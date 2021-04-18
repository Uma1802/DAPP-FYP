import './Tabs.css';
import React, { Component } from 'react';
import ExportCert from '../exportCert.js'
import VerifyCert from '../verifyCert'
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";

class EduUserTabs extends Component {  

    state={
        id:"",
        name:""
    }

    updateContract = async(e) =>{
        const web3 = new Web3(Web3.givenProvider);
       console.log("in update contract");
       try{ 

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log("Logged in account: "+account);
            const metamaskAccount = web3.utils.toChecksumAddress(account);
            console.log("Checksum of logged in account: "+metamaskAccount);

            const parsedCurrentAccount = JSON.parse(
                localStorage.getItem("currentAccount")
                );
            console.log("in local currentAccount: ", parsedCurrentAccount);

            
                const networkId = await web3.eth.net.getId();
                console.log("current network id: "+networkId);

                if (networkId !== 1515)
                {
                    throw new Error("Incorrect network ID")
                }
    
                const deployedNetwork = Participants.networks[networkId];
                const participantInstance = new web3.eth.Contract(
                    Participants.abi,
                    deployedNetwork && deployedNetwork.address,
                    );
                console.log("Participants sol address: "+participantInstance.options.address);      
                return {participantInstance,parsedCurrentAccount,metamaskAccount}     
                  
       }catch(error){
        console.error(error);
        if (error.message.includes("Incorrect network ID"))
            alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
        }
    }

    componentWillMount(){
        this.updateContract().then(
            (value)=>{
                console.log("value  is ",value);

                const participants_contract = value["participantInstance"];
                const current_account=value["parsedCurrentAccount"];
                const metamaskAccount= value["metamaskAccount"];
                console.log("value 1 is ",value["parsedCurrentAccount"]);
                console.log("mm account is: ",metamaskAccount);  

                if(metamaskAccount===current_account){
                    participants_contract.methods.getParticularUser(current_account).call().then(
                        (details)=>{
                            this.setState({id:details[0],name:details[1]});
                        }
                    );                
                }
                else{
                    this.props.history.push("/unauthorized")
                } 
            });
    }
    
    render(){

    return(
      <div className="container tabs">        
        
        <div>
            <h4>Welcome {this.state.name} ({this.state.id})</h4>
        </div>
        
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Dashboard</a>
            </li>
            <li className="nav-item" role="presentation">
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Verify certificates</a>
            </li>
        </ul>
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">                
                <ExportCert
                />
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            
                <VerifyCert
               />
            </div>
            
        </div>
    </div>
    )
    }
}

export default EduUserTabs;
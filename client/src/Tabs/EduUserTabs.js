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
            const currentAccount = web3.utils.toChecksumAddress(account);
            console.log("Checksum of logged in account: "+currentAccount);

            const networkId = await web3.eth.net.getId();
            console.log("current network id: "+networkId);
            const deployedNetwork = Participants.networks[networkId];
            const participantInstance = new web3.eth.Contract(
                Participants.abi,
                deployedNetwork && deployedNetwork.address,
                );
            console.log("Participants sol address: "+participantInstance.options.address);  
        
            //this.setState({contract: participantInstance });
            return {participantInstance,currentAccount}
       }catch(error){
        console.error(error);
        }
    }

    /*componentWillMount(){
        const contract = this.props.contract;
        contract.methods.getParticularUser(this.props.current_account).call().then(
            (details)=>{
                this.setState({id:details[0],name:details[1]});
            }
        )
    }*/
    
     componentWillMount(){
        this.updateContract().then(
            (value)=>{
                console.log("value  is ",value);
                const contract = value["participantInstance"];
                //this.props.participant_contract;
                const current_account=value["currentAccount"];
                console.log("value 0 is ",value["participantInstance"]);
                console.log("value 0 is ",value["currentAccount"]);
                console.log("in will mount of insti tabs,contract is",contract);
                contract.methods.getParticularUser(current_account).call().then(
                    (details)=>{
                        console.log("type is ",details[2]);
                        this.setState({id:details[0],name:details[1],type:details[2]});
                    }
                )
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
                web3 = {this.props.web3}
                current_account = {this.props.current_account} 
                contract = {this.props.contract}  
                certificate_contract = {this.props.certificate_contract}/>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            
                <VerifyCert
                web3 = {this.props.web3}
                current_account = {this.props.current_account} 
                contract = {this.props.contract}  
                certificate_contract = {this.props.certificate_contract}/>
            </div>
            
        </div>
    </div>
    )
    }
}

export default EduUserTabs;
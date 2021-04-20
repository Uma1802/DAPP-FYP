import './Tabs.css';
import React, { Component } from 'react';
import PendingRequest from '../PendingRequest/PendingRequest.js';
import CertIssue from '../CertIssue.js';
import CertRevoke from '../CertRevoke.js';
import ViewCertificates from '../ViewCertificates.js';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";

class InstitutionTabs extends Component {  

    state={
        id:"",
        name:"",
        type:null,
        participant_contract: null,
        current_account: null
    }

    updateContract = async(e) =>{
        const web3 = new Web3(Web3.givenProvider);
       console.log("in update contract");
       try{ 

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
        
            this.setState({participant_contract: participantInstance });

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const metamaskAccount = web3.utils.toChecksumAddress(account); 

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

                const contract = value["participantInstance"];
                const current_account=value["parsedCurrentAccount"];
                const metamaskAccount= value["metamaskAccount"];

                console.log("contract is ",contract);
                console.log("value 1 is ",value["parsedCurrentAccount"]);
                console.log("mm account is: ",metamaskAccount);  

                if(metamaskAccount===current_account){
                    contract.methods.getParticularUser(current_account).call().then(
                        (details)=>{
                            console.log("type is ",details[2]);
                            this.setState({id:details[0],name:details[1],type:details[2],current_account:current_account});
                            console.log("curr acc: "+this.state.current_account);
                        }
                    );                
                }
                else{
                    this.props.history.push("/unauthorized")
                } 
            });              
    }

    render(){
        console.log("Inside Tabs render- contract obj: ",this.props.participant_contract);

    return(

      <div className="container tabs">

      <div>
            <h4>Welcome {this.state.name} ({this.state.id})</h4>
        </div>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <a className="nav-link active" id="request-tab" data-toggle="tab" href="#request" role="tab" aria-controls="request" aria-selected="true">Dashboard</a>
            </li>

            {this.state.type==2  &&
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="issue-tab" data-toggle="tab" href="#issue" role="tab" aria-controls="issue" aria-selected="false">Issue Certificates</a>
                </li>                
            }
            
            {this.state.type==2  &&
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="revoke-tab" data-toggle="tab" href="#revoke" role="tab" aria-controls="revoke" aria-selected="false">Revoke Certificates</a>
                </li>
            }
            
            {this.state.type==2  &&
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="view-tab" data-toggle="tab" href="#view" role="tab" aria-controls="view" aria-selected="false">View Issued Certificates</a>
                </li>
            }
            
            
        </ul>
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="request" role="tabpanel" aria-labelledby="request-tab">
                <PendingRequest                   
                />
            </div>
            <div className="tab-pane fade" id="issue" role="tabpanel" aria-labelledby="issue-tab">                
                <CertIssue
                    web3 = {this.props.web3}
                    current_account = {this.state.current_account} 
                    certificate_contract = {this.props.certificate_contract}
                    participant_contract = {this.state.participant_contract}
                />
            </div>
            <div className="tab-pane fade" id="revoke" role="tabpanel" aria-labelledby="revoke-tab">                
                <CertRevoke
                    web3 = {this.props.web3}
                    current_account = {this.state.current_account} 
                    certificate_contract = {this.props.certificate_contract}
                    participant_contract = {this.state.participant_contract}
                />
            </div>
            <div className="tab-pane fade" id="view" role="tabpanel" aria-labelledby="view-tab">
                <ViewCertificates
                    web3 = {this.props.web3}
                    current_account = {this.state.current_account} 
                    certificate_contract = {this.props.certificate_contract}
                    participant_contract = {this.state.participant_contract}               
                />
            </div>
        </div>
    </div>
    )
    }
}

export default InstitutionTabs;
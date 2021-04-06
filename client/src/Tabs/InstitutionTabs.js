import './Tabs.css';
import React, { Component } from 'react';
import PendingRequest from '../PendingRequest/PendingRequest.js';
import CertIssue from '../CertIssue.js';
import CertRevoke from '../CertRevoke.js';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";

class InstitutionTabs extends Component {  

    state={
        id:"",
        name:"",
        type:null
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
                    <a className="nav-link" id="issue-tab" data-toggle="tab" href="#issue" role="tab" aria-controls="issue" aria-selected="false">Issue certificates</a>
                </li>                
            }
            
            {this.state.type==2  &&
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="revoke-tab" data-toggle="tab" href="#revoke" role="tab" aria-controls="revoke" aria-selected="false">Revoke certificates</a>
                </li>
            }
            
            
        </ul>
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="request" role="tabpanel" aria-labelledby="request-tab">
                <PendingRequest
                    current_account = {this.props.current_account} 
                    contract = {this.props.participant_contract} 
                />
            </div>
            <div className="tab-pane fade" id="issue" role="tabpanel" aria-labelledby="issue-tab">                
                <CertIssue
                    web3 = {this.props.web3}
                    current_account = {this.props.current_account} 
                    certificate_contract = {this.props.certificate_contract}
                    participant_contract = {this.props.participant_contract}
                />
            </div>
            <div className="tab-pane fade" id="revoke" role="tabpanel" aria-labelledby="revoke-tab">                
                <CertRevoke
                    web3 = {this.props.web3}
                    current_account = {this.props.current_account} 
                    certificate_contract = {this.props.certificate_contract}
                    participant_contract = {this.props.participant_contract}
                />
            </div>
        </div>
    </div>
    )
    }
}

export default InstitutionTabs;
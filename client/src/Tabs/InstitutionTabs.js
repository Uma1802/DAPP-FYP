import './Tabs.css';
import React, { Component } from 'react';
import PendingRequest from '../PendingRequest/PendingRequest.js';
import CertIssue from '../CertIssue.js';
import CertRevoke from '../CertRevoke.js';

class InstitutionTabs extends Component {  

    render(){
        console.log("Inside Tabs- contract obj: "+this.props.participant_contract);
    return(

      <div className="container tabs">        
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <a className="nav-link active" id="request-tab" data-toggle="tab" href="#request" role="tab" aria-controls="request" aria-selected="true">Dashboard</a>
            </li>
            <li className="nav-item" role="presentation">
                <a className="nav-link" id="issue-tab" data-toggle="tab" href="#issue" role="tab" aria-controls="issue" aria-selected="false">Issue certificates</a>
            </li>
            <li className="nav-item" role="presentation">
                <a className="nav-link" id="revoke-tab" data-toggle="tab" href="#revoke" role="tab" aria-controls="revoke" aria-selected="false">Revoke certificates</a>
            </li>
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
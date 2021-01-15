import './Tabs.css';
import React, { Component } from 'react';
import PendingRequest from '../PendingRequest/PendingRequest.js';
import CertIssue from '../CertIssue.js';

class InstitutionTabs extends Component {  

    render(){
        console.log("Inside Tabs- contract obj: "+this.props.contract);
    return(

      <div className="container tabs">        
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Dashboard</a>
            </li>
            <li className="nav-item" role="presentation">
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Issue certificates</a>
            </li>
        </ul>
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <PendingRequest
                    history={this.props.history}
                    web3 = {this.props.web3} 
                    current_account = {this.props.current_account} 
                    contract = {this.props.contract} 
                    changeAppState = {this.props.changeAppState}
                />
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">                
                <CertIssue/>
            </div>
        </div>
    </div>
    )
    }
}

export default InstitutionTabs;
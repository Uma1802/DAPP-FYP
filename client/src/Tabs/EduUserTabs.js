import './Tabs.css';
import React, { Component } from 'react';
import ExportCert from '../exportCert.js'
import VerifyCert from '../verifyCert'

class EduUserTabs extends Component {  

    render(){

    return(

      <div className="container tabs">        
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
                <ExportCert/>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <VerifyCert/>
            </div>
            
        </div>
    </div>
    )
    }
}

export default EduUserTabs;
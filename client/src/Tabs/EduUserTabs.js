import './Tabs.css';
import React, { Component } from 'react';
import ExportCert from '../exportCert.js'
import VerifyCert from '../verifyCert'

class EduUserTabs extends Component {  

    state={
        id:"",
        name:""
    }
    
     componentWillMount(){
        const contract = this.props.contract;
        contract.methods.getParticularUser(this.props.current_account).call().then(
            (details)=>{
                this.setState({id:details[0],name:details[1]});
            }
        )
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
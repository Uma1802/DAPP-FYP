import React, { Component } from 'react';
import InstitutionTabs from './Tabs/InstitutionTabs.js'
import Header from './Header/Header.js'

class InstitutionDashBoard extends Component {  
     
    render(){
    console.log("Inside instidash- contract obj: ",this.props.contract);
    return(
        <div>
            <Header/>
            <InstitutionTabs
                web3 = {this.props.web3}
                current_account = {this.props.current_account} 
                certificate_contract = {this.props.certificate_contract}   
                participant_contract = {this.props.contract}        
            />
        </div>
        
    )
    }
}

export default InstitutionDashBoard;

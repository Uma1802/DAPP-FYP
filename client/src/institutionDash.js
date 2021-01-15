import React, { Component } from 'react';
import InstitutionTabs from './Tabs/InstitutionTabs.js'
import Header from './Header/Header.js'

class InstitutionDashBoard extends Component {  
     
    render(){
    console.log("Inside instidash- contract obj: "+this.props.contract);
    return(
        <div>
            <Header/>
            <InstitutionTabs

                history={this.props.history}
                web3 = {this.props.web3} 
                current_account = {this.props.current_account} 
                contract = {this.props.contract} 
                changeAppState = {this.props.changeAppState}            
            />
        </div>
        
    )
    }
}

export default InstitutionDashBoard;
import React, { Component } from 'react';
import EduUserTabs from './Tabs/EduUserTabs.js'
import Header from './Header/Header.js'

class EduUserDashBoard extends Component {  
     
    render(){

    return(
        <div>
            <Header/>
            <EduUserTabs
            web3 = {this.props.web3}
            history={this.props.history}
            current_account = {this.props.current_account} 
            participant_contract = {this.props.contract}  
            certificate_contract = {this.props.certificate_contract}/>
        </div>
        
    )
    }
}

export default EduUserDashBoard;
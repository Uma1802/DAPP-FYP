import React, { Component } from 'react';
import InstitutionTabs from './Tabs/InstitutionTabs.js'
import Header from './Header/Header.js'

class InstitutionDashBoard extends Component {  
     
    render(){

    return(
        <div>
            <Header/>
            <InstitutionTabs/>
        </div>
        
    )
    }
}

export default InstitutionDashBoard;
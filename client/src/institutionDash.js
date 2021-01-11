import React, { Component } from 'react';
import Tabs from './Tabs/Tabs.js'
import Header from './Header/Header.js'

class InstitutionDashBoard extends Component {  
     
    render(){

    return(
        <div>
            <Header/>
            <Tabs/>
        </div>
        
    )
    }
}

export default InstitutionDashBoard;
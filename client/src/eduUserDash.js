import React, { Component } from 'react';
import EduUserTabs from './Tabs/EduUserTabs.js'
import Header from './Header/Header.js'

class EduUserDashBoard extends Component {  
     
    render(){

    return(
        <div>
            <Header/>
            <EduUserTabs/>
        </div>
        
    )
    }
}

export default EduUserDashBoard;
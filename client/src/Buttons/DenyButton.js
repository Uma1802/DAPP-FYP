import React, { Component } from 'react';

class DenyButton extends Component {  

    denyButtonHandler = async() => {  
        console.log("In deny button handler");
        const { current_account, participant_contract, req_addr, deleteRequestRow } = this.props;     
        console.log("Current_account address in deny button: "+current_account);
        console.log("Requesting address in deny button: "+ req_addr);  
          
        try{
                participant_contract.methods.declineRequest(req_addr).send({ from: current_account }).then(() => {
                console.log("Request of ",req_addr+" denied");                
                alert("Denied request of user: ",req_addr)
                deleteRequestRow(req_addr);
            });            
        }
        catch(error){
            console.error("Error in denying request of ",req_addr,": ",error);
            alert("Unable to deny request of user: ",req_addr)
        } 
   }

    render(){

    return(
        <button onClick={this.denyButtonHandler}> Deny </button>
      
    )
    }
}

export default DenyButton;
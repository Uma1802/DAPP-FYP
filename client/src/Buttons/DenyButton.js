import React, { Component } from 'react';

class DenyButton extends Component {  

    state={
        denyButtonDisabled: false
    };

    denyButtonHandler = async() => {  
        console.log("In deny button handler");
        this.setState({denyButtonDisabled: true})
        const { current_account, participant_contract, req_addr, deleteRequestRow } = this.props;     
        console.log("Current_account address in deny button: "+current_account);
        console.log("Requesting address in deny button: "+ req_addr);  
          
        
        participant_contract.methods.declineRequest(req_addr).send({ from: current_account }).then(() => {
        console.log("Request of ",req_addr+" denied");                
        alert("Denied request of user: ",req_addr)
        deleteRequestRow(req_addr);
        this.setState({denyButtonDisabled: false})
        }).catch(error => {
        console.error("Error in denying request of ",req_addr,": ",error);
        
        if (error.message.includes("Person does not exist.")) {
            alert("Unable to deny request of user as request does not exist");
          }
        else if (error.message.includes("Access denied")) {
            alert("Unable to deny request of user as you are not authorized to do it!");
          }
        else if (error.message.includes("MetaMask Tx Signature: User denied transaction signature.")) {
        alert("Unable to deny request of user as transaction was rejected");
        }
        else{
            alert("Unable to admit request of user. Please connect the logged in account to Metamask");
        }
        this.setState({denyButtonDisabled: false})
        });
        
   }

    render(){

    return(
        <button onClick={this.denyButtonHandler} disabled={this.state.denyButtonDisabled}> Deny </button>
      
    )
    }
}

export default DenyButton;
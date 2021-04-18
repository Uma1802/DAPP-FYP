import React, { Component } from 'react';

class AdmitButton extends Component {  

    state={
        admitButtonDisabled: false
    };

    admitButtonHandler = async() => {  
        console.log("In admit button handler");
        this.setState({admitButtonDisabled: true})
        const { current_account, participant_contract, req_addr,deleteRequestRow } = this.props;       
        console.log("Current_account address in admit button: "+current_account);
        console.log("Requesting address in admit button: "+ req_addr); 
        
        
        participant_contract.methods.approveRequest(req_addr).send({ from: current_account }).then(() => {
            console.log("Request of ",req_addr+" approved");
            alert("Admitted user: ",req_addr);
            deleteRequestRow(req_addr);
            this.setState({admitButtonDisabled: false})
        }).catch(error => {
            console.error("Error in admiting ",req_addr,": ",error);
            if (error.message.includes("Person does not exist.")) {
                alert("Unable to admit request of user as request does not exist");
              }
            else if (error.message.includes("Access denied")) {
                alert("Unable to admit request of user as you are not authorized to do it!");
              }
            else if (error.message.includes("MetaMask Tx Signature: User denied transaction signature.")) {
                alert("Unable to admit request of user as transaction was rejected");
            }
            else{
                alert("Unable to admit request of user. Please connect the logged in account to Metamask");
            }
            this.setState({admitButtonDisabled: false})
            });      
                 
    
   }

    render(){

    return(
        <button onClick={this.admitButtonHandler} disabled={this.state.admitButtonDisabled}> Admit </button>      
    )
    }
}

export default AdmitButton;
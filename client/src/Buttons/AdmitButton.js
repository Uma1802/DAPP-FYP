import React, { Component } from 'react';

class AdmitButton extends Component {  

    admitButtonHandler = async() => {  
        console.log("In admit button handler");
        const { current_account, participant_contract, req_addr,deleteRequestRow } = this.props;       
        console.log("Current_account address in admit button: "+current_account);
        console.log("Requesting address in admit button: "+ req_addr);        
        
        try{ 
                participant_contract.methods.approveRequest(req_addr).send({ from: current_account }).then(() => {
                console.log("Request of ",req_addr+" approved");
                alert("Admitted user: ",req_addr);
                deleteRequestRow(req_addr);
            });            
        }
        catch(error){
            console.error("Error in admiting ",req_addr,": ",error);
            alert("Unable to admit user: ",req_addr)
        } 
   }

    render(){

    return(
        <button onClick={this.admitButtonHandler}> Admit </button>      
    )
    }
}

export default AdmitButton;
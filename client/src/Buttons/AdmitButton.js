import React, { Component } from 'react';

class AdmitButton extends Component {  

    admitButtonHandler = async() => {  
        console.log("In admit button handler");
        const { current_account, participant_contract, req_addr,deleteRequestRow } = this.props;       
        console.log("Current_account address in admit button: "+current_account);
        console.log("Requesting address in admit button: "+ req_addr);
        
        /*try{
            participant_contract.methods.getParticularUser(current_account).call().then((eventemitted) => {
                console.log("current_account getParticularUser:"+ eventemitted[3]);
            });   
        }
        catch(error){
            console.error("error in admit "+error);
        }  
        try{
            participant_contract.methods.getParticularRequest(req_addr).call().then((eventemitted) => {
                console.log("current_account getParticularRequest:"+ eventemitted[3]);
            });   
        }
        catch(error){
            console.error("error in admit "+error);
        }  */
        try{ 
            participant_contract.methods.approveRequest(req_addr).send({ from: current_account }).then(() => {
                console.log("Request of ",req_addr+" approved");
                alert("Admiited user: ",req_addr);
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
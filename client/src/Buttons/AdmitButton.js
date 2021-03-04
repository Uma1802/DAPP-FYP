import React, { Component } from 'react';

class AdmitButton extends Component {  

    admitButtonHandler = async() => {  
        console.log("in admit button handler");
        const { current_account, contract, req_addr } = this.props;       
        console.log("current_account: "+current_account);
        console.log("req_addr "+ req_addr);
        
        try{
            contract.methods.getParticularUser(current_account).call().then((eventemitted) => {
                console.log("current_account getParticularUser:"+ eventemitted[3]);
            });   
            contract.methods.getParticularRequest(req_addr).call().then((eventemitted) => {
                console.log("current_account getParticularRequest:"+ eventemitted[3]);
            });    
            contract.methods.approveRequest(req_addr).send({ from: current_account }).then(() => {
                console.log("request approved");
                this.props.deleteRequestRow(req_addr);
            });            
        }
        catch(error){
            console.error("error in admit "+error);
        }   
        finally{
            
        }
   }

    render(){

    return(
        <button onClick={this.admitButtonHandler}> Admit </button>      
    )
    }
}

export default AdmitButton;
import React, { Component } from 'react';

class AdmitButton extends Component {  

    admitButtonHandler = async() => {  
        console.log("in admit button handler");
        const { current_account, contract, req_addr } = this.props;       
          
        try{
            await contract.methods.approveRequest(req_addr).send({ from: current_account });            
        }
        catch(error){
            console.error("error in admit "+error);
        }   
   }

    render(){

    return(
        <button onClick={this.admitButtonHandler}> Admit </button>      
    )
    }
}

export default AdmitButton;
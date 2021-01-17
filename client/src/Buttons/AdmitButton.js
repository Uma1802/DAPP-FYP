import React, { Component } from 'react';

class AdmitButton extends Component {  

    admitButtonHandler = async() => {  
        console.log("in admit button handler");
        const { current_account, contract, req_addr } = this.props;       
          
        try{
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
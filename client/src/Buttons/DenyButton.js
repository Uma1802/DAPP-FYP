import React, { Component } from 'react';

class DenyButton extends Component {  

    denyButtonHandler = async() => {  
        console.log("in deny button handler");
        const { current_account, contract, req_addr } = this.props;       
          
        try{
            await contract.methods.declineRequest(req_addr).send({ from: current_account });            
        }
        catch(error){
            console.error("error in deny "+error);
        }   
   }

    render(){

    return(
        <button onClick={this.denyButtonHandler}> Deny </button>
      
    )
    }
}

export default DenyButton;
import React, { Component } from 'react';

class DenyButton extends Component {  

    denyButtonHandler = async() => {  
        console.log("in deny button handler");
        const { current_account, contract, req_addr } = this.props;       
          
        try{
            contract.methods.declineRequest(req_addr).send({ from: current_account }).then(() => {
                console.log("request denied");
                this.props.deleteRequestRow(req_addr);
            });            
        }
        catch(error){
            console.error("error in deny "+error);
        } 
        finally{
            
        }  
   }

    render(){

    return(
        <button onClick={this.denyButtonHandler}> Deny </button>
      
    )
    }
}

export default DenyButton;
import React, { Component } from 'react';

const IPFS = require('ipfs')
const uint8ArrayConcat = require('uint8arrays/concat')

class ExportButton extends Component {  

    async downloadFileFromIPFS(ipfsHash)   {        
 
        const node = await IPFS.create()

       const version = await node.version()
       console.log('Version:', version.version)
 
       node.id()
           .then(res => {
             console.log(`Daemon active\nID: ${res.id}`)
           })
           .catch(err => {
             console.error(err)
           })
 
         const  chunks = []
         for await (const chunk of node.cat(ipfsHash)) {
             //console.log(chunk)
             chunks.push(chunk)
         } 
         
         node.stop().catch(err => console.error(err))
 
         var blob = new Blob([uint8ArrayConcat(chunks)], { type: 'application/pdf' });
 
         var link = document.createElement('a');
         link.href = window.URL.createObjectURL(blob);
         var fileName = "sampleFile";
         link.download = fileName;
         link.click();         
     }
 

    exportButtonHandler = async() => {  
        console.log("in export button handler");
        const { current_account, ipfsHash } = this.props;       
          
        try{
            downloadFileFromIPFS(ipfsHash)           
        }
        catch(error){
            console.error("error in export "+error);
        }   
        finally{
            
        }
   }

    render(){

    return(
        <button onClick={this.exportButtonHandler}> Download </button>
      
    )
    }
}

export default ExportButton;
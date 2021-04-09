import React, { Component } from 'react';
import ipfs from '../utils/ipfs'

const NodeCrypt = require('../lib//ipfs-crypt/crypto')
const uint8ArrayConcat = require('uint8arrays/concat')
const arrayBufferToHex = require('array-buffer-to-hex')

class ExportButton extends Component {  

    async cat(path,key) {

        let encryptedBuffer;
        const crypto = new NodeCrypt({ key: key })
        const chunks = []

        //try{
          for await (const chunk of ipfs.cat(path)) {
            chunks.push(chunk)   
          }
          encryptedBuffer = uint8ArrayConcat(chunks)
          console.log("Encrypted buffer from IPFS: ",encryptedBuffer)      
        /*} catch (error) {
        console.error("Error1 in downloading from IPFS: ",error)
        }*/
        const decryptedBuffer = crypto.decryptBuffer(encryptedBuffer)
        return decryptedBuffer

      }

    async downloadFileFromIPFS(ipfsHash, key)   {   

        try{
            const decryptedBuffer = await this.cat(ipfsHash,key)
            console.log("Decrypted buffer is: ",decryptedBuffer)
            var blob = new Blob([decryptedBuffer], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.props.certId;
            link.click();
            console.log('Done downloading file!')
        } catch (error) {
            console.error("Error in downloading from IPFS: ",error);
            alert("Error in downloading from IPFS")
        }        
     }
 

    exportButtonHandler = async() => {  

        console.log("In export button handler");        
        const { current_account,ipfsHash,encKey } = this.props;    
        console.log("JSON string of encrypted key: ",encKey)   
          
        try{            
            const buff=Buffer.from(encKey,'utf8')
            const arrbuff=buff.buffer;
            const encryptedKey = arrayBufferToHex(arrbuff)
            console.log("Encrypted key in hex is: ",encryptedKey)  
        }catch(error){
              console.error("Invalid key: ",error);
              alert("Invalid key")
              return;
        } 
        
        console.log("Decrypting encrypted key...");   
        window.ethereum
        .request({
          method: 'eth_decrypt',
          params: [encryptedKey, current_account],
        })
        .then(async (decryptedKey) => {
          console.log("The decrypted key is: ", decryptedKey)
          try{

            const decryptedBuffer = await this.cat(ipfsHash,decryptedKey)
            console.log("Decrypted buffer is: ",decryptedBuffer)

            var blob = new Blob([decryptedBuffer], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.props.certId;
            link.click();
            console.log('Done downloading file!')

            //this.downloadFileFromIPFS(ipfsHash,decryptedKey)  
          }
          catch(error){
            console.error("Error in downloading from IPFS: ",error);
            alert("Error in downloading from IPFS")
          }
                    
        }).catch(error => {
          console.error("Error in decrypting encrypted key: ",error);
          alert("Error in decrypting encrypted key")
        });        
   }

    render(){

    return(
        <button onClick={this.exportButtonHandler}> Download </button>      
    )
    }
}

export default ExportButton;
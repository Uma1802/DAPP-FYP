import React, { Component } from 'react';
import ipfs from '../utils/ipfs'

const IPFS = require('ipfs')
const uint8ArrayConcat = require('uint8arrays/concat')
const NodeCrypt = require('../lib//ipfs-crypt/crypto')
const arrayBufferToHex = require('array-buffer-to-hex')

class ExportButton extends Component {  

    async cat(path,key) {

        let encryptedBuffer;
       
          const crypto = new NodeCrypt({ key: key })
          const chunks = []
        try{
          var i=0
          for await (const chunk of ipfs.cat(path)) {
            //console.log("round: ",++i)
            //console.log("chunk 1",chunk)  
            chunks.push(chunk)   
          }
        
        console.log("type of chunks ",typeof chunks)
        console.log(chunks)
  
          //console.log("enc b from concat ",Buffer.concat(chunks)) causes error list arg must be arr of buff
          encryptedBuffer = uint8ArrayConcat(chunks)
          console.log("type of en buff ",typeof encryptedBuffer)
          console.log("enc b: ",encryptedBuffer)      
        } catch (error) {
          console.error("e2: "+error)
        }
          const decryptedBuffer = crypto.decryptBuffer(encryptedBuffer)
          return decryptedBuffer
      }

    async downloadFileFromIPFS(ipfsHash, key)   {        
 
        //const node = await IPFS.create()

      // const version = await node.version()
       //console.log('Version:', version.version)
 
      /* node.id()
           .then(res => {
             console.log(`Daemon active\nID: ${res.id}`)
           })
           .catch(err => {
             console.error(err)
           })*/

           try{

           const decryptedBuffer = await this.cat(ipfsHash,key)
            console.log("decrypt: ",decryptedBuffer)

            var blob = new Blob([decryptedBuffer], { type: 'application/pdf' });

            console.log("blob ",blob)

            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            var fileName = "sampleFile";
            link.download = this.props.certId;
            //fileName;

            console.log("blob2 ")
            
            link.click();

                console.log('done!')
            } catch (error) {
                console.error(error)
            }
 
           // node.stop().catch(err => console.error(err))
        
     }
 

    exportButtonHandler = async() => {  
        console.log("in export button handler");
        const { current_account,ipfsHash,encKey } = this.props;       
          
        try{

        console.log("json str enc key: ",encKey)

        var buff=Buffer.from(encKey,
        'utf8'
        )

        console.log("buff is: ",buff)

        const arrbuff=buff.buffer;

        console.log("arr buff is ",arrbuff)

        const encryptedKey = arrayBufferToHex(arrbuff)
       console.log("encrypted message ",encryptedKey)  

       window.ethereum
       .request({
         method: 'eth_decrypt',
         params: [encryptedKey, current_account],
       })
       .then((decryptedKey) => {
        console.log("The decrypted key is:", decryptedKey)

            this.downloadFileFromIPFS(ipfsHash,decryptedKey)           
        }
       );}
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
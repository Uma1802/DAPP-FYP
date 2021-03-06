import React,{Component} from 'react'; 
import jsSHA from "jssha";
import ipfs from './utils/ipfs'
import Web3 from 'web3';
import Certificates from "./contracts/Certificates.json";
const NodeCrypt = require('./lib//ipfs-crypt/crypto')
const crypto = require('crypto')
const sigUtil = require('eth-sig-util')
  
class CertIssue extends Component { 
   
    state = {   
      current_account: null, 
      participant_contract: this.props.participant_contract, 
      selectedFile: null,
      certificate_contract: null,
      receiver_addr: ""
    }; 

    async componentDidMount(){
      try{
      console.log("in did mount")
      const web3 = new Web3(Web3.givenProvider);
      const networkId = await web3.eth.net.getId();
      if (networkId !== 1515)
                {
                    throw new Error("Incorrect network ID")
                }
      const deployedNetwork1 = Certificates.networks[networkId];
      var certificateInstance = new web3.eth.Contract(
                  Certificates.abi,
                  deployedNetwork1 && deployedNetwork1.address,
                  );      
      console.log("cert inst is ",certificateInstance)
      this.setState({ certificate_contract: certificateInstance });       
      }
      catch(error){
        if (error.message.includes("Incorrect network ID"))
                alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
      }
    }
     
    // On file select (from the pop up) 
    onFileChange = event => { 
      this.setState({ selectedFile: event.target.files[0] });  
      console.log("file is"+event.target.files[0]);      
      console.log("after set stae in file change"+this.state.selectedFile); 
    }; 

    onChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
    }
     
    async uploadFileToIPFS ( ) {

      console.log("file to upload "+  this.state.selectedFile);
      console.log("ipfs is "+ipfs)

      /*ipfs.id()
      .then(res => {
        console.log(`Daemon active\nID: ${res.id}`)
      })
      .catch(err => {
        console.error(err)
      })*/

 
     var addedFile = null;

      try {
        addedFile = await ipfs.add(
          this.state.selectedFile,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        console.log(addedFile)
        console.log(addedFile.cid.toString+" path: "+addedFile.path)
      } catch (err) {
        console.error(err)
      } 
      finally{ 
        return addedFile;
      }
    }

    async add (buffer,key) {
      try {
        const crypto = new NodeCrypt({ key: key })  
        console.log("buf type: ",typeof buffer)    
        console.log("buf: ",buffer)

        const encryptedBuffer = crypto.encryptBuffer(buffer)
        //console.log("enc buf: ",encryptedBuffer)
        //console.log("enc b type in add ",typeof encryptedBuffer)
        const file = await ipfs.add(encryptedBuffer)
        return file
      } catch (error) {
        console.error("errrror: ",error)
      }
    }

    async encryptUpload (buffer,key)  {
      var addedFile = null;
      try {
        console.log('uploading file...')
        console.log("file buffer ",buffer)  
        
        addedFile = await this.add(buffer,key);
        console.log('added file', addedFile)

      } catch (error) {
        console.error(error)
      }
      finally{ 
        return addedFile;
      }
    }


    // On file upload (click the upload button) 
    onFileUpload (event) { 

      event.preventDefault();
      const web3 = this.state.web3;      

      console.log("on file submit FILE NAME " +this.state.selectedFile); 


      var reader = new FileReader();

      reader.onload = async(evt) => {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          console.log("onload res "+ evt.target.result);
          var start_time = Date.now();
          console.log("time1 : ",start_time);
          const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
          shaObj.update(evt.target.result);          
          var hash = shaObj.getHash("HEX");
          console.log("hash is "+hash);

           //var bytes = new Uint8Array(evt.target.result);
          //const shaObj2 = new jsSHA("SHA-256", "UINT8ARRAY");

          console.log("curr acc: "+this.state.current_account);

          const key = crypto.randomBytes(16).toString('hex');
          console.log("key is: ",key.length)

          const addedFile = await this.encryptUpload(evt.target.result,key);
          var time2 = Date.now();
          console.log("time2 : ",time2 -start_time);
          //const addedFile=this.uploadFileToIPFS();         

          /*  web3.eth.sendTransaction({
              from: this.state.current_account,
              to: this.state.receiver_addr,
              data: web3.utils.toHex("hash"),
              value: '0'
          })
          .then((receipt) => {
                      console.log("tx receipt: "+receipt);
          });*/
          
          var msg=null;
          //console.log("Added file: "+addedFile);
          console.log("rcvd file: "+addedFile);
          if (addedFile==null)
            console.log("rcd file is null");
          else
          console.log("rcd file is not null");

          if(addedFile){
            try{
              const participant_contract = this.props.participant_contract;
              this.setState({current_account: this.props.current_account});
              console.log("certi contract in props: "+this.props.certificate_contract);
              console.log("certi contract in state: "+this.state.certificate_contract);
              console.log("participant contract in props: "+this.props.participant_contract);
              console.log("participant contract in state: "+this.state.participant_contract);
              console.log("current acc in props: "+this.props.current_account);
              console.log("current acc in state: "+this.state.current_account);
              

              const { certificate_contract} = this.state;  

              participant_contract.methods.getPublicKey(this.state.receiver_addr).call().then(
                (encryptionPublicKey) => {
                  if(encryptionPublicKey){
                    console.log("encryptionPublicKey: ",encryptionPublicKey);

                    const encData = sigUtil.encrypt(
                      encryptionPublicKey,
                      { data: key},
                      'x25519-xsalsa20-poly1305'
                    );
      
                    console.log("encrypt data: ",encData)    
                    const jsonStr=JSON.stringify(
                      encData                    
                    );    
                    console.log("json str: ",jsonStr);
                    console.log("json str type: ",typeof jsonStr);
                    /*var buff=Buffer.from(jsonStr,
                      'utf8'
                    )   
                    console.log("type of buff: ",typeof buff)
                    console.log("buff is: ",buff)   */  

                    console.log("ipfs cid: ",addedFile.cid.toString())
                    var time3 = Date.now();
                    console.log("time3 : ",time3 - time2);
                    console.log("current acc: "+this.props.current_account);
                    certificate_contract.methods.createCertificate(this.state.receiver_addr,
                      hash, addedFile.path, jsonStr
                      ).send({ from: this.state.current_account }).then(() => {
                        certificate_contract.methods.getTotalCertificatesCount().call().then(
                          (val)=>{
                            val=val-1;
                        alert("Certificate issued with ID: "+ (Number(100000)+Number(val)));
                        var time4 = Date.now();
                        console.log("time4 : ",time4- time3);
                          });
                        
                      }).catch((error) => {
                        if (error.message.includes("MetaMask Tx Signature: User denied transaction signature."))
                          alert("Unable to issue certificate as transaction was rejected");
                          
                      });
                  } 
                  else{
                    alert("Certificate can't be issued as recipient public key is unavailable!")
                  }
              }).catch(
                (error) => {
                  alert("Recipient user does not exist in the system");
                }
              )                       
                
            }
            catch(error){
              console.error("ERRORR: "+error);
              //alert("Recipient user does not exist in the system");
              
            }
              
              
          }

          else{
            alert("Unable to upload to IPFS")
          }          
         
        }
      };

      if(this.state.selectedFile.type === 'application/pdf' ){
        reader.readAsArrayBuffer(this.state.selectedFile);  
      }
      else{
        alert("File type not supported")
      }
       
    }; 
     
    fileData = () => { 
     
      if (this.state.selectedFile) {           
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
             
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Choose a file before pressing the Issue button</h4> 
          </div> 
        ); 
      } 
    }; 
     
    render() { 
     
      return ( 
        <div> 
            <div className="card col-12 col-lg-6 reg-card">
                <h2 className="card-header bg-dark text-white">Issue certificate</h2>
                <div className="card-body">               

                    <form onSubmit={(e) => this.onFileUpload(e)}>   

                    <div className="form-group text-left">   
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="far fa-address-card"></i></span>
                            </div>
                            <input type="text" 
                                                className="form-control" 
                                                id="name"  
                                                placeholder="Recipient public address" 
                                                onChange={this.onChange}
                                                name = "receiver_addr"
                                                value={this.state.receiver_addr}
                                                required
                                                
                            />    
                        </div>  
                    </div>          

                    <div className="mb-3">
                        <input type="file" onChange={this.onFileChange} required/>
                    </div> 
                   
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled = {this.state.issueButtonDisabled}
                    >Issue certificate</button>
                        
                    </form>     

                </div>

            </div>

            {this.fileData()} 

            </div>
      ); 
    } 
  } 
  
  export default CertIssue; 
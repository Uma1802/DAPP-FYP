import React,{Component} from 'react'; 
import jsSHA from "jssha";
import Certificates from "./contracts/Certificates.json";
import Web3 from 'web3';
class VerifyCert extends Component { 
   
    state = {  
      cert_id:null,
      selectedFile: null,
      certificate_contract:null
    }; 
    
    onFileChange = event => {   
           console.log("File changed: ",event.target.files[0])   
           this.setState({ selectedFile: event.target.files[0] });      
    }; 

    onValueChange = (e) => {
      console.log("Changing "+e.target.name+" to: "+e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
    
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
    
    handleSubmit = (e) => { 

      e.preventDefault();
      console.log("Verification form submitted")    
      const cert_file=this.state.selectedFile;
      var certid = parseInt(this.state.cert_id)

      var reader = new FileReader();

      reader.onload = async(evt) => {

        if (evt.target.readyState == FileReader.DONE) { 
          //console.log("onload res "+ evt.target.result);
          const certificate_contract = this.state.certificate_contract;
          console.log("Done reading uploaded file")
          const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
          shaObj.update(evt.target.result);          
          var hash = shaObj.getHash("HEX");
          console.log("Hash of submitted certificate is: ",hash);          
          console.log("Received certificate id: "+certid);
          console.log("Certificate contract address: "+ certificate_contract );
          certificate_contract.methods.checkIfCertificateExists(certid-100000).call().then(
            (value)=>{
              console.log("Certificate exists: ",value)
              if(value){
                certificate_contract.methods.getParticularCertificate(certid-100000).call().then(
                  (certObject)=>{
                    console.log("Retrieved certificate from blockchain: "+certObject);
                    console.log("Certificate hash from blockchain: "+certObject[1]);
                    if(certObject[1]===hash){
                     console.log("Verification Successful")
                     alert("Verification Successful")
                    }
                    else{
                     console.log("Verification Failed")
                     alert("Verification Failed")
                    }
                });
              }else{
                console.log("Certificate does not exist. Verification Failed!!")
                alert("Certificate does not exist. Verification Failed!!")
              }
            }
          );
        }
      };
      reader.readAsArrayBuffer(cert_file);         
    };    
     
     
    render() {
      console.log("in verify render") 
     
      return (
<div> 

<div className="container">   

    <div className="row justify-content-center">
        <div className="card col-12 col-lg-6 reg-card">
            <h2 className="card-header bg-dark text-white">Verify certificate</h2>
            <div className="card-body">               

                <form onSubmit={(e) => this.handleSubmit(e)}>   

                <div className="form-group text-left">   
                      <div className="input-group mb-4">
                          <div className="input-group-prepend">
                              <span className="input-group-text"><i className="far fa-address-card"></i></span>
                          </div>
                          <input  type="text" 
                                  className="form-control" 
                                  name="cert_id"
                                  value = {this.state.cert_id}
                                  onChange={this.onValueChange}
                                  placeholder="Certificate ID" 
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
                  >Verify</button>
                    
                </form>                     

            </div>

        </div>

    </div>

</div>
        
</div>
      ); 
    } 
  } 
  
  export default VerifyCert; 
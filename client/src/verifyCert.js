import React,{Component} from 'react'; 
import jsSHA from "jssha";
  
class VerifyCert extends Component { 
   
    state = {  
      cert_id:null,
      selectedFile: null,
      isVerified:0
    }; 

    verificationStatus = () => {
      const id = this.state.cert_id;
      if (this.state.isVerified === 1) {           
        return ( 
          <div> 
            <h3>Verification Successful</h3>     
            <p>Certificate ID: {id} </p>   
            <p>File: {this.state.selectedFile.name} </p>         
          </div> 
        );         
      } else if (this.state.isVerified === -1) { 
        return ( 
          <div> 
            <h3>Verification Failed</h3>     
            <p>Certificate ID: {id} </p>   
            <p>File: {this.state.selectedFile.name} </p>         
          </div> 
        ); 
      } 
      
    }; 
     
    
    onFileChange = event => {      
           this.setState({ selectedFile: event.target.files[0] });      
    }; 
     
    
    handleSubmit = (e) => { 
      e.preventDefault();
      const {certificate_contract}=this.props;    

      var reader = new FileReader();

      reader.onload = async(evt) => {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          console.log("onload res "+ evt.target.result);

          const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
          shaObj.update(evt.target.result);          
          var hash = shaObj.getHash("HEX");
          console.log("hash is "+hash);
          console.log("type of certid: "+typeof(this.state.cert_id));
          var certid = parseInt(this.state.cert_id)
          console.log("type of certid2: "+typeof(certid));
          console.log("certificate contract address: "+ certificate_contract );
          certificate_contract.methods.checkIfCertificateExists(certid-100000).call().then(
            (value)=>{
              if(value){
                certificate_contract.methods.getParticularCertificate(certid-100000).call().then(
                  (object)=>{
                    console.log("submitted hash: "+hash);
                    console.log("ret obj: "+object);
                    console.log("retrieved hash: "+object[1]);
                    if(object[1]===hash){
                      this.setState({isVerified:1});
                    }
                    else{
                      this.setState({isVerified:-1});
                    }
                });
              }
            }
          );
        }
      };
      reader.readAsArrayBuffer(this.state.selectedFile);   

      
    }; 

    onChange = (e) => {
      console.log("changing name: "+e.target.name+" changing value: "+e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
     
     
    render() { 
     
      return ( 
        <div> 
            <div className="card col-12 col-lg-6 reg-card">
                <h2 className="card-header bg-dark text-white">Verify certificate</h2>
                <div className="card-body">               

                    <form onSubmit={(e) => this.handleSubmit(e)}>   

                    <div className="form-group text-left">   
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="far fa-address-card"></i></span>
                            </div>
                            <input type="text" 
                                                className="form-control" 
                                                name="cert_id"
                                                value = {this.state.cert_id}
                                                onChange={this.onChange}
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

            {this.verificationStatus()}

            </div>
      ); 
    } 
  } 
  
  export default VerifyCert; 
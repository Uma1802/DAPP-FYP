import React,{Component} from 'react'; 
class CertRevoke extends Component { 
   
    state = {   
      current_account: this.props.current_account, 
      participant_contract: this.props.participant_contract, 
      web3: this.props.web3,
      certificate_contract: this.props.certificate_contract,
      certId: ""
    }; 
     

    onChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
      console.log("cert id: "+ this.state.certId);
    }
    
    onRevoke = async(event)  => {

      event.preventDefault();
      const web3 = this.state.web3;      

      console.log("inside on revoke for cert id: " +this.state.certId); 
      try{
        let count = await this.state.certificate_contract.methods.getCertificatesCount().call();
        console.log("cert count: " + count);
        await this.state.certificate_contract.methods.revokeCertificate(this.state.certId - 100000).send({ from: this.state.current_account });
        count = await this.state.certificate_contract.methods.getCertificatesCount().call();
        console.log("cert count: " + count);
        alert("Certificate Revocation Successful");
        
      }catch(error){
        alert("No such certificate ID exists!");
      }
      };

    
     
    render() { 
     
      return ( 
        <div> 
            <div className="card col-12 col-lg-6 reg-card">
                <h2 className="card-header bg-dark text-white">Revoke Certificate</h2>
                <div className="card-body">               

                  <form onSubmit={(e) => this.onRevoke(e)}>   

                    <div className="form-group text-left">   
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="far fa-address-card"></i></span>
                            </div>
                            <input type="text" 
                              className="form-control" 
                              id="name"  
                              placeholder="Certificate ID" 
                              onChange={this.onChange}
                              name = "certId"
                              value={this.state.certId}
                                                
                            />    
                        </div>  
                    </div>                            
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                    >Revoke Certificate</button>
                      
                  </form>     

                </div>

            </div>
            </div>
      ); 
    } 
  } 
  
  export default CertRevoke; 
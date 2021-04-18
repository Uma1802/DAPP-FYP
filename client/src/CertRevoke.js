import React,{Component} from 'react'; 
import Web3 from 'web3';
import Certificates from "./contracts/Certificates.json";
class CertRevoke extends Component { 
   
    state = {   
      current_account: null, 
      participant_contract: this.props.participant_contract, 
      certificate_contract: null,
      certId: "",
      revokeButtonDisabled: false
    }; 
     

    onChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
      console.log("cert id: "+ this.state.certId);
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
    
    onRevoke = async(event)  => {

      event.preventDefault();
      this.setState({revokeButtonDisabled: true})
      const web3 = this.state.web3;   
      this.setState({current_account: this.props.current_account});   

      console.log("inside on revoke for cert id: " +this.state.certId); 
      try{
        let count = await this.state.certificate_contract.methods.getCertificatesCount().call();
        console.log("cert count: " + count);
        await this.state.certificate_contract.methods.revokeCertificate(this.state.certId - 100000).send({ from: this.state.current_account });
        count = await this.state.certificate_contract.methods.getCertificatesCount().call();
        console.log("cert count: " + count);
        alert("Certificate Revocation Successful");
        this.setState({revokeButtonDisabled: false})
        
      }catch(error){
        if (error.message.includes("MetaMask Tx Signature: User denied transaction signature.")) {
          alert("Unable to revoke certificate as transaction was rejected");
        }
        else if (error.message.includes("Certificate with the given ID does not exist in the system"))
          alert("No such certificate ID exists!");
        else if (error.message.includes("Permission denied"))
          alert("You don't have the permission to revoke certificates!");
        else
          console.error(error)
        this.setState({revokeButtonDisabled: false})
      }
      }

    
     
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
                        disabled = {this.state.revokeButtonDisabled}
                    >Revoke Certificate</button>
                      
                  </form>     

                </div>

            </div>
            </div>
      ); 
    } 
  } 
  
  export default CertRevoke; 
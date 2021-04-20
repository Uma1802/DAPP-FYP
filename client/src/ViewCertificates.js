import React,{Component} from 'react'; 
import jsSHA from "jssha";
import ipfs from './utils/ipfs'
import Web3 from 'web3';
import Certificates from "./contracts/Certificates.json";
import Participants from "./contracts/Participants.json";

  
class ViewCertificates extends Component { 
   
    state = {   
      current_account: null, 
      participant_contract: this.props.participant_contract, 
      certificate_contract: null,
      certificates: null,
      elements: null,
      row: [],
      currentinstitution: null
      

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
    const deployedNetwork = Participants.networks[networkId];
    let row=[];
    var participantInstance = new web3.eth.Contract(
                Participants.abi,
                deployedNetwork && deployedNetwork.address,
                );      
      console.log("cert inst is ",certificateInstance)
      this.setState({ certificate_contract: certificateInstance , participant_contract: participantInstance}); 
      const parsedCurrentAccount = JSON.parse(
        localStorage.getItem("currentAccount")
      );
      
      participantInstance.methods.getParticularUsersInstitution(parsedCurrentAccount).call().then(
          (insti) => {
              this.setState({currentinstitution: insti})
          }
      )
      
      certificateInstance.methods.getTotalCertificatesCount().call().then(
          (count)=> {
              for (let i=0;i<count;i++){
                certificateInstance.methods.getParticularCertificate(i).call().then(
                    (certificate)=>{
                        if (certificate[4] != "0x0000000000000000000000000000000000000000"){
                          participantInstance.methods.getParticularUser(certificate[4]).call().then(
                            (user) => {
                                let instiname = user[3]
                                if (instiname === this.state.currentinstitution){
                                    participantInstance.methods.getParticularUser(certificate[0]).call().then(
                                        (recipient) => {
                                            
                                            row.push(
                                                <tr key={i}>
                                                  <td>{Number(100000)+Number(i)}</td>
                                                  <td>{user[1]} ({user[0]})</td>
                                                  <td>{recipient[0]}</td>
                                                  <td>{recipient[1]}</td>                                                  
                                                </tr>
                                              );
                                              console.log("row length: "+row.length)
                                              console.log("recipient name: "+recipient[0])
                                              if(i+1 == count){
                                                console.log("inside last if of for..i val: "+i)
                                                if (row.length != 0){    
                                                    console.log("inside row len not 0..row len:"+row.length)            
                                                  this.setState({ elements: 
                                                                  <div>
                                                                  <h3>Issued Certificates</h3>
                                                                  <div className="table-responsive">
                                                                    <table className="table table-striped">
                                                                      <thead className="thead-dark">
                                                                        <tr>
                                                                          <th>Certificate ID</th>
                                                                          <th>Issued By</th>
                                                                          <th>Recipient ID</th>
                                                                          <th>Recipient Name</th>
                                                                        </tr>
                                                                      </thead>                                
                                                                      <tbody>
                                                                        {row}
                                                                      </tbody>
                                                                    </table>
                                                                  </div> 
                                                                  </div>
                                                                });
                                                  }
                                              else if (row.length == 0) {
                                  
                                                  console.log("no rows");
                                                  this.setState({
                                                      elements: (
                                                      <div>
                                                          <br></br>
                                                          <h3>No certificates issued!</h3>
                                                      </div>
                                                      )
                                                  });
                                                  }
            
                                            }

                                        }
                                    )
                                    
                                }
                                
                            })

                        }
                        
                    }
                )

              }
              //this.setState({ rows });
              

        })      
      }
      catch(error){
        if (error.message.includes("Incorrect network ID"))
                alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
      }
    }
     
    

    onChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
    }
     
    
     
    render() { 
     
        return (
            <div>
                <div className="row row-content">
                <div className="col-12">
                    {this.state.elements}
                </div>
                </div>
            </div>
          );
    } 
  } 
  
  export default ViewCertificates; 
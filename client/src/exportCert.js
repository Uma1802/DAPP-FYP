import React, { Component } from 'react';
import './PendingRequest/PendingRequest.css';
import ExportButton from './Buttons/ExportButton';
import Participants from "./contracts/Participants.json";
import Certificates from "./contracts/Certificates.json";
import Web3 from 'web3';
class ExportCert extends Component {  

    state={
        element: null
    };


    async getIssuerName(addr,participant_contract){
        console.log("issuer addr is ",addr)
        var issuer = await participant_contract.methods.getParticularUser(addr).call();
        console.log("issuer name is ",issuer[3]);
        return issuer[3]; 
    }

    async componentDidMount(){

        const web3 = new Web3(Web3.givenProvider);
        const networkId = await web3.eth.net.getId();

        const deployedNetwork1 = Certificates.networks[networkId];
        const certificateInstance = new web3.eth.Contract(
                    Certificates.abi,
                    deployedNetwork1 && deployedNetwork1.address,
                    );

        const deployedNetwork = Participants.networks[networkId];
        const participantInstance = new web3.eth.Contract(
            Participants.abi,
            deployedNetwork && deployedNetwork.address,
            );
        console.log("Participants sol address: "+participantInstance.options.address);

        const parsedCurrentAccount = JSON.parse(
            localStorage.getItem("currentAccount")
            );
        console.log("in local currentAccount: ", parsedCurrentAccount);
        
        var rows =[];
        var indices = [];
            var certificate_contract = certificateInstance;
            var count= await certificate_contract.methods.getTotalCertificatesCount().call();
            console.log("total count: "+count);
            for (let j=0;j<count;j++)
                indices.push(j);
            for (let i in indices) {
                console.log("i val:"+i);
                try{
                        var certificate_details= await certificate_contract.methods.getParticularCertificate(i).call();
                        console.log("certi dets: id="+i+" rcpaddr="+certificate_details[0]+" certi hash="+certificate_details[1]+" issueraddr "+certificate_details[4] );
                        if (certificate_details[0] == parsedCurrentAccount){
                            console.log("rcp addr matched");
                            let issuerName= await this.getIssuerName(certificate_details[4],participantInstance)
                            console.log("in did mount issuer is: ",issuerName)
                                rows.push(<tr key={10000+i}>
                                    <td>{10000+i}</td>
                                    <td>{issuerName}</td>
                                    <td> <ExportButton 
                                                    current_account = {parsedCurrentAccount} 
                                                    ipfsHash= {certificate_details[2]}
                                                    encKey= {certificate_details[3]}
                                                    certId={10000+i}
                                                    /> </td>
                                    </tr>);
                                console.log("rows length: "+rows);
                            //});
                        }
                        if (i == (count-1))
                        {
                            console.log("rows length end: "+rows);
                            if (rows.length == 0)
                            this.setState({element:<tbody><h3>No Certificates Received!</h3></tbody>});
                            else
                            this.setState({element:<tbody>{rows}</tbody>});
                        }
                   // });
                }catch(error){
                    console.error("Error: "+error);
                }
            }
            
       // });     
                      
        }

    render(){

    return(
        <div className="row row-content">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Certificate ID</th>
                                        <th>Issuing Institution</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                {                                 
                                        this.state.element
                                    }
                            </table>
                        </div>
                    </div>
                </div>             
    )
    }
}

export default ExportCert;
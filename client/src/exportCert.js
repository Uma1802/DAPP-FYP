import React, { Component } from 'react';
import './PendingRequest/PendingRequest.css';
import ExportButton from './Buttons/ExportButton';

class ExportCert extends Component {  

    state={
        current_account: this.props.current_account, 
        participant_contract: this.props.participant_contract,
        certificate_contract: this.props.certificate_contract,
        element: null,
    };


    async getIssuerName(addr){
        console.log("issuer addr is ",addr)
        console.log("parti contract: "+this.state.participant_contract);
        console.log("props parti contract: "+this.props.participant_contract);
        const {participant_contract}=this.state;
        /*participant_contract.methods.getParticularUser(addr).call().then((issuer)=>{
            console.log("issuer name is ",issuer[1]);
            return issuer[1];
        })    */
        var issuer = await participant_contract.methods.getParticularUser(addr).call();
        console.log("issuer name is ",issuer[3]);
        return issuer[3]; 
    }

    async componentDidMount(){
        
        var rows =[];
        var indices = [];
        const { current_account, certificate_contract } = this.state;
        //certificate_contract.methods.getTotalCertificatesCount().call().then((count) => {
            var count= await certificate_contract.methods.getTotalCertificatesCount().call();
              //var i;
            console.log("total count: "+count);
            for (let j=0;j<count;j++)
                indices.push(j);
            for (let i in indices) {
                console.log("i val:"+i);
                try{
                    //certificate_contract.methods.getParticularCertificate(i).call().then((certificate_details) => {
                        var certificate_details= await certificate_contract.methods.getParticularCertificate(i).call();
                        console.log("certi dets: id="+i+" rcpaddr="+certificate_details[0]+" certi hash="+certificate_details[1]+" issueraddr "+certificate_details[4] );
                        if (certificate_details[0] == current_account){
                            console.log("rcp addr matched");
                            let issuerName= await this.getIssuerName(certificate_details[4])
                            console.log("in did mount issuer is: ",issuerName)
                            //certificate_contract.methods.getParticularCertificateIssuerAddress(i).call().then((issuer_addr) => {
                                rows.push(<tr key={10000+i}>
                                    <td>{10000+i}</td>
                                    <td>{issuerName}</td>
                                    <td> <ExportButton 
                                                    current_account = {this.state.current_account} 
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
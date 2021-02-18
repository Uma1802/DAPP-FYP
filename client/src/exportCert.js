import React, { Component } from 'react';
import './PendingRequest/PendingRequest.css';
import ExportButton from './Buttons/ExportButton';

class ExportCert extends Component {  

    state={
        current_account: this.props.current_account, 
        contract: this.props.contract,
        certificate_contract: this.props.certificate_contract,
        element: null,
    };

    componentDidMount(){
        var rows =[];
        var indices = [];
        const { current_account, certificate_contract } = this.state;
        certificate_contract.methods.getCertificateCount().call().then((count) => {
            //var i;
            console.log("count: "+count);
            for (let j=0;j<count;j++)
                indices.push(j);
            for (let i in indices) {
                console.log("i val:"+i);
                certificate_contract.methods.getParticularCertificate(i).call().then((certificate_details) => {
                    console.log("certi dets: id="+i+" rcpaddr="+certificate_details[0]+" certi hash="+certificate_details[1]+" ipfs hash "+certificate_details[2] );
                    if (certificate_details[0] == current_account){
                        console.log("rcp addr matched");
                        rows.push(<tr key={10000+i}>
                            <td>{10000+i}</td>
                            <td> <ExportButton 
                                            current_account = {this.state.current_account} 
                                            ipfsHash= {certificate_details[2]}
                                            /> </td>
                            </tr>);
                        console.log("rows length: "+rows);
                    }
                    if (i == (count-1))
                    {
                        console.log("rows length end: "+rows);
                        if (rows.length == 0)
                        this.setState({element:<tbody><h3>No Certificates Received!</h3></tbody>});
                        else
                        this.setState({element:<tbody>{rows}</tbody>});
                    }
                });
            }
            
        });                                   
        }

    render(){

    return(
        <div className="row row-content">
                    <div className="col-12">
                        <h2>Export certificate</h2>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Certificate ID</th>
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
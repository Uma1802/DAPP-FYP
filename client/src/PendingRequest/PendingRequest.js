import React, { Component } from 'react';
import './PendingRequest.css';
import AdmitButton from '../Buttons/AdmitButton';
import DenyButton from '../Buttons/DenyButton';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";

class PendingRequest extends Component {  

    state={
        pending_requests:null,
        web3: this.props.web3, 
        current_account: this.props.current_account, 
        contract: this.props.contract,
        element: null
    };

    constructor(props){
        super(props);
        //this.loadPendingRequests();
        console.log("in constructor");
    }

    componentDidMount(){
        console.log("in didmount");
        const { current_account, contract } = this.state;
        contract.methods.getPendingRequest().call().then(
            (res) => {
                this.setState({pending_requests: res});
                var x;
                var rows = [];
                try{
                    console.log("pending_requests in didmount: "+this.state.pending_requests);
                    for (x in this.state.pending_requests)
                    {
                        console.log("Req addr1: "+this.state.pending_requests[x])
                        let current_req_addr = this.state.pending_requests[x];
                        this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
                            (request_details) => {
                                console.log("NAME: "+request_details[1]);
                                console.log("REQ ADDR: "+current_req_addr);
                                rows.push(<tr key={current_req_addr}>
                                    <td>{request_details[1]}</td>
                                    <td>{current_req_addr}</td>
                                    <td><AdmitButton/></td>
                                    <td><DenyButton/></td>
                                    </tr>);
                                console.log("row len in loop: "+rows.length);
                                console.log("rows in loop: "+rows) ;
                            if (rows.length === this.state.pending_requests.length){
                                console.log("going to return rows..row len: "+rows.length);
                                this.setState({element:<tbody>{rows}</tbody>});
                            }
                        }
                        );                                              
                    }
                }
                catch(error){
                    console.error(error);
                }
            }
        );
        
    }
        
        
    loadPendingRequests = async() => {
        console.log("in lpr start");
        console.log("contract obj: "+this.state.contract);
        const { current_account, contract } = this.state;
        try{
            let res = await contract.methods.getPendingRequest().call();
            this.setState({pending_requests: res});
            console.log("pr1: "+this.state.pending_requests);
            console.log("in lpr end");
        }
        catch(error){
            console.error(error);
        }

    }

   /* mapRequests = () => {
        this.displayRequests();
            return(<tr>
            <td>{request_details[1]}</td>
            <td>{request_addr}</td>
            <td>17-12-2020 16:30</td>
            <td><AdmitButton/></td>
            <td><DenyButton/></td>
            </tr>);
    }

    displayRequests = async() => {
        let x;
        for (x in this.state.pending_requests)
        {
            console.log("Req addr1: "+this.state.pending_requests[x]);
            let current_req_addr = this.state.pending_requests[x];
            const request_details = await this.state.contract.methods.getParticularRequest(current_req_addr).call();
            console.log("NAME: "+request_details[1]);
            return 
        }      
    }*/

    display = async() => {
        var x;
        var rows = [];
        try{
            for (x in this.state.pending_requests)
            {
                console.log("Req addr1: "+this.state.pending_requests[x])
                let current_req_addr = this.state.pending_requests[x];
                this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
                    (request_details) => {
                        console.log("NAME: "+request_details[1]);
                        rows.push(<tr key="{current_req_addr}">
                            <td>{request_details[1]}</td>
                            <td>{current_req_addr}</td>
                            <td>17-12-2020 16:30</td>
                            <td><AdmitButton/></td>
                            <td><DenyButton/></td>
                            </tr>);
                        console.log("row len in loop: "+rows.length);
                        console.log("rows in loop: "+rows) ;
                    if (rows.length === this.state.pending_requests.length){
                        console.log("going to return rows..row len: "+rows.length);
                        return (<tbody>{rows}</tbody>)
                    }
                }
                );                                              
            }
        }
        catch(error){
            console.error(error);
        }
        finally{
            //console.log("going to return rows..row len: "+rows.length);
            //return (<tbody>{rows}</tbody>)
        }
        
       // console.log("row len: "+rows.length);
       // return (<tbody>{rows}</tbody>)
    }  
    
    test = () => {
        return (<tr>
            <td>vv</td>
            <td>current_req_addr</td>
            <td>17-12-2020 16:30</td>
            <td><AdmitButton/></td>
            <td><DenyButton/></td>
            </tr>);
    }
    displaytest = () => {
       /* this.display().then( (element) => {
            console.log("element type: "+typeof(element));
            return element;
        }            
        );*/


        var x;
        var rows = [];
        try{
            for (x in this.state.pending_requests)
            {
                console.log("Req addr1: "+this.state.pending_requests[x])
                let current_req_addr = this.state.pending_requests[x];
                this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
                    (request_details) => {
                        console.log("NAME: "+request_details[1]);
                        rows.push(<tr key="{current_req_addr}">
                            <td>{request_details[1]}</td>
                            <td>{current_req_addr}</td>
                            <td>17-12-2020 16:30</td>
                            <td><AdmitButton/></td>
                            <td><DenyButton/></td>
                            </tr>);
                        console.log("row len in loop: "+rows.length);
                        console.log("rows in loop: "+rows) ;
                    if (rows.length === this.state.pending_requests.length){
                        console.log("going to return rows..row len: "+rows.length);
                        return (<tbody>{rows}</tbody>)
                    }
                }
                );                                              
            }
        }
        catch(error){
            console.error(error);
        }
        
    }
    render(){
        console.log("in render");
        var x;
    
    console.log("pr: "+this.state.pending_requests);
    console.log("typeof pr: "+typeof(this.state.pending_requests));
    console.log("Is pr a string?: "+(this.state.pending_requests instanceof String));
    var x;
    for (x in this.state.pending_requests)
        console.log("Req addr: "+this.state.pending_requests[x]);
    //this.displayRequests();
    return( 
        <div className="row row-content">
                    <div className="col-12">
                        <h2>Pending requests</h2>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>&nbsp;</th>
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

export default PendingRequest;
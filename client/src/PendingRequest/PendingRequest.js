import React, { Component } from 'react';
import './PendingRequest.css';
import AdmitButton from '../Buttons/AdmitButton';
import DenyButton from '../Buttons/DenyButton';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";

class PendingRequest extends Component {  

    state={
        pending_requests:null,
        current_account: this.props.current_account, 
        contract: this.props.contract,
        element: null,
        rows: []
    };

    constructor(props){
        super(props);
        console.log("in constructor");
        //this.loadRequests();
    }

    changeRenderFlag = () => {
        this.setState({render_flag: true});
    }

    componentDidMount(){
        console.log("in didmount");
        const { current_account, contract } = this.state;
        contract.methods.getPendingRequest().call().then(
            (res) => {
                this.setState({pending_requests: res});
                var x;
                var rows = [];
                var cnt=0;
                try{
                    console.log("pending_requests in didmount: "+this.state.pending_requests);
                    for (x in this.state.pending_requests)
                    {
                        cnt++;
                        console.log("Req addr1: "+this.state.pending_requests[x])
                        let current_req_addr = this.state.pending_requests[x];
                        if (current_req_addr != "0x0000000000000000000000000000000000000000"){
                            this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
                                (request_details) => {
                                    console.log("NAME: "+request_details[1]);
                                    console.log("REQ ADDR: "+current_req_addr);
                                    rows.push(<tr key={current_req_addr}>
                                        <td>{request_details[1]}</td>
                                        <td>{current_req_addr}</td>
                                        <td><AdmitButton
                                            current_account = {this.state.current_account} 
                                            contract = {this.state.contract} 
                                            req_addr={current_req_addr}
                                            deleteRequestRow = {this.deleteRequestRow}
                                        /></td>
                                        <td><DenyButton
                                            current_account = {this.state.current_account} 
                                            contract = {this.state.contract} 
                                            req_addr={current_req_addr}
                                            deleteRequestRow = {this.deleteRequestRow}
                                        /></td>
                                        </tr>);
                                    console.log("row len in loop: "+rows.length);
                                    console.log("rows in loop: "+rows) ;
                                if (cnt == this.state.pending_requests.length){
                                    console.log("going to return rows..row len: "+rows.length);
                                    this.setState({rows});
                                    this.setState({element:<tbody>{rows}</tbody>});                                   
                                }
                            }
                            ); 
                        }
                                                                     
                    }
                    if (rows.length == 0){
                        console.log("no rows");
                        this.setState({element:<tbody><h2>No Pending Requests!</h2></tbody>});
                    } 
                }
                catch(error){
                    console.error(error);
                }
            }
        );
        
    }

    deleteRequestRow = (req_addr) => {
        this.setState((state) => ({
            rows: state.rows.filter((row) => row.key !== req_addr)
        }))
        if (this.state.rows.length == 0)
            this.setState({element:<tbody><h2>No Pending Requests!</h2></tbody>});
        else
            this.setState({element:<tbody>{this.state.rows}</tbody>});

    }
        

    render(){
        //this.loadRequests();
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
// import React, { Component } from 'react';
// import './PendingRequest.css';
// import AdmitButton from '../Buttons/AdmitButton';
// import DenyButton from '../Buttons/DenyButton';
// import Web3 from 'web3';
// import Participants from "../contracts/Participants.json";

// class PendingRequest extends Component {  

//     state=
//         pending_requests : null,
//         current_account: this.props.current_account, 
//         contract: this.props.contract,
//         element: null,
//         rows: []
//     };

//     constructor(props){
//         super(props);
//         console.log("in constructor");
//         //this.loadRequests();
//     }

//     changeRenderFlag = () => {
//         this.setState({render_flag: true});
//     }

//     componentDidMount(){
//         console.log("in didmount");
//         const { current_account, contract } = this.state;
//         contract.methods.getPendingRequest().call().then(
//             (res) => {
//                 this.setState({pending_requests: res});
//                 var x;
//                 var rows = [];
//                 var cnt=0;
//                 try{
//                     console.log("pending_requests in didmount: "+this.state.pending_requests);
//                     for (x in this.state.pending_requests)
//                     {
//                         cnt++;
//                         console.log("Req addr1: "+this.state.pending_requests[x])
//                         let current_req_addr = this.state.pending_requests[x];
//                         if (current_req_addr != "0x0000000000000000000000000000000000000000"){
//                             this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
//                                 (request_details) => {
//                                     console.log("NAME: "+request_details[1]);
//                                     console.log("REQ ADDR: "+current_req_addr);
//                                     rows.push(<tr key={current_req_addr}>
//                                         <td>{request_details[1]}</td>
//                                         <td>{current_req_addr}</td>
//                                         <td><AdmitButton
//                                             current_account = {this.state.current_account} 
//                                             contract = {this.state.contract} 
//                                             req_addr={current_req_addr}
//                                             deleteRequestRow = {this.deleteRequestRow}
//                                         /></td>
//                                         <td><DenyButton
//                                             current_account = {this.state.current_account} 
//                                             contract = {this.state.contract} 
//                                             req_addr={current_req_addr}
//                                             deleteRequestRow = {this.deleteRequestRow}
//                                         /></td>
//                                         </tr>);
//                                     console.log("row len in loop: "+rows.length);
//                                     console.log("rows in loop: "+rows) ;
//                                 if (cnt == this.state.pending_requests.length){
//                                     console.log("going to return rows..row len: "+rows.length);
//                                     this.setState({rows});
//                                     this.setState({element:<tbody>{rows}</tbody>});                                   
//                                 }
//                             }
//                             ); 
//                         }
                                                                     
//                     }
//                     if (rows.length == 0){
//                         console.log("no rows");
//                         this.setState({element:<tbody><h2>No Pending Requests!</h2></tbody>});
//                     } 
//                 }
//                 catch(error){
//                     console.error(error);
//                 }
//             }
//         );
        
//     }

//     // componentDidMount(){
//     //     console.log("in didmount");
//     //     const { current_account, contract } = this.state;
//     //     contract.methods.getPendingRequestCount().call().then(
//     //         (res) => {
//     //             console.log("in here 1")
//     //             this.setState({pending_requests_count: res});
//     //             console.log("in here 2")
//     //             contract.methods.getRequestAddress(0).call().then(
//     //                 (addr) => {   
//     //                     console.log("xxx addr: "+ addr);  
//     //                 }
//     //             )
//     //             for (var i=0;i<res;i++)
//     //             {                    
//     //                 contract.methods.getRequestAddress(i).call().then(
//     //                     (addr) => {                            
//     //                         this.setState({
//     //                             pending_requests: [ this.state.pending_requests, addr],
//     //                             });
//     //                         console.log("Addr: "+addr);
//     //                 });
                   
//     //                 console.log("Pending requests: "+this.state.pending_requests);
//     //             }
//     //             var x;
//     //             var rows = [];
//     //             var cnt=0;
//     //             try{
//     //                 console.log("pending_requests in didmount: "+this.state.pending_requests);
//     //                 for (x in this.state.pending_requests)
//     //                 {
//     //                     cnt++;
//     //                     console.log("Req addr1: "+this.state.pending_requests[x])
//     //                     let current_req_addr = this.state.pending_requests[x];
//     //                     if (current_req_addr != "0x0000000000000000000000000000000000000000"){
//     //                         this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
//     //                             (request_details) => {
//     //                                 console.log("NAME: "+request_details[1]);
//     //                                 console.log("REQ ADDR: "+current_req_addr);
//     //                                 rows.push(<tr key={current_req_addr}>
//     //                                     <td>{request_details[1]}</td>
//     //                                     <td>{current_req_addr}</td>
//     //                                     <td><AdmitButton
//     //                                         current_account = {this.state.current_account} 
//     //                                         contract = {this.state.contract} 
//     //                                         req_addr={current_req_addr}
//     //                                         deleteRequestRow = {this.deleteRequestRow}
//     //                                     /></td>
//     //                                     <td><DenyButton
//     //                                         current_account = {this.state.current_account} 
//     //                                         contract = {this.state.contract} 
//     //                                         req_addr={current_req_addr}
//     //                                         deleteRequestRow = {this.deleteRequestRow}
//     //                                     /></td>
//     //                                     </tr>);
//     //                                 console.log("row len in loop: "+rows.length);
//     //                                 console.log("rows in loop: "+rows) ;
//     //                             if (cnt === this.state.pending_requests.length){
//     //                                 console.log("going to return rows..row len: "+rows.length);
//     //                                 this.setState({rows});
//     //                                 this.setState({element:<tbody>{rows}</tbody>});                                   
//     //                             }
//     //                         }
//     //                         ); 
//     //                     }
                                                                     
//     //                 }
//     //                 if (rows.length === 0){
//     //                     console.log("no rows");
//     //                     this.setState({element:<tbody><h2>No Pending Requests!</h2></tbody>});
//     //                 } 
//     //             }
//     //             catch(error){
//     //                 console.error(error);
//     //             }
//     //         }
//     //     );
        
//     // }

//     deleteRequestRow = (req_addr) => {
//         this.setState((state) => ({
//             rows: state.rows.filter((row) => row.key !== req_addr)
//         }))
//         if (this.state.rows.length === 0)
//             this.setState({element:<tbody><h2>No Pending Requests!</h2></tbody>});
//         else
//             this.setState({element:<tbody>{this.state.rows}</tbody>});

//     }
        

//     render(){
//         //this.loadRequests();
//         console.log("in render");
//         var x;
    
//     console.log("pr: "+this.state.pending_requests);
//     console.log("typeof pr: "+typeof(this.state.pending_requests));
//     console.log("Is pr a string?: "+(this.state.pending_requests instanceof String));
//     var x;
//     for (x in this.state.pending_requests)
//         console.log("Req addr: "+this.state.pending_requests[x]);
//     //this.displayRequests();
//     return( 
//         <div className="row row-content">
//                     <div className="col-12">
//                         <h2>Pending requests</h2>
//                         <div className="table-responsive">
//                             <table className="table table-striped">
//                                 <thead className="thead-dark">
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Address</th>
//                                         <th>&nbsp;</th>
//                                         <th>&nbsp;</th>
//                                     </tr>
//                                 </thead>
                                
//                                     {                                 
//                                         this.state.element
//                                     }
                                
                                    
                                    
                                
//                             </table>
//                         </div>
//                     </div>
//                 </div>             
//     )
//     }
// }

// export default PendingRequest;
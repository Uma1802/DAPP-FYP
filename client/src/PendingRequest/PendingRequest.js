import React, { Component } from 'react';
import './PendingRequest.css';
import AdmitButton from '../Buttons/AdmitButton';
import DenyButton from '../Buttons/DenyButton';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";

class PendingRequest extends Component {  

    state={
        current_account: this.props.current_account, 
        contract: this.props.contract,
        //current_account:null,
        //contract:null,
        pending_requests:null,
        element: null,
        rows: []
    };

    constructor(props){
        super(props);
        console.log("in constructor");
    }

    changeRenderFlag = () => {
        this.setState({render_flag: true});
    }

    updateState(parsedCurrentAccount,parsedContract){
        console.log("start update state")
        this.setState({current_account: parsedCurrentAccount,contract:parsedContract})
        console.log("end update state")
    }

    updateContract = async(e) =>{
        const web3 = new Web3(Web3.givenProvider);
       console.log("in update contract");
       try{

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log("Logged in account: "+account);
            const currentAccount = web3.utils.toChecksumAddress(account);
            console.log("Checksum of logged in account: "+currentAccount);

               const networkId = await web3.eth.net.getId();
               console.log("current network id: "+networkId);
               const deployedNetwork = Participants.networks[networkId];
               const participantInstance = new web3.eth.Contract(
                   Participants.abi,
                   deployedNetwork && deployedNetwork.address,
                   );
               console.log("Participants sol address: "+participantInstance.options.address);  
           
               this.setState({contract: participantInstance,current_account:currentAccount });
       }catch(error){
        console.error(error);
        }
    }

    componentWillMount(){
        console.log("in willmount");

        console.log("current account in will mount before "+this.state.current_account)
        console.log("props current account: ",this.props.current_account)

       // console.log("contract in will  mount before ",this.state.contract)
        // console.log("props contract: ",this.props.contract)

        /*if(!this.props.current_account || !this.props.contract){
            //console.log("no props ")
            const parsedCurrentAccount = JSON.parse(localStorage.getItem("currentAccount"))
            console.log("in local currentAccount: ",parsedCurrentAccount)
            const parsedContract = JSON.parse(localStorage.getItem("contract"))
            console.log("in local contract: ",parsedContract)

            this.updateState(parsedCurrentAccount,parsedContract)

            //this.setState({current_account: parsedCurrentAccount,contract:parsedContract})
        }
        else{

            console.log("in else")
            localStorage.setItem("currentAccount", JSON.stringify(this.props.current_account))
            localStorage.setItem("contract", JSON.stringify(this.props.contract))
            const parsedContract = JSON.parse(localStorage.getItem("contract"))
            console.log("in local contract: ",parsedContract)

           // this.setState({current_account: this.props.current_account,contract:this.props.contract})
            //console.log("after set state")
        }*/

        //this.updateContract();

        //console.log("after update contract in will mount")

        //console.log("current account in will mount after ",this.state.current_account)
        //console.log("contract in will mount after ",this.state.contract)
    }

    componentDidMount(){
        /*console.log("in didmount");

        console.log("current account in did mount before "+this.state.current_account)
        console.log("props current account: ",this.props.current_account)

        console.log("contract in did mount before "+this.state.contract)
        console.log("props contract: ",this.props.contract)

        if(!this.props.current_account || !this.props.contract){
            //console.log("no props ")
            const parsedCurrentAccount = JSON.parse(localStorage.getItem("currentAccount"))
            console.log("in local currentAccount: ",parsedCurrentAccount)
            const parsedContract = JSON.parse(localStorage.getItem("contract"))
            console.log("in local contract: ",parsedContract)

            this.updateState(parsedCurrentAccount,parsedContract)

            //this.setState({current_account: parsedCurrentAccount,contract:parsedContract})
        }
        else{

            console.log("in else")
            localStorage.setItem("currentAccount", JSON.stringify(this.props.current_account))
            localStorage.setItem("contract", JSON.stringify(this.props.contract))

           // this.setState({current_account: this.props.current_account,contract:this.props.contract})
            console.log("after set state")
        }

        console.log("current account in did mount after "+this.state.current_account)
        console.log("contract in did mount after "+this.state.contract)
        */

        console.log("in did mount")

        this.updateContract().then(
            ()=>{
                const { contract } = this.state;
        contract.methods.getPendingRequest().call().then(
            (res) => {
                this.setState({pending_requests: res});
                var x;
                var rows = [];
                var cnt=0;
                try{
                    console.log("pending_requests in didmount: "+this.state.pending_requests);
                    console.log("Current Address: "+this.state.current_account);
                    var currentUserInstitution ="";
                    var currentUserType ="";
                    this.state.contract.methods.getParticularUser(this.state.current_account).call().then(
                        (res) =>
                        {   console.log(" res[0] "+res[0]);
                            console.log(" res[1] "+res[1]);
                            console.log(" res[2] "+res[2]);
                            console.log(" res[3] "+res[3]);
                            console.log(" res[4] "+res[4]);
                            currentUserInstitution = res[3];
                            currentUserType = res[2];
                        
                    console.log(" currentUserInstitution: "+currentUserInstitution);
                    console.log(" currentUserType: "+currentUserType);
                    for (x in this.state.pending_requests)
                    {
                        cnt++;
                        console.log("Req addr1: "+this.state.pending_requests[x])
                        let current_req_addr = this.state.pending_requests[x];
                        if (current_req_addr != "0x0000000000000000000000000000000000000000"){
                            this.state.contract.methods.getParticularRequest(current_req_addr).call().then(
                                (request_details) => {                                   
                                   
                                    if((currentUserType==1)||(currentUserType==2 && request_details[3]== currentUserInstitution)){
                                        console.log("NAME: "+request_details[1]);
                                        console.log("INSTITUTION"+request_details[3])
                                        console.log("REQ ADDR: "+current_req_addr);
                                        rows.push(<tr key={current_req_addr}>
                                            <td>{request_details[1]}</td>
                                            <td>{request_details[3]}</td>
                                            <td>{current_req_addr}</td>
                                            <td><AdmitButton
                                                current_account = {this.state.current_account} 
                                                participant_contract = {this.state.contract} 
                                                req_addr={current_req_addr}
                                                deleteRequestRow = {this.deleteRequestRow}
                                                /></td>
                                                <td><DenyButton
                                                    current_account = {this.state.current_account} 
                                                    participant_contract = {this.state.contract} 
                                                    req_addr={current_req_addr}
                                                    deleteRequestRow = {this.deleteRequestRow}
                                                /></td>
                                                </tr>);
                                            console.log("row len in loop: "+rows.length);
                                            console.log("rows in loop: "+rows) ;
                                        }
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
                        );
                    }
                    catch(error){
                        console.error(error);
                    }
                }
            );
        });
        //console.log("after update contract in did mount")    
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
        console.log("in pending request render");
        console.log("contract ",this.state.contract)
        console.log("current account: ",this.state.current_account)
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
                                        <th>Institution</th>
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
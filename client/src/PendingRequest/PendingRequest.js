import React, { Component } from "react";
import "./PendingRequest.css";
import AdmitButton from "../Buttons/AdmitButton";
import DenyButton from "../Buttons/DenyButton";
import Web3 from "web3";
import Participants from "../contracts/Participants.json";

class PendingRequest extends Component {
  state = {
    participant_contract: null,
    current_account: null,
    pending_requests: null,
    element: null,
    rows: [],
  };

  changeRenderFlag = () => {
    this.setState({ render_flag: true });
  };

  updateContract = async (e) => {
    const web3 = new Web3(Web3.givenProvider);
    console.log("in update contract");
    const parsedCurrentAccount = JSON.parse(
      localStorage.getItem("currentAccount")
    );
    console.log("in local currentAccount: ", parsedCurrentAccount);

    try {
      const networkId = await web3.eth.net.getId();
      console.log("current network id: " + networkId);
      if (networkId !== 1515)
      {
          throw new Error("Incorrect network ID")
      }
      const deployedNetwork = Participants.networks[networkId];
      const participantInstance = new web3.eth.Contract(
        Participants.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log(
        "Participants sol address: " + participantInstance.options.address
      );

      this.setState({
        participant_contract: participantInstance,
        current_account: parsedCurrentAccount,
      });
    } catch (error) {
      console.error(error);
      if (error.message.includes("Incorrect network ID"))
                alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
    }
  };

  componentDidMount() {
    console.log("in did mount");

    this.updateContract().then(() => {
      const { participant_contract } = this.state;
      participant_contract.methods
        .getPendingRequest()
        .call()
        .then((res) => {
          this.setState({ pending_requests: res });

          var x;
          var rows = [];
          var cnt = 0;
          try {
            console.log("pending_requests in didmount: " + this.state.pending_requests);
            console.log("Current Address: " + this.state.current_account);
            var currentUserInstitution = "";
            var currentUserType = "";
            this.state.participant_contract.methods
              .getParticularUser(this.state.current_account)
              .call()
              .then((res) => {
                console.log(" res[0] " + res[0]);
                console.log(" res[1] " + res[1]);
                console.log(" res[2] " + res[2]);
                console.log(" res[3] " + res[3]);
                console.log(" res[4] " + res[4]);
                currentUserInstitution = res[3];
                currentUserType = res[2];

                console.log(" currentUserInstitution: " + currentUserInstitution);
                console.log(" currentUserType: " + currentUserType);
                for (x in this.state.pending_requests) {
                  cnt++;
                  console.log("Req addr1: " + this.state.pending_requests[x]);
                  let current_req_addr = this.state.pending_requests[x];
                  if (current_req_addr != "0x0000000000000000000000000000000000000000") {
                    console.log("before getparticularrequest: " + current_req_addr);
                    this.state.participant_contract.methods.getParticularRequest(current_req_addr).call()
                    .then((request_details) => {
                        if (currentUserType == 1 || (currentUserType == 2 && request_details[3] == currentUserInstitution)) {
                          console.log("NAME: " + request_details[1]);
                          console.log("INSTITUTION" + request_details[3]);
                          console.log("REQ ADDR: " + current_req_addr);
                          rows.push(
                            <tr key={current_req_addr}>
                              <td>{request_details[1]}</td>
                              <td>{request_details[3]}</td>
                              <td>{current_req_addr}</td>
                              <td>
                                <AdmitButton
                                  current_account={this.state.current_account}
                                  participant_contract={
                                    this.state.participant_contract
                                  }
                                  req_addr={current_req_addr}
                                  deleteRequestRow={this.deleteRequestRow}
                                />
                              </td>
                              <td>
                                <DenyButton
                                  current_account={this.state.current_account}
                                  participant_contract={
                                    this.state.participant_contract
                                  }
                                  req_addr={current_req_addr}
                                  deleteRequestRow={this.deleteRequestRow}
                                />
                              </td>
                            </tr>
                          );
                          console.log("row len in loop: " + rows.length);
                          console.log("rows in loop: " + rows);
                        }
                        if (cnt == this.state.pending_requests.length) {
                          console.log("going to return rows..row len: " + rows.length);
                          if (rows.length !== 0){
                            this.setState({ rows });
                            this.setState({ element: 
                                            <div>
                                            <h3>Pending requests</h3>
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
                                                <tbody>
                                                  {rows}
                                                </tbody>
                                              </table>
                                            </div> 
                                            </div>
                                          });
                            }
                        }
                      });
                  }
                }
                if (rows.length === 0) {
                  console.log("no rows");
                  this.setState({
                    element: (
                      <div>
                        <br></br>
                        <h3>No Pending Requests!</h3>
                      </div>
                    )
                  });
                }
              });
          } catch (error) {
            console.error(error);
          }
        });
    });
    //console.log("after update contract in did mount")
  }

  deleteRequestRow = (req_addr) => {
    this.setState((state) => ({
      rows: state.rows.filter((row) => row.key !== req_addr),
    }));
    if (this.state.rows.length == 0)
      this.setState({
        element: (
          <tbody>
            <h2>No Pending Requests!</h2>
          </tbody>
        ),
      });
    else this.setState({ element: <tbody>{this.state.rows}</tbody> });
  };

  render() {
    //this.loadRequests();
    console.log("in pending request render");
    console.log("participant_contract ", this.state.participant_contract);
    console.log("current account: ", this.state.current_account);
    var x;

    console.log("pr: " + this.state.pending_requests);
    console.log("typeof pr: " + typeof this.state.pending_requests);
    console.log("Is pr a string?: " + (this.state.pending_requests instanceof String)    );
    var x;
    for (x in this.state.pending_requests)
      console.log("Req addr: " + this.state.pending_requests[x]);
    //this.displayRequests();
    return (
      <div className="row row-content">
        <div className="col-12">
          {this.state.element}
        </div>
      </div>
    );
  }
}

export default PendingRequest;

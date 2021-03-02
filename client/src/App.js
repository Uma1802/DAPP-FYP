import React, { Component } from "react";
import "./App.css";
import { Route } from 'react-router-dom'
import RegistrationControl from './RegistrationControl/RegistrationControl'
import InstitutionDashBoard from './institutionDash'
import EduUserDashBoard from './eduUserDash'

class App extends Component {
  state = { 
          web3: null, 
          current_account: null, 
          contract: null,
          certificate_contract: null
          };



  /*componentDidMount(){
    let abi = Certificates.abi;
    let bytecode = Certificates.bytecode;

    let deploy_contract = new web3.eth.Contract(JSON.parse(abi));
    let account = '0x7CCb5e94bFFBBEa86035324cb636C0E0ec3500d6';

    let payload = {
      data: bytecode
    }

    let parameter = {
      from: account,
      gas: web3.utils.toHex(800000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
      }

      deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        console.log('Transaction Hash :', transactionHash);
    }).on('confirmation', () => {}).then((certificate_contract) => {
        console.log('Deployed Contract Address : ', certificate_contract.options.address);
    })
    
    
  }*/
  changeAppState = (web3, current_account, contract, certificate_contract) =>{
    this.setState({web3, current_account, contract, certificate_contract})
    console.log("Inside app.js- certi contract obj : "+this.state.certificate_contract);
  }

  render() {
    /*if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }*/
    return (
      /*<div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>*/
      <div>
       <Route exact path='/' render={({ history }) => ( 
         
          <RegistrationControl 
              history={history}
              web3 = {this.state.web3} 
              current_account = {this.state.current_account} 
              contract = {this.state.contract} 
              changeAppState = {this.changeAppState}
              certificate_contract = {this.state.certificate_contract}
          /> 
          
      )}/>
       <Route exact path='/institution' render={({ history }) => (
         <InstitutionDashBoard
            web3 = {this.state.web3} 
            current_account = {this.state.current_account} 
            contract = {this.state.contract} 
            certificate_contract = {this.state.certificate_contract}
         />
      )}/>

      <Route exact path='/eduUser' render={() => (
              <EduUserDashBoard
              web3 = {this.state.web3} 
              current_account = {this.state.current_account} 
              contract = {this.state.contract} 
              certificate_contract = {this.state.certificate_contract}
              />
            )}/>

      </div>
    );
  }
}

export default App;

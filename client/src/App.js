import React, { Component } from "react";
import "./App.css";
import { Route } from 'react-router-dom'
import RegistrationControl from './RegistrationControl/RegistrationControl'
import InstitutionDashBoard from './institutionDash'
import EduUserDashBoard from './eduUserDash'
import VerifyCert from "./verifyCert";
import Header from "./Header/Header";

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

      <Route exact path='/verify' render={() => (
        <div>
          <Header/>
              <VerifyCert
              web3 = {this.state.web3}  
              certificate_contract = {this.state.certificate_contract}
              />
        </div>
            )}/>

      </div>
    );
  }
}

export default App;

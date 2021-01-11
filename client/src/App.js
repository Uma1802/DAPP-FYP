import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Participants from "./contracts/Participants.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import { Route } from 'react-router-dom'
import RegistrationControl from './RegistrationControl'
import InstitutionDashBoard from './institutionDash'
import Header from './Header'

class App extends Component {
  state = { 
          web3: null, 
          current_account: null, 
          contract: null 
          };

  /*componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("network id: "+networkId);
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      console.log("deployed network: "+deployedNetwork);
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };*/

  runExample = async () => {
    try{
      const { accounts, contract } = this.state;

      // Stores a given value, 5 by default.
      await contract.methods.set(50).send({ from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const response = await contract.methods.get().call();

      // Update state with the result.
      this.setState({ storageValue: response });
      alert("Value from contract: "+this.state.storageValue);
      console.log("Value from contract: "+this.state.storageValue);
    }
    catch (error){
      console.error(error);
    }
    
  };
  changeAppState = (web3, current_account, contract) =>{
    this.setState({web3, current_account, contract})
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
         <div> 
          <Header/>
          <RegistrationControl 
              onLoginSuccess={() => {
                history.push('/institution')
                }}
              web3 = {this.state.web3} 
              current_account = {this.state.current_account} 
              contract = {this.state.contract} 
              changeAppState = {this.changeAppState}
          /> 
          </div>
      )}/>
       <Route exact path='/institution' render={() => (
         <InstitutionDashBoard/>
      )}/>
      </div>
    );
  }
}

export default App;

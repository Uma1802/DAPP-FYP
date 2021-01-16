import './RegistrationControl.css';
import Header from '../Header/Header.js'
import React, { Component } from 'react';
import serializeForm from 'form-serialize';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";
import getWeb3 from "../getWeb3";

class RegistrationControl extends Component {  
    
    state={
        userName:"",
        institutionName:"",
        userType:"",
        web3: null, 
        current_account: null, 
        contract: null
    };

    constructor(props){
        super(props);
        this.setState({web3: this.props.web3, current_account: this.props.current_account, contract: this.props.contract});
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
      }

    updateName = (value) =>{
        this.setState({userName: value});
    }    

    componentDidMount(){
        const web3 = new Web3(Web3.givenProvider);
        this.setState({web3});
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const web3 = new Web3(Web3.givenProvider);
            const result = await this.connectMetamaskAccount();
            if (result !== "NO METAMASK"){
                const current_account = web3.utils.toChecksumAddress(result);
                console.log("Checksum of logged in account: "+current_account);
                const networkId = await web3.eth.net.getId();
                console.log("current network id: "+networkId);
                const deployedNetwork = Participants.networks[networkId];
                const instance = new web3.eth.Contract(
                    Participants.abi,
                    deployedNetwork && deployedNetwork.address,
                    );
                this.setState({ current_account, contract: instance });
                const { contract } = this.state;
                const values = serializeForm(e.target, { hash: true })
                console.log("submit"+values);
                console.log("name: "+this.state.userName);
                console.log("type: "+this.state.userType);
                console.log("institution: "+this.state.institutionName);
                var usertype_number;
                if (this.state.userType === 'Institution')
                    usertype_number = 2;
                else
                    usertype_number = 3;
                let res = await contract.methods.getPendingRequest().call();
                console.log("requests list: "+res);
                console.log("requests list size: "+res.length);
                try{
                    await contract.methods.createUserRequest(this.state.userName,
                        usertype_number,
                        this.state.institutionName).send({ from: current_account });
                }
                catch(error)
                {
                    alert("User already exists or user request is pending!");
                }
                
                res = await contract.methods.getPendingRequest().call();
                console.log("new requests list: "+res);
                console.log("new requests list size: "+res.length);
            }
            else{
                alert("Please install metamask!");
            }
        }
        catch(error){
            console.error(error);
        }
        
        //}
      }

      loginButtonHandler = async() => {
          var loginFlag = false;
          var current_account=null;
          try{
                 const web3 = new Web3(Web3.givenProvider);
                const result = await this.connectMetamaskAccount();
                if (result !== "NO METAMASK")
                {
                    current_account = web3.utils.toChecksumAddress(result);
                    console.log("Checksum of logged in account: "+current_account);

                    const networkId = await web3.eth.net.getId();
                    console.log("current network id: "+networkId);
                    const deployedNetwork = Participants.networks[networkId];
                    const instance = new web3.eth.Contract(
                        Participants.abi,
                        deployedNetwork && deployedNetwork.address,
                      );
                    this.setState({ web3, current_account, contract: instance });
                    const loginstatus = await this.checkIfUserExists();
                    if (loginstatus === "USER EXISTS")
                    {
                        //const nonce = "HELLO WORLD NONCE";
                        var min = 1000;
                        var max = 2000;
                        var nonce =  min + (Math.random() * (max-min));
                        nonce+=""+nonce;
                        console.log("Current address: "+current_account);
                        const signature = await web3.eth.personal.sign(nonce, current_account);
                        console.log("Signature: "+signature);
                        let res = await web3.eth.personal.ecRecover(nonce, signature);
                        const recovered_address = web3.utils.toChecksumAddress(res);
                        console.log("Recovered address: "+recovered_address);
                        if (current_account === recovered_address){
                            console.log("Login success");
                            loginFlag = true; 
                            if(loginFlag){
                                const { contract } = this.state;
                                    let res= await contract.methods.getParticularUser(current_account).call();
                                    console.log("res is "+res);
                                    console.log("res[2]: "+res[2]);
                                    this.props.changeAppState(this.state.web3,this.state.current_account,this.state.contract);                                       
                                    if(res[2]==2){
                                        console.log("if1");
                                        this.props.history.push('/institution')
                                    }
                                        
                                    else if(res[2]==3)
                                    {
                                        console.log("if2");
                                        this.props.history.push('/eduUser')
                                    }
                                    else if(res[2]==1)
                                    {
                                        console.log("if2");
                                        this.props.history.push('/institution')
                                    } 
                                    
                            }                           
                        }
                        else{
                            console.log("Login failed");
                            this.props.changeAppState(this.state.web3,this.state.current_account,this.state.contract);
                        }
                    }
                    else{
                        alert("Current account is not registered!");
                    }                    
                }
            }
            catch (error){
                console.error(error);
            }
            finally{
                
                if(!loginFlag){
                    alert("Login failed");
                }
                
            }
        
     }
     checkIfUserExists = async() => {
         var result = "USER DOES NOT EXIST";
         try{
            const { current_account, contract } = this.state;
            const usersList = await contract.methods.getUsers().call();
            console.log("Address list from contract: "+usersList);
            console.log("Typeof usersList: "+typeof(usersList));
            console.log("usersList array length: "+usersList.length);
            const index = usersList.indexOf(current_account);
            console.log("Index of current account: "+index);
            if (index !== -1)
            {
                result = "USER EXISTS" ;
            }
         }
         catch(error){
             console.error(error);
         }
         finally{
             return result;
         }
     }
     connectMetamaskAccount = async() => {
        var result = "NO METAMASK"; 
        try{
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log("Logged in account: "+account);
                result = account;
              }
            else{
                alert("Please install Metamask!");
            }
         }
         catch (error){
            console.log(error);
         }
         finally{
            return result;      
         }
          
     }
    
    render(){

    return(

        <div> 
            <Header/>

            <div className="container">   

            <div className="row justify-content-center">

            <div className="card col-12 col-lg-6 reg-card">
                <h2 className="card-header bg-dark text-white">REGISTRATION</h2>
                <div className="card-body">               

                    <form onSubmit={(e) => this.handleSubmit(e)}>   

                    <div className="form-group text-left">   
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                            </div>
                            <input type="text" 
                                                className="form-control" 
                                                id="name"  
                                                name="userName"
                                                placeholder="Your name" 
                                                value = {this.state.userName}
                                                onChange={this.onChange}
                                                required
                            />    
                        </div>  
                    </div>    

                    <div className="form-group text-left">
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="fab fa-black-tie"></i>
                                </span>
                            </div>
                            <select id="type" value={this.state.userType} onChange={this.onChange}
                            name="userType" className="form-control custom-select bg-white border-left-0 border-md" required>
                                <option value="">Select type of user</option>
                                <option value="Institution">Instituition</option>
                                <option value="EduUser">Edu-User</option>
                            </select>
                        </div>                   
                    </div>

                    <div className="form-group text-left">
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="fas fa-university"></i>
                                </span>
                            </div>
                            <select id="institution" name="institutionName"  value={this.state.institutionName} onChange={this.onChange} className="form-control custom-select bg-white border-left-0 border-md"
                            required={this.state.userType === "EduUser" || this.state.userType === "" || (this.state.userType==="Institution" && this.state.institutionName==="")}>
                                <option value="">Select instituition</option>
                                <option value="ABC">ABC</option>
                                <option value="EFG">EFG</option>
                                <option value="HIJ">HIJ</option>
                                {(this.state.userType === "EduUser" || this.state.userType === "") && ( <option value="Others">Others</option>           
                                )}                         
                            </select>
                        </div>                   
                    </div>

                    {this.state.userType === "Institution" && (
                    <div className="mb-4">
                        <input
                        id="inputLine"
                        name="institutionName"
                        type='text'
                        placeholder='If institution not found, please enter'
                    />
                    </div>
                    )}                   

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                    >Register</button>
                        
                    </form>                     

                <div className="mt-2">
                    <span>Already registered? </span>
                    <span className="loginText" onClick={this.loginButtonHandler}>Login using metamask</span> 
                </div>

            </div>

        </div>

            </div>

            </div>
                    
        </div>

     
    )
    }
}

export default RegistrationControl;
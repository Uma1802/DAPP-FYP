import './RegistrationControl.css';
import Header from '../Header/Header.js'
import React, { Component } from 'react';
import serializeForm from 'form-serialize';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";
import getWeb3 from "../getWeb3";
import Certificates from "../contracts/Certificates.json";

class RegistrationControl extends Component {  
    
    state={
        userName:"",
        institutionName:"",
        userType:"",
        web3: null, 
        current_account: null, 
        contract: null,
        certificate_contract: null
    };

    constructor(props){
        super(props);
        this.setState({web3: this.props.web3, current_account: this.props.current_account, contract: this.props.contract, certificate_contract: this.props.certificate_contract});
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
      }

    /*updateName = (value) =>{
        this.setState({userName: value});
    }*/    

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
                const deployedNetwork1 = Certificates.networks[networkId];
                const instance1 = new web3.eth.Contract(
                        Certificates.abi,
                        deployedNetwork1 && deployedNetwork1.address,
                        );
                console.log("Participants sol address: "+instance.options.address);  
                console.log("Certificates sol address: "+instance1.options.address);
                
                /*console.log("Participants sol address: "+instance.options.address);



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
                    })*/





                this.setState({ current_account, contract: instance, certificate_contract: instance1 });
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
                alert("Registration request sent!");
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
                    const deployedNetwork1 = Certificates.networks[networkId];
                    const instance1 = new web3.eth.Contract(
                              Certificates.abi,
                              deployedNetwork1 && deployedNetwork1.address,
                              );
                      console.log("Participants sol address: "+instance.options.address);  
                      console.log("Certificates sol address: "+instance1.options.address);



                   /*   console.log("Participants sol address: "+instance.options.address);



                    let abi = Certificates.abi;
                    let bytecode = Certificates.bytecode;
                    
                    let deploy_contract = new web3.eth.Contract((abi));
                    let account = '0x7CCb5e94bFFBBEa86035324cb636C0E0ec3500d6';
                   // bytecode += web3.eth.abi.encodeParameter('address', instance.options.address);
                   // console.log("encooded param: "+web3.eth.abi.encodeParameter('address', instance.options.address));
                    let payload = {
                      data: bytecode
                    }
                
                    let parameter = {
                      from: account,
                      gas: web3.utils.toHex(800000),
                      gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
                      }
                
                      deploy_contract.deploy(payload,instance.options.address).send(parameter, (err, transactionHash) => {
                        console.log('Transaction Hash :', transactionHash);
                    }).on('confirmation', () => {}).then((certificate_contract) => {
                        console.log('Deployed Contract Address : ', certificate_contract.options.address);
                    })*/





                    this.setState({ web3, current_account, contract: instance, certificate_contract: instance1});
                    const loginstatus = await this.checkIfUserExists();
                    if (loginstatus === "USER EXISTS")
                    {
                        //const nonce = "HELLO WORLD NONCE";
                        var min = 1000;
                        var max = 2000;
                        var nonce =  min + (Math.random() * (max-min));
                        nonce+=""+nonce;
                        console.log("Current address: "+current_account);
                        try{
                            var signature = await web3.eth.personal.sign(nonce, current_account);
                            console.log("Signature: "+signature);
                        }
                        catch(error){
                            console.log("inside sign catch");
                            console.error(error);
                            console.log("end of sign catch");
                        }
                        
                       
                        try{var res = await web3.eth.personal.ecRecover(nonce, signature);}
                        catch(err){ console.log("inside ecrover cstch"); console.error(err); console.log("end of ecrecover catch");}
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
                                    this.props.changeAppState(this.state.web3,this.state.current_account,this.state.contract,this.state.certificate_contract);
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
                            this.props.changeAppState(this.state.web3,this.state.current_account,this.state.contract,this.state.certificate_contract);
                        }
                    }
                    else{
                        alert("Current account is not registered!");
                    }                    
                }
            }
            catch (error){
                console.log("inside last catch of loginhandler");
                console.error(error);
                console.log("end of last catch of loginhandler");
            }
            finally{
                
                if(!loginFlag){
                    alert("Login failed!");
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
            console.log("inside last catch of checkuser");
            console.error(error);
            console.log("end of last catch of checkuser");
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
             console.log("inside connect catch");
            console.log(error);
            console.log("end of connect catch");
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
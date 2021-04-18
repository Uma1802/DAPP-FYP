import './RegistrationControl.css';
import Header from '../Header/Header.js'
import React, { Component, useEffect } from 'react';
import serializeForm from 'form-serialize';
import Web3 from 'web3';
import Participants from "../contracts/Participants.json";
import getWeb3 from "../getWeb3";
import Certificates from "../contracts/Certificates.json";
//import LoadingOverlay from 'react-loading-overlay';
//import { LoadingOverlay, Loader } from 'react-overlay-loader';
//import { Spinner } from 'react-bootstrap';

class RegistrationControl extends Component {  
    
    state={
        userName:"",
        institutionName:"",
        userType:"",
        web3: null, 
        current_account: null, 
        contract: null,
        certificate_contract: null,
        institutions: ["Others"],
        flag: false,
        regButtonDisabled: false,
        loginButtonDisabled: false,
        loginSpanCursorStyle: {cursor: "pointer"},
        loading: false
    };

    constructor(props){
        super(props);
        //this.setState({web3: this.props.web3, current_account: this.props.current_account, contract: this.props.contract, certificate_contract: this.props.certificate_contract});
    }

    onChange = (e) => {
        console.log("changing name: "+e.target.name+" changing value: "+e.target.value);
        this.setState({[e.target.name]: e.target.value});
    }

    onChangeFunc = (e) => {
        console.log("changing name: "+e.target.name+" changing value: "+e.target.value);
        
        if(e.target.value === "Others"){
            this.setState({flag: true});
            this.setState({[e.target.name]: "None"});
            console.log("institution name in state: "+ this.state.institutionName);
        }
        else {
            this.setState({flag: false});
            //this.setState({institutionName: e.target.value});
            this.setState({[e.target.name]: e.target.value});
            console.log("institution name in state: "+ this.state.institutionName);
        }
        
        //
    }

    componentDidMount(){
        console.log("before clear");
        localStorage.clear();
        console.log("after clear")   //user logs in , presses back arrow and it leads to login page where local storage is cleared, 
        //presses forward arrow- it will go but local storage values will be null, 
        //hence need to prevent forward icon press from login page.
        //can go to dashboard from login page only by logging in , not by forward arrow
        const web3 = new Web3(Web3.givenProvider);
        //this.setState({web3});
        this.setState({web3, current_account: this.props.current_account, contract: this.props.contract, certificate_contract: this.props.certificate_contract});
        this.updateInstitutions();
    }

    updateInstitutions = async(e) =>{
        //let result = "NO METAMASK";
        const web3 = new Web3(Web3.givenProvider);
        this.setState({web3});
        console.log("in updateInstitution");
        try{
            //let result = await this.connectMetamaskAccount();
            //if (result !== "NO METAMASK"){
                const networkId = await web3.eth.net.getId();
                console.log("current network id: "+networkId);
                if (networkId !== 1515)
                {
                    throw new Error("Incorrect network ID")
                }
                const deployedNetwork = Participants.networks[networkId];
                const instance = new web3.eth.Contract(
                    Participants.abi,
                    deployedNetwork && deployedNetwork.address,
                    );
                console.log("Participants sol address: "+instance.options.address);  
            
                this.setState({contract: instance });
                const contract = this.state.contract;                
                contract.methods.getInstitutionsCount().call().then(
                    (count) => {                
                        try{
                            console.log("institution count: "+count);
                            for (var i=0;i<count;i++)
                            {                    
                                this.state.contract.methods.getInstitution(i).call().then(
                                    (inst) => {           
                                        console.log("institutionName: "+ inst);

                                        if(inst!=="None") {                    
                                            console.log("inst list: "+this.state.institutions);
                                            this.setState({
                                                institutions: [this.state.institutions, inst ],
                                                });
                                                console.log("inst list after: "+this.state.institutions);
                                        }
                                });
                                                                                
                            }
                        }
                        catch(error){
                            console.error(error);
                        }
                    }
                );
            //}
            //else{
            //    alert("Please install metamask!");
                
            //}
        }
        catch(error){
            console.error(error);
            if (error.message.includes("Incorrect network ID"))
                alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
            
        }
    }
        
    // updateInstitutions = async(e) =>{
    //     let result = "NO METAMASK";
    //     const web3 = new Web3(Web3.givenProvider);
    //     this.setState({web3});
    //     console.log("in connectViaMetamask");
    //     try{
    //         result = await this.connectMetamaskAccount();
    //         if (result !== "NO METAMASK"){
    //             const current_account = web3.utils.toChecksumAddress(result);
    //             console.log("Checksum of logged in account: "+current_account);
    //             const networkId = await web3.eth.net.getId();
    //             console.log("current network id: "+networkId);
    //             const deployedNetwork = Participants.networks[networkId];
    //             const instance = new web3.eth.Contract(
    //                 Participants.abi,
    //                 deployedNetwork && deployedNetwork.address,
    //                 );
    //             const deployedNetwork1 = Certificates.networks[networkId];
    //             const instance1 = new web3.eth.Contract(
    //                     Certificates.abi,
    //                     deployedNetwork1 && deployedNetwork1.address,
    //                     );
    //             console.log("Participants sol address: "+instance.options.address);  
    //             console.log("Certificates sol address: "+instance1.options.address);
    //             this.setState({ current_account, contract: instance, certificate_contract: instance1 });
    //             this.state.contract.methods.getInstitutionsCount().call().then(
    //                 (count) => {                
    //                     try{
    //                         console.log("institution count: "+count);
    //                         for (var i=0;i<count;i++)
    //                         {                    
    //                             this.state.contract.methods.getInstitution(i).call().then(
    //                                 (inst) => {           
    //                                     if(!inst.equals("None")) {                    
    //                                         this.setState({
    //                                             institutions: [ this.state.institutions, inst],
    //                                             });
    //                                     }
    //                             });
                                                                                
    //                         }
    //                     }
    //                     catch(error){
    //                         console.error(error);
    //                     }
    //                 }
    //             );
    //         }
    //         else{
    //             alert("Please install metamask!");
                
    //         }
    //     }
    //     catch(error){
    //         console.error(error);
            
    //     }
    // }
    
    handleSubmit = async(e) => {
        e.preventDefault();
        try{
            this.setState({regButtonDisabled: true}) //disable register button
            const web3 = new Web3(Web3.givenProvider);
            const result = await this.connectMetamaskAccount();
            if (result !== "NO METAMASK"){
                const current_account = web3.utils.toChecksumAddress(result);
                console.log("Checksum of logged in account: "+current_account);
                const networkId = await web3.eth.net.getId();
                console.log("current network id: "+networkId);
                if (networkId !== 1515)
                {
                    throw new Error("Incorrect network ID")
                }
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
                    console.log("institution: "+this.state.institutionName);
                    this.setState({loading: true})
                    await contract.methods.createUserRequest(this.state.userName,
                        usertype_number,
                        this.state.institutionName).send({ from: current_account });
                    this.setState({loading: false})
                    res = await contract.methods.getPendingRequest().call();
                    console.log("requests list: "+res);
                    console.log("requests list size: "+res.length);
                    alert("Registration request sent!");
                }
                catch(error)
                {
                    if (error.message.includes("MetaMask Tx Signature: User denied transaction signature."))
                        alert("Registration request failed as transaction was rejected")
                    else if (error.message.includes("User already in system or request sent"))
                        alert("User already exists or user request is pending!");
                }
                
                
            }
            else{
                alert("Please install metamask!");
            }
        }
        catch(error){
            console.error(error);
            if (error.message.includes("Incorrect network ID"))
                alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
        }
        finally{
            this.setState({regButtonDisabled: false})
            this.setState({loading: false})
        }
        
    }

    verifyButtonHandler  = async() => {
        try{
                const web3 = new Web3(Web3.givenProvider);
            const result = await this.connectMetamaskAccount();
            if (result !== "NO METAMASK")
            { 
                const networkId = await web3.eth.net.getId();
                console.log("current network id: "+networkId);
                const deployedNetwork1 = Certificates.networks[networkId];
                const instance1 = new web3.eth.Contract(
                            Certificates.abi,
                            deployedNetwork1 && deployedNetwork1.address,
                            );
                console.log("Certificates sol address: "+instance1.options.address);

                this.setState({ web3, certificate_contract: instance1});
                this.props.changeAppState(this.state.web3,this.state.current_account,this.state.contract,this.state.certificate_contract);
                this.props.history.push('/verify')    
            } 
        }
        catch (error){
            console.error(error);
        }
    }

    loginButtonHandler = async() => {
        var loginFlag = false;
        var current_account=null;
        var loginstatus = "";
        try{
            this.setState({loginButtonDisabled: true})
            this.setState(prevState => ({loginSpanCursorStyle: {cursor: "not-allowed"}}))
            const web3 = new Web3(Web3.givenProvider);
            const result = await this.connectMetamaskAccount();
            if (result !== "NO METAMASK")
            {
                current_account = web3.utils.toChecksumAddress(result);
                console.log("Checksum of logged in account: "+current_account);
                const networkId = await web3.eth.net.getId();
                console.log("current network id: "+networkId);
                if (networkId !== 1515)
                {
                    throw new Error("Incorrect network ID")
                }
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


                this.setState({ web3, current_account, contract: instance, certificate_contract: instance1});
                loginstatus = await this.checkIfUserExists();
                if (loginstatus === "USER EXISTS")
                {
                    //const nonce = "HELLO WORLD NONCE";
                    var min = 1000;
                    var max = 2000;
                    var nonce =  min + (Math.random() * (max-min));
                    nonce+= ""+nonce;
                    console.log("Current address: "+current_account);
                    try{
                        var signature = await web3.eth.personal.sign(nonce, current_account);
                        console.log("Signature: "+signature);
                    }
                    catch(error){
                        console.log("inside sign catch");
                        console.error(error);
                        if (error.message.includes("MetaMask Message Signature: User denied message signature."))
                        {
                            alert("Please sign the nonce message in Metamask to login");
                        }
                        console.log("end of sign catch");
                    }
                    
                    
                    try{
                        if (signature!==undefined)
                            var res = await web3.eth.personal.ecRecover(nonce, signature);
                    }
                    catch(err){ console.log("inside recover catch"); console.error(err); console.log("end of ecrecover catch");}
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
                                    localStorage.setItem("currentAccount", JSON.stringify(current_account))
                                    this.props.history.push('/institution')                                    
                                }
                                    
                                else if(res[2]==3)
                                {
                                    console.log("if2");

                                    const key = await contract.methods.getPublicKey(current_account).call()
                                        
                                        console.log("PublicKey: ",key);
                                        if(!key){
                                            await window.ethereum
                                            .request({
                                                method: 'eth_getEncryptionPublicKey',
                                                params: [current_account], 
                                            })
                                            .then((encryptionPublicKey) => {
                                                console.log("enc pub key: ",encryptionPublicKey)
                                                contract.methods.assignPublicKey(encryptionPublicKey).send({ from: current_account });
                                            })
                                            .catch((error) => {
                                                if (error.code === 4001) {
                                                console.log('We cant encrypt anything without the key.');
                                                } else {
                                                console.error(error);
                                                }
                                            }); 
                                        }
                                        localStorage.setItem("currentAccount", JSON.stringify(current_account))  
                                    this.props.history.push('/eduUser')                                    
                                }
                                else if(res[2]==1)
                                {
                                    console.log("if3");
                                    localStorage.setItem("currentAccount", JSON.stringify(current_account));
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
            if (error.message.includes("Incorrect network ID"))
                alert("Metamask is connected to an incorrect network ID. Please connect to the network ID 1515")
        }
        finally{
            this.setState({loginButtonDisabled: false})
            this.setState(prevState => ({loginSpanCursorStyle: {cursor: "pointer"}}))
            if(!loginFlag && loginFlag===""){
                alert("Login failed!");
            }   
        }
    }

    checkIfUserExists = async() => {
        var result = "USER DOES NOT EXIST";
        try{
        const { current_account, contract } = this.state;
        const exists = await contract.methods.checkIfUserExists(current_account).call();
        
        if (exists !== false)
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
    
    let institutions = this.state.institutions;
    let institutionsList = institutions.map((institution) =>
            <option key={institution}>{institution}</option>
    );
    console.log("state insti list: ",institutions);
    console.log("instiss list: ",institutionsList);
    
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
                                            <option value="Institution">Institution</option>
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
                                        <select id="institution" name="institutionName" onChange={ this.onChangeFunc }
                                        className="form-control custom-select bg-white border-left-0 border-md"
                                        required={this.state.userType === "EduUser" || this.state.userType === "" || (this.state.userType==="Institution" && this.state.institutionName==="")}>
                                            <option value="" disabled selected>Select institution</option>
                                            {institutionsList}
                                            {/* <option value="Others">Others</option> */}
                                            {/* {(this.state.userType === "EduUser" || this.state.userType === "") && ( <option value="Others">Others</option>           
                                            )}                          */}
                                        </select>
                                        
                                    </div>     
                                    {this.state.flag ? this.state.userType === "Institution" &&  (
                                        <div className="mb-4">
                                            <input
                                            id="inputLine"
                                            name="institutionName"
                                            type='text'
                                            onChange={ this.onChange }
                                            placeholder='If institution not found, please enter'
                                        />
                                        </div>
                                        ): "" }                 
                                </div>  

                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={this.state.regButtonDisabled}
                                >Register
                                
                                </button>

                                
                            </form> 

                            
                               
                                               

                            <div className="mt-2">
                                <span>Already registered? </span>
                                <span className="loginText" onClick={!this.state.loginButtonDisabled && (this.loginButtonHandler)} style={this.state.loginSpanCursorStyle}>Login using metamask</span> 
                            </div>

                        </div>

                    </div>

                    

                </div>

                

                
                 <div className="row justify-content-center">
                    <button 
                                                        type="submit" 
                                                        className="btn btn-primary mt-5"
                                                        onClick={this.verifyButtonHandler}
                                                        background-color= "#314455"
                                                    >CLICK HERE TO VERIFY CERTIFICATES</button>
                </div>
            </div>
              
        </div>
              
    )}   
}
export default RegistrationControl;

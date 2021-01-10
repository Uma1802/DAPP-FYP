import './RegistrationControl.css';
import React, { Component } from 'react';
import serializeForm from 'form-serialize';
import Web3 from 'web3';

class RegistrationControl extends Component {  
    
    state={
        institution:"",
        userType:""
    };

    updateType = (value) =>{
        this.setState({userType: value});
    }

    updateInstitution = (value) =>{
        this.setState({institution: value});
    }


    handleSubmit = (e) => {
        /*if(this.state.institution==="default" || !this.state.institution){
            this.setState({institution: ""});
        }
        else{*/
        e.preventDefault()
        const values = serializeForm(e.target, { hash: true })
        console.log("submit"+values);
        //}
      }

      loginButtonHandler = () => {
        const web3 = new Web3(Web3.givenProvider);
        this.connectMetamaskAccount()
        .then((value) => { 
            if (value != "NO METAMASK"){
                var loginaddress = value;
                var nonce = "SAMPLE NONCE";
                console.log("Current address: "+loginaddress); 
                web3.eth.personal.sign(nonce, loginaddress)
                .then((value) => {
                    console.log("Signature: "+value);
                    web3.eth.personal.ecRecover(nonce, value)
                    .then((value) => {
                        console.log("Recovered address: "+value);
                        if (value === loginaddress){
                            console.log("Login Success");
                        }
                        else{
                            console.log("Login Failed");
                        }
                    });
                }); 
            }
        });
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
                                            placeholder="Your name" 
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
                        <select id="type" value={this.state.userType} onChange={(event) => this.updateType(event.target.value)}
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
                        <select id="institution" name="institution"  value={this.state.institution} onChange={(event) => this.updateInstitution(event.target.value)} className="form-control custom-select bg-white border-left-0 border-md"
                        required={this.state.userType === "EduUser" || this.state.userType === "" || (this.state.userType==="Institution" && this.state.institution==="")}>
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
                    type='text'
                    onChange={(event) => this.updateInstitution(event.target.value)}
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
    )
    }
}

export default RegistrationControl;
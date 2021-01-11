import './RegistrationControl.css';
import React, { Component } from 'react';
import serializeForm from 'form-serialize'

class InstitutionDashBoard extends Component {  
    
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

    
    render(){

    return(

      <div className="container">        
        <div className="container reg-title-card mx-auto">
            <h1>REGISTRATIONNNN</h1>
        </div>
        
        <div className="card col-12 col-lg-6 reg-card">

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
                <span className="loginText" onClick={console.log("login clicked")}>Login using metamask</span> 
            </div>

        </div>
       
    </div>
    )
    }
}

export default InstitutionDashBoard;
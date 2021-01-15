import React,{Component} from 'react'; 
  
class VerifyCert extends Component { 
   
    state = {   
      // Initially, no file is selected 
      selectedFile: null
    }; 
     
    // On file select (from the pop up) 
    onFileChange = event => {      
      // Update the state 
      this.setState({ selectedFile: event.target.files[0] });      
    }; 
     
    // On file upload (click the upload button) 
    onFileUpload = () => { 
     
      // Create an object of formData 
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "myFile", 
        this.state.selectedFile, 
        this.state.selectedFile.name 
      ); 
     
      // Details of the uploaded file 
      console.log(this.state.selectedFile); 
     
      // Request made to the backend api 
      // Send formData object 
      //axios.post("api/uploadfile", formData); 
    }; 
     
     
    render() { 
     
      return ( 
        <div> 
            <div className="card col-12 col-lg-6 reg-card">
                <h2 className="card-header bg-dark text-white">Verify certificate</h2>
                <div className="card-body">               

                    <form onSubmit={(e) => this.handleSubmit(e)}>   

                    <div className="form-group text-left">   
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="far fa-address-card"></i></span>
                            </div>
                            <input type="text" 
                                                className="form-control" 
                                                id="name"  
                                                placeholder="Transaction ID" 
                                                required
                            />    
                        </div>  
                    </div>          

                    <div className="mb-3">
                        <input type="file" onChange={this.onFileChange} required/>
                    </div> 
                   
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={this.onFileUpload}
                    >Verify</button>
                        
                    </form>     

                </div>

            </div>

            </div>
      ); 
    } 
  } 
  
  export default VerifyCert; 
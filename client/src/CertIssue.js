import React,{Component} from 'react'; 
import jsSHA from "jssha";
  
class CertIssue extends Component { 
   
    state = {   
      // Initially, no file is selected 
      selectedFile: null
    }; 
     
    // On file select (from the pop up) 
    onFileChange = event => {      
      // Update the state 
      this.setState({ selectedFile: event.target.files[0] });    

      console.log("file is"+event.target.files[0]);
      
      console.log("after set stae in file change"+this.state.selectedFile);
      

    }; 
     
    // On file upload (click the upload button) 
    onFileUpload = (event) => { 

      event.preventDefault();
     
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


    var reader = new FileReader();
    reader.onload = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        console.log(evt.target.result);
        const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
        shaObj.update(evt.target.result);
        var hash = shaObj.getHash("HEX");
        console.log("hash is "+hash);

      //var bytes = new Uint8Array(evt.target.result);
      //const shaObj2 = new jsSHA("SHA-256", "UINT8ARRAY");
      }
    };
    reader.readAsArrayBuffer(this.state.selectedFile);
    
      // Request made to the backend api 
      // Send formData object 
      //axios.post("api/uploadfile", formData); 
    }; 
     
    // File content to be displayed after 
    // file upload is complete 
    fileData = () => { 
     
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
            <p> 
              Last Modified:{" "} 
              {this.state.selectedFile.lastModifiedDate.toDateString()} 
            </p> 
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Choose before Pressing the Upload button</h4> 
          </div> 
        ); 
      } 
    }; 
     
    render() { 
     
      return ( 
        <div> 
            <div className="card col-12 col-lg-6 reg-card">
                <h2 className="card-header bg-dark text-white">Issue certificate</h2>
                <div className="card-body">               

                    <form onSubmit={(e) => this.onFileUpload(e)}>   

                    <div className="form-group text-left">   
                        <div className="input-group mb-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="far fa-address-card"></i></span>
                            </div>
                            <input type="text" 
                                                className="form-control" 
                                                id="name"  
                                                placeholder="Recipient unique ID" 
                                                
                            />    
                        </div>  
                    </div>          

                    <div className="mb-3">
                        <input type="file" onChange={this.onFileChange} required/>
                    </div> 
                   
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                    >Issue certificate</button>
                        
                    </form>     

                </div>

            </div>

            {this.fileData()} 

            </div>
      ); 
    } 
  } 
  
  export default CertIssue; 
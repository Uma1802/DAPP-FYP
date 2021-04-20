import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header/Header';

const Unauthorized = () => {
  return (
    <div>
      <Header/>
      <div className='container'>      
      <br></br>
      <br></br>
        <h4>You are not authorized. Please login to continue.</h4>
        <br></br>    

      <h4><Link to='/'>Back to Home</Link></h4>
    </div>
    </div>
    
  )
}

export default Unauthorized;

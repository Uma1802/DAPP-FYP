import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header/Header';

const Unauthorized = () => {
  return (
    <div>
      <Header/>
      <div className='container'>      
        <h2>You are not authorized. Please login to continue.</h2>    
      <p><Link to='/'>Back to Home</Link></p>
    </div>
    </div>
    
  )
}

export default Unauthorized;

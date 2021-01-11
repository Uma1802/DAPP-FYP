import React from 'react';
import './Header.css';

function Header(props){
return (
<header>
<nav id="header-nav" className="navbar navbar-default">

  <div className="container navbar-header">  

    <div className="row">

    <div> 
      <a href="index.html" className="d-none d-sm-inline">
          <div id="logo-img" alt="Logo image"></div>
        </a>     
    </div>       

      <div className="navbar-brand" >
        <h1>CERTIFICATE VALIDATOR</h1>
        <p>
          Using blockchain
        </p>
      </div>

    </div>       
   
  </div>
</nav>
</header>

);
}

export default Header;
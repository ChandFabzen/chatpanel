import React from 'react';
import  {Link}  from 'react-router-dom'
import './header.css'

const Nav = function Nav({handleLogout}) {
  return (
    <header>
      <nav className="nav">
        <div className="nav_logo">
          Support<span> Panel</span>
        </div>
        <div className="nav_button">
          <Link to='/logout' onClick={handleLogout}>logout</Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
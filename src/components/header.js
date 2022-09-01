import React from 'react';
import  {Link}  from 'react-router-dom'
import './header.css'

const Nav = function Nav() {
  return (
    <header>
      <nav className="nav">
        <div class="nav_logo">
          Support<span> Panel</span>
        </div>
        <div className="nav_button">
          <Link to='/'>login</Link>
          <Link to='/'>Signup</Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
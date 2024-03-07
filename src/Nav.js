import './Nav.css';
import React from 'react';
import AuthenticationComponent from './AuthenticationComponent';
import { NavLink } from 'react-router-dom';

const Nav = ({ onOpenSettings}) => {
  const brandName = process.env.PUBLIC_URL + '/brand-name.png';
  const brandLogo = process.env.PUBLIC_URL + '/brand-logo3.png';

  return (
    <nav className="navbar">
      <div className="brandContainer">
        <div className="brandNameContainer">
          <a className="brandName1"> Skins </a>
          <a className="brandName2"> Bot </a>
        </div>
      </div>
      <div className="navItemsContainer">
        <div className="itemContainer">
          <NavLink to="/" className={({ isActive }) => isActive ? "navitem nav-item-active" : "navitem"}>
            <a className="item">Instant Sell</a>
          </NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? "navitem nav-item-active" : "navitem item2"}>
            <a className="item">How It Works</a>
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => isActive ? "navitem nav-item-active" : "navitem"}>
            <a className="item">FAQ</a>
          </NavLink>
        </div>
        <AuthenticationComponent variant="navbar" onOpenSettings={onOpenSettings} />
      </div>
    </nav>
  );
}

export default Nav;

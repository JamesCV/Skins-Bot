import React, { useState } from 'react';
import './User.css';

const User = ({ user, onOpenSettings }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const displayPhoto = user.photos[0].value;
  const username = user.displayName;
  const downArrow = process.env.PUBLIC_URL + '/down-arrow.png';
  const tx = process.env.PUBLIC_URL + '/tx.png';
  const settings = process.env.PUBLIC_URL + '/settings.png';
  const logout = process.env.PUBLIC_URL + '/logout.png';

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  function handleOptionClick(option) {
    console.log(`Option clicked: ${option}`);
    if (option === "logout") {
      fetch('http://localhost:5001/logout', {
        method: 'GET',
        credentials: 'include' // Include credentials in the request
      })
      .then(response => {
          window.location.href = '/';
        })
      .catch(error => {
        console.error('Logout failed:', error);
      });
    } else if (option === "settings") {
      console.log("Opening: " + option);
      onOpenSettings();
    }
  }

  function truncateText(str, limit = 20) {
    if (str.length <= limit) {
      return str;
    }
    return str.slice(0, limit) + '...';
  }
  return (
    <div
      className={`userContainer ${dropdownOpen ? 'dropdownOpen' : ''}`}
      onClick={toggleDropdown}
    >
      <div className="userProfile">
        <div className="liveIndicator"></div>
        <a className="username"> {truncateText(username)} </a>
        <img className="userphoto" src={displayPhoto} />
        <img className="downArrow" src={downArrow} />
      </div>
      {dropdownOpen && (
        <div className="userDropdownMenu">
          <div className="userDropdownItem" onClick={() => handleOptionClick('transactions')}>
            <img className="userDropdownThumbnail" src={tx} />
            <a className="userDropdownTitle"> Transactions </a>
          </div>
          <div className="userDropdownItem" onClick={() => handleOptionClick('settings')}>
            <img className="userDropdownThumbnail" src={settings} />
            <a className="userDropdownTitle"> Settings </a>
          </div>
          <div className="userDropdownItem" onClick={() => handleOptionClick('logout')}>
            <img className="userDropdownThumbnail" src={logout} />
            <a className="userDropdownTitle logout"> Logout </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

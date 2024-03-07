import './LoggedOutInventory.css';
import React, { useState } from 'react';
import AuthenticationComponent from '../AuthenticationComponent';


function LoggedOutInventory() {
  const csgoThumbnail = process.env.PUBLIC_URL + '/csgothumbnail.png';
  const rustThumbnail = process.env.PUBLIC_URL + '/rustthumbnail.png';
  const [currentGame, setCurrentGame] = useState('csgo');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const downArrow = process.env.PUBLIC_URL + '/down-arrow.png';

  const games = [
      { value: 'csgo', label: 'CS2', thumbnail: csgoThumbnail },
      { value: 'rust', label: 'Rust', thumbnail: rustThumbnail }
  ];
  const selectGame = (game) => {
      setCurrentGame(game);
      setDropdownOpen(false); // Close dropdown after selection
  };
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="inventoryContainer">
      <div className="inventoryHeader">
        <h1 className="inventoryTitle"> Your Inventory </h1>
        <div className="gameContainer">
          <div className="dropdownHeader" onClick={toggleDropdown}>
              <img className="headerThumbnail" src={currentGame ? games.find(g => g.value === currentGame).thumbnail : csgoThumbnail} alt={currentGame || 'Select a game'} />
              <span>{currentGame ? games.find(g => g.value === currentGame).label : 'Select a game'}</span>
              <img className="downArrow" src={downArrow} />
          </div>
          {dropdownOpen && (
              <div className="dropdownMenu">
                  {games.map(game => (
                      <div
                          key={game.value}
                          className={`dropdownItem ${currentGame === game.value ? 'selected' : ''}`}
                          onClick={() => selectGame(game.value)}>
                          <img className="gameThumbnail" src={game.thumbnail} alt={game.label} />
                          <span>{game.label}</span>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>
      <div className="inventoryFilter">
      </div>
      <div className="newUserScreen">
        <div className="info">
          <h1 class="Header"> Trade your CS:GO or Rust skins instantly </h1>
          <h1 class="Desc"> Sign in to instantly sell your skins to Crypto within seconds </h1>
          <div class="signIn">
            <AuthenticationComponent variant="navbar" />
          </div>
        </div>
      </div>
    </div>
  );

}

export default LoggedOutInventory;

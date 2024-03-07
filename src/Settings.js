import React, { useState, useEffect } from 'react';
import './Settings.css';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

const ProfileSettingsModal = ({ isOpen, onClose, user }) => {
  const [tradeValue, settradeValue] = useState('');
  const [tradeURL, setTradeURL] = useState('');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [crypto, setCrypto] = useState('BTC'); // Default to BTC
  const [cryptoInput, setCryptoInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fade = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { duration: 150 }
  });
  const btcLogo = process.env.PUBLIC_URL + '/BTClogo.png';
  const ethLogo = process.env.PUBLIC_URL + '/ETHlogo.png';
  const ltcLogo = process.env.PUBLIC_URL + '/LTClogo.png';

  useEffect(() => {
    const fetchTradeURL = async () => {
      if (user) {
        try {
          const response = await axios.get('http://localhost:5001/api/getTradeURL', { withCredentials: true });
          if (response.data && response.data.tradeURL) {
            settradeValue(response.data.tradeURL);
          }
        } catch (error) {
          console.error('Error fetching trade URL:', error);
        }
      }
    };

    fetchTradeURL();
  }, [user]);


  if (!isOpen) return null;

  const handleSaveClick = async () => {
    setTradeURL(tradeValue);
    try {
      const response = await axios.post('http://localhost:5001/api/setTradeURL', { tradeValue }, { withCredentials: true });
      console.log("Response: " + response.data.message);
    } catch (error) {
      console.error('Error sending trade URL:', error);
    }
  };
  const handleInputChange = (event) => {
    settradeValue(event.target.value);
  };
  const handleFocus = () => {
    setPlaceholderVisible(false);
  };
  const handleBlur = () => {
    if (!tradeValue) {
      setPlaceholderVisible(true);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCrypto = (crypto) => {
    setCrypto(crypto);
    setIsDropdownOpen(false);
  };

  const handleCryptoInput = (event) => {
    setCryptoInput(event.target.value);
  };

  const handleCryptoSave = () => {
    console.log(`Saving: ${crypto}: ${cryptoInput}`);
  };

  function openTradeURL() {
    window.open('http://steamcommunity.com/my/tradeoffers/privacy', '_blank');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Settings Updated");
    onClose();
  };

  if (!user) {
    return null;
  }

  return (
    <animated.div style={fade} className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <a className="settingsHeader"> Settings </a>
          <div className="profile">
            <img className="profilePicture" src={user.photos[0].value} />
            <div className="userDataContainer">
              <a className="steamUsername"> {user.displayName} </a>
              <a className="steamID"> Steam ID: {user._json.steamid} </a>
            </div>
          </div>
        </div>
        <div className="modalBody">
          <div className="cryptoHolder">
            <a className="cryptoConfigText"> Save your Crypto address to your profile here </a>
            <div className="cryptoConfigContainer">
              <div className="cryptoDropdown">
                <div className="cryptoDropDownHeader" onClick={toggleDropdown}>
                  <img className="cryptoDropdownIcon" src={process.env.PUBLIC_URL + `/${crypto}logo.png`} />
                  <a> {crypto} </a>
                </div>
                {isDropdownOpen && (
                  <div className="dropdownOptions">
                    <div className="cryptoDropdownItem" onClick={() => selectCrypto('BTC')}>
                      <img className="cryptoDropdownIcon" src={process.env.PUBLIC_URL + `BTClogo.png`} />
                      <a> BTC </a>
                    </div>
                    <div className="cryptoDropdownItem" onClick={() => selectCrypto('ETH')}>
                      <img className="cryptoDropdownIcon" src={process.env.PUBLIC_URL + `ETHlogo.png`} />
                      <a> ETH </a>
                    </div>
                    <div className="cryptoDropdownItem" onClick={() => selectCrypto('LTC')}>
                      <img className="cryptoDropdownIcon" src={process.env.PUBLIC_URL + `LTClogo.png`} />
                      <a> LTC </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="cryptoInputContainer">
                <input
                  type="text"
                  value={cryptoInput}
                  onChange={handleCryptoInput}
                  placeholder={`Enter your ${crypto} Address`}
                  className="cryptoInput"
                />
                <button className="saveCryptoButton" onClick={handleCryptoSave}>Save</button>
              </div>
            </div>
          </div>
          <div className="tradeConfigHolder">
            <a className="tradeConfigText"> Save your Trade URL to your profile here </a>
            <div className="tradeConfigContainer">
              <div className="tradeURLContainer">
                <input
                  type="text"
                  value={tradeValue}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={placeholderVisible ? "Enter your Steam Trade URL" : ""}
                  className="tradeURLform"
                />
                <button className="saveTradeURL" onClick={handleSaveClick}>Save</button>
              </div>
              <a
                className="findTradeURL"
                onClick={(e) => { e.preventDefault(); openTradeURL(); }}
                href="#"
              >
                Get Your Steam <span className="URLtext">Trade URL Here</span>
              </a>
            </div>
          </div>
        </div>
        <div className="buttonContainer">
          <div className="settingsButton cancel" onClick={onClose}>
            <span className="settingsButtonText"> Close </span>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default ProfileSettingsModal;

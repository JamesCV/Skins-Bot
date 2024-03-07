import './Offer.css';
import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { SelectedItemsContext } from './OfferProvider';
import { useSpring, animated } from 'react-spring';

const Offer = () => {
  const { selectedItems } = useContext(SelectedItemsContext);
  const totalValue = selectedItems.reduce((total, item) => total + item.price, 0);
  const [chosenCrypto, setchosenCrypto] = useState('LTC');
  const [cryptoPrices, setCryptoPrices] = useState({ BTC: 0, ETH: 0, LTC: 0 });
  const [tradeValue, settradeValue] = useState('');
  const userValueProps = useSpring({ number: totalValue, from: { number: 0 } });
  const [cryptoInput, setcryptoInput] = useState('');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [cryptoAddress, setcryptoAddress] = useState('');
  const totalItems = selectedItems.length;
  const btcLogo = process.env.PUBLIC_URL + '/BTClogo.png';
  const ethLogo = process.env.PUBLIC_URL + '/ETHlogo.png';
  const ltcLogo = process.env.PUBLIC_URL + '/LTClogo.png';
  const networkFees = {
    BTC: 0.00025,
    ETH: 0.002,
    LTC: 0.001
  };
  const isBelowMinimum = totalValue < 20;
  const amountLeftForMinimum = (20 - totalValue).toFixed(2);
  const isNegativeFinalValue = ((networkFees[chosenCrypto]*cryptoPrices[chosenCrypto]) - totalValue) > 0;

  const finalValue = totalValue - (networkFees[chosenCrypto]*cryptoPrices[chosenCrypto])
  const props = useSpring({ number: finalValue, from: { number: 0 } });

  const handleTrade = () => {
    console.log("Total Value: " + totalValue)
  };

  const handleFocus = () => {
    setPlaceholderVisible(false);
  };

  const handleBlur = () => {
    if (!cryptoInput) {
      setPlaceholderVisible(true);
    }
  };

  const handleCryptoSave = () => {
    setcryptoAddress(cryptoInput);
  };

  const handleCryptoInput = (event) => {
    setcryptoInput(event.target.value);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd');
        const data = await response.json();
        setCryptoPrices({
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          LTC: data.litecoin.usd
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchPrices();
    // You can set an interval to fetch prices periodically
    const intervalId = setInterval(fetchPrices, 60000); // Fetch every minute

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div className="offerContainer">
      <div className="offerHeader">
        <h1 className="offerTitle"> Checkout </h1>
      </div>
      <div className="offerWindow">
        <div className="paymentWindow">
          {['BTC', 'ETH', 'LTC'].map(crypto => (
            <label key={crypto} className="cryptoItemContainer">
              <div className="cryptoProfile">
                <input
                  type="radio"
                  name="cryptoChoice"
                  value={crypto}
                  checked={chosenCrypto === crypto}
                  onChange={() => setchosenCrypto(crypto)}
                  className="cryptoRadio"
                />
                <img className="cryptoThumbnail" src={process.env.PUBLIC_URL + `/${crypto}logo.png`} />
                <span className="cryptoTitle">{crypto === 'BTC' ? 'Bitcoin' : crypto === 'ETH' ? 'Ethereum' : 'Litecoin'}</span>
              </div>
              <div className="noKYCcontainer">
                <span className="cryptoPrice">${cryptoPrices[crypto]}</span>
                <a className="noKYC"> NO KYC </a>
              </div>
            </label>
          ))}
        </div>
        <div className="cryptoContainer">
          <div className="tradeConfig">
            <a className="cryptoHeader"> Make sure your details are correct </a>
            <div className="cryptoAddressContainer">
              <input
                type="text"
                value={cryptoInput}
                onChange={handleCryptoInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="cryptoAddressInput"
                placeholder={placeholderVisible ? `Enter your ${chosenCrypto} Address` : ""}
              />
              <button className="saveCryptoButton" onClick={handleCryptoSave}>Save</button>
            </div>
          </div>
          <div className="tradeContainer">
            <div className="receiptContainer">
              <div className="itemSummary">
                <a className="itemCount">{totalItems} Items selected</a>
                <a className="finalTradeValue">
                $<animated.span>
                  {userValueProps.number.to(n => n.toFixed(2))}
                </animated.span></a>
              </div>
              <div className="feeContainer">
                <div className="networkFeeContainer">
                  <img className="cryptoSummaryThumbnail" src={process.env.PUBLIC_URL + `/${chosenCrypto}logo.png`} />
                  <a className="feeText"> Network Fee </a>
                </div>
                <a className="feeValue"> ${(networkFees[chosenCrypto]*cryptoPrices[chosenCrypto]).toFixed(2)} </a>
              </div>
            </div>
            <div className="USDwindow">
              <div className="USDsummary">
                <h1 className="offerSummaryDesc">
                  You will recieve
                </h1>
                <h1 className="offerValue">
                  $<animated.span>
                    {isNegativeFinalValue ? '0.00' : props.number.to(n => n.toFixed(2))}
                  </animated.span>
                </h1>
              </div>
              <div className="cryptoWindow">
                <div className="cryptoSummary">
                  <h1 className="cryptoSummaryDesc">
                    $<animated.span>
                      {isNegativeFinalValue ? '0.00' : props.number.to(n => n.toFixed(2))}
                    </animated.span> =
                  </h1>
                  <img className="cryptoSummaryThumbnail" src={process.env.PUBLIC_URL + `/${chosenCrypto}logo.png`} />
                  <h1 className="cryptoValue">
                    {chosenCrypto} {isNegativeFinalValue ? '0.00' : cryptoPrices[chosenCrypto] > 0 ?
                      (finalValue / cryptoPrices[chosenCrypto]).toFixed(6) :
                      '0.000000'}
                  </h1>
                </div>
              </div>
            </div>
            <div className={`tradeButton ${isBelowMinimum ? 'disabled' : ''}`}
                 onClick={!isBelowMinimum ? handleTrade : null}>
              <span className="offerText">
                {isBelowMinimum ? `Add $${amountLeftForMinimum} To Trade` : "GET YOUR CASHOUT NOW"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Offer;

import './App.css';
import React, { useState } from 'react';
import Nav from './Nav';
import Offer from './instant-sell/Offer';
import Inventory from './instant-sell/Inventory';
import { useUserContext } from './UserContext';
import { BrowserRouter } from 'react-router-dom';
import { SelectedItemsContext } from './instant-sell/OfferProvider';
import ProfileSettingsModal from './Settings';

function App() {
  const { user } = useUserContext();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleOpenSettings = () => {
    setSettingsModalOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsModalOpen(false);
  };

  return (
    <div className="App">
      <Nav onOpenSettings={handleOpenSettings} />
      <div className="app-main">
        <div className="trade-window">
          <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
            <Inventory />
            <Offer />
          </SelectedItemsContext.Provider>
        </div>
        {user && (
          <ProfileSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={handleCloseSettings}
            user={user}
          />
        )}
      </div>
      <div className="app-footer">
        <a className="footerText"> Skins Dot Bot - All rights reserved. </a>
        <a className="footerText"> Best trading services. Get your cash instantly. </a>
      </div>
    </div>
  );
}

export default App;

import './Inventory.css';
import React, { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '../UserContext';
import { useContext } from 'react';
import LoggedOutInventory from './LoggedOutInventory';
import LoadInventory from './LoadInventory';
import { SelectedItemsContext } from './OfferProvider'; // Adjust the path as necessary

const Inventory = () => {
  const csgoThumbnail = process.env.PUBLIC_URL + '/csgothumbnail.png';
  const rustThumbnail = process.env.PUBLIC_URL + '/rustthumbnail.png';
  const refresh = process.env.PUBLIC_URL + '/refresh.png';
  const downArrow = process.env.PUBLIC_URL + '/down-arrow.png';
  const searchIcon = process.env.PUBLIC_URL + '/search.png';
  const sortHighIcon = process.env.PUBLIC_URL + '/sort-high.png';
  const sortLowIcon = process.env.PUBLIC_URL + '/sort-low.png';
  const [currentGame, setCurrentGame] = useState('csgo');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUserContext();
  const [inventory, setInventory] = useState(null);
  const { selectedItems, setSelectedItems } = useContext(SelectedItemsContext);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('sort-high');

  const toggleSortDropdown = () => setSortDropdownOpen(!sortDropdownOpen);

  const selectSort = (sort) => {
    setCurrentSort(sort);
    setSortDropdownOpen(false);
  };

  const sortedInventory = useMemo(() => {
    if (!inventory) return [];
    if (currentSort === 'sort-high') {
      return [...inventory].sort((a, b) => b.price - a.price);
    } else {
      return [...inventory].sort((a, b) => a.price - b.price);
    }
  }, [inventory, currentSort]);

  const handleButtonClick = () => {
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 500); // Reset after 1 second
  };

  const calculateTotalValue = () => {
    if (inventory) {
      return inventory.reduce((total, item) => total + item.price, 0);
    }
    return 0;
  };

  useEffect(() => {
    if (user) {
      LoadInventory(user) // loadInventory is a function you need to define
        .then(items => {
          setInventory(items);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error loading inventory:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoggedOutInventory />;
  }

  const sortFilter = [
      { value: 'sort-high', label: 'Sort: High', thumbnail: sortHighIcon },
      { value: 'sort-low', label: 'Sort: Low', thumbnail: sortLowIcon }
  ];

  const games = [
      { value: 'csgo', label: 'CS2', thumbnail: csgoThumbnail },
      { value: 'rust', label: 'Rust', thumbnail: rustThumbnail }
  ];
  const selectGame = (game) => {
      setCurrentGame(game);
      setDropdownOpen(false); // Close dropdown after selection
  };
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleItemClick = (itemid) => {
    const isItemSelected = selectedItems.some(item => item.id === itemid);

    if (isItemSelected) {
      // If the item is already selected, remove it from the array
      setSelectedItems(selectedItems.filter(item => item.id !== itemid));
    } else {
      // If the item is not selected, add it to the array
      const itemToAdd = inventory.find(item => item.id === itemid);
      setSelectedItems([...selectedItems, itemToAdd]);
    }
  };

  return (
    <div className="inventoryContainer">
      <div className="inventoryHeader">
        <div className="inventoryHeaderContainer">
          <h1 className="inventoryTitle"> Your Inventory -  </h1>
          <a className="finalTradeValue">
            ${calculateTotalValue().toFixed(2)}
          </a>
        </div>
        <div className="filterContainer">
          <div className="sortContainer">
            <div className="dropdownHeader sortHeader" onClick={toggleSortDropdown}>
              <img className="headerThumbnail" src={currentSort ? sortFilter.find(g => g.value === currentSort).thumbnail : sortHighIcon} alt={currentSort || 'Sort by'} />
              <span>{currentSort ? sortFilter.find(g => g.value === currentSort).label : 'Sort by'}</span>
              <img className="downArrow" src={downArrow} />
            </div>
            {sortDropdownOpen && (
              <div className="dropdownMenu sortMenu">
                {sortFilter.map(sortOption => (
                  <div
                    key={sortOption.value}
                    className={`dropdownItem ${currentSort === sortOption.value ? 'selected' : ''}`}
                    onClick={() => selectSort(sortOption.value)}
                  >
                    <img className="gameThumbnail" src={sortOption.thumbnail} alt={sortOption.label} />
                    <span>{sortOption.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="gameContainer">
            <div className="dropdownHeader" onClick={toggleDropdown}>
                <img className="headerThumbnail" src={currentGame ? games.find(g => g.value === currentGame).thumbnail : csgoThumbnail} alt={currentGame || 'Select game'} />
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
      </div>
      <div className="inventoryFilter">
        <div className="searchBarContainer">
          <img src={searchIcon} alt="Search" className="searchIcon" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchBar"
          />
        </div>
        <div class="refreshInvContainer" onClick={handleButtonClick}>
          <img className={`refreshInv ${isRotating ? 'rotate-icon' : ''}`} src={refresh} />
        </div>
      </div>
      <div className="inventoryHolder">
        <div className="inventoryWindow">
        {sortedInventory
            .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(item => (
            <div
              className={`inventoryItemContainer ${selectedItems.some(selected => selected.id === item.id) ? 'selected' : ''}`}
              key={item.id}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="itemName">{item.name}</span>
              <img className="itemImage" src={item.img} alt={item.name} />
              <span className="itemPrice">${item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;

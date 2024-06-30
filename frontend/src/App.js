import React, { useState } from 'react';
import './App.css';
import ChatBox from './components/ChatBox';

function App() {
  const [priceLevel, setPriceLevel] = useState(3);

  const handlePriceChange = (level) => {
    setPriceLevel(level);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-buttons">
          <button className="header-button active">WALLET TOTAL</button>
          <button className="header-button">CHAT</button>
        </div>
        <ChatBox />
        <div className="price-selector">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              className={`price-button ${priceLevel === level ? 'active' : ''}`}
              onClick={() => handlePriceChange(level)}
            >
              {'$'.repeat(level)}
            </button>
          ))}
        </div>
      </header>
      <div className="tiktok-overlay-left"></div>
      <div className="tiktok-overlay-right"></div>
    </div>
  );
}

export default App;
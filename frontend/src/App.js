import React from 'react';
import './App.css';
import ChatBox from './components/ChatBox';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <ChatBox />
      </header>
      <div className="tiktok-overlay-left"></div>
      <div className="tiktok-overlay-right"></div>
    </div>
  );
}

export default App;
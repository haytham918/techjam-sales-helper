import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import ProductCard from './ProductCard';

const PRODUCTS = [
  {
    id: 1,
    name: 'Item 1',
    imageUrl: './tiktok-logo.jpg',
    price: 1.99,
    salesVolume: 5000 
  },
  {
    id: 2,
    name: 'Item 2',
    imageUrl: './tiktok-logo.jpg',
    price: 2.99,
    salesVolume: 3000
  },
  {
    id: 3,
    name: 'Item 3',
    imageUrl: './tiktok-logo.jpg',
    price: 3.99,
    salesVolume: 1000
  }
];

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, type: 'user', animating: true }]);
      setInput('');
      setIsInputDisabled(true);

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sure, I can help with that!', type: 'bot', animating: true },
        ]);

        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'products', products: PRODUCTS, animating: true }
          ]);
          setIsInputDisabled(false);
        }, 1000);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isInputDisabled) {
      handleSend();
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.type}`}>
            {msg.type === 'user' ? (
              <>
                <img
                  src="./logo512.png"
                  alt="user avatar"
                  className="avatar"
                />
                <div className={`message ${msg.type} ${msg.animating ? 'animating' : ''}`}>
                  <span>{msg.text}</span>
                </div>
              </>
            ) : msg.type === 'products' ? (
              <>
                <img
                  src="./tiktok-logo.jpg"
                  alt="bot avatar"
                  className="avatar"
                />
                <div className={`message ${msg.type} ${msg.animating ? 'animating' : ''}`}>
                  <div className="product-list">
                    {msg.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <img
                  src="./tiktok-logo.jpg"
                  alt="bot avatar"
                  className="avatar"
                />
                <div className={`message ${msg.type} ${msg.animating ? 'animating' : ''}`}>
                  <span>{msg.text}</span>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isInputDisabled}
        />
        <button onClick={handleSend} disabled={isInputDisabled}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
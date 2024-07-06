import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import ProductCard from './ProductCard';

const convertNewlinesToBreaks = (text) => {
  return text.split('\n').map((item, index) => (
    <React.Fragment key={index}>
      {item}
      <br />
    </React.Fragment>
  ));
};

const Text = ({ text }) => {
  return <span>{convertNewlinesToBreaks(text)}</span>;
};

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

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, type: 'user', animating: true }]);
      setInput('');
      setIsInputDisabled(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput: input }),
        });
        const data = await response.json();
        console.log(data);
        console.log(data.text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.text, type: 'bot', animating: true },
        ]);

        if (Array.isArray(data.products) && data.products.length > 0) {
          setTimeout(() => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { type: 'products', products: data.products, animating: true },
            ]);
          }, 1000);
        }

      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong.', type: 'bot', animating: true },
        ]);
      } finally {
        setIsInputDisabled(false);
      }
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
                  <Text text={msg.text} />
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
                  <Text text={msg.text} />
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

import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, type: 'user', animating: true }]);
      setInput('');
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sure, I can help with that!', type: 'bot', animating: true },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.type}`}>
            <img
              src={
                msg.type === 'user'
                  ? './logo512.png'
                  : './tiktok-logo.jpg'
              }
              alt={`${msg.type} avatar`}
              className="avatar"
            />
            <div className={`message ${msg.type} ${msg.animating ? 'animating' : ''}`}>
              <span>{msg.text}</span>
            </div>
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
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
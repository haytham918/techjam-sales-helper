import React, { useState, useEffect, useRef } from 'react';
import { GoArrowUpRight } from "react-icons/go";
import { CiPaperplane } from "react-icons/ci";
import axios from 'axios';

import ProductCard from './ProductCard';
import './ChatBox.css';

async function getSession() {
  return axios.post('/api/start-chat')
    .then(response => {
      return response.data.sessionId;
    })
    .catch(error => {
      console.error('Error starting chat session:', error);
      throw error;
    });
}

async function chat(message, sessionId) {
  return axios.post('/api/chat', { message, sessionId })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error sending message:', error);
      throw error;
    });
}

function ChatBoxHeader({ chatOpen, setChatOpen }) {
  return (
    <div className="chatbox-header" onClick={() => setChatOpen(!chatOpen)}>
      <img src="/images/chatbot_image.svg" alt="" className="chatbox-avatar" />
      <h3>Chatbox</h3>
      {chatOpen && <span className="chatbox-toggle">X</span>}
    </div>
  );
}

function ChatBoxOptions({ handleOptionClick }) {
  return (
    <div className="chatbox-options-container">
      <span>How can I help you my friend?</span>
      <div className="chatbox-options">
        <button onClick={() => handleOptionClick('Looking for Product Suggestions')}>
          <div>
            <h4>Looking for Product Suggestions</h4>
            <span>Looking for Product Suggestions</span>
          </div>
          <GoArrowUpRight />
        </button>
        <button onClick={() => handleOptionClick("Suggest some Food Choices")}>
          <div>
            <h4>Suggest some Food Choices</h4>
            <span>Suggest some Food Choices</span>
          </div>
          <GoArrowUpRight />
        </button>
        <button onClick={() => handleOptionClick("Promotions and Discounts")}>
          <div>
            <h4>Promotions and Discounts</h4>
            <span>Promotions and Discounts</span>
          </div>
          <GoArrowUpRight />
        </button>
        <button onClick={() => handleOptionClick("Order Assistance")}>
          <div>
            <h4>Order Assistance</h4>
            <span>Order Assistance</span>
          </div>
          <GoArrowUpRight />
        </button>
      </div>
    </div>
  );
}

function ChatBoxMessageProducts({ products }) {
  return (
    <div className="chatbox-message-products">
      {products.map((product, index) => (
        <div key={index} className="chatbox-message-product">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

function ChatBoxBody({ messages, input, handleSendMessage, setInput, handleKeyDown, messagesEndRef }) {
  return (
    <div className="chatbox-body" >
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbox-message ${msg.sender}`}>
            <div className="chatbox-message-body">
              <div className="chatbox-message-text">
                <span>{msg.text}</span>
              </div>
              <img className="chatbot-message-avatar" src={`/images/${msg.sender}_avatar.svg`} alt="" />
            </div>
            {(msg.sender === 'bot' && msg.products && (
              <ChatBoxMessageProducts products={msg.products} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Type your message here..."}
        />
        <button onClick={handleSendMessage}>
          <CiPaperplane />
        </button>
      </div>
    </div>
  );
}

function ChatBox() {
  const [chatOpen, setChatOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen && !sessionId) {
      getSession().then(sessionId => setSessionId(sessionId));
    }
  }, [chatOpen, sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const handleOptionClick = (option) => {
    setSessionOpen(true);
    setMessages([{ text: option, sender: 'user' }]);
    chat(option, sessionId).then(response => {
      setMessages(response);
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) {
      return;
    }
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    chat(input, sessionId).then(response => {
      setMessages([...messages, ...response]);
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`chatbox ${chatOpen ? 'open' : ''}`}>
      <ChatBoxHeader chatOpen={chatOpen} setChatOpen={setChatOpen} />
      {chatOpen && (
        sessionOpen ? (
          <ChatBoxBody messages={messages} input={input}
            handleSendMessage={handleSendMessage} setInput={setInput}
            handleKeyDown={handleKeyDown} messagesEndRef={messagesEndRef} />
        ) : <ChatBoxOptions handleOptionClick={handleOptionClick} />
      )}
    </div >
  );
};

export default ChatBox;

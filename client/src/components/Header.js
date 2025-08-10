import React, { useState } from 'react';
import './Header.css';

const Header = ({ conversation }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!conversation) {
    return (
      <div className="header">
        <div className="header-content">
          <div className="welcome-message">
            <h2>Welcome to WhatsApp Web Clone</h2>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCall = (type) => {
    alert(`${type} call feature would be implemented here`);
  };

  const handleSearch = () => {
    alert('Search in conversation feature would be implemented here');
  };

  const handleMenuAction = (action) => {
    alert(`${action} feature would be implemented here`);
    setShowMenu(false);
  };

  return (
    <div className="header">
      <div className="header-content">
        <div className="user-info">
          <div className="user-avatar">
            <span>{conversation.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="user-details">
            <h3 className="user-name">
              {conversation.name || `User ${conversation.wa_id}`}
            </h3>
            <span className="user-status">
              <span className="status-dot"></span>
              online
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-btn" 
            onClick={() => handleSearch()}
            title="Search in conversation"
          >
            <span>🔍</span>
          </button>
          
          <button 
            className="action-btn" 
            onClick={() => handleCall('voice')}
            title="Voice call"
          >
            <span>📞</span>
          </button>
          
          <button 
            className="action-btn" 
            onClick={() => handleCall('video')}
            title="Video call"
          >
            <span>📹</span>
          </button>
          
          <div className="menu-container">
            <button 
              className="action-btn menu-btn" 
              onClick={() => setShowMenu(!showMenu)}
              title="More options"
            >
              <span>⋮</span>
            </button>
            
            {showMenu && (
              <div className="menu-dropdown">
                <button 
                  className="menu-item"
                  onClick={() => handleMenuAction('View contact')}
                >
                  <span>👤</span>
                  View contact
                </button>
                <button 
                  className="menu-item"
                  onClick={() => handleMenuAction('Select messages')}
                >
                  <span>✅</span>
                  Select messages
                </button>
                <button 
                  className="menu-item"
                  onClick={() => handleMenuAction('Mute notifications')}
                >
                  <span>🔇</span>
                  Mute notifications
                </button>
                <button 
                  className="menu-item"
                  onClick={() => handleMenuAction('Clear chat')}
                >
                  <span>🗑️</span>
                  Clear chat
                </button>
                <button 
                  className="menu-item"
                  onClick={() => handleMenuAction('Delete chat')}
                >
                  <span>❌</span>
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 
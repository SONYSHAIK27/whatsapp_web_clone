import React, { useState } from 'react';
import { format } from 'date-fns';
import './MessageBubble.css';

const MessageBubble = ({ message, isOwnMessage }) => {
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || []);

  const getMessageTime = () => {
    try {
      if (message.timestamp) {
        // Handle different timestamp formats
        const timestamp = parseInt(message.timestamp);
        let date;
        
        if (timestamp < 10000000000) {
          // Unix timestamp in seconds, convert to milliseconds
          date = new Date(timestamp * 1000);
        } else {
          // Already in milliseconds
          date = new Date(timestamp);
        }
        
        // Validate the date
        if (isNaN(date.getTime())) {
          console.warn('Invalid timestamp for message:', message);
          return '';
        }
        
        return format(date, 'HH:mm');
      }
      return '';
    } catch (error) {
      console.error('Error formatting message time:', error, message);
      return '';
    }
  };

  const getStatusIcon = () => {
    if (!isOwnMessage) return null;
    
    switch (message.status) {
      case 'sent':
        return <span className="status-icon sent">✓</span>;
      case 'delivered':
        return <span className="status-icon delivered">✓✓</span>;
      case 'read':
        return <span className="status-icon read">✓✓</span>;
      default:
        return <span className="status-icon sent">✓</span>;
    }
  };

  const handleReaction = (emoji) => {
    const newReactions = [...reactions];
    const existingIndex = newReactions.findIndex(r => r.emoji === emoji);
    
    if (existingIndex >= 0) {
      newReactions.splice(existingIndex, 1);
    } else {
      newReactions.push({ emoji, count: 1 });
    }
    
    setReactions(newReactions);
  };

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div 
      className={`message-wrapper ${isOwnMessage ? 'own-message' : 'other-message'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
        <div className="message-content">
          <p className="message-text">
            {message.text?.body || 'No message content'}
          </p>
        </div>
        
        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="message-reactions">
            {reactions.map((reaction, index) => (
              <span key={index} className="reaction">
                {reaction.emoji}
                {reaction.count > 1 && <span className="reaction-count">{reaction.count}</span>}
              </span>
            ))}
          </div>
        )}
        
        <div className="message-meta">
          <span className="message-time">{getMessageTime()}</span>
          {getStatusIcon()}
        </div>
      </div>
      
      {/* Quick Actions */}
      {showActions && (
        <div className="message-actions">
          <div className="quick-reactions">
            {quickReactions.map((emoji, index) => (
              <button
                key={index}
                className="reaction-btn"
                onClick={() => handleReaction(emoji)}
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="action-buttons">
            <button className="action-btn" title="Reply">
              <span>↩️</span>
            </button>
            <button className="action-btn" title="Forward">
              <span>↪️</span>
            </button>
            <button className="action-btn" title="Copy">
              <span>📋</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble; 
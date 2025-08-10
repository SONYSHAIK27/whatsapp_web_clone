import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import './ChatArea.css';

const ChatArea = ({ messages, onSendMessage, conversation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator for demo
  useEffect(() => {
    if (conversation && messages.length > 0) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [conversation, messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    // Simulate typing indicator
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      try {
        // Handle different timestamp formats
        let date;
        if (message.timestamp) {
          // If timestamp is a string number, convert to milliseconds
          const timestamp = parseInt(message.timestamp);
          if (timestamp < 10000000000) {
            // Unix timestamp in seconds, convert to milliseconds
            date = new Date(timestamp * 1000);
          } else {
            // Already in milliseconds
            date = new Date(timestamp);
          }
        } else if (message.createdAt) {
          date = new Date(message.createdAt);
        } else {
          // Fallback to current date
          date = new Date();
        }
        
        // Validate the date
        if (isNaN(date.getTime())) {
          console.warn('Invalid date for message:', message);
          date = new Date(); // Fallback to current date
        }
        
        const dateKey = format(date, 'yyyy-MM-dd');
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } catch (error) {
        console.error('Error processing message date:', error, message);
        // Add to today's group as fallback
        const today = format(new Date(), 'yyyy-MM-dd');
        if (!groups[today]) {
          groups[today] = [];
        }
        groups[today].push(message);
      }
    });
    return groups;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Validate the date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Today';
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Today';
      } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
        return 'Yesterday';
      } else {
        return format(date, 'MMMM d, yyyy');
      }
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Today';
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-area">
      <div className="messages-container">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-content">
              <div className="no-messages-icon">💬</div>
              <h3>No messages yet</h3>
              <p>Start a conversation by sending a message</p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date} className="message-date-group">
              <div className="date-separator">
                <span>{formatDate(date)}</span>
              </div>
              {dateMessages.map((message, index) => (
                <MessageBubble 
                  key={message.id || index} 
                  message={message}
                  isOwnMessage={message.from === '1234567890'}
                />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-input-form">
          <div className="input-wrapper">
            <button type="button" className="emoji-btn" title="Emoji">
              <span>😊</span>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="message-input"
            />
            <button type="button" className="attach-btn" title="Attach">
              <span>📎</span>
            </button>
            <button type="button" className="voice-btn" title="Voice message">
              <span>🎤</span>
            </button>
          </div>
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim()}
            title="Send message"
          >
            <span>➤</span>
          </button>
        </form>
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};

export default ChatArea; 
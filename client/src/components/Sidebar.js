import React, { useMemo, useState } from 'react';
import './Sidebar.css';
import NewChatModal from './NewChatModal';
import SettingsPanel from './SettingsPanel';

const Sidebar = ({ conversations, onConversationSelect, selectedConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, archived
  const [activeTab, setActiveTab] = useState('chats'); // chats, status, channels, calls

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage?.text?.body?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conversation.unreadCount > 0) ||
                         (filter === 'archived' && conversation.archived);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate total unread messages
  const totalUnreadCount = conversations.reduce((total, conversation) => {
    return total + (conversation.unreadCount || 0);
  }, 0);

  const getConversationPreview = (conversation) => {
    if (conversation.lastMessage?.text?.body) {
      const text = conversation.lastMessage.text.body;
      return text.length > 30 ? text.substring(0, 30) + '...' : text;
    }
    return 'No messages yet';
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return '';
    }
  };

  const contacts = useMemo(() => {
    const byWa = new Map();
    conversations.forEach((c) => {
      if (!byWa.has(c.wa_id)) {
        byWa.set(c.wa_id, {
          wa_id: c.wa_id,
          name: c.name || `User ${c.wa_id?.slice?.(-4) || ''}`,
        });
      }
    });
    return Array.from(byWa.values());
  }, [conversations]);

  const [showNewChat, setShowNewChat] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <>
            <div className="search-section">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
              <button 
                className={`filter-tab ${filter === 'favourites' ? 'active' : ''}`}
                onClick={() => setFilter('favourites')}
              >
                Favourites
              </button>
              <button 
                className={`filter-tab ${filter === 'groups' ? 'active' : ''}`}
                onClick={() => setFilter('groups')}
              >
                Groups
              </button>
            </div>

            {/* Archived section removed to match requested UI */}

            <div className="conversations-list">
              {filteredConversations.length === 0 ? (
                <div className="no-conversations">
                  <div className="no-conversations-icon">💬</div>
                  <h3>No conversations found</h3>
                  <p>{searchTerm ? 'Try a different search term' : 'Start a new conversation'}</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.wa_id}
                    className={`conversation-item ${selectedConversation?.wa_id === conversation.wa_id ? 'active' : ''}`}
                    onClick={() => onConversationSelect(conversation)}
                  >
                    <div className="conversation-avatar">
                      <span>{conversation.name?.charAt(0) || 'U'}</span>
                    </div>
                    
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <h4 className="conversation-name">
                          {conversation.name || `User ${conversation.wa_id}`}
                        </h4>
                        <span className="conversation-time">
                          {formatLastMessageTime(conversation.lastMessage?.timestamp)}
                        </span>
                      </div>
                      
                      <div className="conversation-preview">
                        <p className="last-message">
                          {getConversationPreview(conversation)}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        );
      
      case 'status':
        return (
          <div className="tab-content">
            <div className="status-section">
              <h3>Status</h3>
              <p>No status updates</p>
            </div>
          </div>
        );
      
      case 'channels':
        return (
          <div className="tab-content">
            <div className="channels-section">
              <h3>Channels</h3>
              <p>No channels available</p>
            </div>
          </div>
        );
      
      case 'calls':
        return (
          <div className="tab-content">
            <div className="calls-section">
              <h3>Calls</h3>
              <p>No recent calls</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      {/* Left Navigation Icons - Exact WhatsApp Web Icons */}
      <div className="sidebar-nav">
        <button 
          className={`nav-icon ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
          title="Chats"
        >
          <svg className="nav-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          {totalUnreadCount > 0 && <span className="notification-badge">{totalUnreadCount}</span>}
        </button>
        <button 
          className={`nav-icon ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
          title="Status"
        >
          <svg className="nav-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="status-dot"></span>
        </button>
        <button 
          className={`nav-icon ${activeTab === 'channels' ? 'active' : ''}`}
          onClick={() => setActiveTab('channels')}
          title="Channels"
        >
          <svg className="nav-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <span className="status-dot"></span>
        </button>
        <button 
          className={`nav-icon ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
          title="Calls"
        >
          <svg className="nav-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
        <div className="nav-spacer"></div>
        <button className="nav-icon" title="Settings" onClick={() => setShowSettings(true)}>
          <svg className="nav-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
          <span className="nav-tooltip">Settings</span>
        </button>
        <button className="nav-icon profile-nav" title="Profile">
          <div className="profile-ring">
            <div className="profile-avatar-small">
              <span>👤</span>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="profile-section">
            <div className="profile-avatar">
              <span>👤</span>
              {totalUnreadCount > 0 && <span className="notification-badge">{totalUnreadCount}</span>}
            </div>
            <div className="profile-info">
              <h3>{activeTab === 'chats' ? 'Chats' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            </div>
          </div>
          
          <div className="header-actions">
            {activeTab === 'chats' && (
              <button
                className="action-btn"
                title="New Chat"
                onClick={() => setShowNewChat(true)}
              >
                <span>➕</span>
              </button>
            )}
            <div className="menu-container">
              <button
                className="action-btn"
                title="Menu"
                onClick={() => setShowHeaderMenu((v) => !v)}
              >
                <span>⋮</span>
              </button>
              {showHeaderMenu && (
                <div className="sb-menu" onMouseLeave={() => setShowHeaderMenu(false)}>
                  <button className="sb-menu-item" onClick={() => { setShowNewChat(true); setShowHeaderMenu(false); }}>
                    New group
                  </button>
                  <button className="sb-menu-item" onClick={() => { alert('Starred messages (demo)'); setShowHeaderMenu(false); }}>
                    Starred messages
                  </button>
                  <button className="sb-menu-item" onClick={() => { alert('Select chats (demo)'); setShowHeaderMenu(false); }}>
                    Select chats
                  </button>
                  <button className="sb-menu-item" onClick={() => { alert('Logged out (demo)'); setShowHeaderMenu(false); }}>
                    Log out
                  </button>
                  <div className="sb-menu-sep" />
                  <a className="sb-menu-item" href="https://www.whatsapp.com/download" target="_blank" rel="noreferrer" onClick={() => setShowHeaderMenu(false)}>
                    Get WhatsApp for Windows
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderTabContent()}
      </div>
      {showNewChat && (
        <NewChatModal
          contacts={contacts}
          onClose={() => setShowNewChat(false)}
          onStartChat={(contact) => {
            onConversationSelect({ wa_id: contact.wa_id, name: contact.name });
            setShowNewChat(false);
          }}
        />
      )}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default Sidebar; 
import React, { useState } from 'react';
import './SettingsPanel.css';

const SettingsPanel = ({ onClose }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="sp-overlay" onClick={onClose}>
      <div className="sp-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sp-header">
          <button className="sp-back" onClick={onClose}>←</button>
          <h3 className="sp-title">Settings</h3>
        </div>

        <div className="sp-search">
          <span className="sp-search-icon">🔎</span>
          <input
            className="sp-search-input"
            placeholder="Search settings"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="sp-profile">
          <div className="sp-avatar">A</div>
          <div className="sp-profile-main">
            <div className="sp-name">Account</div>
            <div className="sp-sub">DND.</div>
          </div>
        </div>

        <div className="sp-list">
          {[
            { icon: '👤', label: 'Account' },
            { icon: '🔒', label: 'Privacy' },
            { icon: '💬', label: 'Chats' },
            { icon: '🔔', label: 'Notifications' },
            { icon: '⌨️', label: 'Keyboard shortcuts' },
            { icon: '❓', label: 'Help' },
          ].map((item) => (
            <button key={item.label} className="sp-row" onClick={() => alert(`${item.label} (demo)`)}>
              <span className="sp-ico">{item.icon}</span>
              <div className="sp-row-main">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

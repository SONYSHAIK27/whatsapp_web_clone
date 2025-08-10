import React, { useMemo, useState } from 'react';
import './NewChatModal.css';

const NewChatModal = ({ contacts = [], onClose, onStartChat }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      c.name?.toLowerCase().includes(q) || c.wa_id?.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  return (
    <div className="nc-overlay" onClick={onClose}>
      <div className="nc-panel" onClick={(e) => e.stopPropagation()}>
        <div className="nc-header">
          <button className="nc-back" onClick={onClose} aria-label="Back">←</button>
          <h3 className="nc-title">New chat</h3>
        </div>

        <div className="nc-search">
          <span className="nc-search-icon">🔎</span>
          <input
            className="nc-search-input"
            placeholder="Search name or number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="nc-quick">
          <button className="nc-quick-item" disabled>
            <span className="nc-avatar nc-green">👥</span>
            <div>
              <div className="nc-quick-title">New group</div>
            </div>
          </button>
          <button className="nc-quick-item" disabled>
            <span className="nc-avatar nc-green">➕</span>
            <div>
              <div className="nc-quick-title">New contact</div>
            </div>
          </button>
          <button className="nc-quick-item" disabled>
            <span className="nc-avatar nc-green">👥</span>
            <div>
              <div className="nc-quick-title">New community</div>
            </div>
          </button>
        </div>

        <div className="nc-section-label">Contacts on WhatsApp</div>

        <div className="nc-list">
          {filtered.map((c) => (
            <button
              key={c.wa_id}
              className="nc-row"
              onClick={() => onStartChat?.(c)}
            >
              <span className="nc-avatar nc-teal">{c.name?.[0]?.toUpperCase() || 'U'}</span>
              <div className="nc-row-main">
                <div className="nc-name">{c.name}</div>
                <div className="nc-sub">{c.wa_id}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="nc-empty">No contacts found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;


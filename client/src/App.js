import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Header from './components/Header';
import PairingScreen from './components/PairingScreen';

// Configure axios base URL for production
const baseURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
console.log('Server URL:', process.env.REACT_APP_SERVER_URL);
console.log('Base URL:', baseURL);
axios.defaults.baseURL = baseURL;

const socketUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
console.log('Socket URL:', socketUrl);
const socket = io(socketUrl);

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paired, setPaired] = useState(false);

  useEffect(() => {
    // Check session pairing
    (async () => {
      try {
        const { data } = await axios.get('/api/session');
        setPaired(!!data.paired);
        if (data.paired) {
          await fetchConversations();
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    })();

    // Socket event listeners
    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      fetchConversations(); // Refresh conversations list
    });

    socket.on('message_status_update', (updatedMessage) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.off('new_message');
      socket.off('message_status_update');
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (wa_id) => {
    try {
      const response = await axios.get(`/api/conversations/${wa_id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedConversation) return;

    try {
      const response = await axios.post('/api/messages', {
        wa_id: selectedConversation._id,
        text: text,
        user_name: 'You',
        user_number: '1234567890'
      });
      
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading WhatsApp Clone...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {!paired ? (
        // Show only QR pairing screen - no sidebar, no chat list
        <PairingScreen onPaired={async () => { setPaired(true); await fetchConversations(); }} />
      ) : (
        // Show full WhatsApp Web interface after pairing
        <div className="app-container">
          <Sidebar 
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
          <div className="main-content">
            {selectedConversation ? (
              <>
                <Header conversation={selectedConversation} />
                <ChatArea 
                  messages={messages}
                  onSendMessage={sendMessage}
                  conversation={selectedConversation}
                />
              </>
            ) : (
              <div className="welcome-screen">
                <div className="welcome-content">
                  <div className="welcome-icon">💬</div>
                  <h1>WhatsApp Web Clone</h1>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
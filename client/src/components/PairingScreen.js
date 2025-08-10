import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import './PairingScreen.css';

const PairingScreen = ({ onPaired }) => {
  const [sid, setSid] = useState(null);
  const [qrData, setQrData] = useState('');
  const [status, setStatus] = useState('pending');
  const [expiresIn, setExpiresIn] = useState(60);
  const [autoNote, setAutoNote] = useState('');
  const pollRef = useRef(null);
  const tickRef = useRef(null);

  const initNewCode = async () => {
    try {
      setStatus('loading');
      console.log('Attempting to generate QR code...');
      console.log('PairingScreen Version:', Date.now()); // Cache busting
      // Use the working endpoint that doesn't require database
      const { data } = await axios.post('/api/test-qr');
      console.log('QR code generated successfully:', data);
      setSid(data.sid);
      setQrData(data.qrData);
      setStatus('pending');
      setExpiresIn(60);
      setAutoNote('');
    } catch (e) {
      console.error('Failed to generate QR code:', e);
      console.error('Error details:', e.response?.data || e.message);
      setStatus('error');
      setAutoNote(`Failed to generate QR code: ${e.response?.data?.error || e.message}`);
    }
  };

  useEffect(() => {
    initNewCode();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  useEffect(() => {
    if (!sid) return;
    // poll pairing status
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get('/api/test-pair-status', { params: { sid } });
        setStatus(data.status);
        if (data.status === 'paired') {
          if (pollRef.current) clearInterval(pollRef.current);
          if (tickRef.current) clearInterval(tickRef.current);
          onPaired?.();
        }
      } catch {}
    }, 1500);
    // countdown timer & auto-refresh
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          // auto-refresh new QR like WhatsApp
          clearInterval(tickRef.current);
          setAutoNote('QR refreshed');
          initNewCode();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [sid, onPaired]);

  const manualConfirm = async () => {
    if (!sid) return;
    try {
      const { data } = await axios.post('/api/test-pair-confirm', { sid });
      setStatus(data.status);
      if (data.status === 'paired') {
        if (pollRef.current) clearInterval(pollRef.current);
        if (tickRef.current) clearInterval(tickRef.current);
        onPaired?.();
      }
    } catch (error) {
      console.error('Failed to confirm pairing:', error);
    }
  };

  return (
    <div className="pair-wrap">
      <div className="pair-card">
        <h2>Use WhatsApp on your computer</h2>
        <div className="pair-content">
          <div className="pair-qr">
            {qrData ? <QRCode value={qrData} size={220} /> : <div className="pair-placeholder" />}
            <div className="pair-qr-footer">
              <span className="pair-timer">{expiresIn}s</span>
              {autoNote && <span className="pair-note">{autoNote}</span>}
              <button className="pair-refresh" onClick={initNewCode} title="Refresh QR">↻</button>
            </div>
          </div>
          <div className="pair-steps">
            <ol>
              <li>Open WhatsApp on your phone</li>
              <li>Tap Menu ⋮ or Settings and select Linked devices</li>
              <li>Tap Link a device and scan this QR code</li>
            </ol>
            <button 
              className="pair-btn" 
              onClick={manualConfirm} 
              disabled={!sid || status === 'paired' || status === 'loading'}
            >
              {status === 'loading' ? 'Generating QR...' : 
               status === 'paired' ? 'Paired Successfully!' : 
               'I scanned the QR (demo)'}
            </button>
            <div className="pair-status">Status: {status}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairingScreen;

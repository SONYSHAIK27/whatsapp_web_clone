const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  id: String,
  meta_msg_id: String,
  wa_id: String,
  from: String,
  to: String,
  timestamp: String,
  type: String,
  text: {
    body: String
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  user_name: String,
  user_number: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema, 'processed_messages');

// User Schema (simple auth)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema, 'users');

// Auth helpers
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_please_change';
const COOKIE_NAME = 'wa_session';

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid session' });
  }
}

// QR-style pairing demo session
const sessionSchema = new mongoose.Schema({
  sid: { type: String, unique: true },
  code: String,
  status: { type: String, enum: ['pending', 'paired'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) }
});
const Session = mongoose.model('Session', sessionSchema, 'sessions');

function setSessionCookie(res, sid) {
  res.cookie(COOKIE_NAME, sid, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function requireSession(req, res, next) {
  const sid = req.cookies[COOKIE_NAME];
  if (!sid) return res.status(401).json({ error: 'No session' });
  const s = await Session.findOne({ sid, status: 'paired' });
  if (!s) return res.status(401).json({ error: 'Invalid session' });
  req.session = s;
  return next();
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, passwordHash });
    await user.save();
    setAuthCookie(res, { id: user._id, name: user.name });
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    setAuthCookie(res, { id: user._id, name: user.name });
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone });
  } catch (e) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: false });
  res.json({ ok: true });
});

app.get('/api/auth/me', async (req, res) => {
  res.json(null);
});

// QR-like pairing endpoints
app.post('/api/pair/init', async (req, res) => {
  try {
    const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await Session.create({ sid, code });
    const qrData = `wa-demo://pair?sid=${sid}&code=${code}`;
    res.json({ sid, code, qrData });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/pair/status', async (req, res) => {
  const { sid } = req.query;
  const s = await Session.findOne({ sid });
  if (!s) return res.status(404).json({ error: 'not_found' });
  res.json({ status: s.status });
});

// For demo: emulate phone confirming scan
app.post('/api/pair/confirm', async (req, res) => {
  const { sid } = req.body || {};
  const s = await Session.findOne({ sid });
  if (!s) return res.status(404).json({ error: 'not_found' });
  s.status = 'paired';
  await s.save();
  res.cookie(COOKIE_NAME, sid, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*60*60*1000 });
  res.json({ ok: true });
});

app.get('/api/session', async (req, res) => {
  const sid = req.cookies[COOKIE_NAME];
  if (!sid) return res.json({ paired: false });
  const s = await Session.findOne({ sid, status: 'paired' });
  res.json({ paired: !!s });
});

// Webhook payload processor
app.post('/api/webhook', async (req, res) => {
  try {
    const payload = req.body;
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

    if (payload.entry && payload.entry[0] && payload.entry[0].changes) {
      const changes = payload.entry[0].changes;
      
      for (const change of changes) {
        if (change.value && change.value.messages) {
          for (const message of change.value.messages) {
            const messageData = {
              id: message.id,
              meta_msg_id: message.meta_msg_id,
              wa_id: change.value.metadata?.wa_id || '',
              from: message.from,
              to: message.to,
              timestamp: message.timestamp,
              type: message.type,
              text: message.text,
              user_name: `User ${message.from.slice(-4)}`,
              user_number: message.from
            };

            const existingMessage = await Message.findOne({ id: message.id });
            if (!existingMessage) {
              const newMessage = new Message(messageData);
              await newMessage.save();
              io.emit('new_message', newMessage);
            }
          }
        }

        // Handle status updates
        if (change.value && change.value.statuses) {
          for (const status of change.value.statuses) {
            const updateData = {
              status: status.status,
              timestamp: status.timestamp
            };

            const updatedMessage = await Message.findOneAndUpdate(
              { $or: [{ id: status.id }, { meta_msg_id: status.id }] },
              updateData,
              { new: true }
            );

            if (updatedMessage) {
              io.emit('message_status_update', updatedMessage);
            }
          }
        }
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Routes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ created_at: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/conversations', requireAuth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          lastMessage: { $last: '$$ROOT' },
          messageCount: { $sum: 1 },
          user_name: { $first: '$user_name' },
          user_number: { $first: '$user_number' }
        }
      },
      {
        $sort: { 'lastMessage.created_at': -1 }
      }
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.get('/api/conversations/:wa_id', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id })
      .sort({ created_at: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Send message (demo)
app.post('/api/messages', requireAuth, async (req, res) => {
  try {
    const { wa_id, text, user_name, user_number } = req.body;
    
    const newMessage = new Message({
      id: `demo_${Date.now()}`,
      meta_msg_id: `demo_${Date.now()}`,
      wa_id: wa_id || 'demo_user',
      from: user_number || '1234567890',
      to: '9876543210',
      timestamp: new Date().toISOString(),
      type: 'text',
      text: { body: text },
      status: 'sent',
      user_name: user_name || 'Demo User',
      user_number: user_number || '1234567890'
    });

    await newMessage.save();
    io.emit('new_message', newMessage);
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Temporary environment test endpoint
app.get('/api/env-test', (req, res) => {
  res.json({
    mongodb_uri_set: !!process.env.MONGODB_URI,
    mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    mongodb_uri_preview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET',
    node_env: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
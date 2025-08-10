# WhatsApp Web Clone

A real-time WhatsApp Web clone built with Node.js, React, MongoDB, and Socket.IO. This application simulates WhatsApp Business API webhooks and provides a responsive chat interface similar to WhatsApp Web.

## Features

### ✅ Completed Features
- **Real-time messaging** with Socket.IO
- **WhatsApp Web-like UI** with responsive design
- **Message status indicators** (sent, delivered, read)
- **Webhook payload processing** for WhatsApp Business API simulation
- **MongoDB integration** for message storage
- **Mobile-friendly responsive design**
- **Message timestamps** and date grouping
- **Conversation management** with user grouping
- **Send message functionality** (demo mode)

### 🚀 Bonus Features
- **Real-time status updates** via WebSocket
- **Auto-scroll** to latest messages
- **Message grouping by date**
- **Clean, modern UI** matching WhatsApp Web design
- **Webhook simulation** for testing

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **CORS** enabled for cross-origin requests

### Frontend
- **React.js** with functional components and hooks
- **Socket.IO Client** for real-time updates
- **Axios** for API communication
- **date-fns** for date formatting
- **CSS3** with custom properties for theming

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd whatsapp_clone
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/whatsapp
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend (in a new terminal)
npm run client
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### 1. Webhook Processing
The application includes a webhook processor that simulates WhatsApp Business API payloads:

```bash
# Process sample webhook payloads
node scripts/process-webhooks.js

# Start continuous webhook simulation
node scripts/process-webhooks.js --simulate
```

### 2. Using the Chat Interface
1. Open the application in your browser
2. Select a conversation from the sidebar
3. Send messages using the input box
4. Watch real-time updates as webhooks are processed

### 3. API Endpoints

#### Webhook Processing
- `POST /api/webhook` - Process WhatsApp Business API webhooks

#### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send a new message (demo)

#### Conversations
- `GET /api/conversations` - Get all conversations grouped by user
- `GET /api/conversations/:wa_id` - Get messages for a specific conversation

## Database Schema

### Messages Collection (`processed_messages`)
```javascript
{
  id: String,                    // Message ID
  meta_msg_id: String,          // Meta message ID
  wa_id: String,                // WhatsApp ID
  from: String,                 // Sender number
  to: String,                   // Recipient number
  timestamp: String,            // Unix timestamp
  type: String,                 // Message type (text, image, etc.)
  text: {                       // Message content
    body: String
  },
  status: String,               // Message status (sent, delivered, read)
  user_name: String,            // User display name
  user_number: String,          // User phone number
  created_at: Date              // Database timestamp
}
```

## Webhook Payload Format

The application processes WhatsApp Business API webhook payloads:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "123456789",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "1234567890",
              "phone_number_id": "987654321"
            },
            "contacts": [
              {
                "profile": {
                  "name": "John Doe"
                },
                "wa_id": "1234567890"
              }
            ],
            "messages": [
              {
                "from": "1234567890",
                "id": "wamid.HBgLMTIzNDU2Nzg5MC4V",
                "timestamp": "1703123456",
                "text": {
                  "body": "Hello! How are you?"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## Deployment

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Option 2: Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`

### Option 3: Heroku
1. Create a new Heroku app
2. Connect your GitHub repository
3. Set environment variables
4. Deploy using Heroku CLI or GitHub integration

### Environment Variables for Production
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=production
```

## Project Structure

```
whatsapp_clone/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Sidebar.js
│   │   │   ├── Header.js
│   │   │   ├── ChatArea.js
│   │   │   └── MessageBubble.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── scripts/
│   └── process-webhooks.js    # Webhook processor
├── server.js                  # Express server
├── package.json
└── README.md
```

## Features in Detail

### Real-time Messaging
- Messages appear instantly using Socket.IO
- Status updates (sent → delivered → read) in real-time
- Auto-scroll to latest messages

### Responsive Design
- Desktop: Full WhatsApp Web layout
- Mobile: Optimized for mobile devices
- Touch-friendly interface

### Message Status Indicators
- ✓ Sent (gray)
- ✓✓ Delivered (gray)
- ✓✓ Read (blue)

### Webhook Processing
- Processes WhatsApp Business API webhook payloads
- Extracts message data and user information
- Updates message statuses based on webhook events
- Simulates real WhatsApp Business API behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a demo application that simulates WhatsApp Business API functionality. No real WhatsApp messages are sent or received. The webhook processing is for demonstration purposes only. 
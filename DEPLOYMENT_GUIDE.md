# WhatsApp Clone - Deployment Guide

## Quick Start

### Local Development
1. **Install Dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Set up Environment**
   Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/whatsapp
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the Application**
   ```bash
   # Option 1: Use the batch file (Windows)
   start.bat
   
   # Option 2: Manual start
   npm run dev          # Backend
   npm run client       # Frontend (in new terminal)
   ```

4. **Test the Setup**
   ```bash
   node test-setup.js
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Prepare for Vercel**
   - The `vercel.json` file is already configured
   - Make sure your code is in a GitHub repository

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `MONGODB_URI` with your MongoDB Atlas connection string

### Option 2: Render

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

3. **Environment Variables**
   - Add `MONGODB_URI` with your MongoDB Atlas connection string

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   ```

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free account

2. **Create Cluster**
   - Choose "Free" tier
   - Select your preferred region
   - Create cluster

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Set Environment Variable**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from [mongodb.com](https://mongodb.com)
   - Install and start MongoDB service

2. **Set Environment Variable**
   ```env
   MONGODB_URI=mongodb://localhost:27017/whatsapp
   ```

## Testing the Application

### 1. Test Webhook Processing
```bash
# Process sample webhooks
node scripts/process-webhooks.js

# Start continuous simulation
node scripts/process-webhooks.js --simulate
```

### 2. Test Real-time Features
1. Open the application in multiple browser tabs
2. Send messages in one tab
3. Watch them appear in real-time in other tabs

### 3. Test Mobile Responsiveness
1. Open browser developer tools
2. Toggle device toolbar
3. Test on different screen sizes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - For Atlas: Check IP whitelist

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on port 5000/3000

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version (v14+ required)

4. **Socket.IO Connection Issues**
   - Check CORS settings
   - Verify Socket.IO client URL

### Debug Commands

```bash
# Test database connection
node test-setup.js

# Check server logs
npm run dev

# Check frontend build
npm run build

# Test webhook processing
node scripts/process-webhooks.js
```

## Production Checklist

- [ ] MongoDB Atlas connection string configured
- [ ] Environment variables set in hosting platform
- [ ] Frontend built for production (`npm run build`)
- [ ] CORS settings configured for production domain
- [ ] SSL certificate enabled (for HTTPS)
- [ ] Domain name configured (optional)

## Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   db.processed_messages.createIndex({ "wa_id": 1 })
   db.processed_messages.createIndex({ "created_at": -1 })
   ```

2. **Caching**
   - Consider Redis for session storage
   - Implement message caching for large conversations

3. **CDN**
   - Use CDN for static assets
   - Enable gzip compression

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure environment variables in production

2. **CORS Configuration**
   - Restrict CORS to your domain in production
   - Update Socket.IO CORS settings

3. **Input Validation**
   - Validate webhook payloads
   - Sanitize user inputs

4. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Monitor webhook processing

## Monitoring

1. **Application Logs**
   - Monitor server logs for errors
   - Set up error tracking (Sentry, etc.)

2. **Database Monitoring**
   - Monitor MongoDB Atlas metrics
   - Set up alerts for connection issues

3. **Performance Monitoring**
   - Monitor response times
   - Track Socket.IO connection counts

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the README.md file
3. Open an issue in the repository
4. Check the application logs

---

**Note**: This is a demo application. For production use, implement proper security measures, error handling, and monitoring. 
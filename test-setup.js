const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

async function testSetup() {
  console.log('🧪 Testing WhatsApp Clone Setup...\n');

  // Test 1: MongoDB Connection
  console.log('1. Testing MongoDB Connection...');
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connection successful');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('💡 Make sure MongoDB is running or update MONGODB_URI in .env file');
    return;
  }

  // Test 2: Server API
  console.log('\n2. Testing Server API...');
  try {
    const response = await axios.get('http://localhost:5000/api/conversations');
    console.log('✅ Server API is running');
  } catch (error) {
    console.log('❌ Server API test failed:', error.message);
    console.log('💡 Make sure to run: npm run dev');
    return;
  }

  // Test 3: Webhook Processing
  console.log('\n3. Testing Webhook Processing...');
  try {
    const testPayload = {
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
                      "name": "Test User"
                    },
                    "wa_id": "test_user_123"
                  }
                ],
                "messages": [
                  {
                    "from": "test_user_123",
                    "id": "test_message_123",
                    "timestamp": Math.floor(Date.now() / 1000).toString(),
                    "text": {
                      "body": "This is a test message"
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
    };

    const response = await axios.post('http://localhost:5000/api/webhook', testPayload);
    console.log('✅ Webhook processing successful');
  } catch (error) {
    console.log('❌ Webhook processing failed:', error.message);
  }

  console.log('\n🎉 Setup test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Start the React app: npm run client');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('4. Test webhook processing: node scripts/process-webhooks.js');
  
  process.exit(0);
}

testSetup().catch(console.error); 
const axios = require('axios');

// Sample conversations to add for testing scrollbar
const testConversations = [
  {
    wa_id: "1234567890",
    name: "John Doe",
    lastMessage: {
      text: { body: "Hey, how are you doing?" },
      timestamp: Math.floor(Date.now() / 1000) - 3600
    },
    unreadCount: 2
  },
  {
    wa_id: "1234567891",
    name: "Jane Smith",
    lastMessage: {
      text: { body: "Can you send me the files?" },
      timestamp: Math.floor(Date.now() / 1000) - 7200
    },
    unreadCount: 0
  },
  {
    wa_id: "1234567892",
    name: "Mike Johnson",
    lastMessage: {
      text: { body: "Meeting at 3 PM tomorrow" },
      timestamp: Math.floor(Date.now() / 1000) - 10800
    },
    unreadCount: 1
  },
  {
    wa_id: "1234567893",
    name: "Sarah Wilson",
    lastMessage: {
      text: { body: "Thanks for your help!" },
      timestamp: Math.floor(Date.now() / 1000) - 14400
    },
    unreadCount: 0
  },
  {
    wa_id: "1234567894",
    name: "David Brown",
    lastMessage: {
      text: { body: "Project deadline is next week" },
      timestamp: Math.floor(Date.now() / 1000) - 18000
    },
    unreadCount: 3
  },
  {
    wa_id: "1234567895",
    name: "Lisa Davis",
    lastMessage: {
      text: { body: "Happy birthday! 🎉" },
      timestamp: Math.floor(Date.now() / 1000) - 21600
    },
    unreadCount: 0
  },
  {
    wa_id: "1234567896",
    name: "Tom Anderson",
    lastMessage: {
      text: { body: "Let's catch up soon" },
      timestamp: Math.floor(Date.now() / 1000) - 25200
    },
    unreadCount: 1
  },
  {
    wa_id: "1234567897",
    name: "Emma Wilson",
    lastMessage: {
      text: { body: "Great work on the presentation!" },
      timestamp: Math.floor(Date.now() / 1000) - 28800
    },
    unreadCount: 0
  },
  {
    wa_id: "1234567898",
    name: "Alex Thompson",
    lastMessage: {
      text: { body: "Coffee tomorrow?" },
      timestamp: Math.floor(Date.now() / 1000) - 32400
    },
    unreadCount: 2
  },
  {
    wa_id: "1234567899",
    name: "Rachel Green",
    lastMessage: {
      text: { body: "Document is ready for review" },
      timestamp: Math.floor(Date.now() / 1000) - 36000
    },
    unreadCount: 0
  },
  {
    wa_id: "1234567900",
    name: "Chris Martin",
    lastMessage: {
      text: { body: "Weekend plans?" },
      timestamp: Math.floor(Date.now() / 1000) - 39600
    },
    unreadCount: 1
  },
  {
    wa_id: "1234567901",
    name: "Maria Garcia",
    lastMessage: {
      text: { body: "Team lunch on Friday" },
      timestamp: Math.floor(Date.now() / 1000) - 43200
    },
    unreadCount: 0
  }
];

async function addTestData() {
  try {
    console.log('Adding test conversations...');
    
    for (const conversation of testConversations) {
      // Add a message for each conversation
      const messagePayload = {
        object: "whatsapp_business_account",
        entry: [{
          id: "123456789",
          changes: [{
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: "1234567890",
                phone_number_id: "123456789"
              },
              contacts: [{
                profile: {
                  name: conversation.name
                },
                wa_id: conversation.wa_id
              }],
              messages: [{
                from: conversation.wa_id,
                id: `msg_${Date.now()}_${Math.random()}`,
                timestamp: conversation.lastMessage.timestamp.toString(),
                type: "text",
                text: {
                  body: conversation.lastMessage.text.body
                }
              }]
            },
            field: "messages"
          }]
        }]
      };

      await axios.post('http://localhost:5000/api/webhook', messagePayload);
      console.log(`Added conversation: ${conversation.name}`);
    }
    
    console.log('✅ Test data added successfully!');
    console.log('Now refresh your browser to see the scrollbar in action!');
    
  } catch (error) {
    console.error('Error adding test data:', error.message);
  }
}

addTestData(); 
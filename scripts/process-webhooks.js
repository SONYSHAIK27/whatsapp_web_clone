const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Sample webhook payloads that simulate WhatsApp Business API
const samplePayloads = [
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
  },
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
                    "name": "Jane Smith"
                  },
                  "wa_id": "9876543210"
                }
              ],
              "messages": [
                {
                  "from": "9876543210",
                  "id": "wamid.HBgLOTg3NjU0MzIxMC4V",
                  "timestamp": "1703123457",
                  "text": {
                    "body": "Hi there! Can you help me with something?"
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
  },
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
              "statuses": [
                {
                  "id": "wamid.HBgLMTIzNDU2Nzg5MC4V",
                  "status": "delivered",
                  "timestamp": "1703123458",
                  "recipient_id": "1234567890"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },
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
                    "name": "Alice Johnson"
                  },
                  "wa_id": "5556667777"
                }
              ],
              "messages": [
                {
                  "from": "5556667777",
                  "id": "wamid.HBgLNTU1NjY2Nzc3Ny4V",
                  "timestamp": "1703123459",
                  "text": {
                    "body": "Thanks for the information! This is very helpful."
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
  },
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
              "statuses": [
                {
                  "id": "wamid.HBgLOTg3NjU0MzIxMC4V",
                  "status": "read",
                  "timestamp": "1703123460",
                  "recipient_id": "9876543210"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  }
];

// Function to send webhook payload to our API
async function sendWebhookPayload(payload) {
  try {
    const response = await axios.post('http://localhost:5000/api/webhook', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Webhook processed successfully:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return null;
  }
}

// Function to process all sample payloads
async function processSamplePayloads() {
  console.log('Starting to process sample webhook payloads...');
  
  for (let i = 0; i < samplePayloads.length; i++) {
    console.log(`Processing payload ${i + 1}/${samplePayloads.length}...`);
    
    const result = await sendWebhookPayload(samplePayloads[i]);
    
    if (result) {
      console.log(`✅ Payload ${i + 1} processed successfully`);
    } else {
      console.log(`❌ Failed to process payload ${i + 1}`);
    }
    
    // Add delay between requests to simulate real webhook timing
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Finished processing all sample payloads!');
}

// Function to continuously send webhooks (for demo purposes)
async function startWebhookSimulation() {
  console.log('Starting webhook simulation...');
  console.log('Press Ctrl+C to stop');
  
  let counter = 0;
  
  setInterval(async () => {
    counter++;
    const randomPayload = samplePayloads[Math.floor(Math.random() * samplePayloads.length)];
    
    // Modify timestamp to make it current
    if (randomPayload.entry && randomPayload.entry[0] && randomPayload.entry[0].changes) {
      const change = randomPayload.entry[0].changes[0];
      if (change.value && change.value.messages) {
        change.value.messages[0].timestamp = Math.floor(Date.now() / 1000).toString();
      }
    }
    
    console.log(`Sending webhook ${counter}...`);
    await sendWebhookPayload(randomPayload);
  }, 5000); // Send every 5 seconds
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--simulate')) {
    startWebhookSimulation();
  } else {
    processSamplePayloads();
  }
}

module.exports = {
  sendWebhookPayload,
  processSamplePayloads,
  startWebhookSimulation,
  samplePayloads
}; 
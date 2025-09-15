const crypto = require('crypto');



const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });




async function processWithAI(messages, latestMessage) {
  try {
    // Mask sensitive data first
    const maskedMessages = messages.map(msg => ({
      role: msg.sender_type === 'customer' ? 'user' : 'assistant',
      content: maskSensitiveData(msg.content),
    }));

    // Send to OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant for customer support. Summarize the conversation and classify the customer's intent." },
        ...maskedMessages,
        { role: "user", content: `Please provide:\n1. A one-line summary of this conversation\n2. The customer’s intent category (like support, billing, product_inquiry, order_status, account, general).\nLatest message: "${maskSensitiveData(latestMessage)}"` }
      ],
      max_tokens: 200,
    });

    const aiText = response.choices[0].message.content.trim();

    // Parse summary + intent
    const lines = aiText.split("\n").map(l => l.trim()).filter(Boolean);
    const summary = lines[0] || "No summary available";
    const intent = lines[1] || "unknown";

    return {
      summary,
      intent,
      confidence: 0.9,
    };
  } catch (error) {
    console.error("AI processing error:", error);
    return {
      summary: "Unable to generate summary",
      intent: "unknown",
      confidence: 0.0,
    };
  }
}


function maskSensitiveData(text) {
  // Mask phone numbers
  text = text.replace(/\b\d{3}-?\d{3}-?\d{4}\b/g, '[PHONE]');
  
  // Mask email addresses
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  
  // Mask account numbers (simple pattern)
  text = text.replace(/\b\d{8,16}\b/g, '[ACCOUNT]');
  
  // Mask credit card patterns
  text = text.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD]');
  
  return text;
}

function generateMockSummary(messages) {
  const customerMessages = messages.filter(m => m.sender_type === 'customer');
  const messageCount = customerMessages.length;
  
  if (messageCount === 0) return 'No customer messages found';
  if (messageCount === 1) return 'Customer initiated contact with a single message';
  
  const summaries = [
    'Customer inquiring about product information and pricing',
    'Support request regarding technical issues with service',
    'Customer asking about order status and delivery information',
    'General inquiry about business hours and location',
    'Customer expressing concern about billing and payment',
    'Request for assistance with account management',
    'Customer providing feedback about recent experience'
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
}

function classifyMockIntent(message) {
  const intents = {
    'support': ['help', 'problem', 'issue', 'error', 'broken', 'fix'],
    'billing': ['bill', 'payment', 'charge', 'invoice', 'refund', 'money'],
    'product_inquiry': ['price', 'cost', 'product', 'buy', 'purchase', 'available'],
    'order_status': ['order', 'delivery', 'shipped', 'tracking', 'status'],
    'account': ['account', 'login', 'password', 'profile', 'settings'],
    'general': ['hours', 'location', 'contact', 'info', 'information']
  };

  const lowerMessage = message.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
}

// Placeholder for actual OpenAI integration
async function callOpenAI(messages, prompt) {
  // This would be replaced with actual OpenAI API call
  // const response = await openai.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     { role: "system", content: prompt },
  //     ...messages.map(m => ({ role: m.sender_type === 'customer' ? 'user' : 'assistant', content: m.content }))
  //   ],
  //   max_tokens: 150
  // });
  // return response.choices[0].message.content;
  
  return 'Mock AI response';
}

module.exports = {
  processWithAI,
  maskSensitiveData
};
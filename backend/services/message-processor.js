const { pool } = require('../config/database');
const { processWithAI } = require('./ai-service');
const { broadcastToTenant } = require('./websocket-service');

async function processIncomingMessage(tenantId, message, contacts) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Find or create contact
    const contactInfo = contacts ? contacts[0] : null;
    const phoneNumber = message.from;
    
    let contact = await client.query(
      'SELECT id FROM contacts WHERE tenant_id = $1 AND phone_number = $2',
      [tenantId, phoneNumber]
    );

    if (contact.rows.length === 0) {
      const contactResult = await client.query(
        `INSERT INTO contacts (tenant_id, phone_number, name, whatsapp_profile_name) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          tenantId,
          phoneNumber,
          contactInfo?.profile?.name || `Contact ${phoneNumber}`,
          contactInfo?.profile?.name
        ]
      );
      contact = contactResult;
    }

    const contactId = contact.rows[0].id;

    // Find or create conversation
    let conversation = await client.query(
      'SELECT id FROM conversations WHERE tenant_id = $1 AND contact_id = $2',
      [tenantId, contactId]
    );

    if (conversation.rows.length === 0) {
      const conversationResult = await client.query(
        `INSERT INTO conversations (tenant_id, contact_id) 
         VALUES ($1, $2) RETURNING id`,
        [tenantId, contactId]
      );
      conversation = conversationResult;
    }

    const conversationId = conversation.rows[0].id;

    // Insert message
    const messageContent = extractMessageContent(message);
    const messageResult = await client.query(
      `INSERT INTO messages (conversation_id, whatsapp_message_id, content, sender_type, message_type, timestamp)
       VALUES ($1, $2, $3, 'customer', $4, $5) RETURNING id`,
      [
        conversationId,
        message.id,
        messageContent,
        message.type || 'text',
        new Date(parseInt(message.timestamp) * 1000)
      ]
    );

    // Update conversation timestamp
    await client.query(
      'UPDATE conversations SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1',
      [conversationId]
    );

    await client.query('COMMIT');

    // Process with AI in background
    processMessageWithAI(tenantId, conversationId, messageContent);

    // Broadcast to WebSocket clients
    broadcastToTenant(tenantId, {
      type: 'new_message',
      conversation_id: conversationId,
      message: {
        id: messageResult.rows[0].id,
        content: messageContent,
        sender_type: 'customer',
        timestamp: new Date().toISOString(),
      }
    });

    console.log('Message processed successfully:', message.id);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Message processing error:', error);
    throw error;
  } finally {
    client.release();
  }
}

function extractMessageContent(message) {
  switch (message.type) {
    case 'text':
      return message.text?.body || '';
    case 'image':
      return '[Image]';
    case 'document':
      return '[Document]';
    case 'audio':
      return '[Audio]';
    case 'video':
      return '[Video]';
    default:
      return '[Unsupported message type]';
  }
}

async function processMessageWithAI(tenantId, conversationId, messageContent) {
  try {
    // Get conversation messages
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT content, sender_type, timestamp
         FROM messages 
         WHERE conversation_id = $1 
         ORDER BY timestamp ASC`,
        [conversationId]
      );

      const messages = result.rows;
      
      // Process with AI service
      const aiResult = await processWithAI(messages, messageContent);
      
      // Update conversation with AI results
      await client.query(
        `UPDATE conversations 
         SET ai_summary = $1, ai_intent = $2, ai_processed = TRUE, updated_at = NOW()
         WHERE id = $3`,
        [aiResult.summary, aiResult.intent, conversationId]
      );

      // Mark message as AI processed
      await client.query(
        `UPDATE messages 
         SET ai_processed = TRUE 
         WHERE conversation_id = $1 AND ai_processed = FALSE`,
        [conversationId]
      );

      console.log('AI processing completed for conversation:', conversationId);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('AI processing error:', error);
  }
}

module.exports = {
  processIncomingMessage,
};
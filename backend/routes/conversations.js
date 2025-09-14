const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all conversations for tenant
router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          c.id,
          c.ai_summary,
          c.ai_intent,
          c.last_message_at,
          c.created_at,
          c.updated_at,
          ct.name as contact_name,
          ct.phone_number as contact_phone,
          (
            SELECT content 
            FROM messages 
            WHERE conversation_id = c.id 
            ORDER BY timestamp DESC 
            LIMIT 1
          ) as last_message,
          (
            SELECT timestamp 
            FROM messages 
            WHERE conversation_id = c.id 
            ORDER BY timestamp DESC 
            LIMIT 1
          ) as last_message_time,
          (
            SELECT COUNT(*) 
            FROM messages 
            WHERE conversation_id = c.id 
            AND sender_type = 'customer'
          ) as unread_count
        FROM conversations c
        JOIN contacts ct ON c.contact_id = ct.id
        WHERE c.tenant_id = $1
        ORDER BY c.last_message_at DESC
      `, [req.user.id]);

      res.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Conversations fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations',
    });
  }
});

// Get single conversation
router.get('/:id', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          c.id,
          c.ai_summary,
          c.ai_intent,
          c.created_at,
          ct.name as contact_name,
          ct.phone_number as contact_phone
        FROM conversations c
        JOIN contacts ct ON c.contact_id = ct.id
        WHERE c.id = $1 AND c.tenant_id = $2
      `, [req.params.id, req.user.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found',
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Conversation fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation',
    });
  }
});

// Get messages for conversation
router.get('/:id/messages', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      // Verify conversation belongs to tenant
      const convResult = await client.query(
        'SELECT id FROM conversations WHERE id = $1 AND tenant_id = $2',
        [req.params.id, req.user.id]
      );

      if (convResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found',
        });
      }

      const result = await client.query(`
        SELECT 
          id,
          content,
          sender_type,
          message_type,
          timestamp,
          whatsapp_message_id
        FROM messages
        WHERE conversation_id = $1
        ORDER BY timestamp DESC
      `, [req.params.id]);

      res.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

module.exports = router;
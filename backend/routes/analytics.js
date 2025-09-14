const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get analytics data
router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      // Get basic metrics
      const metricsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM conversations WHERE tenant_id = $1) as total_conversations,
          (SELECT COUNT(*) FROM messages m 
           JOIN conversations c ON m.conversation_id = c.id 
           WHERE c.tenant_id = $1) as total_messages,
          (SELECT COUNT(*) FROM messages m 
           JOIN conversations c ON m.conversation_id = c.id 
           WHERE c.tenant_id = $1 AND m.sender_type = 'customer') as customer_messages
      `, [req.user.id]);

      // Get top intents
      const intentsResult = await client.query(`
        SELECT ai_intent as intent, COUNT(*) as count
        FROM conversations
        WHERE tenant_id = $1 AND ai_intent IS NOT NULL
        GROUP BY ai_intent
        ORDER BY count DESC
        LIMIT 5
      `, [req.user.id]);

      // Get daily volume for last 7 days
      const volumeResult = await client.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE c.tenant_id = $1 
          AND m.created_at >= NOW() - INTERVAL '7 days'
          AND m.sender_type = 'customer'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, [req.user.id]);

      const metrics = metricsResult.rows[0];
      
      res.json({
        success: true,
        data: {
          total_conversations: parseInt(metrics.total_conversations),
          total_messages: parseInt(metrics.total_messages),
          avg_response_time: 15, // Mock data - implement actual calculation
          top_intents: intentsResult.rows,
          daily_volume: volumeResult.rows,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

module.exports = router;
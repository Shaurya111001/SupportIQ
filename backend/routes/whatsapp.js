const express = require('express');
const { pool } = require('../config/database');
const { generateWebhookToken } = require('../utils/crypto');

const router = express.Router();

// Connect WhatsApp Business
router.post('/connect', async (req, res) => {
  try {
    // In a real implementation, this would:
    // 1. Initiate OAuth flow with Meta
    // 2. Get access token and phone number ID
    // 3. Register webhook with Meta's API
    // 4. Store credentials securely
    
    // For demo purposes, we'll simulate a successful connection
    const client = await pool.connect();
    
    try {
      // Generate demo credentials (replace with real OAuth flow)
      const demoPhoneNumberId = 'demo_' + Date.now();
      const demoAccessToken = 'demo_token_' + generateWebhookToken();
      const demoBusinessAccountId = 'demo_business_' + Date.now();
      
      await client.query(
        `UPDATE tenants 
         SET whatsapp_phone_number_id = $1, 
             whatsapp_access_token = $2, 
             whatsapp_business_account_id = $3,
             whatsapp_connected = TRUE,
             updated_at = NOW() 
         WHERE id = $4`,
        [demoPhoneNumberId, demoAccessToken, demoBusinessAccountId, req.user.id]
      );

      // In production, register webhook with Meta:
      // await registerWebhookWithMeta(req.user.id, demoAccessToken);

      res.json({
        success: true,
        message: 'WhatsApp Business account connected successfully',
        webhook_url: `${process.env.WEBHOOK_BASE_URL}/webhook/whatsapp/${req.user.id}`,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('WhatsApp connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect WhatsApp Business account',
    });
  }
});

// Disconnect WhatsApp Business
router.post('/disconnect', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query(
        `UPDATE tenants 
         SET whatsapp_phone_number_id = NULL, 
             whatsapp_access_token = NULL, 
             whatsapp_business_account_id = NULL,
             whatsapp_connected = FALSE,
             updated_at = NOW() 
         WHERE id = $1`,
        [req.user.id]
      );

      res.json({
        success: true,
        message: 'WhatsApp Business account disconnected successfully',
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('WhatsApp disconnect error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect WhatsApp Business account',
    });
  }
});

// Get WhatsApp status
router.get('/status', async (req, res) => {
  try {
    res.json({
      success: true,
      connected: req.user.whatsapp_connected,
      webhook_url: req.user.whatsapp_connected 
        ? `${process.env.WEBHOOK_BASE_URL}/webhook/whatsapp/${req.user.id}`
        : null,
    });
  } catch (error) {
    console.error('WhatsApp status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get WhatsApp status',
    });
  }
});

module.exports = router;
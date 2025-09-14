const express = require('express');
const crypto = require('crypto');
const { pool } = require('../config/database');
const { processIncomingMessage } = require('../services/message-processor');

const router = express.Router();

// WhatsApp webhook verification (GET)
router.get('/whatsapp/:tenant_id', async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('Webhook verification request:', { mode, token, challenge, tenant_id: req.params.tenant_id });

  if (mode && token) {
    if (mode === 'subscribe') {
      // Verify the token matches what we stored for this tenant
      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT webhook_verify_token FROM tenants WHERE id = $1',
          [req.params.tenant_id]
        );
        
        if (result.rows.length > 0 && result.rows[0].webhook_verify_token === token) {
          console.log('Webhook verified successfully for tenant:', req.params.tenant_id);
          res.status(200).send(challenge);
        } else {
          console.log('Webhook verification failed - token mismatch');
          res.sendStatus(403);
        }
      } catch (error) {
        console.error('Webhook verification error:', error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

// WhatsApp webhook events (POST)
router.post('/whatsapp/:tenant_id', async (req, res) => {
  const tenantId = req.params.tenant_id;
  const body = req.body;

  try {
    // Verify webhook signature (implement this for production)
    // const signature = req.headers['x-hub-signature-256'];
    // if (!verifyWebhookSignature(body, signature)) {
    //   return res.sendStatus(403);
    // }

    console.log('Webhook received for tenant:', tenantId, JSON.stringify(body, null, 2));

    // Store webhook event
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO webhook_events (tenant_id, event_type, payload) VALUES ($1, $2, $3)',
        [tenantId, 'whatsapp_message', body]
      );
    } finally {
      client.release();
    }

    // Process the webhook
    if (body.entry && body.entry[0] && body.entry[0].changes) {
      for (const change of body.entry[0].changes) {
        if (change.field === 'messages' && change.value.messages) {
          for (const message of change.value.messages) {
            await processIncomingMessage(tenantId, message, change.value.contacts);
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.sendStatus(500);
  }
});

// Verify webhook signature
function verifyWebhookSignature(body, signature) {
  if (!signature || !process.env.WHATSAPP_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature.replace('sha256=', '')),
    Buffer.from(expectedSignature)
  );
}

module.exports = router;
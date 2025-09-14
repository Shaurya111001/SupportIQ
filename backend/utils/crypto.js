const crypto = require('crypto');

function generateWebhookToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

module.exports = {
  generateWebhookToken,
  generateSecureToken
};
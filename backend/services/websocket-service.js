function broadcastToTenant(tenantId, message) {
  // Get WebSocket server instance
  const wss = require('../server').wss;
  
  if (!wss) {
    console.log('WebSocket server not available');
    return;
  }

  // Broadcast to all clients connected for this tenant
  wss.clients.forEach(client => {
    if (client.readyState === 1 && client.tenant_id === tenantId) { // WebSocket.OPEN = 1
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        console.error('WebSocket send error:', error);
      }
    }
  });
}

module.exports = {
  broadcastToTenant
};
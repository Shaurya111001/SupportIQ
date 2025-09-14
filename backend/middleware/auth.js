const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user details from database
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, business_name, email, whatsapp_connected FROM tenants WHERE id = $1',
        [decoded.userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }
      
      req.user = result.rows[0];
      next();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
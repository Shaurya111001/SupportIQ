const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Dummy database client for development
const db = {
  query: async () => {
    // Return dummy data or empty result
    return { rows: [], rowCount: 0 };
  },
  connect: async () => {},
  end: async () => {},
};

// Dummy initDatabase function
async function initDatabase() {
  console.log('Mock database initialized (no real DB connection)');
}

module.exports = { db, initDatabase };
const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'budgetTracker',
    password: 'seq@123',
    port: 5432,
  });

module.exports = pool;

const pool = require('../db/db');

const User = {
  async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async create(name, email, password) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

module.exports = User;

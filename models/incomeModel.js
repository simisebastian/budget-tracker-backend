const pool = require('../db/db');

const Income = {
  async findByUserId(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT i.*, s.name AS source
        FROM income i 
        JOIN income_sources s ON i.source_id = s.id 
        WHERE i.user_id = $1
      `, [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async create(userId, sourceId, amount, date) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO income (user_id, source_id, amount, date) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, sourceId, amount, date]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

module.exports = Income;

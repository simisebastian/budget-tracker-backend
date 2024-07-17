const pool = require('../db/db');

const ExpenseSubSource = {
  async findAll(sourceId) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM expenses_sub_sources WHERE source_id = $1', [sourceId]);
      return result.rows;
    } finally {
      client.release();
    }
  }
};

module.exports = ExpenseSubSource;

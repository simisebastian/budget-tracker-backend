const pool = require('../db/db');

const IncomeSource = {
  async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM income_sources');
      return result.rows;
    } finally {
      client.release();
    }
  }
};

module.exports = IncomeSource;

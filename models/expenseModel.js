const pool = require('../db/db');

const Expense = {
    async findByUserId(userId) {
        const client = await pool.connect();
        try {
          const result = await client.query(`SELECT e.id, e.amount, s.name AS source_name, ss.name AS subsource_name, e.description, e.date
        FROM expense e
        JOIN expenses_sources s ON e.source_id = s.id
        JOIN expenses_sub_sources ss ON e.sub_source_id = ss.id
        WHERE e.user_id = $1`, [userId]);
          return result.rows;
        } finally {
          client.release();
        }
    },

    async create(user_id, amount, category, subCategory, description, date) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO expense (user_id, amount, source_id, sub_source_id, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [user_id, amount, category, subCategory, description, date]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

module.exports = Expense;

const pool = require('../db/db');

const Expense = {
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

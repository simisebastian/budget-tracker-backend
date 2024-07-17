const pool = require('../db/db');


const expenseSource = {
    async findAll() {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT * FROM expenses_sources
            `);
            return result.rows;
        } finally {
            client.release();
        }
    }
}

module.exports = expenseSource;
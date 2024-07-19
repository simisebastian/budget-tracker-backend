const pool = require('../db/db');

const DailyData = {
    async getDailyData(userId) {
        console.log('getDailyData', userId);
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    DATE(date) as date,
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as daily_income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as daily_expense,
                    jsonb_agg(jsonb_build_object(
                        'id', id,
                        'amount', amount,
                        'date', date,
                        'type', type,
                        'source_name', source_name,
                        'sub_source_name', sub_source_name
                    )) as details
                FROM (
                    SELECT i.id, i.date, i.amount, 'income' as type, s.name as source_name, NULL as sub_source_name
                    FROM income i
                    JOIN income_sources s ON i.source_id = s.id
                    WHERE i.user_id = $1
                    UNION ALL
                    SELECT e.id, e.date, e.amount, 'expense' as type, es.name as source_name, ess.name as sub_source_name
                    FROM expense e
                    JOIN expenses_sources es ON e.source_id = es.id
                    JOIN expenses_sub_sources ess ON e.sub_source_id = ess.id
                    WHERE e.user_id = $1
                ) as combined
                GROUP BY DATE(date)
                ORDER BY DATE(date);
            `, [userId]); // Pass userId here
            return result.rows;
        } finally {
            client.release();
        }
    }
}

module.exports = DailyData;

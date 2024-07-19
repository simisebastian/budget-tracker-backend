const DailyData = require('../models/dailyDataModel');

const dailyDataController = {
    async getDailyData(req, res) {
        try {
            const userId = req.user.id;
            console.log("getDailyData", userId);
            const data = await DailyData.getDailyData(userId);
            if (data.length === 0) {
                res.status(200).json({ message: 'Daily data array is empty', data: [] });
            } else {
                res.status(200).json(data);
            }
        } catch (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = dailyDataController;

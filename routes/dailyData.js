const express = require('express');
const dailyDataController = require('../controllers/dailyDataController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.get('/daily-data', authenticateJWT, dailyDataController.getDailyData);

module.exports = router;

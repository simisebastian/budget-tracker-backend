const express = require('express');
const incomeController = require('../controllers/incomeController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.get('/income', authenticateJWT, incomeController.getIncome);
router.get('/income/source', authenticateJWT, incomeController.getIncomeSources);
router.post('/add-income', authenticateJWT, incomeController.addIncome);

module.exports = router;

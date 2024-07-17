const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.get('/expenses/subCategories/:sourceId', authenticateJWT, expenseController.getExpenseSubSources);
router.get('/expenses/categories', authenticateJWT, expenseController.getExpenseSources);   
router.post('/expenses/add', authenticateJWT, expenseController.addExpense);

module.exports = router;

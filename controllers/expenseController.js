const ExpenseSubSource = require('../models/expenseSubSourceModel');
const ExpenseSource = require('../models/expenseSourceModel');
const Expense = require('../models/expenseModel');

const expenseController = { 

  async getExpenseSources(req, res) {
    try {
      const sources = await ExpenseSource.findAll();
      if (sources.length === 0) {
        res.status(200).json({ message: 'Expense source array is empty', data: [] });
      } else {
        res.status(200).json(sources);
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getExpenseSubSources(req, res) {
    try {
      const sourceId = req.params.sourceId; // Ensure the parameter name matches your route
      const subSources = await ExpenseSubSource.findAll(sourceId);
      if (subSources.length === 0) {
        res.status(200).json({ message: 'Expense sub-source array is empty', data: [] });
      } else {
        res.status(200).json(subSources);
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async addExpense(req, res) {
    const { amount, category, subCategory, description, date } = req.body;
    const userId = req.user.id;
    try {
      const newExpense = await Expense.create(userId, amount, category, subCategory, description, date);
      res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

};

module.exports = expenseController;

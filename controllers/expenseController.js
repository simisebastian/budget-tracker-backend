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

  async getExpenses(req, res) {
    try {
      const userId = req.user.id;
      const expenses = await Expense.findByUserId(userId);
      if (expenses.length === 0) {
        res.status(200).json({ message: 'Expense array is empty', data: [] });
      } else {
        const totalAmount = expenses.reduce((acc, row) => acc + parseFloat(row.amount), 0);
        res.status(200).json({ message: 'Expense data retrieved successfully', data: expenses, totalAmount });
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async addExpense(req, res) {
    const { source, sub_source, name, amount, date, account_type } = req.body;
    const userId = req.user.id;
    try {
      const newExpense = await Expense.create(userId, source, sub_source, name, amount, date, account_type);
      res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

};

module.exports = expenseController;

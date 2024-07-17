const ExpenseSubSource = require('../models/expenseSubSourceModel');
const ExpenseSource = require('../models/expenseSourceModel');

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
  }
};

module.exports = expenseController;

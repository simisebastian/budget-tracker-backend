const Income = require('../models/incomeModel');
const IncomeSource = require('../models/incomeSourceModel');

const incomeController = {
  async getIncome(req, res) {
    const userId = req.user.id;
    try {
      const income = await Income.findByUserId(userId);
      if (income.length === 0) {
        res.status(200).json({ message: 'Income array is empty', data: [] });
      } else {
        const totalAmount = income.reduce((acc, row) => acc + parseFloat(row.amount), 0);
        res.status(200).json({ message: 'Income data retrieved successfully', data: income, totalAmount });
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getIncomeSources(req, res) {
    try {
      const sources = await IncomeSource.findAll();
      if (sources.length === 0) {
        res.status(200).json({ message: 'Income source array is empty', data: [] });
      } else {
        res.status(200).json(sources);
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async addIncome(req, res) {
    const { source, amount, date } = req.body;
    const userId = req.user.id;
    try {
      const newIncome = await Income.create(userId, source, amount, date);
      res.status(201).json({ message: 'Income added successfully', income: newIncome });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = incomeController;

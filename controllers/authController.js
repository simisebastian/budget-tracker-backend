const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const authController = {
  async register(req, res) {
    const { fullname, email, password } = req.body;
    try {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create(fullname, email, hashedPassword);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, 'simi123xyz', { expiresIn: '1h' });
      const { password: userPassword, ...userWithoutPassword } = user;
      res.json({ message: 'Login successful', token, user: userWithoutPassword });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = authController;

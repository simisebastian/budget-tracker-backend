const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors'); 


app.use(cors());
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'budgetTracker',
  password: 'seq@123',
  port: 5432,
});

app.use(express.json());
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const queryText = 'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *';
  const values = [name, email, hashedPassword];
  pool.query(queryText, values, async (err, result) => {
    try {
      // const result = await pool.query(queryText, values);
      res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const queryText = 'SELECT * FROM "user" WHERE email = $1';
  const values = [email];

  try {
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, 'simi123xyz', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

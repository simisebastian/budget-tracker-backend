const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const authenticateJWT = require('./auth'); // Adjust the path as needed
const cors = require('cors'); 
const bodyParser = require('body-parser');


const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'budgetTracker',
    password: 'seq@123',
    port: 5432,
  });



// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.post('/api/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if the email already exists
    const emailCheckQuery = 'SELECT * FROM "users" WHERE email = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const queryText = 'INSERT INTO "users" (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [fullname, email, hashedPassword];
    const result = await pool.query(queryText, values);

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error executing query:', err);

    res.status(500).json({ error: 'Internal Server Error' });
    
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const queryText = 'SELECT * FROM "users" WHERE email = $1';
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

    // Exclude password before sending the user details
    const { password: userPassword, ...userWithoutPassword } = user;

    res.json({ message: 'Login successful', token,user: userWithoutPassword });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/income', authenticateJWT, async (req, res) => {
  console.log('Received request from user:', req.user);
  const userId = req.user.id; // Get user ID from the token

  try {
    const result = await pool.query(`
      SELECT i.*, s.name AS source
      FROM income i 
      JOIN income_sources s ON i.source_id = s.id 
      WHERE i.user_id = $1
    `, [userId]);
    // const result = await pool.query('SELECT * FROM income WHERE user_id = $1', [userId]);
    console.log('Query result:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('Income array is empty');
      res.status(200).json({ message: 'Income array is empty', data: [] });
    } else {
      console.log('Returning income data');
      const totalAmount = result.rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);
      res.status(200).json({ message: 'Income data retrieved successfully', data: result.rows, totalAmount });
    }
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/income/source', authenticateJWT, async (req, res) => {
  console.log('Received request from user:', req.user);

  try {
    const result = await pool.query('SELECT * FROM income_sources');
    console.log('Query result:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('Income array is empty');
      res.status(200).json({ message: 'Income source array is empty', data: [] });
    } else {
      console.log('Returning income data');
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/add-income', authenticateJWT, async (req, res) => {
  console.log('Received request from user to add income:', req.body);
  const { source, amount, date } = req.body;
  const userId = req.user.id; // Get user ID from the token

  console.log(source, amount, date, "Received request from user to add income");

  try {
    const result = await pool.query(
      'INSERT INTO income (user_id, source_id, amount, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, source, amount, date]
    );

    console.log('Income added:', result.rows[0]);
    res.status(201).json({ message: 'Income added successfully', income: result.rows[0] });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})



// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
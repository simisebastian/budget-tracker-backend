const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dailyDataRoutes = require('./routes/dailyData');
require('./db/initDB'); // Ensure the database and tables are initialized
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use('/api', authRoutes);
app.use('/api', incomeRoutes);
app.use('/api', expenseRoutes);
app.use('/api', dailyDataRoutes);

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

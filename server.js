const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
require('./db/initDB'); // Ensure the database and tables are initialized

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

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - simple health/info check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library API is running',
    endpoints: {
      books: '/api/books',
      authors: '/api/authors',
    },
  });
});

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

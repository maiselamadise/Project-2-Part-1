require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - simple info check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library API is running',
    endpoints: {
      books: '/api/books',
      authors: '/api/authors',
      docs: '/api-docs',
      health: '/health',
    },
  });
});

// Health check - also reports whether the database connection is up
app.get('/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const database = states[mongoose.connection.readyState] || 'unknown';
  res.status(database === 'connected' ? 200 : 503).json({
    success: database === 'connected',
    status: database === 'connected' ? 'ok' : 'degraded',
    database,
  });
});

// Swagger docs - interactive UI at /api-docs, raw spec at /swagger.json
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/swagger.json', (req, res) => res.status(200).json(swaggerDocument));

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB first, then start accepting requests.
const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
};

// Only start the server when run directly (`node server.js`), so the app can be imported elsewhere.
if (require.main === module) {
  start();
}

module.exports = app;

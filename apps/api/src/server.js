require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const mongoose = require('mongoose');
const { handleAssistantQuery } = require('./assistant/engine');

// Import routes
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const analyticsRouter = require('./routes/analytics');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth =
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      timestamp: new Date(),
      database: {
        status: dbHealth,
        name: mongoose.connection.db
          ? mongoose.connection.db.databaseName
          : 'unknown',
      },
      version: '1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date(),
    });
  }
});

// API Routes
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/dashboard', dashboardRouter);

// Assistant endpoints (integrated directly into server)
// POST /api/assistant/chat - Main assistant chat endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, sessionId, userContext = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        error: {
          message: 'Message is required',
          status: 400,
        },
      });
    }

    // Extract order ID from message if present
    const orderIdMatch = message.match(/([A-Z0-9]{10,})/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    // Prepare context for assistant
    const context = {
      orderId,
      query: message,
      userContext,
    };

    // Process the query through the assistant engine
    const result = await handleAssistantQuery(message, context);

    // Return response in expected format
    res.json({
      success: true,
      data: {
        response: result.text,
        sessionId: sessionId || `session-${Date.now()}`,
        intent: result.intent,
        confidence: 0.9, // High confidence for keyword matching
        citations: result.citations || [],
        functionsCalled: result.functionsCalled || [],
        invalidCitations: result.invalidCitations || [],
      },
    });
  } catch (error) {
    console.error('Assistant chat error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process assistant query',
        status: 500,
      },
    });
  }
});

// GET /api/assistant/health - Assistant health check
app.get('/api/assistant/health', async (req, res) => {
  try {
    // Test basic functionality
    const testResult = await handleAssistantQuery('Hello', {});

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date(),
        testResponse: testResult.text,
        intentsSupported: [
          'policy_question',
          'order_status',
          'product_search',
          'complaint',
          'chitchat',
          'off_topic',
          'violation',
        ],
      },
    });
  } catch (error) {
    console.error('Assistant health check error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Assistant health check failed',
        status: 500,
      },
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);

  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error',
      status: error.status || 500,
      timestamp: new Date(),
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      status: 404,
      timestamp: new Date(),
    },
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});
startServer();

module.exports = app;

const express = require('express');
const database = require('../db');

const router = express.Router();

// GET /api/dashboard/business-metrics
router.get('/business-metrics', async (req, res) => {
  try {
    const db = database.getDb();

    // Get business metrics using aggregation
    const metrics = await Promise.all([
      // Total revenue
      db
        .collection('orders')
        .aggregate([
          { $match: { status: { $ne: 'CANCELLED' } } },
          { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
        ])
        .toArray(),

      // Total orders count
      db.collection('orders').countDocuments({ status: { $ne: 'CANCELLED' } }),

      // Average order value
      db
        .collection('orders')
        .aggregate([
          { $match: { status: { $ne: 'CANCELLED' } } },
          { $group: { _id: null, avgOrderValue: { $avg: '$total' } } },
        ])
        .toArray(),

      // Orders by status
      db
        .collection('orders')
        .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
        .toArray(),
    ]);

    const [
      totalRevenueResult,
      totalOrders,
      avgOrderValueResult,
      ordersByStatus,
    ] = metrics;

    res.json({
      totalRevenue: totalRevenueResult[0]?.totalRevenue || 0,
      totalOrders,
      avgOrderValue: avgOrderValueResult[0]?.avgOrderValue || 0,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/dashboard/performance
router.get('/performance', async (req, res) => {
  try {
    // This would be implemented with actual performance tracking
    // For now, return mock data structure
    res.json({
      apiLatency: {
        avg: 125,
        p95: 250,
        p99: 500,
      },
      sseConnections: 0, // Will be updated when SSE is implemented
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/dashboard/assistant-stats
router.get('/assistant-stats', async (req, res) => {
  try {
    // This would be implemented with actual assistant tracking
    // For now, return mock data structure
    res.json({
      totalQueries: 0,
      intentDistribution: {
        policy_question: 0,
        order_status: 0,
        product_search: 0,
        complaint: 0,
        chitchat: 0,
        off_topic: 0,
        violation: 0,
      },
      functionCalls: {
        getOrderStatus: 0,
        searchProducts: 0,
        getCustomerOrders: 0,
      },
      avgResponseTime: 0,
    });
  } catch (error) {
    console.error('Error fetching assistant stats:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

module.exports = router;

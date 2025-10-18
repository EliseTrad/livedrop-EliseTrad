const express = require('express');
const { Order } = require('../db');

const router = express.Router();

// GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/daily-revenue', async (req, res) => {
  try {
    let { from, to } = req.query;

    // If no dates provided, default to last 30 days
    if (!from || !to) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      from = thirtyDaysAgo.toISOString().split('T')[0];
      to = today.toISOString().split('T')[0];
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // Include the entire 'to' date

    if (isNaN(fromDate) || isNaN(toDate)) {
      return res.status(400).json({
        error: {
          message: 'Invalid date format. Use YYYY-MM-DD',
          status: 400,
        },
      });
    }

    // MongoDB aggregation pipeline for daily revenue calculation
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: fromDate,
            $lte: toDate,
          },
          status: { $ne: 'CANCELLED' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          revenue: { $round: ['$revenue', 2] },
          orderCount: '$orderCount',
        },
      },
      {
        $sort: { date: 1 },
      },
    ];

    const result = await Order.aggregate(pipeline);

    res.json(result);
  } catch (error) {
    console.error('Error fetching daily revenue:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/analytics/summary - Overall business metrics
router.get('/summary', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' },
          statusBreakdown: {
            $push: '$status',
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          totalOrders: 1,
          averageOrderValue: { $round: ['$averageOrderValue', 2] },
          statusBreakdown: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    const summary = result[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      statusBreakdown: [],
    };

    // Count status occurrences
    const statusCounts = {};
    summary.statusBreakdown.forEach((status) => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    res.json({
      ...summary,
      statusBreakdown: statusCounts,
    });
  } catch (error) {
    console.error('Error fetching summary analytics:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/analytics/dashboard - Admin dashboard metrics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total revenue and orders
    const summaryPipeline = [
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
        },
      },
    ];

    const summaryResult = await Order.aggregate(summaryPipeline);
    const { totalRevenue = 0, totalOrders = 0 } = summaryResult[0] || {};

    // Get active customers (customers with orders)
    const activeCustomers = await Order.distinct('customerEmail');
    const activeCustomerCount = activeCustomers.length;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    // Get daily revenue for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenuePipeline = [
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          revenue: { $round: ['$revenue', 2] },
          orderCount: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ];

    const dailyRevenue = await Order.aggregate(dailyRevenuePipeline);

    const dashboardData = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      activeCustomers: activeCustomerCount,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      recentOrders: recentOrders.map((order) => ({
        orderId: order.orderId,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      dailyRevenue,
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard analytics',
    });
  }
});

// GET /api/analytics/assistant - Assistant performance metrics
router.get('/assistant', async (req, res) => {
  try {
    // Mock assistant analytics data for now
    // In a real application, you'd track these metrics in a database
    const assistantAnalytics = {
      totalConversations: 156,
      intentDistribution: {
        policy_question: 45,
        order_status: 38,
        product_search: 32,
        complaint: 18,
        chitchat: 15,
        off_topic: 6,
        violation: 2,
      },
      averageResponseTime: 4,
      functionCalls: {
        getOrderStatus: 38,
        searchProducts: 32,
        getCustomerOrders: 22,
      },
      topQueries: [
        {
          query: 'What is your return policy?',
          count: 12,
          intent: 'policy_question',
        },
        { query: 'Where is my order?', count: 11, intent: 'order_status' },
        {
          query: 'Do you have wireless headphones?',
          count: 9,
          intent: 'product_search',
        },
        { query: 'My package was damaged', count: 8, intent: 'complaint' },
        {
          query: 'How long does shipping take?',
          count: 7,
          intent: 'policy_question',
        },
        { query: 'Can I track my order?', count: 6, intent: 'order_status' },
        {
          query: 'Show me laptops under $1000',
          count: 5,
          intent: 'product_search',
        },
        { query: 'Hello there!', count: 4, intent: 'chitchat' },
        { query: 'What are your hours?', count: 4, intent: 'policy_question' },
        { query: 'I want to cancel my order', count: 3, intent: 'complaint' },
      ],
    };

    res.json({
      success: true,
      data: assistantAnalytics,
    });
  } catch (error) {
    console.error('Assistant analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assistant analytics',
    });
  }
});

module.exports = router;

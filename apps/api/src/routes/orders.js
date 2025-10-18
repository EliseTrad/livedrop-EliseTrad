const express = require('express');
const { Order, Customer, Product } = require('../db');

const router = express.Router();

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // Validation
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Customer ID and items array are required',
          status: 400,
        },
      });
    }

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        error: {
          message: 'Customer not found',
          status: 404,
        },
      });
    }

    // Validate products exist and calculate total
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          error: {
            message: `Product ${item.productId} not found`,
            status: 404,
          },
        });
      }
      total += item.price * item.quantity;
    }

    const order = new Order({
      customerId,
      items,
      total,
      status: 'PENDING',
      carrier: null,
      estimatedDelivery: null,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      orderId: savedOrder._id,
      ...savedOrder.toObject(),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: {
          message: 'Order not found',
          status: 404,
        },
      });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
        details: error.message,
      },
    });
  }
});

// GET /api/orders?customerId=:customerId
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({
        error: {
          message: 'Customer ID is required',
          status: 400,
        },
      });
    }

    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/orders/:id/stream - Server-Sent Events for live order tracking
router.get('/:id/stream', async (req, res) => {
  const { id } = req.params;

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  console.log(`📡 SSE client connected for order ${id}`);

  // Order status progression
  const statusProgression = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  let intervalId;
  let isActive = true;

  try {
    // Get initial order
    const order = await Order.findById(id);
    if (!order) {
      res.write(`data: ${JSON.stringify({ error: 'Order not found' })}\n\n`);
      res.end();
      return;
    }

    // Send initial status
    res.write(
      `data: ${JSON.stringify({
        orderId: order._id,
        status: order.status,
        total: order.total,
        timestamp: new Date(),
        message: `Order ${order.status.toLowerCase()}`,
      })}\n\n`
    );

    // Auto-progress status every 5 seconds
    intervalId = setInterval(async () => {
      if (!isActive) return;

      try {
        const currentOrder = await Order.findById(id);
        if (!currentOrder) {
          res.write(
            `data: ${JSON.stringify({ error: 'Order not found' })}\n\n`
          );
          clearInterval(intervalId);
          res.end();
          return;
        }

        const currentStatusIndex = statusProgression.indexOf(
          currentOrder.status
        );

        // If not at final status, progress to next
        if (currentStatusIndex < statusProgression.length - 1) {
          const nextStatus = statusProgression[currentStatusIndex + 1];

          // Update order in database
          await Order.findByIdAndUpdate(id, {
            status: nextStatus,
            updatedAt: new Date(),
          });

          // Generate realistic updates
          let message = '';
          let estimatedDelivery = null;
          let carrier = currentOrder.carrier;

          switch (nextStatus) {
            case 'PROCESSING':
              message = 'Order is being prepared';
              break;
            case 'SHIPPED':
              message = 'Order has been shipped';
              carrier =
                carrier ||
                ['FedEx', 'UPS', 'DHL'][Math.floor(Math.random() * 3)];
              estimatedDelivery = new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
              ); // 2 days
              await Order.findByIdAndUpdate(id, { carrier, estimatedDelivery });
              break;
            case 'DELIVERED':
              message = 'Order has been delivered';
              break;
          }

          // Send update via SSE
          res.write(
            `data: ${JSON.stringify({
              orderId: id,
              status: nextStatus,
              total: currentOrder.total,
              timestamp: new Date(),
              message,
              carrier,
              estimatedDelivery,
            })}\n\n`
          );

          console.log(`📦 Order ${id} updated to ${nextStatus}`);

          // End stream when delivered
          if (nextStatus === 'DELIVERED') {
            setTimeout(() => {
              if (isActive) {
                res.write(
                  `data: ${JSON.stringify({
                    orderId: id,
                    status: 'COMPLETED',
                    message: 'Thank you for your purchase!',
                    timestamp: new Date(),
                    final: true,
                  })}\n\n`
                );
                clearInterval(intervalId);
                res.end();
                isActive = false;
                console.log(`✅ SSE stream completed for order ${id}`);
              }
            }, 3000);
          }
        }
      } catch (error) {
        console.error('SSE update error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Update failed' })}\n\n`);
      }
    }, Math.random() * 4000 + 3000); // Random interval 3-7 seconds
  } catch (error) {
    console.error('SSE initialization error:', error);
    res.write(
      `data: ${JSON.stringify({ error: 'Stream initialization failed' })}\n\n`
    );
    res.end();
  }

  // Handle client disconnect
  req.on('close', () => {
    console.log(`📡 SSE client disconnected for order ${id}`);
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  req.on('end', () => {
    console.log(`📡 SSE client ended for order ${id}`);
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
});

module.exports = router;

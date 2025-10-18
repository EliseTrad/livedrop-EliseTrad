// SSE order status stream with auto-status progression
const express = require('express');
const { Order } = require('../db');
const router = express.Router();

// Helper: simulate status progression
const STATUS_FLOW = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const STATUS_DELAYS = [4000, 6000, 6000]; // ms for each step

router.get('/api/orders/:id/stream', async (req, res) => {
  const orderId = req.params.id;
  let order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  let currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  if (currentStatusIndex === -1) currentStatusIndex = 0;

  function sendStatus(status) {
    res.write(
      `data: ${JSON.stringify({
        status,
        carrier: order.carrier,
        eta: order.estimatedDelivery,
      })}\n\n`
    );
  }

  sendStatus(order.status); // Send current status immediately

  let closed = false;
  req.on('close', () => {
    closed = true;
  });

  async function progress() {
    if (closed) return;
    if (currentStatusIndex < STATUS_FLOW.length - 1) {
      await new Promise((r) =>
        setTimeout(r, STATUS_DELAYS[currentStatusIndex])
      );
      currentStatusIndex++;
      order.status = STATUS_FLOW[currentStatusIndex];
      await order.save();
      sendStatus(order.status);
      if (order.status !== 'DELIVERED') {
        progress();
      } else {
        res.end();
      }
    } else {
      res.end();
    }
  }
  progress();
});

module.exports = router;

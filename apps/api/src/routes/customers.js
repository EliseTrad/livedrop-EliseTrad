const express = require('express');
const { Customer } = require('../db');
const { ObjectId } = require('mongoose').Types;

const router = express.Router();

// GET /api/customers?email=user@example.com - Look up customer by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: {
          message: 'Email parameter is required',
          status: 400,
        },
      });
    }

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({
        error: {
          message: 'Customer not found',
          status: 404,
        },
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

// GET /api/customers/:id - Get customer profile by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          message: 'Invalid customer ID',
          status: 400,
        },
      });
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        error: {
          message: 'Customer not found',
          status: 404,
        },
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
      },
    });
  }
});

module.exports = router;

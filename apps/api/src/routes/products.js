const express = require('express');
const { Product } = require('../db');

const router = express.Router();

// GET /api/products?search=&tag=&sort=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      tag = '',
      sort = 'name',
      page = 1,
      limit = 30,
    } = req.query;

    // Build query
    let query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name':
      default:
        sortOption = { name: 1 };
        break;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query with Mongoose
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('❌ Products GET error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch products',
        details: error.message,
        timestamp: new Date(),
      },
    });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404,
        },
      });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ Product GET by ID error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch product',
        details: error.message,
        timestamp: new Date(),
      },
    });
  }
});

module.exports = router;

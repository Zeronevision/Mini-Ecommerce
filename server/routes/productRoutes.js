const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.post('/', async (req, res) => {
  const { name, price, image, description } = req.body;
  
  try {
    const product = await Product.create({ name, price, image, description });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

module.exports = router;
const express = require('express');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, products: [{ product: productId, quantity }] });
    } else {
      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart' });
  }
});

router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});

module.exports = router;
const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items' });
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const p = await Product.findById(item.product);
      if (!p) return res.status(404).json({ message: `Product not found` });
      if (p.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock: ${p.name}` });
      orderItems.push({ product: p._id, name: p.name, price: p.price, quantity: item.quantity, image: p.images?.[0] || '' });
      subtotal += p.price * item.quantity;
      p.stock -= item.quantity;
      await p.save();
    }
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && coupon.usedCount < coupon.maxUses) {
        discount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
        discount = Math.min(discount, subtotal);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
    const order = await Order.create({ user: req.user._id, items: orderItems, shippingAddress, subtotal, discount, couponCode, totalPrice: subtotal - discount, notes });
    const Cart = mongoose.models.Cart;
    if (Cart) await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/my', protect, async (req, res) => {
  try { res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Multer setup
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// All admin routes require auth + admin
router.use(protect, adminOnly);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email')
    ]);
    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders: orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    data.price = Number(data.price);
    data.stock = Number(data.stock);
    data.itar = data.itar === 'true' || data.itar === true;
    data.featured = data.featured === 'true' || data.featured === true;
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (data.price) data.price = Number(data.price);
    if (data.stock !== undefined) data.stock = Number(data.stock);
    if (data.itar !== undefined) data.itar = data.itar === 'true' || data.itar === true;
    if (data.featured !== undefined) data.featured = data.featured === 'true' || data.featured === true;
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, recentOrders, revenue] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }])
    ]);
    res.json({ totalProducts, totalOrders, totalUsers, totalRevenue: revenue[0]?.total || 0, recentOrders });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Products CRUD
router.get('/products', async (req, res) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) data.images = req.files.map(f => `/uploads/${f.filename}`);
    data.price = +data.price; data.stock = +data.stock;
    if (data.originalPrice) data.originalPrice = +data.originalPrice;
    data.featured = data.featured === 'true';
    if (data.tags) data.tags = data.tags.split(',').map(t => t.trim());
    res.status(201).json(await Product.create(data));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) data.images = req.files.map(f => `/uploads/${f.filename}`);
    if (data.price) data.price = +data.price;
    if (data.stock !== undefined) data.stock = +data.stock;
    if (data.originalPrice) data.originalPrice = +data.originalPrice;
    if (data.featured !== undefined) data.featured = data.featured === 'true';
    if (data.tags) data.tags = data.tags.split(',').map(t => t.trim());
    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const q = status && status !== 'all' ? { status } : {};
    const total = await Order.countDocuments(q);
    const orders = await Order.find(q).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { ...(status && { status }), ...(paymentStatus && { paymentStatus }) }, { new: true }).populate('user', 'name email');
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Users
router.get('/users', async (req, res) => {
  try { res.json(await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

// Coupons CRUD
router.get('/coupons', async (req, res) => {
  try { res.json(await Coupon.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/coupons', async (req, res) => {
  try {
    const data = { ...req.body, code: req.body.code.toUpperCase() };
    if (data.discountValue) data.discountValue = +data.discountValue;
    if (data.minOrderValue) data.minOrderValue = +data.minOrderValue;
    if (data.maxUses) data.maxUses = +data.maxUses;
    res.status(201).json(await Coupon.create(data));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/coupons/:id', async (req, res) => {
  try { await Coupon.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

// Reviews
router.get('/reviews', async (req, res) => {
  try { res.json(await Review.find().populate('user', 'name').populate('product', 'name').sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

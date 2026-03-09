const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 12, sort } = req.query;
    const q = {};
    if (search) q.$text = { $search: search };
    if (category && category !== 'all') q.category = category;
    if (minPrice || maxPrice) { q.price = {}; if (minPrice) q.price.$gte = +minPrice; if (maxPrice) q.price.$lte = +maxPrice; }
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { avgRating: -1 };
    const total = await Product.countDocuments(q);
    const products = await Product.find(q).sort(sortObj).skip((page - 1) * limit).limit(+limit);
    res.json({ products, total, pages: Math.ceil(total / limit), page: +page });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/featured', async (req, res) => {
  try { res.json(await Product.find({ featured: true }).limit(8)); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/categories', async (req, res) => {
  try { res.json(await Product.distinct('category')); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

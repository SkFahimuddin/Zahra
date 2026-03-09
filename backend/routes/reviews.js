const router = require('express').Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  await Product.findByIdAndUpdate(productId, { avgRating: Math.round(avg * 10) / 10, numReviews: reviews.length });
};

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/product/:productId', protect, async (req, res) => {
  try {
    const { rating, title, body } = req.body;
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) {
      existing.rating = rating; existing.title = title; existing.body = body;
      await existing.save();
    } else {
      await Review.create({ product: req.params.productId, user: req.user._id, rating, title, body });
    }
    await updateProductRating(req.params.productId);
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const pid = review.product;
    await review.deleteOne();
    await updateProductRating(pid);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

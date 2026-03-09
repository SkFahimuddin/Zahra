const router = require('express').Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

router.get('/', protect, async (req, res) => {
  try {
    const w = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(w || { products: [] });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/toggle/:productId', protect, async (req, res) => {
  try {
    let w = await Wishlist.findOne({ user: req.user._id });
    if (!w) w = new Wishlist({ user: req.user._id, products: [] });
    const pid = req.params.productId;
    const idx = w.products.findIndex(p => p.toString() === pid);
    let added;
    if (idx > -1) { w.products.splice(idx, 1); added = false; }
    else { w.products.push(pid); added = true; }
    await w.save();
    res.json({ added, productId: pid });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

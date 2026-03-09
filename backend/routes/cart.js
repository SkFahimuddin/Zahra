const router = require('express').Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 } }]
}, { timestamps: true });
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

const getCart = uid => Cart.findOne({ user: uid }).populate('items.product');

router.get('/', protect, async (req, res) => {
  try { const c = await getCart(req.user._id); res.json(c || { items: [] }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) cart.items[idx].quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    res.json(await getCart(req.user._id));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) { if (quantity <= 0) cart.items.splice(idx, 1); else cart.items[idx].quantity = quantity; }
    await cart.save();
    res.json(await getCart(req.user._id));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(await getCart(req.user._id));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/clear', protect, async (req, res) => {
  try { await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }); res.json({ message: 'Cart cleared' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

const router = require('express').Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

router.post('/validate', protect, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon limit reached' });
    if (orderTotal < coupon.minOrderValue) return res.status(400).json({ message: `Minimum order value is $${coupon.minOrderValue}` });
    const discount = coupon.discountType === 'percentage'
      ? (orderTotal * coupon.discountValue) / 100
      : coupon.discountValue;
    res.json({ valid: true, discount: Math.min(discount, orderTotal), coupon });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

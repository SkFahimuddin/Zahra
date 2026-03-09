const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, quantity: Number, image: String
  }],
  shippingAddress: { street: String, city: String, state: String, zip: String, country: String },
  subtotal: Number,
  discount: { type: Number, default: 0 },
  couponCode: String,
  totalPrice: Number,
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid','paid'], default: 'unpaid' },
  notes: String
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);

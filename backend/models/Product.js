const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true, enum: ['Attar', 'Oud & Bakhoor', 'Gift Sets', 'Accessories'] },
  images: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  tags: [String],
  volume: String,
  concentration: String,
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });
productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });
module.exports = mongoose.model('Product', productSchema);

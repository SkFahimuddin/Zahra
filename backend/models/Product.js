const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  itar: { type: Boolean, default: true }, // ITAR controlled flag
  partNumber: { type: String, trim: true },
  manufacturer: { type: String, trim: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text', manufacturer: 'text' });

module.exports = mongoose.model('Product', productSchema);

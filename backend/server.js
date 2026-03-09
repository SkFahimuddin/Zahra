const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews',  require('./routes/reviews'));
app.use('/api/coupons',  require('./routes/coupons'));
app.use('/api/admin',    require('./routes/admin'));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/itar_perfume')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seedAdmin();
    await seedSampleProducts();
  })
  .catch(err => console.error('MongoDB Error:', err));

async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const email = process.env.ADMIN_EMAIL || 'admin@itar.com';
  if (!(await User.findOne({ email }))) {
    await User.create({ name: 'Admin', email, password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10), role: 'admin' });
    console.log('✅ Admin seeded:', email);
  }
}

async function seedSampleProducts() {
  const Product = require('./models/Product');
  if ((await Product.countDocuments()) > 0) return;
  const samples = [
    { name: 'Oud Al Layl', description: 'A deep, smoky oud from the forests of Assam, aged for 12 years. Rich woody base with hints of amber and musk.', price: 299, category: 'Oud & Bakhoor', stock: 25, featured: true, tags: ['oud','dark','smoky'], volume: '12ml', concentration: 'Pure Attar' },
    { name: 'Rose Taifi', description: 'The legendary Taif rose captured in its purest form. Delicate floral with a warm honeyed finish.', price: 189, category: 'Attar', stock: 40, featured: true, tags: ['floral','rose','light'], volume: '6ml', concentration: 'Pure Attar' },
    { name: 'Musk Al Haramain', description: 'A white musk of ethereal softness. Clean, powdery and intensely personal.', price: 149, category: 'Attar', stock: 60, featured: true, tags: ['musk','clean','white'], volume: '6ml', concentration: 'Pure Attar' },
    { name: 'Bakhoor Malaki', description: 'Royal bakhoor chips crafted from the finest oud, rose water, and sandalwood. Perfect for home fragrance rituals.', price: 89, category: 'Oud & Bakhoor', stock: 50, featured: true, tags: ['bakhoor','incense','home'], volume: '50g', concentration: 'Bakhoor' },
    { name: 'Amber Oud Gift Set', description: 'A curated trio of our most beloved fragrances — Oud Al Layl, Rose Taifi, and Musk Al Haramain — presented in a hand-crafted wooden box.', price: 549, category: 'Gift Sets', stock: 15, featured: true, tags: ['gift','set','luxury'], volume: '3x6ml', concentration: 'Pure Attar' },
    { name: 'Crystal Attar Bottle', description: 'Hand-blown crystal dabba with 24k gold stopper. The perfect vessel for your finest attars.', price: 75, category: 'Accessories', stock: 30, featured: false, tags: ['bottle','crystal','accessory'], volume: '6ml bottle', concentration: 'Accessory' },
  ];
  await Product.insertMany(samples);
  console.log('✅ Sample products seeded');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

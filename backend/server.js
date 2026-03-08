const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/itar_ecom')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seedAdmin();
  })
  .catch(err => console.error('MongoDB Error:', err));

// Seed admin user on startup
async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@itar.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin'
    });
    console.log(`✅ Admin seeded: ${adminEmail}`);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

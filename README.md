# ITAR — Arabian Perfumes E-Commerce

A full-stack luxury Arabic perfume store. Gold on black aesthetic. Built with Node.js + Express + MongoDB + React.

## 🚀 Deploy on Render (Full-Stack, Single Service)

### 1. MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Database Access → add user with username/password
3. Network Access → add IP `0.0.0.0/0`
4. Connect → Drivers → copy connection string

### 2. Push to GitHub
Push this entire folder to a GitHub repository.

### 3. Deploy on Render
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** *(leave empty)*
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
4. Environment Variables:
   ```
   MONGO_URI         = mongodb+srv://...your atlas URI...
   JWT_SECRET        = some_long_random_string_here
   ADMIN_EMAIL       = admin@itar.com
   ADMIN_PASSWORD    = Admin@123
   NODE_ENV          = production
   PORT              = 10000
   ```
5. Click **Deploy**

That's it! Your app will be live at `https://your-app.onrender.com`

## 💻 Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit with your MongoDB URI
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start              # http://localhost:3000
```

## Default Admin
- **Email:** admin@itar.com
- **Password:** Admin@123

## Features
- 🛍️ Shop — Browse Attar, Oud & Bakhoor, Gift Sets, Accessories
- 🔍 Search — Full-text search across products
- ❤️ Wishlist — Save favorite fragrances
- ⭐ Reviews — Star ratings and written reviews
- 🏷️ Coupons — Percentage or fixed discount codes
- 🛒 Cart + Checkout — Persistent cart with coupon support
- 📦 Order History — Track all orders
- 🔐 Admin Panel — Products, Orders, Customers, Coupons

## Tech Stack
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Multer
- **Frontend:** React 18, React Router v6, Axios, React Hot Toast
- yesss
- 

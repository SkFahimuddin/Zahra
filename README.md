# ITAR Defense Supply — E-Commerce Website

A full-stack e-commerce platform for ITAR-controlled defense and aerospace components.

## Tech Stack
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React + React Router
- **Auth**: JWT with bcrypt
- **File Upload**: Multer

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB running locally (`mongod`) OR MongoDB Atlas URI
- npm or yarn

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

The backend runs on **http://localhost:5000**

**Default Admin credentials:**
- Email: `admin@itar.com`
- Password: `Admin@123`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs on **http://localhost:3000**

---

### 3. Configure `.env` (backend)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/itar_ecom
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@itar.com
ADMIN_PASSWORD=Admin@123
```

---

## 📱 Pages & Features

### Customer Side
| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured products, categories |
| `/shop` | Browse all products with search & category filter |
| `/product/:id` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with shipping address |
| `/orders` | My order history |
| `/login` | Login page (redirects admin to `/admin`) |
| `/register` | Register with ITAR certification checkbox |

### Admin Side (login with admin credentials)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with stats & recent orders |
| `/admin/products` | Add, edit, delete products with image upload |
| `/admin/orders` | View all orders, update status & payment |
| `/admin/users` | View all registered users |

---

## 🗄️ Database Models

- **User** — name, email, password (hashed), role (user/admin), address
- **Product** — name, description, price, category, image, stock, itar flag, partNumber, manufacturer, featured
- **Order** — user ref, items[], shippingAddress, totalPrice, status, paymentStatus
- **Cart** — user ref, items[] with product ref + quantity

---

## 🔐 Security Notes

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt (10 rounds)
- Admin routes protected by role middleware
- ITAR compliance notice on all purchase flows
- Only US shipping addresses accepted at checkout

---

## 📦 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Products (public)
- `GET /api/products` — list with ?search=, ?category=, ?page=, ?limit=
- `GET /api/products/featured`
- `GET /api/products/categories`
- `GET /api/products/:id`

### Cart (protected)
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/:productId`
- `DELETE /api/cart/clear`

### Orders (protected)
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/:id`

### Admin (admin only)
- `GET /api/admin/dashboard`
- `GET/POST /api/admin/products`
- `PUT/DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id`
- `GET /api/admin/users`

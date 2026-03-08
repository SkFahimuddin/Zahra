import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminLayout from './pages/admin/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Admin routes - no main navbar */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/users" element={<AdminUsers />} />
              </Routes>
            </AdminLayout>
          </AdminRoute>
        } />

        {/* Public routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Create from './pages/Create';
import Details from './pages/Details';
import Edit from './pages/Edit';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import AdminGuard from './components/AdminGuard';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'white' }}>
      <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Page not found</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>That page doesn't exist.</p>
      <Link to="/" style={{ color: '#e63946', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
        Back to home
      </Link>
    </div>
  );
}

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<AdminGuard><Create /></AdminGuard>} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/edit/:id" element={<AdminGuard><Edit /></AdminGuard>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<AdminGuard><Orders /></AdminGuard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AdminProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AdminProvider>
    </Router>
  );
}

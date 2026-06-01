import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Spinner } from './components/common';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { OrdersPage, OrderDetailPage } from './pages/OrderPages';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<div className="text-center py-20"><p className="text-5xl mb-4">404</p><p className="text-gray-500">Trang không tìm thấy</p></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

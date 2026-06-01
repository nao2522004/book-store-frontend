import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/books?keyword=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-amber-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <span className="text-2xl">📚</span>
            <span className="hidden sm:inline font-serif">BookStore</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm sách, tác giả..."
                className="w-full pl-4 pr-10 py-2 rounded-full bg-amber-800 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300 hover:text-white">
                🔍
              </button>
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-white hover:text-amber-300 transition-colors">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50" onMouseLeave={() => setUserMenu(false)}>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50" onClick={() => setUserMenu(false)}>📦 Đơn hàng của tôi</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50" onClick={() => setUserMenu(false)}>👤 Hồ sơ</Link>
                    {user.roles?.includes('ADMIN') && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50" onClick={() => setUserMenu(false)}>⚙️ Quản trị</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={() => { logout(); setUserMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-white text-sm hover:text-amber-300 transition-colors font-medium">Đăng nhập</Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors">Đăng ký</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {menuOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm sách..."
                className="flex-1 px-4 py-2 rounded-l-full bg-amber-800 text-white placeholder-amber-300 focus:outline-none text-sm"
              />
              <button type="submit" className="px-4 py-2 bg-amber-500 rounded-r-full text-white text-sm">Tìm</button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

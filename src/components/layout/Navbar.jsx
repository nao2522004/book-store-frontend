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
    <nav className="sticky top-0 z-50 bg-[#FAF5EC]/90 backdrop-blur-xl border-b border-[#D4C4A8]/70 text-[#2C2114] select-none shadow-[0_4px_30px_rgba(38,28,18,0.06)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">


          <Link to="/" className="flex items-center gap-2.5 tracking-[0.25em] font-medium transition-all duration-300 hover:opacity-90 group">
            <span className="text-xl text-[#8B6508] transition-transform duration-500 group-hover:rotate-180">❖</span>
            <span className="text-lg md:text-xl uppercase font-bold text-[#140E0A] group-hover:text-[#8B6508] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
              Bibliotheca
            </span>
          </Link>


          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-12 group">
            <div className="relative w-full border-b border-[#2C2114]/30 focus-within:border-[#8B6508] transition-all duration-300 pb-1.5 flex items-center">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm kinh điển, tác phẩm..."
                className="w-full bg-transparent pl-1 pr-8 text-sm focus:outline-none placeholder-[#A8967E]/70 font-serif italic text-[#140E0A]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              />
              <button type="submit" className="absolute right-1 text-[#2C2114]/40 group-focus-within:text-[#8B6508] text-xs transition-colors duration-300 hover:scale-120">
                ✦
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6">

            <Link to="/cart" className="relative p-1.5 text-[#2C2114] hover:text-[#8B6508] transition-all duration-300 group flex items-center">
              <span className="text-xs font-bold tracking-[0.15em] uppercase hidden lg:inline mr-2.5 border-b border-transparent group-hover:border-[#8B6508]/40 pb-0.5 transition-all" style={{ fontFamily: "'Cinzel', serif" }}>
                Túi Sách
              </span>
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#8B6508] text-[#FAF5EC] text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-[#FAF5EC] shadow-sm animate-pulse">
                    {totalItems > 99 ? '99' : totalItems}
                  </span>
                )}
              </div>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2.5 hover:text-[#8B6508] transition-colors focus:outline-none py-1 group"
                >
                  <div className="w-8 h-8 rounded-none border border-[#8B6508]/60 bg-[#F3EFE6] flex items-center justify-center text-xs font-bold shadow-sm group-hover:border-[#8B6508] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-[#140E0A] group-hover:text-[#8B6508]" style={{ fontFamily: "'Cinzel', serif" }}>
                    {user.name}
                  </span>
                </button>

                {userMenu && (
                  <div
                    className="absolute right-0 mt-3 w-52 bg-[#FAF5EC] border border-[#D4C4A8] shadow-[0_10px_30px_rgba(38,28,18,0.12)] rounded-[1px] py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setUserMenu(false)}
                  >
                    <div className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-[#A8967E] border-b border-[#D4C4A8]/30 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                      Quyền Trượng Học Giả
                    </div>
                    <Link to="/orders" className="block px-4 py-2.5 text-xs uppercase tracking-wide text-[#3E2F1A] hover:bg-[#F3EFE6]/70 hover:text-[#8B6508] transition-colors" style={{ fontFamily: "'Cinzel', serif" }} onClick={() => setUserMenu(false)}>
                      Khảo Đơn Hàng
                    </Link>
                    <Link to="/profile" className="block px-4 py-2.5 text-xs uppercase tracking-wide text-[#3E2F1A] hover:bg-[#F3EFE6]/70 hover:text-[#8B6508] transition-colors" style={{ fontFamily: "'Cinzel', serif" }} onClick={() => setUserMenu(false)}>
                      Hồ Sơ Độc Giả
                    </Link>
                    {user.roles?.includes('ADMIN') && (
                      <Link to="/admin" className="block px-4 py-2.5 text-xs uppercase tracking-wide text-[#8B6508] bg-[#8B6508]/5 hover:bg-[#8B6508]/10 font-bold" style={{ fontFamily: "'Cinzel', serif" }} onClick={() => setUserMenu(false)}>
                        Biện Giám (Admin)
                      </Link>
                    )}
                    <hr className="my-1.5 border-[#D4C4A8]/50" />
                    <button
                      onClick={() => { logout(); setUserMenu(false); }}
                      className="block w-full text-left px-4 py-2.5 text-xs uppercase tracking-wide text-red-800 hover:bg-red-50/60 font-semibold transition-colors"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Rời Thư Viện
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5 text-xs uppercase tracking-[0.15em] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                <Link to="/login" className="hover:text-[#8B6508] text-[#3E2F1A] transition-colors duration-200">
                  Đăng nhập
                </Link>
                <Link to="/register" className="border-2 border-[#8B6508] bg-[#8B6508] text-white px-5 py-2 hover:bg-transparent hover:text-[#8B6508] shadow-md hover:shadow-none transition-all duration-300 rounded-[1px]">
                  Đăng ký
                </Link>
              </div>
            )}

            <button className="md:hidden p-1 text-xl text-[#2C2114] hover:text-[#8B6508] focus:outline-none transition-transform active:scale-95" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-5 pt-2 border-t border-[#D4C4A8]/40 space-y-3">
            <form onSubmit={handleSearch} className="flex border-b-2 border-[#2C2114]/60 focus-within:border-[#8B6508] transition-colors pb-1 mx-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm tác phẩm tâm đắc..."
                className="flex-1 bg-transparent px-1 py-2 text-sm focus:outline-none placeholder-[#A8967E] font-serif italic"
              />
              <button type="submit" className="px-3 text-xs font-bold uppercase tracking-wider text-[#2C2114]" style={{ fontFamily: "'Cinzel', serif" }}>
                TRA
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, PLACEHOLDER_BOOK } from '../utils';
import { Spinner } from '../components/common';

export default function CartPage() {
  const { cart, loading, totalPrice, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="bg-[#FAF5EC] min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#FAF5EC] border border-[#D4C4A8] p-8 text-center shadow-sm relative">
        <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />
        <span className="inline-block text-2xl text-[#8B6508] mb-4">❖</span>
        <h2 className="text-lg font-serif font-bold text-[#140E0A] uppercase tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Yêu Cầu Kiến Danh
        </h2>
        <p className="text-stone-500 text-xs font-serif italic mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Vui lòng thông quan nhập cảnh để kiểm tra thư mục tàng thư cá nhân của bạn.
        </p>
        <Link
          to="/login"
          className="relative inline-block bg-[#8B6508] text-[#FAF5EC] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-[1px] transition-all duration-300 hover:bg-[#2C2114] hover:tracking-[0.22em] shadow-sm group"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span className="absolute inset-1 border border-[#FAF5EC]/10 pointer-events-none" />
          Đăng Nhập Ngay
        </Link>
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center py-28 bg-[#FAF5EC] min-h-screen"><Spinner size="lg" /></div>;

  const items = cart?.items || [];

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#2C2114] selection:bg-[#E6CE9A]/50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#140E0A] tracking-wide border-b border-[#D4C4A8] pb-5 mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Túi Sách Thu Thập
          <span className="text-xs uppercase tracking-widest text-[#8B6508] font-bold bg-[#8B6508]/5 border border-[#8B6508]/20 px-2.5 py-0.5 rounded-[1px]" style={{ fontFamily: "'Cinzel', serif" }}>
            {items.length} Quyển
          </span>
        </h1>

        {items.length === 0 ? (
          <div className="bg-[#FAF5EC] border border-[#D4C4A8] py-20 px-4 text-center shadow-sm relative">
            <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />
            <span className="inline-block text-3xl text-[#A8967E] mb-4">❖</span>
            <h2 className="text-lg font-serif font-bold text-[#140E0A] uppercase tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Túi Sách Hiện Trống
            </h2>
            <p className="text-stone-500 text-xs font-serif italic mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Chưa có mộc bản hay kinh điển nào được lựa chọn lưu giữ.
            </p>
            <Link
              to="/books"
              className="relative inline-block bg-[#8B6508] text-[#FAF5EC] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-[1px] transition-all duration-300 hover:bg-[#2C2114] hover:tracking-[0.22em] shadow-sm group"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <span className="absolute inset-1 border border-[#FAF5EC]/10 pointer-events-none" />
              Quay Lại Tầm Thư
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.bookId} className="bg-[#FAF5EC] border border-[#D4C4A8] p-5 flex gap-5 items-start shadow-sm relative">
                  <div className="absolute inset-1 border border-[#8B6508]/5 pointer-events-none" />

                  <Link to={`/books/${item.bookId}`} className="flex-shrink-0 border border-[#D4C4A8]/60 p-1.5 bg-white aspect-[3/4] w-20">
                    <img
                      // B2: backend trả bookCoverUrl (không phải coverImageUrl)
                      src={item.bookCoverUrl || PLACEHOLDER_BOOK}
                      alt={item.bookTitle}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch relative z-10">
                    <div>
                      <Link
                        to={`/books/${item.bookId}`}
                        className="font-serif font-bold text-base text-[#140E0A] hover:text-[#8B6508] transition-colors line-clamp-1 block mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.bookTitle}
                      </Link>
                      {/* B2: backend trả unitPrice (không phải price) */}
                      <p className="text-xs uppercase tracking-wider font-bold text-[#8B6508]" style={{ fontFamily: "'Cinzel', serif" }}>
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-end justify-between pt-4 mt-2 border-t border-[#D4C4A8]/30">
                      <div className="flex items-center border border-[#D4C4A8] bg-[#FAF5EC] h-8 px-0.5 rounded-[1px]">
                        <button
                          onClick={() => item.quantity > 1 ? updateItem(item.bookId, item.quantity - 1) : removeItem(item.bookId)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-stone-500 hover:text-[#8B6508] hover:bg-[#8B6508]/5 font-bold transition-colors focus:outline-none"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold text-[#140E0A] w-8 text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.bookId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-stone-500 hover:text-[#8B6508] hover:bg-[#8B6508]/5 font-bold transition-colors focus:outline-none"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-5">
                        {/* B2: dùng unitPrice */}
                        <span className="font-bold text-sm text-[#2C2114]" style={{ fontFamily: "'Cinzel', serif" }}>
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.bookId)}
                          className="text-[11px] uppercase tracking-widest font-bold text-stone-400 hover:text-red-800 transition-colors focus:outline-none border-b border-transparent hover:border-red-800/30 pb-0.5"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Tẩy trừ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={clearCart}
                  className="text-[11px] uppercase tracking-widest font-bold text-stone-400 hover:text-red-800 transition-all duration-300 focus:outline-none border-b border-transparent hover:border-red-800/40 pb-0.5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ✕ Tẩy trống toàn bộ túi sách
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#FAF5EC] border-2 border-[#2C2114]/80 p-6 sticky top-28 shadow-md relative">
                <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />

                <h2 className="font-serif font-bold text-lg text-[#140E0A] uppercase tracking-wide border-b border-[#D4C4A8] pb-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Tổng Kê Sách Quy
                </h2>

                <div className="space-y-3 text-xs uppercase tracking-wider font-bold text-stone-600" style={{ fontFamily: "'Cinzel', serif" }}>
                  <div className="flex justify-between items-center">
                    <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} cuốn)</span>
                    <span className="text-[#2C2114] font-sans font-normal text-xs">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Phí chuyển thư</span>
                    <span className="text-emerald-700 font-extrabold">Miễn ngân</span>
                  </div>
                </div>

                <div className="border-t border-[#D4C4A8] pt-4 mt-4 flex justify-between items-baseline font-bold text-[#2C2114]">
                  <span className="text-xs uppercase tracking-widest font-extrabold" style={{ fontFamily: "'Cinzel', serif" }}>Tổng ngân chung</span>
                  <span className="text-xl text-[#8B6508]" style={{ fontFamily: "'Cinzel', serif" }}>{formatPrice(totalPrice)}</span>
                </div>

                <div className="pt-6 space-y-4">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="relative w-full h-12 bg-transparent text-[#2C2114] border border-[#2C2114] font-bold text-xs uppercase tracking-[0.2em] rounded-[1px] overflow-hidden transition-all duration-350 before:absolute before:inset-0 before:bg-[#2C2114] before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300 before:ease-out hover:text-[#FAF5EC] flex items-center justify-center z-10 focus:outline-none"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <span className="relative z-20">
                      Tiến Hành Trả Ngân ➔
                    </span>
                  </button>

                  <Link
                    to="/books"
                    className="block text-center text-xs uppercase tracking-[0.15em] font-extrabold text-[#8B6508] hover:text-[#A67B1E] transition-all hover:tracking-[0.2em] pt-1"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    ✦ Tiếp Tục Tầm Thư
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

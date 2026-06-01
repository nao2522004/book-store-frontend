import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, PLACEHOLDER_BOOK } from '../utils';
import { Spinner, Empty } from '../components/common';

export default function CartPage() {
  const { cart, loading, totalPrice, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🔐</p>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h2>
      <p className="text-gray-500 mb-6">Đăng nhập để xem giỏ hàng của bạn</p>
      <Link to="/login" className="bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">Đăng nhập</Link>
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const items = cart?.items || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-6">🛒 Giỏ hàng ({items.length} sản phẩm)</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Thêm sách yêu thích vào giỏ hàng nhé!</p>
          <Link to="/books" className="bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.bookId} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start">
                <Link to={`/books/${item.bookId}`} className="flex-shrink-0">
                  <img
                    src={item.coverImageUrl || PLACEHOLDER_BOOK}
                    alt={item.bookTitle}
                    className="w-16 h-20 object-cover rounded-xl"
                    onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.bookId}`} className="font-semibold text-gray-800 hover:text-amber-700 text-sm line-clamp-2 block mb-1">{item.bookTitle}</Link>
                  <p className="text-amber-700 font-bold text-sm mb-3">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => item.quantity > 1 ? updateItem(item.bookId, item.quantity - 1) : removeItem(item.bookId)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 font-medium">−</button>
                      <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateItem(item.bookId, item.quantity + 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 font-medium">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800 text-sm">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.bookId)} className="text-red-400 hover:text-red-600 transition-colors text-lg">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
              🗑️ Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
              <h2 className="font-bold text-gray-800 text-lg">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({items.reduce((s,i) => s + i.quantity, 0)} sản phẩm)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
                <span>Tổng cộng</span>
                <span className="text-amber-700 text-lg">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Tiến hành thanh toán →
              </button>
              <Link to="/books" className="block text-center text-sm text-amber-700 hover:text-amber-900 font-medium">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

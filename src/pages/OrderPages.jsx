import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { orderAPI } from '../api';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel, getPaymentStatusLabel, PLACEHOLDER_BOOK } from '../utils';
import { Spinner, Pagination } from '../components/common';

export function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    orderAPI.getMyOrders({ page, size: 10 })
      .then(r => setOrders(r.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#2C2114] selection:bg-[#E6CE9A]/50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#140E0A] tracking-wide border-b border-[#D4C4A8] pb-5 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Lịch Sử Tông Ký
        </h1>

        {loading ? (
          <div className="flex justify-center py-28"><Spinner size="lg" /></div>
        ) : !orders?.content?.length ? (
          <div className="bg-[#FAF5EC] border border-[#D4C4A8] py-20 px-4 text-center shadow-sm relative">
            <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />
            <span className="inline-block text-3xl text-[#A8967E] mb-4">❖</span>
            <h2 className="text-lg font-serif font-bold text-[#140E0A] uppercase tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chưa Có Đơn Kỳ
            </h2>
            <p className="text-stone-500 text-xs font-serif italic mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Nơi đây chưa lưu vết bất kỳ giao dịch tàng thư hay điều phối mộc bản nào.
            </p>
            <Link
              to="/books"
              className="inline-block bg-[#8B6508] hover:bg-[#A67B1E] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-[1px] transition-all shadow-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Khởi Sự Tầm Thư
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.content.map(order => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-[#FAF5EC] border border-[#D4C4A8] p-5 shadow-sm hover:border-[#8B6508]/60 hover:shadow-md transition-all relative group"
                >
                  <div className="absolute inset-1 border border-[#8B6508]/0 group-hover:border-[#8B6508]/5 pointer-events-none transition-all" />

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-sm text-[#140E0A] uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                        Mã Số Ký # {order.id}
                      </p>
                      <p className="text-[11px] text-stone-400 font-mono mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-[1px] border ${getOrderStatusColor(order.status)}`} style={{ fontFamily: "'Cinzel', serif" }}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D4C4A8]/30">
                    <p className="text-xs font-serif italic text-stone-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Thu thâu {order.items?.length || 0} mục văn bản
                    </p>
                    <p className="font-bold text-sm text-[#8B6508]" style={{ fontFamily: "'Cinzel', serif" }}>
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                data={orders}
                onPageChange={setPage}
                currentPage={page}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getById(id).then(r => setOrder(r.data)).catch(() => { }).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Hành vi huỷ bỏ tàng thư này không thể vãn hồi. Xác nhận trục xuất đơn ký?')) return;
    setCancelling(true);
    try {
      const res = await orderAPI.cancel(id);
      setOrder(res.data);
    } catch (_) { }
    finally { setCancelling(false); }
  };

  if (loading) return <div className="flex justify-center py-28 bg-[#FAF5EC] min-h-screen"><Spinner size="lg" /></div>;
  if (!order) return (
    <div className="text-center py-28 bg-[#FAF5EC] min-h-screen text-stone-500 font-serif italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      Không tìm thấy dữ kiện về đơn văn bách nghệ này.
    </div>
  );

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#2C2114] selection:bg-[#E6CE9A]/50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {location.state?.success && (
          <div className="bg-emerald-50 border-2 border-emerald-700/30 text-emerald-950 px-5 py-4 rounded-[1px] mb-8 text-center text-xs uppercase tracking-widest font-bold relative" style={{ fontFamily: "'Cinzel', serif" }}>
            <div className="absolute inset-0.5 border border-emerald-750/5 pointer-events-none" />
            ❖ Khởi trạng hoàn tất! Bản ký đã được nghi nhận vào hệ thống tàng thư quốc gia.
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4C4A8] pb-5 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#140E0A] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Đơn Biên Lai # {order.id}
            </h1>
            <p className="text-[11px] text-stone-400 font-mono mt-1">Niên giám thiết lập: {formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-extrabold px-4 py-2 rounded-[1px] border self-start sm:self-center ${getOrderStatusColor(order.status)}`} style={{ fontFamily: "'Cinzel', serif" }}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        {/* Items */}
        <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 mb-6 shadow-sm relative">
          <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#140E0A] mb-5 border-b border-[#D4C4A8]/40 pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            📚 Khảo Mục Mộc Bản
          </h2>
          <div className="space-y-4 relative z-10">
            {order.items?.map(item => (
              <div key={item.bookId} className="flex gap-4 items-center border-b border-[#D4C4A8]/20 pb-4 last:border-0 last:pb-0">
                <div className="border border-[#D4C4A8]/60 p-1 bg-white aspect-[3/4] w-12 flex-shrink-0">
                  <img
                    src={item.coverImageUrl || PLACEHOLDER_BOOK}
                    alt={item.bookTitle}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-sm text-[#2C2114] line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.bookTitle}
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    Số lượng: {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold text-xs text-[#140E0A]" style={{ fontFamily: "'Cinzel', serif" }}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Address — B2: backend trả fullName/street/province (không phải recipientName/address/city) */}
          <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 shadow-sm relative">
            <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#140E0A] mb-4 border-b border-[#D4C4A8]/40 pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              📍 Địa Sở Tiếp Thụ
            </h2>
            {order.address && (
              <div className="text-xs sm:text-sm space-y-1.5 relative z-10">
                <p className="font-bold text-[#2C2114] uppercase tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                  {order.address.fullName}
                </p>
                <p className="text-[#8B6508] font-mono">{order.address.phone}</p>
                <p className="text-stone-600 font-serif leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.province}
                </p>
              </div>
            )}
          </div>

          {/* Payment — B2: backend trả subtotal (không phải subtotalAmount) */}
          <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 shadow-sm relative">
            <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#140E0A] mb-4 border-b border-[#D4C4A8]/40 pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              💰 Đối Chiếu Ngân Khố
            </h2>
            <div className="text-xs uppercase tracking-wider font-bold text-stone-600 space-y-2 relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>
              <div className="flex justify-between items-center">
                <span>Nguyên ngân tinh</span>
                <span className="text-[#2C2114] font-sans font-normal text-xs">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700">
                  <span>Khấu trừ giảm</span>
                  <span className="font-sans font-normal text-xs">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Vận chuyển cục</span>
                <span className="text-emerald-700 font-extrabold">Miễn ngân</span>
              </div>
              <div className="flex justify-between items-baseline text-[#140E0A] border-t border-[#D4C4A8]/40 pt-2 mt-2 font-extrabold">
                <span className="text-[11px]">Tổng ngân tất yếu</span>
                <span className="text-sm text-[#8B6508] font-sans font-bold">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] pt-1 text-stone-500">
                <span>Khố trạng hiệu</span>
                <span className="text-[#2C2114] font-serif italic text-xs lowercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {getPaymentStatusLabel(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Link
            to="/orders"
            className="text-xs uppercase tracking-widest font-extrabold text-[#8B6508] hover:text-[#A67B1E] transition-colors"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            ← Bản Sách Tổng Ký
          </Link>

          {order.status === 'PENDING' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[1px] transition-colors disabled:opacity-40 focus:outline-none"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {cancelling ? 'Đang Khấu Trục...' : '✕ Trục Xuất Đơn Đặt'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

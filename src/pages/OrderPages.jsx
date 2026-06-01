import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { orderAPI } from '../api';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel, getPaymentStatusLabel, PLACEHOLDER_BOOK } from '../utils';
import { Spinner, Empty, Pagination } from '../components/common';

export function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    orderAPI.getMyOrders({ page, size: 10 })
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-6">📦 Đơn hàng của tôi</h1>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !orders?.content?.length ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
          <Link to="/books" className="bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-amber-600 transition-colors">Mua sách ngay</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.content.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">Đơn #{order.id}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{order.items?.length || 0} sản phẩm</p>
                  <p className="font-bold text-amber-700">{formatPrice(order.totalAmount)}</p>
                </div>
              </Link>
            ))}
          </div>
          <Pagination data={orders} onPageChange={setPage} />
        </>
      )}
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
    orderAPI.getById(id).then(r => setOrder(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn huỷ đơn này?')) return;
    setCancelling(true);
    try {
      const res = await orderAPI.cancel(id);
      setOrder(res.data);
    } catch (_) {}
    finally { setCancelling(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Không tìm thấy đơn hàng</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {location.state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl mb-6 text-center">
          🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-900">Đơn hàng #{order.id}</h1>
          <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-sm font-semibold px-4 py-2 rounded-full ${getOrderStatusColor(order.status)}`}>
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <h2 className="font-bold text-gray-800 mb-4">📚 Sản phẩm</h2>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item.bookId} className="flex gap-4 items-center">
              <img
                src={item.coverImageUrl || PLACEHOLDER_BOOK}
                alt={item.bookTitle}
                className="w-12 h-16 object-cover rounded-lg"
                onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 line-clamp-1">{item.bookTitle}</p>
                <p className="text-xs text-gray-500">x{item.quantity} × {formatPrice(item.unitPrice)}</p>
              </div>
              <p className="font-bold text-gray-800 text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">📍 Địa chỉ giao hàng</h2>
          {order.address && (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{order.address.recipientName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.address}, {order.address.ward}, {order.address.district}, {order.address.city}</p>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">💰 Thanh toán</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span>{formatPrice(order.subtotalAmount)}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(order.discountAmount)}</span></div>}
            <div className="flex justify-between text-gray-600"><span>Vận chuyển</span><span className="text-green-600">Miễn phí</span></div>
            <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-2"><span>Tổng</span><span className="text-amber-700">{formatPrice(order.totalAmount)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Trạng thái TT</span><span className="font-medium">{getPaymentStatusLabel(order.paymentStatus)}</span></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/orders" className="text-amber-700 hover:text-amber-900 text-sm font-medium">← Về danh sách</Link>
        {order.status === 'PENDING' && (
          <button onClick={handleCancel} disabled={cancelling}
            className="ml-auto bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
            {cancelling ? 'Đang huỷ...' : '✕ Huỷ đơn hàng'}
          </button>
        )}
      </div>
    </div>
  );
}

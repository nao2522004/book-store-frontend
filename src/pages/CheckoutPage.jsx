import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressAPI, couponAPI, orderAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils';
import { Spinner, ErrorMsg } from '../components/common';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newAddr, setNewAddr] = useState({ recipientName: '', phone: '', address: '', city: '', district: '', ward: '' });
  const [showNewAddr, setShowNewAddr] = useState(false);

  useEffect(() => {
    addressAPI.getAll().then(r => {
      const addrs = r.data || [];
      setAddresses(addrs);
      const def = addrs.find(a => a.isDefault) || addrs[0];
      if (def) setSelectedAddress(def.id);
    }).catch(() => {});
  }, []);

  const validateCoupon = async () => {
    setCouponError('');
    setCouponData(null);
    try {
      const res = await couponAPI.validate(couponCode);
      if (res.data?.isValid) setCouponData(res.data);
      else setCouponError(res.data?.errorMessage || 'Mã không hợp lệ');
    } catch (err) { setCouponError(err.message); }
  };

  const discount = couponData?.discountAmount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const handleOrder = async () => {
    if (!selectedAddress) { setError('Vui lòng chọn địa chỉ giao hàng'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.create({
        addressId: selectedAddress,
        couponCode: couponData ? couponCode : undefined,
        note,
        items: cart?.items?.map(i => ({ bookId: i.bookId, quantity: i.quantity })),
      });
      await clearCart();
      navigate(`/orders/${res.data.id}`, { state: { success: true } });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.create(newAddr);
      setAddresses(a => [...a, res.data]);
      setSelectedAddress(res.data.id);
      setShowNewAddr(false);
      setNewAddr({ recipientName: '', phone: '', address: '', city: '', district: '', ward: '' });
    } catch (err) { setError(err.message); }
  };

  if (!cart?.items?.length) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🛒</p>
      <p className="text-gray-600">Giỏ hàng trống. Hãy thêm sách trước!</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-6">💳 Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-4">📍 Địa chỉ giao hàng</h2>
            <div className="space-y-2">
              {addresses.map(addr => (
                <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                  <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">{addr.recipientName} · {addr.phone}</p>
                    <p className="text-gray-500">{addr.address}, {addr.ward}, {addr.district}, {addr.city}</p>
                    {addr.isDefault && <span className="text-xs text-amber-600 font-medium">Mặc định</span>}
                  </div>
                </label>
              ))}
              <button onClick={() => setShowNewAddr(!showNewAddr)} className="text-amber-700 text-sm font-medium hover:text-amber-900">
                + Thêm địa chỉ mới
              </button>
            </div>

            {showNewAddr && (
              <form onSubmit={handleAddAddress} className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { key: 'recipientName', label: 'Họ tên', col: 2 },
                  { key: 'phone', label: 'Số điện thoại', col: 1 },
                  { key: 'city', label: 'Tỉnh/Thành', col: 1 },
                  { key: 'district', label: 'Quận/Huyện', col: 1 },
                  { key: 'ward', label: 'Phường/Xã', col: 1 },
                  { key: 'address', label: 'Địa chỉ chi tiết', col: 2 },
                ].map(f => (
                  <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input
                      required
                      value={newAddr[f.key]}
                      onChange={e => setNewAddr(a => ({ ...a, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                ))}
                <div className="col-span-2 flex gap-2">
                  <button type="submit" className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600">Lưu địa chỉ</button>
                  <button type="button" onClick={() => setShowNewAddr(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm border hover:bg-gray-50">Huỷ</button>
                </div>
              </form>
            )}
          </div>

          {/* Coupon */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-4">🎫 Mã giảm giá</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã coupon"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
              />
              <button onClick={validateCoupon} disabled={!couponCode} className="bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
                Áp dụng
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            {couponData && <p className="text-green-600 text-xs mt-2 font-medium">✓ Giảm {formatPrice(couponData.discountAmount)}</p>}
          </div>

          {/* Note */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-3">📝 Ghi chú</h2>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ghi chú cho người giao hàng..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
            <h2 className="font-bold text-gray-800">Đơn hàng ({cart.items.length} sản phẩm)</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.items.map(item => (
                <div key={item.bookId} className="flex justify-between text-sm text-gray-600">
                  <span className="line-clamp-1 flex-1 mr-2">{item.bookTitle} x{item.quantity}</span>
                  <span className="font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span>{formatPrice(totalPrice)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Vận chuyển</span><span className="text-green-600">Miễn phí</span></div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
              <span>Tổng</span>
              <span className="text-amber-700 text-lg">{formatPrice(finalPrice)}</span>
            </div>
            {error && <ErrorMsg message={error} />}
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner size="sm" /> Đang xử lý...</> : '🎉 Đặt hàng ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

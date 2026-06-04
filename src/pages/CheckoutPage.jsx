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
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addrErrors, setAddrErrors] = useState({});

  const [newAddr, setNewAddr] = useState({
    fullName: '', phone: '', street: '', province: '', district: '', ward: '',
    isDefault: false
  });
  const [showNewAddr, setShowNewAddr] = useState(false);

  useEffect(() => {
    addressAPI.getAll().then(r => {
      const addrs = r.data || [];
      setAddresses(addrs);
      const def = addrs.find(a => a.isDefault) || addrs[0];
      if (def) setSelectedAddress(def.id);
    }).catch(() => { });
  }, []);

  const validateCoupon = async () => {
    setCouponError('');
    setCouponData(null);
    try {
      const res = await couponAPI.validate(couponCode, totalPrice);
      if (res.data?.isValid) setCouponData(res.data);
      else setCouponError(res.data?.errorMessage || 'Mã sức giảm bất hợp lệ');
    } catch (err) {
      setCouponError(err.message);
    }
  };

  const discount = couponData?.discountAmount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const handleOrder = async () => {
    if (!selectedAddress) {
      setError('Vui lòng định đoạt địa sở thụ thư');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.create({
        addressId: selectedAddress,
        paymentMethod,
        couponCode: couponData ? couponCode : undefined,
        note: note || undefined,
      });
      await clearCart();
      navigate(`/orders/${res.data.id}`, { state: { success: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateAddrField = (key, value) => {
    if (!value?.trim()) return 'Không được để trống';
    if (key === 'phone' && !PHONE_REGEX.test(value))
      return 'Số điện thoại không hợp lệ (9-10 số, đầu 03/05/07/08/09)';
    return '';
  };

  const handleAddrChange = (key, value) => {
    setNewAddr(a => ({ ...a, [key]: value }));
    setAddrErrors(e => ({ ...e, [key]: validateAddrField(key, value) }));
  };

  const PHONE_REGEX = /^(0[35789])[0-9]{7,8}$/;
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!PHONE_REGEX.test(newAddr.phone)) {
      setError('Số điện thoại không hợp lệ (9-10 số, bắt đầu bằng 03/05/07/08/09)');
      return;
    }
    try {
      const payload = { ...newAddr, isDefault: !!newAddr.isDefault };
      const res = await addressAPI.create(payload);
      setAddresses(a => [...a, res.data]);
      setSelectedAddress(res.data.id);
      setShowNewAddr(false);
      setNewAddr({ fullName: '', phone: '', street: '', province: '', district: '', ward: '', isDefault: false });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!cart?.items?.length) return (
    <div className="bg-[#FAF5EC] min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#FAF5EC] border border-[#D4C4A8] p-8 text-center shadow-sm relative">
        <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />
        <span className="inline-block text-3xl text-[#A8967E] mb-4">❖</span>
        <p className="text-stone-600 font-serif text-sm italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Túi sách hiện thời trống rỗng. Hãy thâu tập kinh điển trước khi tiến hành trả ngân.
        </p>
      </div>
    </div>
  );

  const PAYMENT_OPTIONS = [
    { value: 'COD', label: '💵 Thanh toán khi nhận hàng (COD)' },
    { value: 'BANKING', label: '🏦 Chuyển khoản ngân hàng' },
    { value: 'MOMO', label: '💜 Ví MoMo' },
    { value: 'ZALOPAY', label: '💙 ZaloPay' },
    { value: 'VNPAY', label: '🔴 VNPay' },
  ];

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#2C2114] selection:bg-[#E6CE9A]/50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#140E0A] tracking-wide border-b border-[#D4C4A8] pb-5 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Khấu Trừ Trả Ngân
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-6">

            {/* ── Địa chỉ ── */}
            <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 shadow-sm relative">
              <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />

              <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#2C2114] mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                <span>📍 Địa Sở Thụ Thư</span>
              </h2>

              <div className="space-y-3 relative z-10">
                {addresses.map(addr => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-4 p-4 rounded-[1px] border cursor-pointer transition-all duration-300 relative group ${selectedAddress === addr.id
                      ? 'border-[#8B6508] bg-[#8B6508]/5 shadow-sm'
                      : 'border-[#D4C4A8]/60 bg-transparent hover:border-[#8B6508]/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1 accent-[#8B6508]"
                    />
                    <div className="text-xs sm:text-sm flex-1">
                      <p className="font-bold text-[#2C2114] uppercase tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                        {addr.fullName} <span className="text-[#A8967E] font-mono tracking-normal px-1">·</span> {addr.phone}
                      </p>
                      <p className="text-stone-600 font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                      </p>
                      {addr.isDefault && (
                        <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold text-[#8B6508] bg-[#8B6508]/10 px-1.5 py-0.5 mt-2" style={{ fontFamily: "'Cinzel', serif" }}>
                          Định Ước Mặc Định
                        </span>
                      )}
                    </div>
                  </label>
                ))}

                <div className="pt-2">
                  <button
                    onClick={() => setShowNewAddr(!showNewAddr)}
                    className="text-xs uppercase tracking-[0.15em] font-extrabold text-[#8B6508] hover:text-[#A67B1E] hover:tracking-[0.18em] transition-all focus:outline-none border-b border-transparent hover:border-[#A67B1E]/30 pb-0.5"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    + Thiết lập địa sở mới
                  </button>
                </div>
              </div>

              {showNewAddr && (
                <form onSubmit={handleAddAddress} className="mt-6 grid grid-cols-2 gap-4 relative z-10 border-t border-[#D4C4A8]/40 pt-6">
                  {[
                    { key: 'fullName', label: 'Danh tính thụ nhân', col: 2 },
                    { key: 'phone', label: 'Liên lạc minh số', col: 1 },
                    { key: 'province', label: 'Tỉnh / Thành thành', col: 1 },
                    { key: 'district', label: 'Quận / Huyện phủ', col: 1 },
                    { key: 'ward', label: 'Phường / Xã hạt', col: 1 },
                    { key: 'street', label: 'Chi tiết lộ trình địa sở', col: 2 },
                  ].map(f => (
                    <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                        {f.label}
                      </label>
                      <input
                        required
                        value={newAddr[f.key]}
                        onChange={e => handleAddrChange(f.key, e.target.value)}
                        className={`w-full bg-[#FAF5EC] border rounded-[1px] px-3 py-2 text-sm focus:outline-none text-[#140E0A] transition-colors ${addrErrors[f.key]
                          ? 'border-red-400 focus:border-red-600'
                          : 'border-[#D4C4A8] focus:border-[#8B6508]'
                          }`}
                      />
                      {addrErrors[f.key] && (
                        <p className="text-red-600 text-[10px] font-serif italic mt-1">{addrErrors[f.key]}</p>
                      )}
                    </div>
                  ))}

                  <div className="col-span-2 flex items-center gap-2 py-1 relative z-10">
                    <input
                      type="checkbox"
                      id="isDefaultCheckbox"
                      checked={newAddr.isDefault || false}
                      onChange={e => setNewAddr(a => ({ ...a, [f.key || 'isDefault']: e.target.checked }))}
                      className="accent-[#8B6508] cursor-pointer"
                    />
                    <label
                      htmlFor="isDefaultCheckbox"
                      className="text-xs font-serif italic text-stone-600 cursor-pointer user-select-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Đặt địa sở này làm định ước mặc định
                    </label>
                  </div>

                  <div className="col-span-2 flex gap-4 pt-3">
                    <button
                      type="submit"
                      className="relative h-10 bg-transparent text-[#2C2114] border border-[#2C2114] font-bold text-xs uppercase tracking-[0.15em] px-6 rounded-[1px] overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:bg-[#2C2114] before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-250 before:ease-out hover:text-[#FAF5EC] flex items-center justify-center z-10 focus:outline-none"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      <span className="relative z-20">Lưu Thư Địa Sở</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddr(false)}
                      className="h-10 text-stone-400 hover:text-red-800 text-xs font-bold uppercase tracking-[0.15em] px-6 border border-[#D4C4A8] hover:border-red-800/20 rounded-[1px] transition-all bg-transparent focus:outline-none"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Bãi Miễn
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── Phương thức thanh toán ── */}
            <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 shadow-sm relative">
              <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
              <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#2C2114] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                💳 Phương Thức Thanh Toán
              </h2>
              <div className="space-y-2 relative z-10">
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-[1px] border cursor-pointer transition-all ${paymentMethod === opt.value
                      ? 'border-[#8B6508] bg-[#8B6508]/5'
                      : 'border-[#D4C4A8]/60 hover:border-[#8B6508]/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="accent-[#8B6508]"
                    />
                    <span className="text-sm font-serif text-[#2C2114]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Coupon ── */}
            <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 shadow-sm relative">
              <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
              <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#2C2114] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                🎫 Tiết Giảm Minh Tờ (Coupon)
              </h2>
              <div className="flex gap-4 relative z-10">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Điền văn tự giảm giá..."
                  className="flex-1 bg-transparent border border-[#D4C4A8] rounded-[1px] px-4 py-2.5 text-xs uppercase tracking-widest font-bold placeholder-[#A8967E]/60 focus:outline-none focus:border-[#8B6508] text-[#140E0A]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                />
                <button
                  onClick={validateCoupon}
                  disabled={!couponCode}
                  className="relative h-11 bg-transparent text-[#8B6508] border border-[#8B6508] font-bold text-xs uppercase tracking-[0.15em] px-6 rounded-[1px] overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:bg-[#8B6508] before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-250 before:ease-out hover:text-[#FAF5EC] flex items-center justify-center z-10 disabled:opacity-40 disabled:before:hidden disabled:hover:text-[#8B6508] disabled:border-[#D4C4A8] focus:outline-none"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span className="relative z-20">Chiếu Dụng</span>
                </button>
              </div>
              {couponError && <p className="text-red-700 text-xs font-serif italic mt-2.5 pl-1">{couponError}</p>}
              {couponData && <p className="text-emerald-700 text-xs font-extrabold uppercase tracking-wider mt-2.5 pl-1" style={{ fontFamily: "'Cinzel', serif" }}>✓ Đã trừ khấu {formatPrice(couponData.discountAmount)}</p>}
            </div>

            {/* ── Ghi chú ── */}
            <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 shadow-sm relative">
              <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
              <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#2C2114] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                📝 Bút Tích Đính Kèm (Ghi chú)
              </h2>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Lời căn dặn dịch quan vận chuyển mộc bản..."
                rows={2}
                className="w-full bg-transparent border border-[#D4C4A8] rounded-[1px] p-4 text-sm focus:outline-none focus:border-[#8B6508] placeholder-[#A8967E]/60 font-serif italic text-[#140E0A] relative z-10 resize-none transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              />
            </div>
          </div>

          {/* ── Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-[#FAF5EC] border-2 border-[#2C2114]/80 p-6 sticky top-28 shadow-md relative">
              <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />

              <h2 className="font-serif font-bold text-lg text-[#140E0A] uppercase tracking-wide border-b border-[#D4C4A8] pb-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tổng Đơn Biên Lai
              </h2>

              <div className="space-y-3 max-h-40 overflow-y-auto pr-1 divide-y divide-[#D4C4A8]/30">
                {cart.items.map(item => (
                  <div key={item.bookId} className="flex justify-between items-start text-xs pt-2.5 first:pt-0 font-serif text-stone-700" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <span className="line-clamp-2 flex-1 mr-4 font-bold leading-tight">{item.bookTitle} <span className="font-sans font-normal text-xs text-stone-400">x{item.quantity}</span></span>
                    <span className="font-sans font-bold text-stone-900 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#D4C4A8] pt-4 mt-4 space-y-2.5 text-xs uppercase tracking-wider font-bold text-stone-600" style={{ fontFamily: "'Cinzel', serif" }}>
                <div className="flex justify-between items-center">
                  <span>Sơ tính ngân</span>
                  <span className="text-[#2C2114] font-sans font-normal text-xs">{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Khấu giảm</span>
                    <span className="font-sans font-normal text-xs">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Phí vận cục</span>
                  <span className="text-emerald-700 font-extrabold">Miễn ngân</span>
                </div>
              </div>

              <div className="border-t border-[#D4C4A8] pt-4 mt-4 flex justify-between items-baseline font-bold text-[#2C2114]">
                <span className="text-xs uppercase tracking-widest font-extrabold" style={{ fontFamily: "'Cinzel', serif" }}>Tổng ngân chung</span>
                <span className="text-xl text-[#8B6508]" style={{ fontFamily: "'Cinzel', serif" }}>{formatPrice(finalPrice)}</span>
              </div>

              {error && <div className="mt-3"><ErrorMsg message={error} /></div>}

              <div className="pt-6">
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="relative w-full h-12 bg-transparent text-[#2C2114] border border-[#2C2114] font-bold text-xs uppercase tracking-[0.2em] rounded-[1px] overflow-hidden transition-all duration-350 before:absolute before:inset-0 before:bg-[#2C2114] before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300 before:ease-out hover:text-[#FAF5EC] flex items-center justify-center gap-2 disabled:opacity-40 disabled:before:hidden disabled:hover:text-[#2C2114] focus:outline-none z-10"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span className="relative z-20 flex items-center justify-center gap-2">
                    {loading ? (
                      <><Spinner size="sm" /> Đang sắc lệnh...</>
                    ) : (
                      'Khởi Sự Đặt Hàng ❖'
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
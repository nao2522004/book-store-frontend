import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookAPI, reviewAPI } from '../api';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate, getDiscountPercent, PLACEHOLDER_BOOK } from '../utils';
import { Spinner, StarRating, Empty, ErrorMsg } from '../components/common';

export default function BookDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('desc');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookRes, revRes] = await Promise.all([
          bookAPI.getById(id),
          reviewAPI.getByBook(id, { page: 1, size: 10 }).catch(() => null),
        ]);
        setBook(bookRes.data);
        setReviews(revRes?.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(book.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewAPI.create({ bookId: Number(id), ...reviewForm });
      const revRes = await reviewAPI.getByBook(id, { page: 1, size: 10 });
      setReviews(revRes.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (_) {
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24 bg-[#FAF5EC] min-h-screen"><Spinner size="lg" /></div>;
  if (!book) return <div className="max-w-2xl mx-auto px-4 py-16"><ErrorMsg message={error || 'Không tìm thấy tác phẩm cổ điển này.'} /></div>;

  const displayPrice = book.discountPrice && book.discountPrice < book.price ? book.discountPrice : book.price;
  // B2: tính discountPercent ở client vì backend không trả trường này
  const discountPercent = getDiscountPercent(book);
  // B2: backend trả publishedDate (datetime string), không có publishedYear
  const publishedYear = book.publishedDate ? new Date(book.publishedDate).getFullYear() : null;

  return (
    <div className="bg-[#FAF5EC] min-h-screen selection:bg-[#E6CE9A]/50 text-[#2C2114] pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <nav className="text-xs uppercase tracking-widest text-[#A8967E] mb-10 flex items-center gap-2 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
          <Link to="/" className="hover:text-[#8B6508] transition-colors">Thư Viện</Link>
          <span className="text-[#A8967E]/40">❖</span>
          <Link to="/books" className="hover:text-[#8B6508] transition-colors">Toàn Bản</Link>
          <span className="text-[#A8967E]/40">❖</span>
          <span className="text-[#2C2114] font-semibold truncate max-w-[200px] md:max-w-xs">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          <div className="md:col-span-5 flex justify-center items-start">
            <div className="w-full max-w-sm bg-[#FAF5EC] border border-[#D4C4A8] p-4 shadow-[0_15px_40px_rgba(38,28,18,0.08)] relative group">
              <div className="absolute inset-2 border border-[#8B6508]/10 pointer-events-none" />
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={book.coverImageUrl || PLACEHOLDER_BOOK}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {book.categories?.map(c => (
                    <Link
                      key={c.id}
                      to={`/books?categoryId=${c.id}`}
                      className="text-[10px] uppercase tracking-widest font-extrabold bg-[#8B6508]/5 border border-[#8B6508]/20 text-[#8B6508] px-2.5 py-1 rounded-[1px] hover:bg-[#8B6508]/10 transition-colors"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#140E0A] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {book.title}
                </h1>
              </div>

              <div className="text-xs uppercase tracking-wider space-y-2.5 border-y border-[#D4C4A8]/40 py-5 text-stone-600 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                {book.authors?.length > 0 && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#A8967E] min-w-[100px]">Tác giả:</span>
                    <span className="text-[#2C2114]">{book.authors.map(a => a.name).join(', ')}</span>
                  </p>
                )}
                {book.publisher && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#A8967E] min-w-[100px]">Ấn hành cục:</span>
                    <span className="text-[#2C2114]">{book.publisher.name}</span>
                  </p>
                )}
                {/* B2: dùng publishedDate thay vì publishedYear */}
                {publishedYear && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#A8967E] min-w-[100px]">Niên đại XB:</span>
                    <span className="text-[#2C2114]">{publishedYear}</span>
                  </p>
                )}
                {book.isbn && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#A8967E] min-w-[100px]">Mã thư tịch:</span>
                    <span className="text-[#2C2114] font-mono tracking-normal">{book.isbn}</span>
                  </p>
                )}
                {book.pages && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#A8967E] min-w-[100px]">Khảo số trang:</span>
                    <span className="text-[#2C2114]">{book.pages} trang</span>
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-bold text-[#8B6508]" style={{ fontFamily: "'Cinzel', serif" }}>
                  {formatPrice(displayPrice)}
                </span>
                {book.discountPrice && book.discountPrice < book.price && (
                  <>
                    <span className="text-lg text-[#A8967E] line-through font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
                      {formatPrice(book.price)}
                    </span>
                    {/* B2: dùng discountPercent đã tính ở client */}
                    {discountPercent > 0 && (
                      <span className="bg-[#8B6508] text-[#FAF5EC] text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-[1px]" style={{ fontFamily: "'Cinzel', serif" }}>
                        -{discountPercent}% Tiết giảm
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="pt-2">
                <span
                  className={`text-xs uppercase tracking-widest font-extrabold px-3 py-1 border rounded-[1px] ${book.stockQuantity > 0
                    ? 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
                    : 'border-red-600/30 bg-red-50 text-red-800'
                    }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {book.stockQuantity > 0 ? `✓ Hiện tàng ${book.stockQuantity} quyển` : '✗ Mộc bản đã hết'}
                </span>
              </div>
            </div>

            {book.stockQuantity > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-8 mt-6 border-t border-[#D4C4A8]/40">
                <div className="flex items-center justify-between border-2 border-[#2C2114]/40 h-14 px-2 min-w-[140px]">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg text-stone-600 hover:text-[#8B6508] transition-colors focus:outline-none font-bold"
                  >
                    −
                  </button>
                  <span className="font-bold text-base text-[#140E0A] w-12 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(book.stockQuantity, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg text-stone-600 hover:text-[#8B6508] transition-colors focus:outline-none font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`flex-1 h-14 px-6 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 rounded-[1px] shadow-sm hover:shadow-md ${added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#8B6508] hover:bg-[#A67B1E] text-white'
                    }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {adding ? 'Đang thâu tập...' : added ? '✓ Đã đưa vào Túi Sách!' : '🛒 Thu nhận vào Túi Sách'}
                </button>
              </div>
            )}

            {error && <div className="mt-4"><ErrorMsg message={error} /></div>}
          </div>
        </div>

        <div className="bg-[#FAF5EC] border border-[#D4C4A8] shadow-sm relative">
          <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />

          <div className="flex border-b border-[#D4C4A8] relative z-10 bg-[#F3EFE6]">
            {[
              { key: 'desc', label: 'Tóm lược tác phẩm' },
              { key: 'reviews', label: `Học giả bình nghị (${reviews?.totalElements || 0})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 sm:px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all focus:outline-none relative ${activeTab === tab.key
                  ? 'text-[#8B6508] bg-[#FAF5EC] border-r border-[#D4C4A8] last:border-r-0 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B6508]'
                  : 'text-stone-500 hover:text-[#2C2114] border-r border-[#D4C4A8]/40 hover:bg-[#FAF5EC]/50'
                  }`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 relative z-10">
            {activeTab === 'desc' && (
              <p
                className="text-stone-700 leading-relaxed text-justify font-serif text-base whitespace-pre-line first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#8B6508] first-letter:mr-2 first-letter:float-left first-letter:leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {book.description || 'Tác phẩm hiện chưa được cập nhật tờ khải mô tả.'}
              </p>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-10">
                <form onSubmit={handleSubmitReview} className="border border-[#D4C4A8]/60 bg-[#F3EFE6]/40 p-6 space-y-4 rounded-[1px]">
                  <h3 className="text-xs uppercase tracking-widest font-extrabold text-[#2C2114]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Để lại bút tích phê bình
                  </h3>
                  <div className="py-1">
                    <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Viết lời bình nghị của bạn về giá trị tác phẩm tại đây..."
                    rows={4}
                    className="w-full bg-transparent border border-[#D4C4A8] rounded-[1px] p-4 text-sm focus:outline-none focus:border-[#8B6508] placeholder-[#A8967E]/60 font-serif italic text-[#140E0A] resize-none transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !reviewForm.comment.trim()}
                    className="bg-[#2C2114] hover:bg-[#8B6508] text-[#FAF5EC] px-6 py-3 uppercase tracking-widest text-xs font-bold transition-colors disabled:opacity-40 rounded-[1px]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {submitting ? 'Đang khắc thư...' : 'Ký danh gửi ngôn'}
                  </button>
                </form>

                {!reviews?.content?.length ? (
                  <div className="py-8">
                    <Empty icon="❖" message="Thư tịch này hiện chưa có học giả để lại lời phê bình." />
                  </div>
                ) : (
                  <div className="divide-y divide-[#D4C4A8]/40 space-y-6">
                    {reviews.content.map(rev => (
                      <div key={rev.id} className="pt-6 first:pt-0 group">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="w-8 h-8 border border-[#8B6508]/60 bg-[#F3EFE6] flex items-center justify-center text-xs font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                            {rev.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-[#2C2114]" style={{ fontFamily: "'Cinzel', serif" }}>
                              {rev.userName}
                            </span>
                            <div className="flex items-center gap-3 mt-0.5">
                              <StarRating value={rev.rating} readonly />
                              <span className="text-[10px] tracking-wider text-[#A8967E] uppercase font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                {formatDate(rev.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-stone-700 font-serif text-base text-justify pl-11 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

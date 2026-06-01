import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookAPI, reviewAPI } from '../api';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate, PLACEHOLDER_BOOK } from '../utils';
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
          reviewAPI.getByBook(id, { page: 0, size: 10 }).catch(() => null),
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
    } catch (err) { setError(err.message); }
    finally { setAdding(false); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewAPI.create({ bookId: Number(id), ...reviewForm });
      const revRes = await reviewAPI.getByBook(id, { page: 0, size: 10 });
      setReviews(revRes.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (_) {}
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!book) return <div className="max-w-2xl mx-auto px-4 py-12"><ErrorMsg message={error || 'Không tìm thấy sách'} /></div>;

  const displayPrice = book.discountPrice && book.discountPrice < book.price ? book.discountPrice : book.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-amber-700">Trang chủ</Link>
        <span>/</span>
        <Link to="/books" className="hover:text-amber-700">Sách</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Cover */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <img
              src={book.coverImageUrl || PLACEHOLDER_BOOK}
              alt={book.title}
              className="w-full rounded-2xl shadow-xl object-cover"
              onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            {book.categories?.map(c => (
              <Link key={c.id} to={`/books?categoryId=${c.id}`} className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full mr-1 mb-2 hover:bg-amber-200 transition-colors">
                {c.name}
              </Link>
            ))}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">{book.title}</h1>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            {book.authors?.length > 0 && <p><span className="font-medium">Tác giả:</span> {book.authors.map(a => a.name).join(', ')}</p>}
            {book.publisher && <p><span className="font-medium">NXB:</span> {book.publisher.name}</p>}
            {book.publishedYear && <p><span className="font-medium">Năm XB:</span> {book.publishedYear}</p>}
            {book.isbn && <p><span className="font-medium">ISBN:</span> {book.isbn}</p>}
            {book.pages && <p><span className="font-medium">Số trang:</span> {book.pages}</p>}
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-amber-700">{formatPrice(displayPrice)}</span>
            {book.discountPrice && book.discountPrice < book.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(book.price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{book.discountPercent}%</span>
              </>
            )}
          </div>

          <p className={`text-sm font-medium ${book.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {book.stockQuantity > 0 ? `✓ Còn ${book.stockQuantity} cuốn` : '✗ Hết hàng'}
          </p>

          {book.stockQuantity > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-medium">−</button>
                <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(book.stockQuantity, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-medium">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  added ? 'bg-green-500 text-white' : 'bg-amber-700 hover:bg-amber-600 text-white'
                }`}
              >
                {adding ? 'Đang thêm...' : added ? '✓ Đã thêm vào giỏ!' : '🛒 Thêm vào giỏ hàng'}
              </button>
            </div>
          )}
          {error && <ErrorMsg message={error} />}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: 'desc', label: 'Mô tả' },
            { key: 'reviews', label: `Đánh giá (${reviews?.totalElements || 0})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'desc' && (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{book.description || 'Chưa có mô tả.'}</p>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review form */}
              <form onSubmit={handleSubmitReview} className="bg-amber-50 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-gray-800">Viết đánh giá</h3>
                <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Chia sẻ cảm nhận của bạn..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
                <button type="submit" disabled={submitting || !reviewForm.comment}
                  className="bg-amber-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>

              {/* Review list */}
              {!reviews?.content?.length ? (
                <Empty icon="💬" message="Chưa có đánh giá nào" />
              ) : (
                <div className="space-y-4">
                  {reviews.content.map(rev => (
                    <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {rev.userName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm text-gray-800">{rev.userName}</span>
                        <StarRating value={rev.rating} readonly />
                        <span className="text-xs text-gray-400 ml-auto">{formatDate(rev.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 pl-9">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

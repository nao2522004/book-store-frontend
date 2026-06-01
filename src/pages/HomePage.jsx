import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookAPI, categoryAPI } from '../api';
import BookCard from '../components/book/BookCard';
import { Spinner, Empty } from '../components/common';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [booksRes, catsRes] = await Promise.all([
          bookAPI.getAll({ page: 0, size: 8, sort: 'createdAt,desc' }),
          categoryAPI.getAll({ page: 0, size: 8 }),
        ]);
        setNewBooks(booksRes.data?.content || []);
        setFeaturedBooks(booksRes.data?.content?.slice(0, 4) || []);
        setCategories(catsRes.data?.content || catsRes.data || []);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/books?keyword=${encodeURIComponent(search.trim())}`);
  };

  const categoryIcons = ['📖', '🔬', '🎨', '💼', '🌍', '👶', '💡', '🏛️'];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            Khám phá thế giới<br />qua từng trang sách 📚
          </h1>
          <p className="text-amber-200 text-lg mb-8 max-w-xl mx-auto">
            Hàng nghìn đầu sách chất lượng, giao hàng tận nơi, giá tốt nhất.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm tên sách, tác giả, thể loại..."
              className="flex-1 px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
            />
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 px-6 py-3 rounded-full font-semibold text-sm transition-colors whitespace-nowrap">
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-amber-50 border-b border-amber-100 py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: '📚', label: 'Đầu sách', value: '10,000+' },
            { icon: '👥', label: 'Khách hàng', value: '50,000+' },
            { icon: '⭐', label: 'Đánh giá 5 sao', value: '98%' },
            { icon: '🚚', label: 'Giao hàng', value: 'Toàn quốc' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-bold text-amber-900 text-lg">{s.value}</div>
              <div className="text-xs text-amber-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Categories */}
          {categories.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-amber-900">Danh mục sách</h2>
                <Link to="/categories" className="text-amber-700 hover:text-amber-900 text-sm font-medium">Xem tất cả →</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    to={`/books?categoryId=${cat.id}`}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl">{categoryIcons[i % categoryIcons.length]}</span>
                    <span className="text-xs text-gray-600 text-center leading-tight group-hover:text-amber-700 font-medium">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* New Books */}
          <section className="max-w-7xl mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-amber-900">Sách mới nhất</h2>
              <Link to="/books" className="text-amber-700 hover:text-amber-900 text-sm font-medium">Xem tất cả →</Link>
            </div>
            {newBooks.length === 0 ? (
              <Empty icon="📚" message="Chưa có sách nào" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                {newBooks.map(book => <BookCard key={book.id} book={book} />)}
              </div>
            )}
          </section>

          {/* Promo banner */}
          <section className="bg-gradient-to-r from-amber-700 to-amber-600 text-white py-12 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-3">🎉 Ưu đãi hôm nay</h2>
              <p className="text-amber-200 mb-6">Nhập mã coupon để nhận ưu đãi đặc biệt cho đơn hàng của bạn</p>
              <Link to="/books" className="bg-white text-amber-800 font-bold px-8 py-3 rounded-full hover:bg-amber-50 transition-colors inline-block">
                Mua ngay
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

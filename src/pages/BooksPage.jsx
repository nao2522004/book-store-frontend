import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookAPI, categoryAPI, authorAPI } from '../api';
import BookCard from '../components/book/BookCard';
import { Spinner, Pagination, Empty } from '../components/common';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Mới nhất' },
  { value: 'price,asc', label: 'Giá tăng dần' },
  { value: 'price,desc', label: 'Giá giảm dần' },
  { value: 'title,asc', label: 'Tên A-Z' },
];

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    sort: 'createdAt,desc',
    page: 0,
    size: 12,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    categoryAPI.getAll({ size: 50 }).then(r => setCategories(r.data?.content || r.data || [])).catch(() => {});
  }, []);

  const fetchBooks = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = { page: f.page, size: f.size, sort: f.sort };
      if (f.keyword) params.keyword = f.keyword;
      if (f.categoryId) params.categoryId = f.categoryId;

      const res = f.keyword
        ? await bookAPI.search(params)
        : await bookAPI.getAll(params);
      setBooks(res.data);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBooks(filters); }, [filters, fetchBooks]);

  useEffect(() => {
    const kw = searchParams.get('keyword');
    const cat = searchParams.get('categoryId');
    if (kw !== undefined || cat !== undefined) {
      setFilters(f => ({ ...f, keyword: kw || '', categoryId: cat || '', page: 0 }));
    }
  }, [searchParams]);

  const setFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 0 }));
  };

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
        <input
          type="text"
          value={filters.keyword}
          onChange={e => setFilter('keyword', e.target.value)}
          placeholder="Tên sách, tác giả..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
        <div className="space-y-1">
          <button
            onClick={() => setFilter('categoryId', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.categoryId ? 'bg-amber-100 text-amber-800 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter('categoryId', cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.categoryId == cat.id ? 'bg-amber-100 text-amber-800 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-amber-900">
          {filters.keyword ? `Kết quả: "${filters.keyword}"` : 'Tất cả sách'}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={e => setFilter('sort', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            className="md:hidden bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium"
            onClick={() => setSidebarOpen(true)}
          >
            🔽 Lọc
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Bộ lọc</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-xl">&times;</button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : books?.content?.length === 0 ? (
            <Empty icon="🔍" message="Không tìm thấy sách nào" />
          ) : (
            <>
              {books && (
                <p className="text-sm text-gray-500 mb-4">
                  Tìm thấy <span className="font-semibold text-gray-700">{books.totalElements}</span> sách
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {books?.content?.map(book => <BookCard key={book.id} book={book} />)}
              </div>
              <Pagination data={books} onPageChange={p => setFilters(f => ({ ...f, page: p }))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

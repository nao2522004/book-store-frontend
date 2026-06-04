import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookAPI, categoryAPI } from '../api';
import BookCard from '../components/book/BookCard';
import { Pagination, Empty } from '../components/common';
import { BookCardSkeletonGrid } from '../components/book/BookCardSkeleton';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Tác Phẩm Mới' },
  { value: 'price,asc', label: 'Giá Ngân Tăng Dần' },
  { value: 'price,desc', label: 'Giá Ngân Giảm Dần' },
  { value: 'title,asc', label: 'Thứ Tự A-Z' },
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
    page: 1,
    size: 12,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    categoryAPI.getAll({ size: 50 }).then(r => setCategories(r.data?.content || r.data || [])).catch(() => { });
  }, []);

  const fetchBooks = useCallback(async (f) => {
    setLoading(true);
    try {
      const [sortBy, sortDir] = (f.sort || 'createdAt,desc').split(',');
      const params = {
        page: f.page,
        size: f.size,
        sortBy,
        sortDir,
      };
      if (f.keyword) params.keyword = f.keyword;
      if (f.categoryId) params.categoryId = f.categoryId;

      const res = await bookAPI.getAll(params);
      setBooks(res.data);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(filters); }, [filters, fetchBooks]);

  useEffect(() => {
    const kw = searchParams.get('keyword');
    const cat = searchParams.get('categoryId');
    if (kw !== undefined || cat !== undefined) {
      setFilters(f => ({ ...f, keyword: kw || '', categoryId: cat || '', page: 1 }));
    }
  }, [searchParams]);

  const setFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const Sidebar = () => (
    <div className="space-y-8">
      <div className="relative">
        <label className="block text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#2C2114] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
          Khảo Tìm Văn Bản
        </label>
        <div className="relative border-b-2 border-[#2C2114]/30 focus-within:border-[#8B6508] pb-1 transition-colors">
          <input
            type="text"
            value={filters.keyword}
            onChange={e => setFilter('keyword', e.target.value)}
            placeholder="Tên kinh điển, triết gia..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder-[#A8967E]/60 font-serif italic text-[#140E0A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          />
          <span className="absolute right-1 bottom-1 text-[#A8967E] text-xs">✦</span>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#2C2114] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          Hệ Thống Tư Tưởng
        </label>
        <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
          <button
            onClick={() => setFilter('categoryId', '')}
            className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider font-bold transition-all ${!filters.categoryId
              ? 'bg-[#8B6508] text-white rounded-[1px] shadow-sm'
              : 'text-stone-600 hover:bg-[#F3EFE6] hover:text-[#8B6508]'
              }`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            ❖ Toàn Bộ Khảo Cứu
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter('categoryId', cat.id)}
              className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${filters.categoryId == cat.id
                ? 'bg-[#8B6508] text-white rounded-[1px] shadow-sm'
                : 'text-stone-600 hover:bg-[#F3EFE6] hover:text-[#8B6508]'
                }`}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <span className={filters.categoryId == cat.id ? 'text-[#FAF5EC]' : 'text-[#8B6508]/40'}>✦</span>
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );


  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#2C2114] selection:bg-[#E6CE9A]/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4C4A8] pb-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#140E0A] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              {filters.keyword ? `Kết Quả Khảo Tìm: "${filters.keyword}"` : 'Thư Mục Toàn Bản'}
            </h1>
            <p className="text-stone-500 text-xs font-serif italic mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Nơi lưu trữ những tư tưởng vượt thời gian
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 self-end sm:self-center w-full sm:w-auto">
            <div className="relative border border-[#D4C4A8] bg-[#FAF5EC] rounded-[1px] px-3 py-2 flex items-center shadow-sm">
              <select
                value={filters.sort}
                onChange={e => setFilter('sort', e.target.value)}
                className="bg-transparent text-xs uppercase tracking-wider font-bold pr-6 focus:outline-none appearance-none text-[#2C2114] cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#FAF5EC] text-[#2C2114]">{o.label}</option>)}
              </select>
              <span className="absolute right-3 pointer-events-none text-[9px] text-[#8B6508]">▼</span>
            </div>

            <button
              className="md:hidden border-2 border-[#8B6508] text-[#8B6508] bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[1px] transition-colors active:bg-[#8B6508]/10"
              style={{ fontFamily: "'Cinzel', serif" }}
              onClick={() => setSidebarOpen(true)}
            >
              Bộ Lọc
            </button>
          </div>
        </div>

        <div className="flex gap-10 lg:gap-12">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 sticky top-28 shadow-sm">
              <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />
              <Sidebar />
            </div>
          </div>

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
              <div className="absolute inset-0 bg-[#140E0A]/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#FAF5EC] border-r border-[#D4C4A8] p-6 overflow-y-auto z-10">
                <div className="absolute inset-2 border border-[#8B6508]/10 pointer-events-none" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#2C2114]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Tiêu Chí Tầm Thư
                  </h3>
                  <button onClick={() => setSidebarOpen(false)} className="text-stone-500 text-2xl hover:text-[#8B6508]">&times;</button>
                </div>
                <div className="relative z-10">
                  <Sidebar />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <BookCardSkeletonGrid count={filters.size} />
            ) : books?.content?.length === 0 ? (
              <div className="bg-[#FAF5EC] border border-[#D4C4A8] py-16 px-4 text-center shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />
                <Empty icon="❖" message="Không tìm thấy văn bản nào tương thích với điều kiện khảo cứu." />
              </div>
            ) : (
              <>
                {books && (
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span>Tầm nguyên được</span>
                    <span className="text-[#8B6508] font-extrabold text-sm">{books.totalElements}</span>
                    <span>Tác phẩm tôn vinh</span>
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
                  {books?.content?.map(book => <BookCard key={book.id} book={book} />)}
                </div>

                <div className="mt-12 pt-6 border-t border-[#D4C4A8]/40">
                  <Pagination
                    data={books}
                    onPageChange={p => setFilters(f => ({ ...f, page: p }))}
                    currentPage={filters.page}
                  />
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookAPI, categoryAPI } from '../api';
import BookCard from '../components/book/BookCard';
import { Empty } from '../components/common';
import { BookCardSkeletonGrid } from '../components/book/BookCardSkeleton';

//  HOA TIẾT PHÂN ĐOẠN VĂN BẢN 
function OrnamentalDivider({ color = "#8B6508" }) {
  return (
    <div className="flex items-center gap-4 w-full my-12 opacity-70 select-none animate-fade-in">
      <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <div className="text-sm tracking-widest transition-all duration-300 hover:scale-110 cursor-default" style={{ color, textShadow: '0 0 8px rgba(139, 101, 8, 0.2)' }}>
        ☙ ❖ ❧
      </div>
      <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
    </div>
  );
}

//  KỆ SÁCH 
function InteractiveBookShelf() {
  const [hovered, setHovered] = useState(null);
  const SPINE_COLORS = ["#1A2A40", "#5C201E", "#234427", "#3E1B50", "#735220", "#20424C"];
  const SPINE_TITLES = ["Plato", "Nietzsche", "Locke", "Kinh Điển", "Kant", "Spinoza"];

  return (
    <div className="relative max-w-xs mx-auto mt-6 hidden md:block select-none">
      <div className="flex items-end justify-center gap-[3px] h-[140px] px-2 relative z-10 overflow-hidden pb-1">
        {SPINE_COLORS.map((color, i) => {
          const isHov = hovered === i;
          const widths = [36, 30, 40, 32, 38, 34];
          const heights = [120, 105, 125, 110, 122, 115];
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative rounded-t-[4px] cursor-pointer flex-shrink-0 transition-all duration-300 ease-out"
              style={{
                width: `${widths[i]}px`,
                height: `${heights[i]}px`,
                transform: isHov ? 'translateY(-12px) scaleX(1.05)' : 'translateY(0)',
                background: `linear-gradient(90deg, rgba(0,0,0,0.4) 0%, ${color} 25%, ${color} 75%, rgba(0,0,0,0.6) 100%)`,
                boxShadow: isHov ? `8px 12px 20px rgba(0,0,0,0.6)` : `2px 2px 6px rgba(0,0,0,0.35)`,
              }}
            >

              <div className="absolute inset-x-0 top-3 h-[2px] bg-black/20 border-b border-white/10" />
              <div className="absolute inset-x-0 bottom-4 h-[2px] bg-black/20 border-t border-white/10" />

              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-bold tracking-widest uppercase transition-colors duration-200"
                style={{
                  transform: "translate(-50%, -50%) rotate(-90deg)",
                  fontFamily: "'Cinzel', serif",
                  color: isHov ? '#F4ECE0' : 'rgba(212, 160, 23, 0.75)'
                }}
              >
                {SPINE_TITLES[i]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-[12px] bg-gradient-to-b from-[#3E2F1A] to-[#1A130B] border-t-2 border-[#8B6508]/40 shadow-xl rounded-b-[2px]" />
    </div>
  );
}

export default function HomePage() {
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
          bookAPI.getAll({ page: 1, size: 6, sortBy: 'createdAt', sortDir: 'desc' }),
          categoryAPI.getAll({ page: 1, size: 6 }),
        ]);
        setNewBooks(booksRes.data?.content || []);
        setCategories(catsRes.data?.content || catsRes.data || []);
      } catch (_) { }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/books?keyword=${encodeURIComponent(search.trim())}`);
  };

  const categoryIcons = ['📜', '🏛️', '🖋️', '⚖️', '🕊️', '🕰️'];

  return (
    <div className="min-h-screen bg-[#FAF3E3] text-[#261C12] selection:bg-[#E6CE9A] relative overflow-x-hidden antialiased">

      <div className="absolute inset-0 bg-[radial-gradient(#C4B293_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF3E3]/50 to-transparent pointer-events-none" />

      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Cinzel:wght@600;700;800&display=swap"
        rel="stylesheet"
      />


      <div className="max-w-7xl mx-auto border-x border-[#C4B498]/40 lg:border-x-4 lg:border-double lg:border-[#C4B498]/80 bg-[#FAF3E3] shadow-[0_0_60px_rgba(38,28,18,0.15)] relative">


        <div className="absolute inset-y-0 left-6 w-[1px] border-l border-dashed border-[#C4B498]/30 pointer-events-none hidden lg:block" />
        <div className="absolute inset-y-0 right-6 w-[1px] border-r border-dashed border-[#C4B498]/30 pointer-events-none hidden lg:block" />


        <section className="border-b border-[#C4B498]/60 py-20 px-6 md:px-16 relative overflow-hidden">
          <div className="absolute inset-6 border border-[#8B6508]/20 pointer-events-none rounded-[2px]" />
          <div className="absolute -top-24 -left-24 w-48 h-48 border border-[#8B6508]/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 border border-[#8B6508]/10 rounded-full pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-[#8B6508] text-xs tracking-[0.4em] uppercase font-extrabold block mb-5 animate-fade-in" style={{ fontFamily: "'Cinzel', serif" }}>
              ✦ EX LIBRIS BIBLIOTHECA ✦
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#140E0A] leading-tight mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Những Cuốn Sách <em className="font-serif italic font-normal text-[#8B6508] relative inline-block">Khai Mở<span className="absolute bottom-2 left-0 w-full h-[2px] bg-[#8B6508]/20"></span></em> Bản Ngã
            </h1>

            <div className="text-[#4E3A26] text-lg md:text-xl mb-10 font-serif leading-relaxed text-center italic max-w-2xl mx-auto font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "Nơi lưu giữ những hệ tư tưởng vĩ đại làm thay đổi sâu sắc toàn bộ dòng chảy lịch sử và nền văn minh nhân loại qua muôn vàn thế kỷ thịnh suy."
            </div>


            <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-3 border-b-2 border-[#261C12]/80 pb-3 focus-within:border-[#8B6508] transition-all duration-300 group px-2">
              <span className="text-[#A8967E] group-focus-within:text-[#8B6508] transition-colors duration-300">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Khảo cứu tác phẩm, tác giả hoặc hệ tư tưởng..."
                className="flex-1 bg-transparent text-[#261C12] focus:outline-none text-base placeholder-[#A8967E]/80 font-serif italic"
              />
              <button type="submit" className="text-[#261C12] hover:text-[#8B6508] text-xs font-bold tracking-widest uppercase transition-colors duration-200" style={{ fontFamily: "'Cinzel', serif" }}>
                TRA CỨU
              </button>
            </form>
          </div>
        </section>


        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-[#C4B498]/60">


          <div className="lg:col-span-3 p-6 md:p-12 space-y-16 border-r-0 lg:border-r border-[#C4B498]/60">


            {categories.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-8 border-b border-[#C4B498] pb-4">
                  <h2 className="text-2xl font-serif font-bold text-[#140E0A] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    I. Hệ Thống Tư Tưởng
                  </h2>
                  <Link to="/categories" className="text-[#614E3A] hover:text-[#8B6508] text-xs font-bold uppercase tracking-widest pb-1 border-b-2 border-transparent hover:border-[#8B6508] transition-all duration-300" style={{ fontFamily: "'Cinzel', serif" }}>
                    XEM PHÂN HỆ →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {categories.map((cat, i) => (
                    <Link
                      key={cat.id}
                      to={`/books?categoryId=${cat.id}`}
                      className="flex items-center gap-4 p-5 bg-[#F5EFE0] border border-[#C4B498]/60 hover:border-[#8B6508] hover:bg-white transition-all duration-300 shadow-[2px_2px_8px_rgba(38,28,18,0.03)] hover:shadow-[4px_8px_20px_rgba(139,101,8,0.1)] group rounded-[1px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FAF3E3] group-hover:bg-[#FAF3E3]/50 flex items-center justify-center text-2xl shadow-inner transition-colors duration-300">
                        <span className="filter sepia-[0.2] group-hover:scale-110 transition-transform duration-300">{categoryIcons[i % categoryIcons.length]}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-[#3E2F1A] font-bold tracking-wider group-hover:text-[#8B6508] block uppercase transition-colors duration-200" style={{ fontFamily: "'Cinzel', serif" }}>
                          {cat.name}
                        </span>
                        <span className="text-[11px] font-serif italic text-stone-500 block mt-0.5">Khảo cứu văn bản</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <OrnamentalDivider />


            <div>
              <div className="flex items-end justify-between mb-8 border-b border-[#C4B498] pb-4">
                <h2 className="text-2xl font-serif font-bold text-[#140E0A] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  II. Ấn Bản Mới Thu Thập
                </h2>
                <Link to="/books" className="text-[#614E3A] hover:text-[#8B6508] text-xs font-bold uppercase tracking-widest pb-1 border-b-2 border-transparent hover:border-[#8B6508] transition-all duration-300" style={{ fontFamily: "'Cinzel', serif" }}>
                  TRA KHỐ →
                </Link>
              </div>

              {loading ? (
                <BookCardSkeletonGrid count={6} />
              ) : newBooks.length === 0 ? (
                <div className="bg-[#FAF3E3] py-16 border border-dashed border-[#C4B498] text-center rounded-[2px]"><Empty message="Chưa có bản thảo mới." /></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {newBooks.map(book => (
                    <div key={book.id} className="hover:-translate-y-2 transition-transform duration-300 ease-out">
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>


          <div className="bg-[#F4ECE0]/80 p-8 space-y-12 font-serif text-sm border-t lg:border-t-0 border-[#C4B498]/60">


            <div className="border-b border-[#C4B498]/60 pb-8 text-center">
              <span className="text-[10px] uppercase font-extrabold text-[#8B6508] tracking-[0.2em] block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>TỦ CỔ THƯ VIRTUAL</span>
              <InteractiveBookShelf />
            </div>


            <div className="border-b border-[#C4B498]/60 pb-8 space-y-4 relative">
              <span className="absolute top-0 right-0 text-4xl text-[#C4B498]/30 font-serif pointer-events-none select-none">“</span>
              <h4 className="text-xs uppercase font-extrabold text-[#140E0A] tracking-wider border-l-2 border-[#8B6508] pl-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Lời Người Đi Trước
              </h4>
              <p className="text-stone-800 italic leading-relaxed text-justify px-1 text-base font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "Cuộc sống không được phản tỉnh thì không đáng sống."
              </p>
              <span className="block text-right text-xs font-bold text-[#8B6508] tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>— Socrates</span>
            </div>


            <div className="border-b border-[#C4B498]/60 pb-8 space-y-4">
              <h4 className="text-xs uppercase font-extrabold text-[#140E0A] tracking-wider border-l-2 border-[#8B6508] pl-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Số Liệu Ký Mục
              </h4>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center border-b border-[#C4B498]/30 pb-2">
                  <span className="text-stone-700 font-serif">Tác phẩm tinh tuyển:</span>
                  <span className="font-bold text-[#8B6508] bg-[#FAF3E3] px-2 py-0.5 rounded-[2px] shadow-sm font-mono">XII,450+</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#C4B498]/30 pb-2">
                  <span className="text-stone-700 font-serif">Đại tư tưởng gia:</span>
                  <span className="font-bold text-[#8B6508] bg-[#FAF3E3] px-2 py-0.5 rounded-[2px] shadow-sm font-mono">DCCCL+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-700 font-serif">Thời gian vận chuyển:</span>
                  <span className="font-bold text-[#8B6508] bg-[#FAF3E3] px-2 py-0.5 rounded-[2px] shadow-sm font-mono">XLVIII H</span>
                </div>
              </div>
            </div>


            <div className="space-y-4 bg-[#FAF3E3]/40 p-4 border border-[#C4B498]/40 rounded-[2px]">
              <h4 className="text-xs uppercase font-extrabold text-[#140E0A] tracking-wider border-l-2 border-[#8B6508] pl-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Thư Sảnh Nhật Ký
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed text-justify italic font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Bản dịch mới cho cuốn <span className="not-italic font-bold text-[#140E0A]">Phê phán lý tính thuần túy</span> của Immanuel Kant dự kiến sẽ cập bến vào tuần sau. Độc giả có thể liên hệ bộ phận cổ thư để đặt trước.
              </p>
            </div>

          </div>

        </div>


        <section className="p-6 md:p-12 bg-[#FAF3E3]">
          <div className="bg-[#1E1410] text-[#FAF3E3] py-16 px-6 md:px-12 rounded-[2px] text-center border-2 border-double border-[#8B6508] relative overflow-hidden shadow-2xl group">

            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#8B6508]/60 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#8B6508]/60 transition-all duration-300 group-hover:scale-105" />

            <div className="absolute inset-0 bg-[radial-gradient(rgba(139,101,8,0.15)_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[#D4A017] text-xs tracking-[0.40em] font-extrabold block mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                — EX LIBRIS PRIVILEGIO —
              </span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#E6C280] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mật Mã Ưu Đãi Học Giả
              </h3>
              <p className="text-stone-300 text-base font-serif italic mb-8 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Nhập mã độc quyền <span className="text-[#E6C280] font-bold not-italic border-b-2 border-[#8B6508] px-2 py-0.5 bg-black/40 tracking-wider font-mono">PHILOSOPHY26</span> để nhận đặc quyền tri ân thượng hạng từ Thư phòng.
              </p>
              <Link
                to="/books"
                className="bg-[#8B6508] hover:bg-[#A67B1E] text-white font-bold px-10 py-4 shadow-lg transition-all duration-300 inline-block uppercase tracking-[0.2em] text-xs rounded-[1px] hover:shadow-[0_0_25px_rgba(139,101,8,0.4)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                SƯU TẦM CỔ THƯ
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
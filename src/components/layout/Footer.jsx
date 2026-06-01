import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#140E0A] text-[#C4B498]/80 mt-auto relative border-t border-[#8B6508] select-none">

      <div className="absolute inset-x-0 top-[3px] h-[1px] bg-gradient-to-r from-transparent via-[#8B6508]/60 to-transparent mx-8" />

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">

        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-2.5 text-white tracking-[0.25em] font-medium">
            <span className="text-[#8B6508] text-xl animate-pulse">❖</span>
            <span className="text-xl uppercase font-bold tracking-widest text-[#E6C280]" style={{ fontFamily: "'Cinzel', serif" }}>
              Bibliotheca
            </span>
          </div>
          <p className="text-base font-serif italic text-stone-400/90 leading-relaxed max-w-md text-justify" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Mỗi cuốn sách mở ra là một tinh cầu tư tưởng." Nơi gìn giữ, tôn vinh và lưu truyền các giá trị nhân văn, hệ thống triết học cổ đại xuyên thế kỷ đến tận tay những học giả trân quý tri thức.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#E6C280] mb-6 font-extrabold border-b border-[#8B6508]/20 pb-2 inline-block" style={{ fontFamily: "'Cinzel', serif" }}>
            Mục Lục Khảo Cứu
          </h4>
          <ul className="space-y-4 text-[11px] uppercase tracking-widest font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
            <li>
              <Link to="/books" className="text-stone-400 hover:text-[#E6C280] transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#8B6508] opacity-0 group-hover:opacity-100 transition-opacity duration-200">✦</span> Toàn Bộ Thư Mục
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-stone-400 hover:text-[#E6C280] transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#8B6508] opacity-0 group-hover:opacity-100 transition-opacity duration-200">✦</span> Hệ Tư Tưởng
              </Link>
            </li>
            <li>
              <Link to="/authors" className="text-stone-400 hover:text-[#E6C280] transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#8B6508] opacity-0 group-hover:opacity-100 transition-opacity duration-200">✦</span> Đại Triết Gia
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#E6C280] mb-6 font-extrabold border-b border-[#8B6508]/20 pb-2 inline-block" style={{ fontFamily: "'Cinzel', serif" }}>
            Độc Giả Đường Dây
          </h4>
          <ul className="space-y-4 text-[11px] uppercase tracking-widest font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
            <li>
              <Link to="/orders" className="text-stone-400 hover:text-[#E6C280] transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#8B6508] opacity-0 group-hover:opacity-100 transition-opacity duration-200">✦</span> Kiểm Đơn Hành Trình
              </Link>
            </li>
            <li>
              <a href="mailto:contact@bibliotheca.edu" className="text-stone-400 hover:text-[#E6C280] transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#8B6508] opacity-0 group-hover:opacity-100 transition-opacity duration-200">✦</span> Liên Hệ Học Sảnh
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-[#8B6508]/15 bg-[#0C0805] py-6 text-center text-[10px] uppercase tracking-[0.25em] text-stone-500/80 font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
        © {new Date().getFullYear()} Bibliotheca. Bản Quyền Sở Hữu Thuộc Về Viện Hàn Lâm Tri Thức.
      </div>
    </footer>
  );
}
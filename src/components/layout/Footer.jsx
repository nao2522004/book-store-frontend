import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <span>📚</span> <span className="font-serif">BookStore</span>
          </div>
          <p className="text-sm text-amber-400 leading-relaxed">Cửa hàng sách trực tuyến uy tín, mang đến hàng nghìn đầu sách chất lượng đến tay bạn đọc.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Danh mục</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/books" className="hover:text-white transition-colors">Tất cả sách</Link></li>
            <li><Link to="/categories" className="hover:text-white transition-colors">Danh mục</Link></li>
            <li><Link to="/authors" className="hover:text-white transition-colors">Tác giả</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Hỗ trợ</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/orders" className="hover:text-white transition-colors">Theo dõi đơn hàng</Link></li>
            <li><a href="mailto:your-email@example.com" className="hover:text-white transition-colors">Liên hệ</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-amber-900 text-center py-4 text-xs text-amber-500">
        © 2024 BookStore. All rights reserved.
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { formatPrice, getDiscountPercent, PLACEHOLDER_BOOK } from '../../utils';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // B2: tính discountPercent ở client vì backend không trả trường này
  const discountPercent = getDiscountPercent(book);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addItem(book.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (_) { }
    finally { setAdding(false); }
  };

  return (
    <Link
      to={`/books/${book.id}`}
      className="group bg-[#FAF5EC] rounded-[1px] transition-all duration-300 overflow-hidden flex flex-col border border-[#D4C4A8]/65 hover:border-[#8B6508]/60 relative p-2"
    >

      <div className="absolute inset-3 border border-[#8B6508]/5 pointer-events-none z-10 group-hover:border-[#8B6508]/10 transition-colors" />

      <div className="relative overflow-hidden bg-[#FAF5EC] aspect-[3/4] border border-[#D4C4A8]/40 p-1 bg-white">
        <img
          src={book.coverImageUrl || PLACEHOLDER_BOOK}
          alt={book.title}
          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
          onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
        />

        {discountPercent > 0 && (
          <span
            className="absolute top-2 left-2 bg-[#8B6508] text-[#FAF5EC] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[1px] shadow-sm z-20"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            -{discountPercent}%
          </span>
        )}

        {book.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-[#2C2114]/70 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span
              className="text-[#FAF5EC] text-xs uppercase tracking-[0.2em] font-bold border border-[#FAF5EC]/30 px-3 py-1.5"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Cạn Bản
            </span>
          </div>
        )}
      </div>

      <div className="p-3 pt-4 flex flex-col flex-1 gap-1.5 relative z-10">
        <h3
          className="font-serif font-bold text-[#140E0A] text-sm leading-snug line-clamp-2 group-hover:text-[#8B6508] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {book.title}
        </h3>

        <p
          className="text-[11px] font-serif italic text-stone-500 truncate"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {book.authorName || book.authors?.map(a => a.name).join(', ')}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-[#D4C4A8]/30">

          <div className="min-w-0">
            {book.discountPrice && book.discountPrice < book.price ? (
              <>
                <p className="text-[#8B6508] font-bold text-xs font-mono">{formatPrice(book.discountPrice)}</p>
                <p className="text-stone-400 text-[10px] line-through font-mono mt-0.5">{formatPrice(book.price)}</p>
              </>
            ) : (
              <p className="text-[#2C2114] font-bold text-xs font-mono">{formatPrice(book.price)}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || book.stockQuantity === 0}
            className={`relative text-[10px] uppercase tracking-wider font-extrabold px-3 py-2 rounded-[1px] transition-all duration-300 focus:outline-none overflow-hidden h-8 min-w-[70px] flex items-center justify-center border ${added
              ? 'bg-emerald-800 border-emerald-800 text-[#FAF5EC]'
              : 'bg-transparent border-[#2C2114]/80 text-[#2C2114] hover:text-[#FAF5EC] before:absolute before:inset-0 before:bg-[#2C2114] before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-250 disabled:opacity-30 disabled:before:hidden'
              }`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <span className="relative z-10">
              {adding ? '...' : added ? '✓ Có' : '+ Thêm'}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}

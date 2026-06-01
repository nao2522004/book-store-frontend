import { Link } from 'react-router-dom';
import { formatPrice, PLACEHOLDER_BOOK, truncate } from '../../utils';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addItem(book.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (_) {}
    finally { setAdding(false); }
  };

  return (
    <Link to={`/books/${book.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-amber-50 aspect-[3/4]">
        <img
          src={book.coverImageUrl || PLACEHOLDER_BOOK}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = PLACEHOLDER_BOOK; }}
        />
        {book.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{book.discountPercent}%
          </span>
        )}
        {book.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Hết hàng</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500">{book.authorName || book.authors?.map(a => a.name).join(', ')}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            {book.discountPrice && book.discountPrice < book.price ? (
              <>
                <p className="text-amber-700 font-bold text-sm">{formatPrice(book.discountPrice)}</p>
                <p className="text-gray-400 text-xs line-through">{formatPrice(book.price)}</p>
              </>
            ) : (
              <p className="text-amber-700 font-bold text-sm">{formatPrice(book.price)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || book.stockQuantity === 0}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
              added ? 'bg-green-500 text-white' :
              'bg-amber-700 hover:bg-amber-600 text-white disabled:opacity-50'
            }`}
          >
            {adding ? '...' : added ? '✓ Đã thêm' : '+ Giỏ'}
          </button>
        </div>
      </div>
    </Link>
  );
}

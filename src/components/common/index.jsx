// Toast
export function Toast({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-in
          ${t.type === 'error' ? 'bg-red-500' : t.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// Spinner
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${s} border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin`} />
  );
}

// Loading page
export function LoadingPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// Pagination
export function Pagination({ data, onPageChange }) {
  if (!data || data.totalPages <= 1) return null;
  const { number: page, totalPages } = data;

  const pages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-amber-100 text-amber-800 transition-colors"
      >
        ← Trước
      </button>
      {start > 0 && <><button onClick={() => onPageChange(0)} className="px-3 py-2 rounded-lg text-sm hover:bg-amber-100 text-amber-800">1</button><span className="text-gray-400">...</span></>}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-amber-700 text-white' : 'hover:bg-amber-100 text-amber-800'}`}
        >
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && <><span className="text-gray-400">...</span><button onClick={() => onPageChange(totalPages - 1)} className="px-3 py-2 rounded-lg text-sm hover:bg-amber-100 text-amber-800">{totalPages}</button></>}
      <button
        disabled={data.last}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-amber-100 text-amber-800 transition-colors"
      >
        Sau →
      </button>
    </div>
  );
}

// Modal
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Error message
export function ErrorMsg({ message }) {
  if (!message) return null;
  return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{message}</div>;
}

// Empty state
export function Empty({ icon = '📦', message = 'Không có dữ liệu' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <span className="text-5xl mb-3">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// Star rating
export function StarRating({ value = 0, onChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          className={`text-xl ${s <= value ? 'text-yellow-400' : 'text-gray-300'} ${!readonly ? 'hover:text-yellow-400 transition-colors cursor-pointer' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

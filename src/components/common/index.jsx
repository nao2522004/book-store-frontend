import { Link } from 'react-router-dom';

export { default as ErrorBoundary } from './ErrorBoundary';

export function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-5 py-3.5 rounded-[1px] border shadow-md text-xs font-bold uppercase tracking-wider animate-slide-in relative flex items-center gap-2 bg-[#FAF5EC] ${t.type === 'error'
            ? 'border-red-800/60 text-red-900 bg-red-50/30'
            : t.type === 'warning'
              ? 'border-[#8B6508]/60 text-[#8B6508] bg-amber-50/30'
              : 'border-emerald-800/60 text-emerald-950 bg-emerald-50/30'
            }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span>{t.type === 'error' ? '✕' : t.type === 'warning' ? '❖' : '✓'}</span>
          <span className="font-serif tracking-normal normal-case font-normal text-stone-700">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' }[size];
  return (
    <div className={`${s} border-[#D4C4A8] border-t-[#8B6508] rounded-full animate-spin`} />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] bg-[#FAF5EC] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function Pagination({ data, onPageChange, currentPage }) {
  if (!data || data.totalPages <= 1) return null;
  const { totalPages, hasNext, hasPrevious } = data;
  const page = currentPage ?? data.page ?? 1;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const btnClass = "h-9 px-3 border border-[#D4C4A8] text-xs font-bold uppercase tracking-wider text-[#2C2114] hover:text-[#FAF5EC] relative overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:bg-[#2C2114] before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-250 disabled:opacity-30 disabled:before:hidden disabled:hover:text-[#2C2114] flex items-center justify-center rounded-[1px]";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 select-none" style={{ fontFamily: "'Cinzel', serif" }}>
      <button disabled={!hasPrevious} onClick={() => onPageChange(page - 1)} className={btnClass}>
        <span className="relative z-10">← Trước</span>
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 border border-[#D4C4A8]/60 text-xs font-medium text-stone-500 hover:text-[#8B6508] transition-colors">1</button>
          <span className="text-stone-400 px-1 text-xs">...</span>
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-xs font-bold transition-all rounded-[1px] ${p === page
            ? 'bg-[#8B6508] border border-[#8B6508] text-[#FAF5EC]'
            : 'border border-[#D4C4A8]/60 text-stone-600 hover:border-[#2C2114] hover:text-[#2C2114]'
            }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className="text-stone-400 px-1 text-xs">...</span>
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 border border-[#D4C4A8]/60 text-xs font-medium text-stone-500 hover:text-[#8B6508] transition-colors">{totalPages}</button>
        </>
      )}

      <button disabled={!hasNext} onClick={() => onPageChange(page + 1)} className={btnClass}>
        <span className="relative z-10">Sau →</span>
      </button>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-[#2C2114]/60 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-[#FAF5EC] border-2 border-[#2C2114] rounded-[1px] shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-1">
        <div className="absolute inset-1 border border-[#8B6508]/10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between p-5 border-b border-[#D4C4A8]/60">
            <h2 className="text-base font-serif font-bold text-[#140E0A] uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-red-800 text-xl transition-colors focus:outline-none"
            >
              ✕
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ErrorMsg({ message }) {
  if (!message) return null;
  return (
    <div className="bg-[#FAF5EC] border border-red-800/40 text-red-900 px-4 py-3 rounded-[1px] text-xs font-serif italic flex items-center gap-2">
      <span className="text-red-800 font-sans not-italic font-bold">✕</span> {message}
    </div>
  );
}

export function Empty({ icon = '❖', message = 'Không có dữ liệu' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-stone-400 border border-dashed border-[#D4C4A8]/60 rounded-[1px] bg-[#FAF5EC]/50 relative">
      <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />
      <span className="text-3xl mb-3 text-[#A8967E]">{icon}</span>
      <p className="text-xs font-serif italic text-stone-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {message}
      </p>
    </div>
  );
}

export function StarRating({ value = 0, onChange, readonly = false }) {
  return (
    <div className="flex gap-1 select-none">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          className={`text-lg focus:outline-none leading-none ${s <= value ? 'text-[#8B6508]' : 'text-stone-300'
            } ${!readonly ? 'hover:text-[#A67B1E] transition-colors cursor-pointer' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
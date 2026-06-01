import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorMsg, Spinner } from '../components/common';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/';
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAF3E3] selection:bg-[#E6CE9A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#C4B293_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-xl text-[#8B6508] transition-transform duration-500 hover:rotate-180 mb-4">
            ❖
          </Link>
          <span className="text-[#8B6508] text-[10px] tracking-[0.35em] uppercase font-bold block mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            EX LIBRIS BIBLIOTHECA
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#140E0A] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
            Khảo Nhập Độc Giả
          </h1>
          <p className="text-stone-500 text-xs font-serif italic mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Chào mừng bạn trở lại với không gian học thuật
          </p>
        </div>

        <div className="bg-[#FAF3E3] border border-[#C4B498] shadow-[0_15px_50px_rgba(38,28,18,0.1)] p-8 relative">
          <div className="absolute inset-2 border border-[#8B6508]/10 pointer-events-none" />

          {successMessage && !error && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs uppercase tracking-wider text-center font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#2C2114] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Địa chỉ Email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-[#2C2114]/30 focus:border-[#8B6508] pb-1.5 text-sm focus:outline-none placeholder-[#A8967E]/60 font-serif italic text-[#140E0A] transition-colors"
                placeholder="reader@bibliotheca.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#2C2114] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Mật tự mật mã
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-[#2C2114]/30 focus:border-[#8B6508] pb-1.5 text-sm focus:outline-none placeholder-[#A8967E]/60 font-serif text-[#140E0A] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <ErrorMsg message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B6508] hover:bg-[#A67B1E] text-white font-bold py-3.5 px-4 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs shadow-md hover:shadow-lg rounded-[1px]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {loading ? <><Spinner size="sm" /> Đang thông quan...</> : 'Đăng nhập'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-[#C4B498]/40">
            <p className="text-xs font-serif text-stone-500">
              Chưa thiết lập quy bạ?{' '}
              <Link to="/register" className="text-[#8B6508] font-bold hover:text-[#A67B1E] underline underline-offset-4 uppercase tracking-wider ml-1 text-[11px]" style={{ fontFamily: "'Cinzel', serif" }}>
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không trùng khớp'); return; }
    if (form.password.length < 6) { setError('Mật tự phải bao gồm tối thiểu 6 ký tự'); return; }
    setLoading(true);
    setError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/login', { state: { message: 'Quy bạ thành công! Vui lòng đăng nhập.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAF3E3] selection:bg-[#E6CE9A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#C4B293_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-xl text-[#8B6508] transition-transform duration-500 hover:rotate-180 mb-4">
            ❖
          </Link>
          <span className="text-[#8B6508] text-[10px] tracking-[0.35em] uppercase font-bold block mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            EX LIBRIS BIBLIOTHECA
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#140E0A] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
            Thiết Lập Quy Bạ
          </h1>
          <p className="text-stone-500 text-xs font-serif italic mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Gia nhập học sảnh để lưu giữ hành trình khai mở tư tưởng
          </p>
        </div>

        <div className="bg-[#FAF3E3] border border-[#C4B498] shadow-[0_15px_50px_rgba(38,28,18,0.1)] p-8 relative">
          <div className="absolute inset-2 border border-[#8B6508]/10 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Danh tính học giả', type: 'text', placeholder: 'Nguyễn Văn A' },
              { key: 'email', label: 'Địa chỉ Email', type: 'email', placeholder: 'reader@bibliotheca.edu' },
              { key: 'password', label: 'Thiết lập mật từ', type: 'password', placeholder: '••••••••' },
              { key: 'confirmPassword', label: 'Xác nhận mật từ', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#2C2114] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  required
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-transparent border-b-2 border-[#2C2114]/30 focus:border-[#8B6508] pb-1.5 text-sm focus:outline-none placeholder-[#A8967E]/60 font-serif text-[#140E0A] transition-colors"
                  placeholder={f.placeholder}
                />
              </div>
            ))}

            {error && <ErrorMsg message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B6508] hover:bg-[#A67B1E] text-white font-bold py-3.5 px-4 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs shadow-md hover:shadow-lg rounded-[1px] mt-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {loading ? <><Spinner size="sm" /> Đang ghi danh...</> : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-[#C4B498]/40">
            <p className="text-xs font-serif text-stone-500">
              Đã có chương mục độc giả?{' '}
              <Link to="/login" className="text-[#8B6508] font-bold hover:text-[#A67B1E] underline underline-offset-4 uppercase tracking-wider ml-1 text-[11px]" style={{ fontFamily: "'Cinzel', serif" }}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
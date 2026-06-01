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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl">📚</Link>
          <h1 className="text-2xl font-serif font-bold text-amber-900 mt-3">Đăng nhập</h1>
          <p className="text-gray-500 text-sm mt-1">Chào mừng bạn trở lại!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required autoFocus
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="••••••"
              />
            </div>
            {error && <ErrorMsg message={error} />}
            <button type="submit" disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Đang đăng nhập...</> : 'Đăng nhập'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-amber-700 font-medium hover:text-amber-900">Đăng ký ngay</Link>
          </p>
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
    if (form.password !== form.confirmPassword) { setError('Mật khẩu không khớp'); return; }
    if (form.password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    setLoading(true);
    setError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl">📚</Link>
          <h1 className="text-2xl font-serif font-bold text-amber-900 mt-3">Đăng ký</h1>
          <p className="text-gray-500 text-sm mt-1">Tạo tài khoản để bắt đầu mua sắm</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Họ tên', type: 'text', placeholder: 'Nguyễn Văn A' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
              { key: 'password', label: 'Mật khẩu', type: 'password', placeholder: '••••••' },
              { key: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: '••••••' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  type={f.type} required
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            {error && <ErrorMsg message={error} />}
            <button type="submit" disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Đang đăng ký...</> : 'Tạo tài khoản'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-amber-700 font-medium hover:text-amber-900">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

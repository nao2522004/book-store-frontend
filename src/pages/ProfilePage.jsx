import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { ErrorMsg } from '../components/common';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Mật mã tân lập không trùng khớp');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Cải biến mật mã thành công!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#2C2114] selection:bg-[#E6CE9A]/50 pb-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#140E0A] tracking-wide border-b border-[#D4C4A8] pb-5 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Thông Quan Kiến Danh
        </h1>

        <div className="bg-[#FAF5EC] border border-[#D4C4A8] p-6 mb-6 shadow-sm relative">
          <div className="absolute inset-1.5 border border-[#8B6508]/5 pointer-events-none" />

          <div className="flex items-center gap-5 mb-6 relative z-10">
            <div
              className="w-16 h-16 bg-[#2C2114] rounded-full flex items-center justify-center text-[#FAF5EC] text-xl font-bold border-2 border-[#8B6508]/40 shadow-inner"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#140E0A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {user?.name}
              </h2>
              <p className="text-xs font-mono text-stone-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="border border-[#D4C4A8]/40 bg-[#FAF5EC] p-3 rounded-[1px]">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#8B6508] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                Danh Tính
              </p>
              <p className="text-sm font-bold text-[#2C2114] truncate">{user?.name}</p>
            </div>
            <div className="border border-[#D4C4A8]/40 bg-[#FAF5EC] p-3 rounded-[1px]">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#8B6508] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                Liên Kết Ngữ (Email)
              </p>
              <p className="text-sm font-bold text-[#2C2114] truncate font-mono">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF5EC] border-2 border-[#2C2114]/80 p-6 shadow-md relative">
          <div className="absolute inset-1.5 border border-[#8B6508]/10 pointer-events-none" />

          <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#140E0A] mb-5 border-b border-[#D4C4A8] pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            🔒 Cải Biến Mật Mã
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4 relative z-10">
            {[
              { key: 'currentPassword', label: 'Cựu mật mã hiện thời' },
              { key: 'newPassword', label: 'Tân mật mã thiết lập' },
              { key: 'confirmPassword', label: 'Xác minh tân mật mã' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                  {f.label}
                </label>
                <input
                  type="password"
                  required
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-[#FAF5EC] border border-[#D4C4A8] rounded-[1px] px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B6508] text-[#140E0A] transition-colors"
                />
              </div>
            ))}

            {error && <div className="pt-2"><ErrorMsg message={error} /></div>}

            {success && (
              <div className="bg-emerald-50 border border-emerald-700/30 text-emerald-950 px-4 py-3 rounded-[1px] text-xs font-bold uppercase tracking-widest text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                ✓ {success}
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#8B6508] hover:bg-[#A67B1E] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-[1px] transition-all shadow-sm disabled:opacity-40"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {loading ? 'Đang Lục Soát Cập Nhật...' : 'Xác Bản Cải Biến ❖'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
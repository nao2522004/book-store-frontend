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
    if (form.newPassword !== form.confirmPassword) { setError('Mật khẩu mới không khớp'); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Đổi mật khẩu thành công!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-amber-900 mb-6">👤 Hồ sơ cá nhân</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-amber-700 font-medium text-xs mb-1">Tên</p>
            <p className="text-gray-800 font-semibold">{user?.name}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-amber-700 font-medium text-xs mb-1">Email</p>
            <p className="text-gray-800 font-semibold truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4">🔒 Đổi mật khẩu</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Mật khẩu hiện tại' },
            { key: 'newPassword', label: 'Mật khẩu mới' },
            { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type="password" required
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          ))}
          {error && <ErrorMsg message={error} />}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}

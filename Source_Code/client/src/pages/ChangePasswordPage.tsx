import { useState } from 'react';
import { Lock, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError('Mật khẩu xác nhận không khớp.');
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/change-password', { oldPassword, newPassword });
      setSuccess(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
          <div className="mb-10">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Đổi mật khẩu</h1>
            <p className="text-slate-500 font-medium">Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu định kỳ.</p>
          </div>

          {success && (
            <div className="mb-8 bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 text-green-700 font-bold animate-slide-up">
              <CheckCircle size={24} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-bold transition-all"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full my-2"></div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-bold transition-all"
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-bold transition-all"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Xác nhận đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

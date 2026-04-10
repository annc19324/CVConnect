import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20 px-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl border border-slate-100">
        <div className="mb-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold mb-6 transition-colors">
            <ArrowLeft size={18} />
            Quay lại đăng nhập
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Quên mật khẩu?</h1>
          <p className="text-slate-500 font-medium">Đừng lo, hãy nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        </div>

        {message ? (
          <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-start gap-4">
            <CheckCircle className="text-green-600 mt-1" size={24} />
            <p className="text-green-700 font-bold">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Đăng nhập bằng Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-bold"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 font-bold text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Gửi yêu cầu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

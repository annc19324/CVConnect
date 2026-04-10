import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

/**
 * Trang Đăng nhập (Premium Design)
 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Xử lý khi người dùng nhấn nút Đăng nhập
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Gọi API Backend
      const response = await api.post('/auth/login', { email, password });
      
      // 2. Nếu thành công, lưu Token và thông tin User vào Context
      login(response.data.token, response.data.user);
      
      // 3. Chuyển hướng người dùng về trang chủ
      navigate('/');
    } catch (err: any) {
      console.error('Đăng nhập thất bại:', err);
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Container chính của Form */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-primary-100 overflow-hidden border border-slate-100">
        <div className="p-10">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl text-white font-bold text-2xl shadow-lg shadow-primary-200 mb-4 transform hover:scale-105 transition-transform">
              CV
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Chào mừng trở lại!</h1>
            <p className="text-slate-500 font-medium italic">Đăng nhập để tiếp tục xây dựng sự nghiệp của bạn.</p>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50/50 focus:border-primary-500 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
                <Link to="/forgot-password" size={18} className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Quên mật khẩu?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50/50 focus:border-primary-500 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-100 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Footer của Form */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 hover:underline">
                Đăng ký ngay miễn phí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

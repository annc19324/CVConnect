import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle, Loader2, Building2, UserRound } from 'lucide-react';
import api from '../services/api';

/**
 * Trang Đăng ký người dùng mới (Premium Design)
 * Cho phép người dùng chọn vai trò: Ứng viên (Candidate) hoặc Nhà tuyển dụng (Recruiter).
 */
const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleName, setRoleName] = useState('CANDIDATE'); // Mặc định là Candidate
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Xử lý đăng ký tài khoản mới
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Gọi API Đăng ký
      await api.post('/auth/register', { email, password, fullName, roleName });
      
      // 2. Thành công -> Chuyển hướng sang trang Đăng nhập
      navigate('/login');
    } catch (err: any) {
      console.error('Đăng ký thất bại:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-primary-100 overflow-hidden border border-slate-100">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Bắt đầu ngay hôm nay!</h1>
            <p className="text-slate-500 font-medium italic">Tạo tài khoản để mở rộng cơ hội sự nghiệp của bạn.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chọn vai trò (Role Selection Cards) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4 ml-1">Tôi là:</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Lựa chọn Ứng viên */}
                <div
                  onClick={() => setRoleName('CANDIDATE')}
                  className={`cursor-pointer group p-5 border-2 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center gap-3 ${
                    roleName === 'CANDIDATE' 
                    ? 'border-primary-600 bg-primary-50/50 shadow-lg shadow-primary-50' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${roleName === 'CANDIDATE' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <UserRound size={24} />
                  </div>
                  <span className={`font-bold transition-colors ${roleName === 'CANDIDATE' ? 'text-primary-700' : 'text-slate-600'}`}>Ứng viên</span>
                  <div className={`absolute top-3 right-3 w-4 h-4 border-2 rounded-full flex items-center justify-center ${roleName === 'CANDIDATE' ? 'border-primary-600 bg-white' : 'border-slate-300'}`}>
                    {roleName === 'CANDIDATE' && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                  </div>
                </div>

                {/* Lựa chọn Nhà tuyển dụng */}
                <div
                  onClick={() => setRoleName('RECRUITER')}
                  className={`cursor-pointer group p-5 border-2 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center gap-3 ${
                    roleName === 'RECRUITER' 
                    ? 'border-primary-600 bg-primary-50/50 shadow-lg shadow-primary-50' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${roleName === 'RECRUITER' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Building2 size={24} />
                  </div>
                  <span className={`font-bold transition-colors ${roleName === 'RECRUITER' ? 'text-primary-700' : 'text-slate-600'}`}>Nhà tuyển dụng</span>
                  <div className={`absolute top-3 right-3 w-4 h-4 border-2 rounded-full flex items-center justify-center ${roleName === 'RECRUITER' ? 'border-primary-600 bg-white' : 'border-slate-300'}`}>
                    {roleName === 'RECRUITER' && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Họ và tên Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Họ và tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50/50 focus:border-primary-500 transition-all font-medium"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email (Tên đăng nhập)</label>
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
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mật khẩu</label>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-100 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                   <Loader2 className="animate-spin" size={24} />
                   Đang đăng ký...
                </>
              ) : (
                <>
                   <UserPlus size={20} />
                   Tạo tài khoản ngay
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline">
                 Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

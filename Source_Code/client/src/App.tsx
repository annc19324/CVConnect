import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, LogIn, UserPlus, LogOut, User as UserIcon, Shield, Settings } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import các trang
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import CVBuilderPage from './pages/CVBuilderPage';
import MyCVsPage from './pages/MyCVsPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-200 group-hover:rotate-6 transition-transform">
            CV
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tighter">
            CVConnect
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/jobs" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-bold transition-colors">
            <Briefcase size={20} className="text-slate-400" />
            Việc làm
          </Link>
          {user?.role.name === 'CANDIDATE' && (
            <>
              <Link to="/my-cvs" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-bold transition-colors">
                <FileText size={20} className="text-slate-400" />
                Quản lý CV
              </Link>
              <Link to="/cv-builder" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-bold transition-colors">
                <PlusSquare size={20} className="text-slate-400" />
                Tạo CV
              </Link>
            </>
          )}
          {user?.role.name === 'ADMIN' && (
            <Link to="/admin" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors">
              <Shield size={20} />
              Quản trị
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={user.role.name === 'ADMIN' ? "/admin" : (user.role.name === 'RECRUITER' ? "/recruiter-dashboard" : "/candidate-dashboard")} 
                className="hidden sm:flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 hover:bg-primary-100 transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 group cursor-pointer relative pr-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-600 overflow-hidden">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={20} />}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-black text-slate-900 leading-tight">{user.fullName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role.name}</p>
                </div>
                
                {/* User Dropdown/Settings icon */}
                <Link to="/change-password" title="Đổi mật khẩu" className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                  <Settings size={18} />
                </Link>

                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Đăng xuất">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-bold transition-colors px-4 py-2">
                <LogIn size={20} />
                Đăng nhập
              </Link>
              <Link to="/register" className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 flex items-center gap-2 transform hover:-translate-y-0.5">
                <UserPlus size={20} />
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const PlusSquare = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const HomePage = () => (
    <main className="w-full pt-44 pb-32 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2"></div>

        <section className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-block py-2 px-6 bg-primary-50 rounded-full text-primary-700 font-black text-xs mb-8 tracking-widest uppercase">
                🚀 CVConnect Mini v2.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1]">
                Xây sự nghiệp,<br /> 
                <span className="text-primary-600">kết nối</span> tương lai.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-bold leading-relaxed">
                Nền tảng giúp bạn tạo hồ sơ chuyên nghiệp, nộp đơn ứng tuyển nhanh chóng và tương tác trực tiếp với nhà tuyển dụng hàng đầu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/cv-builder" className="w-full sm:w-auto bg-primary-600 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 transform hover:-translate-y-1">
                    Bắt đầu ngay
                </Link>
                <Link to="/jobs" className="w-full sm:w-auto bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-xl border-2 border-slate-100 hover:border-primary-100 transition-all transform hover:-translate-y-1">
                    Xem việc làm
                </Link>
            </div>
        </section>
    </main>
);

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role.name)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navigation />
          <div className="flex-1">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                
                <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
                
                {/* Candidate */}
                <Route path="/cv-builder" element={<ProtectedRoute roles={['CANDIDATE']}><CVBuilderPage /></ProtectedRoute>} />
                <Route path="/cv-builder/:id" element={<ProtectedRoute roles={['CANDIDATE']}><CVBuilderPage /></ProtectedRoute>} />
                <Route path="/my-cvs" element={<ProtectedRoute roles={['CANDIDATE']}><MyCVsPage /></ProtectedRoute>} />
                <Route path="/candidate-dashboard" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateDashboard /></ProtectedRoute>} />
                
                {/* Recruiter */}
                <Route path="/recruiter-dashboard" element={<ProtectedRoute roles={['RECRUITER']}><RecruiterDashboard /></ProtectedRoute>} />
                
                {/* Admin */}
                <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <footer className="w-full border-t border-slate-200 bg-white py-20 mt-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">CV</div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">CVConnect</span>
                </div>
                <p className="text-slate-400 font-bold">Nền tảng kết nối nhân tài và cơ hội nghề nghiệp.</p>
              </div>
              <div className="md:text-right">
                <p className="text-slate-900 font-black mb-2">Build with modern Tech-stack</p>
                <p className="text-slate-400 font-bold text-sm">Express.js • PostgreSQL • React • Tailwind</p>
                <div className="mt-6 text-slate-300 text-xs font-bold uppercase tracking-widest">
                    &copy; 2026 CVConnect International.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

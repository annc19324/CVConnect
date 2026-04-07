import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, LogIn, UserPlus, LogOut, User as UserIcon, MessageSquare } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import các trang
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import CVBuilderPage from './pages/CVBuilderPage';
import MyCVsPage from './pages/MyCVsPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

/**
 * Component Header thông minh - Tự động thay đổi dựa trên trạng thái đăng nhập
 */
const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-200 group-hover:rotate-6 transition-transform">
            CV
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tighter">
            CVConnect
          </span>
        </Link>
        
        {/* Links điều hướng chính */}
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
        </nav>

        {/* Khu vực User / Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Nút Dashboard */}
              <Link 
                to={user.role.name === 'RECRUITER' ? "/recruiter-dashboard" : "/candidate-dashboard"} 
                className="hidden sm:flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 hover:bg-primary-100 transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {/* Thông tin User */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 group cursor-pointer relative py-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-600 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-tight">{user.fullName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role.name}</p>
                </div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2" title="Đăng xuất">
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

/** Trang chủ Landing Page */
const HomePage = () => (
  <main className="w-full pt-32 pb-20">
    <section className="max-w-7xl mx-auto px-4 text-center">
      <div className="inline-block py-2 px-4 bg-primary-50 rounded-full text-primary-700 font-bold text-sm mb-8 animate-pulse">
         🚀 Nền tảng tuyển dụng Mini hàng đầu
      </div>
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]">
        Chạm đến <span className="text-primary-600">cơ hội</span><br />
        xứng tầm tài năng.
      </h1>
      <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
        Xây dựng sơ yếu lý lịch chuyên nghiệp, ứng tuyển nhanh chóng và nhận phản hồi tức thì 
        với hệ thống tin nhắn thời gian thực của CVConnect.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <Link to="/cv-builder" className="w-full sm:w-auto bg-primary-600 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 transform hover:-translate-y-1">
           Bắt đầu tạo CV
        </Link>
        <Link to="/jobs" className="w-full sm:w-auto bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-xl border-2 border-slate-100 hover:border-primary-100 hover:bg-slate-50 transition-all transform hover:-translate-y-1">
           Khám phá việc làm ⚡
        </Link>
      </div>
    </section>
  </main>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            
            {/* Route bảo vệ cho Ứng viên */}
            <Route path="/cv-builder" element={<ProtectedRoute><CVBuilderPage /></ProtectedRoute>} />
            <Route path="/cv-builder/:id" element={<ProtectedRoute><CVBuilderPage /></ProtectedRoute>} />
            <Route path="/my-cvs" element={<ProtectedRoute><MyCVsPage /></ProtectedRoute>} />
            <Route path="/candidate-dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
            
            {/* Route bảo vệ cho Nhà tuyển dụng */}
            <Route path="/recruiter-dashboard" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <footer className="w-full border-t border-slate-200 bg-white py-16 mt-20">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">CV</div>
                <span className="text-xl font-bold text-slate-900">CVConnect</span>
              </div>
              <div className="text-slate-400 font-bold text-sm">
                &copy; 2026 CVConnect. Built with Node.js & React.
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Briefcase, Clock, Eye, Trash2, 
  CheckCircle, XCircle, AlertCircle, Plus, MessageCircle,
  Download, ExternalLink, ChevronRight, Loader2
} from 'lucide-react';
import api from '../services/api';
import { CV, Application } from '../types';
import ChatWindow from '../components/ChatWindow';

const CandidateDashboard = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cvs' | 'applications'>('cvs');
  const [activeChatAppId, setActiveChatAppId] = useState<string | null>(null);

  /** 1. Tải toàn bộ dữ liệu khi mở dashboard */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cvsRes, appsRes] = await Promise.all([
          api.get('/cvs/my'),
          api.get('/applications/my')
        ]);
        setCvs(cvsRes.data.cvs);
        setApplications(appsRes.data.applications);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /** 2. Xoá CV */
  const handleDeleteCV = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này?')) return;
    try {
      await api.delete(`/cvs/${id}`);
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (error) {
      alert('Không thể xoá CV.');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
      ACCEPTED: 'bg-green-50 text-green-600 border-green-100',
      REJECTED: 'bg-red-50 text-red-600 border-red-100'
    };
    const labels: any = {
      PENDING: 'Đang chờ duyệt',
      ACCEPTED: 'Đã chấp nhận',
      REJECTED: 'Từ chối'
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 size={48} className="animate-spin text-primary-600 mb-4" />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Đang tải dữ liệu của bạn...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Xin chào, ứng viên!</h1>
            <p className="text-slate-500 font-medium mt-1">Quản lý hiệu quả hành trình sự nghiệp của bạn.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/cv-builder" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all transform hover:-translate-y-1 flex items-center gap-2">
              <Plus size={20} /> Tạo CV chuyên nghiệp
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-10 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
          <button 
            onClick={() => { setActiveTab('cvs'); setActiveChatAppId(null); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'cvs' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <FileText size={18} /> Hồ sơ của tôi ({cvs.length})
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'applications' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Briefcase size={18} /> Việc làm đã nộp ({applications.length})
          </button>
        </div>

        {activeTab === 'cvs' ? (
          /* TAB 1: DANH SÁCH CV */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {cvs.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <FileText size={40} />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Chưa có hồ sơ nào</p>
                <Link to="/cv-builder" className="mt-4 text-primary-600 font-bold hover:underline inline-block">Bắt đầu tạo ngay &rarr;</Link>
              </div>
            ) : (
              cvs.map(cv => (
                <div key={cv.id} className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-100/20 transition-all group relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${cv.pdfUrl ? 'bg-green-500' : 'bg-primary-500'}`}>
                      <FileText size={28} />
                    </div>
                    <button onClick={() => handleDeleteCV(cv.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">{cv.title}</h3>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8">Mẫu: {cv.template}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                       {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <div className="flex gap-3">
                      {cv.pdfUrl ? (
                         <a href={cv.pdfUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                            <Download size={18} />
                         </a>
                      ) : (
                         <Link to="/cv-builder" className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all shadow-sm" title="Hoàn thiện PDF">
                            <AlertCircle size={18} />
                         </Link>
                      )}
                      <Link to={`/cv-builder`} className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* TAB 2: ĐƠN ỨNG TUYỂN */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slide-up">
            <div className="lg:col-span-2 space-y-6">
              {applications.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[40px] border border-slate-100">
                  <Briefcase size={60} className="mx-auto text-slate-100 mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Bạn chưa nộp hồ sơ nào</p>
                </div>
              ) : (
                applications.map(app => (
                  <div key={app.id} className={`bg-white rounded-[32px] border transition-all overflow-hidden ${activeChatAppId === app.id ? 'border-primary-400 shadow-2xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
                    <div className="p-8">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                        <div className="flex gap-5">
                          <div className="w-20 h-20 bg-slate-50 rounded-[28px] border border-slate-100 p-3 flex items-center justify-center shrink-0">
                            {app.job?.company?.logoUrl ? (
                              <img src={app.job.company.logoUrl} alt="" className="w-full h-full object-contain rounded-xl" />
                            ) : (
                              <Briefcase size={32} className="text-slate-300" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 leading-none mb-2">{app.job?.title}</h3>
                            <p className="text-primary-600 font-bold mb-3">{app.job?.company?.name}</p>
                            <div className="flex flex-wrap items-center gap-4">
                               {getStatusBadge(app.status)}
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                 📅 {new Date(app.appliedDate).toLocaleDateString('vi-VN')}
                               </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => setActiveChatAppId(activeChatAppId === app.id ? null : app.id)}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black shadow-lg transition-all ${
                              activeChatAppId === app.id 
                              ? 'bg-slate-900 text-white ring-4 ring-slate-100' 
                              : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'
                            }`}
                          >
                            <MessageCircle size={20} />
                            Nhắn tin
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat Section */}
                    {activeChatAppId === app.id && (
                      <div className="bg-slate-50 border-t border-slate-100 p-6 animate-slide-up">
                        <ChatWindow 
                           applicationId={app.id} 
                           receiverId={app.job?.postedBy || ''} 
                           receiverName={app.job?.company?.name || 'Nhà tuyển dụng'}
                        />
                      </div>
                    )}
                  </div>
              ))
            )}
          </div>
          
          {/* Dashboard Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6">Thống kê hồ sơ</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Tổng số đơn nộp', val: applications.length, color: 'bg-primary-500' },
                    { label: 'Hồ sơ được chọn', val: applications.filter(a => a.status === 'ACCEPTED').length, color: 'bg-green-500' },
                    { label: 'Đang chờ xử lý', val: applications.filter(a => a.status === 'PENDING').length, color: 'bg-amber-500' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                        <span className="text-sm font-bold text-slate-500">{stat.label}</span>
                      </div>
                      <span className="text-xl font-black text-slate-900">{stat.val}</span>
                    </div>
                  ))}
                </div>
            </div>
            
            <div className="bg-primary-600 p-8 rounded-[40px] text-white shadow-2xl shadow-primary-200 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-black mb-2">Thăng tiến sự nghiệp?</h3>
                 <p className="text-primary-100 text-sm font-medium leading-relaxed mb-6">
                   Hệ thống AI sẽ sớm cập nhật tính năng gợi ý việc làm dựa trên CV của bạn.
                 </p>
                 <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-white animate-pulse"></div>
                 </div>
                 <p className="mt-2 text-[10px] font-bold text-primary-200 uppercase tracking-widest">Đang phát triển 65%</p>
               </div>
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;

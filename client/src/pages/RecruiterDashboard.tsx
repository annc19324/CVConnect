import { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Users, Building2, FileText,
  CheckCircle, XCircle, Clock, Eye, Loader2,
  ToggleLeft, ToggleRight, AlertCircle, ChevronDown, 
  MessageSquare, ExternalLink, Download, Search
} from 'lucide-react';
import api from '../services/api';
import { Job, Application } from '../types';
import ChatWindow from '../components/ChatWindow';

/**
 * Trang Dashboard của Nhà tuyển dụng (Recruiter).
 * Tích hợp tính năng Chat Realtime và Quản lý ứng viên tập trung.
 */

/** === TAB ĐĂNG TIN TUYỂN DỤNG === */
const PostJobTab = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requireCV, setRequireCV] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reqArray = requirements.split('\n').filter(r => r.trim().length > 0);
      await api.post('/jobs', { title, description, requirements: reqArray, salary, location, deadline, requireCV });
      setSuccessMsg('🎉 Đăng tin thành công!');
      // Reset
      setTitle(''); setDescription(''); setRequirements(''); setSalary(''); setLocation(''); setDeadline('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-medium transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 animate-slide-up">
      {successMsg && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-3xl text-green-700 font-black flex items-center gap-3">
          <CheckCircle size={24} /> {successMsg}
        </div>
      )}

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest pl-1">Tiêu đề công việc *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Full Stack Developer (React/Node)..." className={inputCls} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest pl-1">Địa điểm *</label>
             <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Hà Nội, TP.HCM, Remote..." className={inputCls} />
          </div>
          <div>
             <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest pl-1">Mức lương</label>
             <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Thoả thuận / Chi tiết..." className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest pl-1">Mô tả chi tiết *</label>
          <textarea rows={6} required value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} resize-none`} placeholder="Mô tả trách nhiệm công việc..." />
        </div>

        {/* TOGGLE REQUIRE CV */}
        <div className={`p-8 rounded-3xl border-2 transition-all ${requireCV ? 'border-primary-200 bg-primary-50/30' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center justify-between">
            <div>
               <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                 <FileText size={20} className={requireCV ? 'text-primary-600' : 'text-slate-400'} />
                 Yêu cầu ứng viên đính kèm CV?
               </h4>
               <p className="text-sm font-medium text-slate-500 mt-1">
                 {requireCV ? '✅ Hệ thống sẽ chỉ nhận đơn khi có CV đính kèm.' : '⚡ Linh hoạt: Ứng viên có thể nộp đơn không cần CV.'}
               </p>
            </div>
            <button type="button" onClick={() => setRequireCV(!requireCV)} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${requireCV ? 'bg-primary-600' : 'bg-slate-300'}`}>
               <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${requireCV ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
        {loading ? 'Đang xử lý...' : 'Đăng tin tuyển dụng ngay'}
      </button>
    </form>
  );
};

/** === TAB QUẢN LÝ ĐƠN ỨNG TUYỂN (TÍCH HỢP CHAT) === */
const ApplicationsTab = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatAppId, setActiveChatAppId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/applications/recruiter')
      .then(res => setApplications(res.data.applications))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert('Lỗi cập nhật trạng thái.');
    }
  };

  if (loading) return <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest text-xs animate-pulse">Đang nạp danh sách hồ sơ...</div>;

  return (
    <div className="space-y-6 animate-slide-up">
      {applications.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
            <Users size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-bold">Chưa có ứng viên nào nộp đơn.</p>
        </div>
      ) : (
        applications.map(app => (
          <div key={app.id} className={`bg-white rounded-[32px] border transition-all overflow-hidden ${activeChatAppId === app.id ? 'border-primary-400 shadow-2xl scale-[1.01]' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Ứng viên Info */}
                <div className="flex gap-5">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600 font-black text-xl border border-slate-100 uppercase">
                      {(app as any).candidate?.fullName[0]}
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-none">{(app as any).candidate?.fullName}</h4>
                      <p className="text-slate-400 font-bold text-xs mt-1">Ứng tuyển vị trí <span className="text-primary-600">{(app as any).job?.title}</span></p>
                      
                      <div className="flex flex-wrap gap-4 mt-3">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           app.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                           app.status === 'ACCEPTED' ? 'bg-green-50 text-green-600 border-green-100' :
                           'bg-red-50 text-red-500 border-red-100'
                         }`}>
                           {app.status}
                         </span>
                         {(app as any).cv?.pdfUrl ? (
                            <a href={(app as any).cv.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-black text-primary-500 hover:underline">
                               <FileText size={14} /> Xem CV PDF
                            </a>
                         ) : (
                            <span className="text-xs text-slate-300 font-bold italic">Không đính kèm CV</span>
                         )}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                   {app.status === 'PENDING' && (
                     <>
                        <button onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold text-xs flex items-center gap-1.5 px-4">
                           <CheckCircle size={16} /> Chấp nhận
                        </button>
                        <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="p-3 bg-red-400 text-white rounded-xl hover:bg-red-500 transition-all font-bold text-xs flex items-center gap-1.5 px-4">
                           <XCircle size={16} /> Từ chối
                        </button>
                     </>
                   )}
                   <button 
                     onClick={() => setActiveChatAppId(activeChatAppId === app.id ? null : app.id)}
                     className={`p-4 rounded-2xl transition-all ${activeChatAppId === app.id ? 'bg-slate-900 text-white ring-4 ring-slate-100' : 'bg-slate-50 text-slate-400 hover:text-primary-600'}`}
                   >
                     <MessageSquare size={20} />
                   </button>
                </div>
              </div>
            </div>

            {/* Hidden Chat Area */}
            {activeChatAppId === app.id && (
              <div className="bg-slate-50 border-t border-slate-100 p-8 animate-slide-up">
                <ChatWindow 
                   applicationId={app.id} 
                   receiverId={app.candidateId} 
                   receiverName={(app as any).candidate?.fullName || 'Ứng viên'} 
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState<'post' | 'applications'>('post');

  const tabs = [
    { id: 'post', label: 'Đăng tin mới', icon: Plus },
    { id: 'applications', label: 'Đơn ứng tuyển', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Bảng điều phối <span className="text-primary-600">Tuyển dụng</span></h1>
             <p className="text-slate-500 font-medium">Tìm kiếm tài năng phù hợp nhất cho doanh nghiệp của bạn.</p>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex gap-2 mb-10 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
           {tabs.map(({ id, label, icon: Icon }) => (
             <button
               key={id}
               onClick={() => setActiveTab(id)}
               className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                 activeTab === id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'
               }`}
             >
               <Icon size={18} /> {label}
             </button>
           ))}
        </div>

        {/* Content Section */}
        <div className="min-h-[500px]">
           {activeTab === 'post' && <PostJobTab />}
           {activeTab === 'applications' && <ApplicationsTab />}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

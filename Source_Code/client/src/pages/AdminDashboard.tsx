import { useState, useEffect } from 'react';
import { 
  Users, Briefcase, FileText, BarChart3, 
  Trash2, Shield, Search, Loader2, 
  CheckCircle, XCircle, MoreVertical
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'jobs' | 'cvs'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } else if (activeTab === 'jobs') {
        const res = await api.get('/admin/jobs');
        setJobs(res.data.jobs);
      } else if (activeTab === 'cvs') {
        const res = await api.get('/admin/cvs');
        setCvs(res.data.cvs);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Xác nhận xoá người dùng này?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { alert('Lỗi khi xoá.'); }
  };

  const handleUpdateJobStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await api.patch(`/admin/jobs/${id}/status`, { status: newStatus });
      setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
    } catch (err) { alert('Lỗi khi cập nhật.'); }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Xác nhận xoá tin tuyển dụng này?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) { alert('Lỗi khi xoá.'); }
  };

  const handleDeleteCV = async (id: string) => {
    if (!window.confirm('Xác nhận xoá CV này?')) return;
    try {
      await api.delete(`/admin/cvs/${id}`);
      setCvs(cvs.filter(c => c.id !== id));
    } catch (err) { alert('Lỗi khi xoá.'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Shield size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hệ thống <span className="text-primary-600">Quản trị</span></h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
          {[
            { id: 'stats', label: 'Thống kê', icon: BarChart3 },
            { id: 'users', label: 'Người dùng', icon: Users },
            { id: 'jobs', label: 'Tin tuyển dụng', icon: Briefcase },
            { id: 'cvs', label: 'Hồ sơ CV', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'stats' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Người dùng', val: stats.totalUsers, color: 'blue', icon: Users },
                  { label: 'Tin tuyển dụng', val: stats.totalJobs, color: 'indigo', icon: Briefcase },
                  { label: 'Hồ sơ CV', val: stats.totalCVs, color: 'amber', icon: FileText },
                  { label: 'Đơn ứng tuyển', val: stats.totalApplications, color: 'emerald', icon: CheckCircle },
                ].map(s => (
                  <div key={s.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${s.color}-50 text-${s.color}-600`}>
                      <s.icon size={24} />
                    </div>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{s.label}</p>
                    <h3 className="text-4xl font-black text-slate-900">{s.val}</h3>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'users' || activeTab === 'jobs' || activeTab === 'cvs') && (
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                  <h3 className="font-black text-slate-800">Danh sách {activeTab === 'users' ? 'Người dùng' : activeTab === 'jobs' ? 'Tin đăng' : 'Hồ sơ'}</h3>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" placeholder="Tìm kiếm nhanh..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-xs font-black uppercase tracking-widest">
                      <tr>
                        {activeTab === 'users' && (
                          <>
                            <th className="px-6 py-4">Thành viên</th>
                            <th className="px-6 py-4">Vai trò</th>
                            <th className="px-6 py-4">Ngày tham gia</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                          </>
                        )}
                        {activeTab === 'jobs' && (
                          <>
                            <th className="px-6 py-4">Vị trí & Công ty</th>
                            <th className="px-6 py-4">Người đăng</th>
                            <th className="px-6 py-4">Ứng tuyển</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                          </>
                        )}
                        {activeTab === 'cvs' && (
                          <>
                            <th className="px-6 py-4">Tên CV</th>
                            <th className="px-6 py-4">Chủ sở hữu</th>
                            <th className="px-6 py-4">Ngày tạo</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activeTab === 'users' && users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden font-bold">
                                {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.fullName[0]}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-none mb-1">{u.fullName}</p>
                                <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                              u.role.name === 'ADMIN' ? 'bg-red-50 text-red-600' : 
                              u.role.name === 'RECRUITER' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {u.role.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {u.role.name !== 'ADMIN' && (
                              <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {activeTab === 'jobs' && jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase())).map(j => (
                        <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 leading-none mb-1">{j.title}</p>
                            <p className="text-xs text-primary-600 font-bold">{j.company.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">{j.author.fullName}</p>
                            <p className="text-xs text-slate-400">{j.author.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900">
                             {j._count.applications}
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleUpdateJobStatus(j.id, j.status)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                j.status === 'OPEN' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {j.status === 'OPEN' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {j.status}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteJob(j.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {activeTab === 'cvs' && cvs.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{c.title}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">
                            {c.user.fullName}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteCV(c.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

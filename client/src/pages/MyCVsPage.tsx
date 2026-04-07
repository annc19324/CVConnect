import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, FileText, Download, Loader2, Calendar } from 'lucide-react';
import api from '../services/api';

const MyCVsPage = () => {
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const res = await api.get('/cvs/my');
      setCvs(res.data.cvs);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách CV:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này không?')) return;
    try {
      await api.delete(`/cvs/${id}`);
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (err) {
      console.error('Lỗi khi xoá CV:', err);
      alert('Không thể xoá CV.');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý <span className="text-primary-600">CV của tôi</span></h1>
            <p className="text-slate-500 font-medium mt-1">Xem, cập nhật và tải xuống các mẫu CV bạn đã tạo.</p>
          </div>
          <Link to="/cv-builder" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-primary-200 transform hover:-translate-y-1">
            <Plus size={20} />
            Tạo CV Mới
          </Link>
        </div>

        {cvs.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn chưa có CV nào</h3>
            <p className="text-slate-500 mb-8">Hãy bắt đầu tạo CV đầu tiên để chinh phục nhà tuyển dụng nhé!</p>
            <Link to="/cv-builder" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200">
              Tạo CV ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map(cv => (
              <div key={cv.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col hover:border-primary-100 hover:shadow-xl hover:shadow-primary-50 transition-all group">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">
                      {cv.template}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 truncate" title={cv.title}>{cv.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Calendar size={16} />
                    <span>Cập nhật: {new Date(cv.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                  <Link to={`/cv-builder/${cv.id}`} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Edit2 size={16} /> Sửa
                  </Link>
                  {cv.pdfUrl ? (
                    <a href={cv.pdfUrl} target="_blank" rel="noreferrer" className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors" title="Tải PDF">
                      <Download size={16} /> PDF
                    </a>
                  ) : (
                    <Link to={`/cv-builder/${cv.id}`} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors" title="Cần xuất PDF">
                      <Download size={16} /> Xuất
                    </Link>
                  )}
                  <button onClick={() => handleDelete(cv.id)} className="w-[42px] h-[42px] bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCVsPage;

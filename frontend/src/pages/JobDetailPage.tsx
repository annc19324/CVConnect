import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, DollarSign, Clock, Building2, FileText,
  Send, CheckCircle, AlertCircle, ArrowLeft, Loader2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Job, CV } from '../types';

/**
 * Trang Chi tiết Việc làm + Form Nộp đơn ứng tuyển.
 * Tích hợp logic requireCV: bắt buộc hoặc tuỳ chọn đính kèm CV.
 */
const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [myCVs, setMyCVs] = useState<CV[]>([]);
  const [selectedCVId, setSelectedCVId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Lấy chi tiết job khi trang được mở
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/detail/${id}`);
        setJob(res.data.job);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  /**
   * Khi người dùng nhấn "Ứng tuyển", tải danh sách CV của họ (nếu đã đăng nhập).
   */
  const handleShowApplyForm = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role.name !== 'CANDIDATE') {
      setErrorMsg('Chỉ ứng viên mới có thể nộp đơn ứng tuyển.');
      return;
    }

    try {
      // Tải danh sách CV của ứng viên
      const res = await api.get('/cvs/my');
      setMyCVs(res.data.cvs);
      setShowApplyForm(true);
    } catch (error) {
      console.error('Lỗi khi tải CV:', error);
    }
  };

  /**
   * Xử lý nộp đơn ứng tuyển.
   * LOGIC QUAN TRỌNG:
   * - Nếu job.requireCV = true và chưa chọn CV → báo lỗi
   * - Nếu job.requireCV = false → cv_id có thể bỏ trống
   */
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Kiểm tra requireCV phía Frontend (phòng ngừa bổ sung)
    if (job?.requireCV && !selectedCVId) {
      setErrorMsg('Vị trí này yêu cầu đính kèm CV. Vui lòng chọn hoặc tạo mới CV.');
      return;
    }

    setApplying(true);
    try {
      await api.post('/applications', {
        jobId: id,
        cvId: selectedCVId || null, // null nếu không chọn
        coverLetter,
      });
      setSuccessMsg('🎉 Nộp đơn thành công! Nhà tuyển dụng sẽ xem xét hồ sơ của bạn.');
      setShowApplyForm(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi nộp đơn.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold pt-24">Đang tải...</div>;
  }

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold pt-24">Không tìm thấy tin tuyển dụng.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Nút quay lại */}
        <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-6 transition-colors">
          <ArrowLeft size={18} /> Quay lại danh sách
        </button>

        {/* Card chính */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
          {/* Header với gradient */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                {job.company?.logoUrl ? (
                  <img src={job.company.logoUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <Building2 size={36} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2">{job.title}</h1>
                <p className="text-primary-200 font-bold text-lg">{job.company?.name}</p>
              </div>
            </div>
          </div>

          {/* Thông tin nhanh */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <MapPin size={18} className="text-primary-500" /> {job.location}
              </div>
              {job.salary && (
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <DollarSign size={18} className="text-green-500" /> {job.salary}
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Clock size={18} className="text-amber-500" /> Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                </div>
              )}
              {/* Badge requireCV */}
              {job.requireCV ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 font-bold rounded-full text-sm border border-amber-100">
                  <FileText size={14} /> Bắt buộc đính kèm CV
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-bold rounded-full text-sm border border-green-100">
                  <CheckCircle size={14} /> CV không bắt buộc
                </div>
              )}
            </div>
          </div>

          {/* Mô tả công việc */}
          <div className="p-8">
            <h2 className="text-xl font-black text-slate-900 mb-4">Mô tả công việc</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</div>

            {/* Yêu cầu */}
            {job.requirements && (
              <div className="mt-8">
                <h2 className="text-xl font-black text-slate-900 mb-4">Yêu cầu ứng viên</h2>
                {Array.isArray(job.requirements) ? (
                  <ul className="list-disc list-inside text-slate-600 space-y-2">
                    {(job.requirements as string[]).map((req, idx) => (
                      <li key={idx} className="leading-relaxed">{req}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {JSON.stringify(job.requirements, null, 2)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Khu vực Nộp đơn */}
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            {/* Thông báo thành công */}
            {successMsg && (
              <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold flex items-center gap-3">
                <CheckCircle size={24} /> {successMsg}
              </div>
            )}

            {/* Thông báo lỗi */}
            {errorMsg && (
              <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold flex items-center gap-3">
                <AlertCircle size={24} /> {errorMsg}
              </div>
            )}

            {/* Nút Ứng tuyển */}
            {!showApplyForm && !successMsg && (
              <button
                onClick={handleShowApplyForm}
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-primary-100 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <Send size={22} /> Ứng tuyển ngay
              </button>
            )}

            {/* Form nộ đơn (hiện ra khi nhấn "Ứng tuyển ngay") */}
            {showApplyForm && (
              <form onSubmit={handleApply} className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-xl font-black text-slate-900">Nộp đơn ứng tuyển</h3>

                {/* ======================================================
                    PHẦN CHỌN CV - Logic dựa vào job.requireCV
                    ====================================================== */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    <FileText size={16} className="inline mr-2" />
                    Chọn CV đính kèm
                    {job.requireCV ? (
                      <span className="text-red-500 ml-1">* (Bắt buộc)</span>
                    ) : (
                      <span className="text-slate-400 ml-1">(Không bắt buộc)</span>
                    )}
                  </label>

                  {myCVs.length === 0 ? (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm font-medium">
                      Bạn chưa có CV nào.{' '}
                      <a href="/cv-builder" className="text-primary-600 font-bold hover:underline">Tạo CV ngay</a>
                      {!job.requireCV && (
                        <span className="block mt-1 text-slate-500">Bạn vẫn có thể nộp đơn mà không cần CV.</span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Tuỳ chọn "Không đính kèm CV" - chỉ hiển thị khi KHÔNG bắt buộc */}
                      {!job.requireCV && (
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="radio"
                            name="cvSelect"
                            value=""
                            checked={selectedCVId === ''}
                            onChange={() => setSelectedCVId('')}
                            className="w-5 h-5 text-primary-600"
                          />
                          <span className="font-medium text-slate-600">Không đính kèm CV</span>
                        </label>
                      )}

                      {/* Danh sách CV của ứng viên */}
                      {myCVs.map((cv) => (
                        <label
                          key={cv.id}
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                            selectedCVId === cv.id
                              ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                              : 'border-slate-100 hover:border-primary-100 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="cvSelect"
                            value={cv.id}
                            checked={selectedCVId === cv.id}
                            onChange={() => setSelectedCVId(cv.id)}
                            className="w-5 h-5 text-primary-600"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{cv.title}</p>
                            <p className="text-xs text-slate-400">Mẫu: {cv.template} • Cập nhật: {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thư xin việc (Cover Letter) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thư giới thiệu (Tuỳ chọn)</label>
                  <textarea
                    rows={4}
                    placeholder="Giới thiệu bản thân, tại sao bạn phù hợp với vị trí này?"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50/50 focus:border-primary-500 transition-all font-medium resize-none"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                {/* Nút gửi */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Huỷ bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {applying ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                    {applying ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;

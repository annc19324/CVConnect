import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, BookOpen, Briefcase,
  Plus, Trash2, Save, Loader2, CheckCircle, FileText, Download, UploadCloud
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer'; // Dùng để generate PDF blob
import api from '../services/api';
import { CVData } from '../types';
import CVTemplate from '../components/CVTemplate'; // Import Template vừa tạo

/**
 * Trang CV Builder - Tích hợp Xuất PDF & Lưu trữ Cloudinary.
 */

const defaultCVData: CVData = {
  personalInfo: {
    fullName: '', email: '', phone: '', address: '', summary: '',
  },
  education: [{ school: '', degree: '', field: '', startDate: '', endDate: '' }],
  experience: [{ company: '', position: '', description: '', startDate: '', endDate: '' }],
  skills: [''],
};

const CVBuilderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cvId, setCvId] = useState<string | null>(null); // Lưu ID sau khi tạo JSON lần đầu
  const [cvTitle, setCVTitle] = useState('');
  const [template, setTemplate] = useState('modern');
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (id) {
      setCvId(id);
      api.get(`/cvs/${id}`).then(res => {
        const cv = res.data.cv;
        if (cv) {
          setCVTitle(cv.title);
          setTemplate(cv.template);
          if (cv.data) setCVData(cv.data);
        }
      }).catch(err => console.error("Lỗi khi tải CV:", err));
    }
  }, [id]);

  /** 1. Lưu thông tin JSON vào Database */
  const handleSaveJson = async () => {
    if (!cvTitle.trim()) return alert('Vui lòng đặt tiêu đề cho CV.');
    setSaving(true);
    try {
      let res;
      if (cvId) {
        res = await api.put(`/cvs/${cvId}`, { title: cvTitle, template, data: cvData });
      } else {
        res = await api.post('/cvs', { title: cvTitle, template, data: cvData });
        setCvId(res.data.cv.id);
      }
      return res.data.cv;
    } catch (err) {
      console.error('Lỗi khi lưu JSON:', err);
      return null;
    } finally {
      setSaving(false);
    }
  };

  /** 2. Xuất PDF & Upload lên Cloudinary */
  const handleExportAndUpload = async () => {
    // Trước khi xuất PDF, ta lưu JSON trước để đảm bảo dữ liệu mới nhất
    const savedCV = await handleSaveJson();
    if (!savedCV) return;

    setExporting(true);
    try {
      // BƯỚC A: Render PDF ra Blob
      const blob = await pdf(<CVTemplate data={cvData} />).toBlob();
      
      // BƯỚC B: Chuyển Blob thành File để gửi qua FormData (Multer nhận)
      const file = new File([blob], `${cvTitle.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('pdf', file);

      // BƯỚC C: Gọi API Backend để upload lên Cloudinary
      await api.post(`/cvs/${savedCV.id}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('🎉 CV đã được lưu và xuất PDF thành công lên Cloudinary!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Lỗi khi xuất/upload PDF:', err);
      alert('Có lỗi xảy ra khi tạo file PDF.');
    } finally {
      setExporting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-medium transition-all text-sm";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header với 2 tầng nút */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">CVConnect <span className="text-primary-600">Builder</span></h1>
            <p className="text-slate-500 font-medium mt-1">Tạo hồ sơ chuyên nghiệp chỉ trong vài phút.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveJson} disabled={saving || exporting}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="text-slate-400" />}
              Lưu bản nháp
            </button>
            <button
              onClick={handleExportAndUpload} disabled={saving || exporting}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {exporting ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
              {exporting ? 'Đang xử lý PDF...' : 'Lưu & Xuất PDF'}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold flex items-center gap-3 animate-slide-up">
            <CheckCircle size={24} /> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Thông tin CV */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                <FileText size={18} />
              </div>
              Bắt đầu với tiêu đề
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Tiêu đề CV của bạn *</label>
                <input className={inputCls} placeholder="VD: Senior React Developer 2026"
                  value={cvTitle} onChange={(e) => setCVTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Mẫu thiết kế PDF</label>
                <select className={inputCls} value={template} onChange={(e) => setTemplate(e.target.value)}>
                  <option value="modern">Modern - Thanh lịch & Hiện đại</option>
                  <option value="classic">Classic - Truyền thống</option>
                  <option value="minimal">Minimal - Tối giản</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Thông tin cá nhân */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Họ và tên *', field: 'fullName', placeholder: 'Nguyễn Văn A' },
                { label: 'Email liên hệ *', field: 'email', placeholder: 'name@example.com' },
                { label: 'Số điện thoại', field: 'phone', placeholder: '09xxxxxxxxx' },
                { label: 'Địa chỉ hiện tại', field: 'address', placeholder: 'Quận 1, TP. Hồ Chí Minh' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-600 mb-2">{label}</label>
                  <input
                    className={inputCls} placeholder={placeholder}
                    value={(cvData.personalInfo as any)[field]}
                    onChange={(e) => updatePersonalInfo(field, e.target.value)}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-2">Giới thiệu ngắn gọn bản thân</label>
                <textarea rows={4} className={`${inputCls} resize-none`}
                  placeholder="Chia sẻ về đam mê, mục tiêu nghề nghiệp và những gì tốt nhất của bạn..."
                  value={cvData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Học vấn */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                  <BookOpen size={18} />
                </div>
                Quá trình học vấn
              </h2>
              <button onClick={addEducation} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                <Plus size={16} /> Thêm trường học
              </button>
            </div>
            <div className="space-y-6">
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
                  <button onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Tên trường học</label>
                      <input className={inputCls} placeholder="Đại học Bách Khoa"
                        value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Chuyên ngành</label>
                      <input className={inputCls} placeholder="Khoa học Máy tính"
                        value={edu.field} onChange={(e) => updateEducation(idx, 'field', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Bằng cấp</label>
                      <input className={inputCls} placeholder="Kỹ sư / Cử nhân"
                        value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Thời gian bắt đầu</label>
                      <input className={inputCls} placeholder="09/2020"
                        value={edu.startDate} onChange={(e) => updateEducation(idx, 'startDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Thời gian kết thúc</label>
                      <input className={inputCls} placeholder="Hiện tại / 06/2024"
                        value={edu.endDate} onChange={(e) => updateEducation(idx, 'endDate', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kinh nghiệm */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Briefcase size={18} />
                </div>
                Kinh nghiệm làm việc
              </h2>
              <button onClick={addExperience} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                <Plus size={16} /> Thêm công việc
              </button>
            </div>
            <div className="space-y-6">
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
                  <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Tên công ty</label>
                      <input className={inputCls} placeholder="Example Tech Corp"
                        value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Vị trí đảm nhiệm</label>
                      <input className={inputCls} placeholder="Full Stack Developer"
                        value={exp.position} onChange={(e) => updateExperience(idx, 'position', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Từ ngày</label>
                      <input className={inputCls} placeholder="01/2022"
                        value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Đến ngày</label>
                      <input className={inputCls} placeholder="Hiện tại"
                        value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Mô tả công việc & dự án đã làm</label>
                      <textarea rows={4} className={`${inputCls} resize-none`}
                        placeholder="Nêu bật kết quả từ công việc này..."
                        value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kỹ năng */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                  <UploadCloud size={18} />
                </div>
                Kỹ năng chuyên môn
              </h2>
              <button
                onClick={() => setCVData((prev) => ({ ...prev, skills: [...prev.skills, ''] }))}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cvData.skills.map((skill, idx) => (
                <div key={idx} className="relative group">
                  <input
                    className={inputCls} placeholder={`Kỹ năng ${idx + 1}`}
                    value={skill} onChange={(e) => updateSkill(idx, e.target.value)}
                  />
                  {cvData.skills.length > 1 && (
                    <button
                      onClick={() => setCVData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nút lưu cuối trang */}
        <div className="mt-12 flex justify-center pb-10">
          <button
            onClick={handleExportAndUpload} disabled={exporting || saving}
            className="flex items-center gap-3 px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-primary-200 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
            {exporting ? 'Đang tạo PDF...' : 'Hoàn tất & Xuất bản CV'}
          </button>
        </div>
      </div>
    </div>
  );

  /** Hàm tiện ích cập nhật thông tin */
  function updatePersonalInfo(field: string, value: string) {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };
  function updateEducation(idx: number, field: string, value: string) {
    setCVData((prev) => {
      const updated = [...prev.education];
      (updated[idx] as any)[field] = value;
      return { ...prev, education: updated };
    });
  };
  function addEducation() {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', startDate: '', endDate: '' }],
    }));
  };
  function removeEducation(idx: number) {
    setCVData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  };
  function updateExperience(idx: number, field: string, value: string) {
    setCVData((prev) => {
      const updated = [...prev.experience];
      (updated[idx] as any)[field] = value;
      return { ...prev, experience: updated };
    });
  };
  function addExperience() {
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', description: '', startDate: '', endDate: '' }],
    }));
  };
  function removeExperience(idx: number) {
    setCVData((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
  };
  function updateSkill(idx: number, value: string) {
    setCVData((prev) => {
      const updated = [...prev.skills];
      updated[idx] = value;
      return { ...prev, skills: updated };
    });
  };
};

export default CVBuilderPage;

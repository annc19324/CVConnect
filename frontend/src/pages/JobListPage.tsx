import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, DollarSign, Clock, Building2,
  Briefcase, Filter, FileText, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import { Job } from '../types';

/**
 * Trang Danh sách Việc làm - Hiển thị tất cả tin tuyển dụng đang mở (OPEN).
 * Hỗ trợ tìm kiếm theo từ khóa và địa điểm.
 */
const JobListPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  // Lấy danh sách việc làm khi trang được tải lần đầu
  useEffect(() => {
    fetchJobs();
  }, []);

  /**
   * Gọi API lấy danh sách job, có thể truyền keyword và location để lọc.
   */
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs);
    } catch (error) {
      console.error('Lỗi khi tải danh sách việc làm:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý khi nhấn nút Tìm kiếm
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* Thanh tìm kiếm nổi bật */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-black text-white mb-2 text-center">Khám phá cơ hội việc làm</h1>
          <p className="text-primary-200 text-center mb-8 font-medium">Hàng ngàn tin tuyển dụng hấp dẫn đang chờ bạn</p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-3 shadow-2xl">
            {/* Ô tìm theo Từ khóa */}
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-slate-50 rounded-xl">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Vị trí, kỹ năng, công ty..."
                className="flex-1 bg-transparent outline-none font-medium text-slate-700 placeholder:text-slate-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Ô tìm theo Địa điểm */}
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-slate-50 rounded-xl">
              <MapPin size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Hà Nội, TP.HCM, Hải Phòng..."
                className="flex-1 bg-transparent outline-none font-medium text-slate-700 placeholder:text-slate-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Danh sách Job */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            {jobs.length} việc làm được tìm thấy
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold text-lg">Đang tải...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Briefcase size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold text-lg">Chưa có tin tuyển dụng nào.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  {/* Logo Công ty */}
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    {job.company?.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <Building2 size={28} className="text-primary-500" />
                    )}
                  </div>

                  {/* Nội dung chính */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                        {job.title}
                      </h3>
                      {/* Badge yêu cầu CV */}
                      {job.requireCV ? (
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100 flex items-center gap-1 whitespace-nowrap">
                          <FileText size={12} /> Yêu cầu CV
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100 whitespace-nowrap">
                          CV không bắt buộc
                        </span>
                      )}
                    </div>
                    <p className="text-primary-600 font-bold mb-3">{job.company?.name}</p>

                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin size={14} className="text-slate-400" /> {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <DollarSign size={14} className="text-slate-400" /> {job.salary}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={14} className="text-slate-400" /> Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mũi tên chỉ hướng */}
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-primary-500 transition-colors shrink-0 mt-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListPage;

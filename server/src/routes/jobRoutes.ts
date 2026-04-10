import { Router } from 'express';
import { createJob, getAllJobs, getJobById, getRecruiterJobs } from '../controllers/jobController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const jobRouter = Router();

/**
 * Các API cho việc lấy thông tin tin tuyển dụng (Public)
 */
// Lấy danh sách tin (Tìm kiếm, hiển thị Home)
jobRouter.get('/', getAllJobs);

// Xem chi tiết tin cụ thể
jobRouter.get('/detail/:id', getJobById);


/**
 * Các API quản lý tin dành riêng cho Nhà tuyển dụng (Recruiter)
 */
// Đăng tin mới (Yêu cầu đăng nhập + vai trò RECRUITER)
jobRouter.post('/', authMiddleware, roleMiddleware(['RECRUITER']), createJob);

// Xem các tin của chính mình (Recruiter tự quản lý)
jobRouter.get('/recruiter/my-jobs', authMiddleware, roleMiddleware(['RECRUITER']), getRecruiterJobs);

export default jobRouter;

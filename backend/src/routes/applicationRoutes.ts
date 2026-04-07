import { Router } from 'express';
import {
  applyJob,
  getApplicationsForRecruiter,
  getMyApplications,
  updateApplicationStatus,
} from '../controllers/applicationController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const applicationRouter = Router();

/**
 * Các API cho Đơn ứng tuyển - đều yêu cầu xác thực.
 */

// Ứng viên nộp đơn ứng tuyển
applicationRouter.post('/', authMiddleware, roleMiddleware(['CANDIDATE']), applyJob);

// Ứng viên xem lịch sử ứng tuyển của mình
applicationRouter.get('/my', authMiddleware, roleMiddleware(['CANDIDATE']), getMyApplications);

// Recruiter xem tất cả đơn ứng tuyển (có thể lọc theo ?jobId=...)
applicationRouter.get('/recruiter', authMiddleware, roleMiddleware(['RECRUITER']), getApplicationsForRecruiter);

// Recruiter cập nhật trạng thái đơn (ACCEPTED / REJECTED)
applicationRouter.patch('/:id/status', authMiddleware, roleMiddleware(['RECRUITER']), updateApplicationStatus);

export default applicationRouter;

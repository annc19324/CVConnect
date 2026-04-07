import { Router } from 'express';
import {
  getAllUsers, updateUserRole, deleteUser,
  getStats, adminGetAllJobs, adminDeleteJob,
} from '../controllers/adminController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const adminRouter = Router();

/**
 * Tất cả API Admin đều yêu cầu: Đăng nhập + Vai trò ADMIN.
 */

// Thống kê hệ thống
adminRouter.get('/stats', authMiddleware, roleMiddleware(['ADMIN']), getStats);

// Quản lý người dùng
adminRouter.get('/users', authMiddleware, roleMiddleware(['ADMIN']), getAllUsers);
adminRouter.patch('/users/:id/role', authMiddleware, roleMiddleware(['ADMIN']), updateUserRole);
adminRouter.delete('/users/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteUser);

// Quản lý tin tuyển dụng
adminRouter.get('/jobs', authMiddleware, roleMiddleware(['ADMIN']), adminGetAllJobs);
adminRouter.delete('/jobs/:id', authMiddleware, roleMiddleware(['ADMIN']), adminDeleteJob);

export default adminRouter;

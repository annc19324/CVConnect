import { Router } from 'express';
import {
  getAllUsers, updateUserRole, deleteUser,
  getStats, adminGetAllJobs, adminDeleteJob,
  adminUpdateJobStatus, adminGetAllCVs, adminDeleteCV
} from '../controllers/adminController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const adminRouter = Router();

// Tất cả yêu cầu ADMIN
const adminAuth = [authMiddleware, roleMiddleware(['ADMIN'])];

// Thống kê
adminRouter.get('/stats', adminAuth, getStats);

// Quản lý người dùng
adminRouter.get('/users', adminAuth, getAllUsers);
adminRouter.patch('/users/:id/role', adminAuth, updateUserRole);
adminRouter.delete('/users/:id', adminAuth, deleteUser);

// Quản lý tin tuyển dụng
adminRouter.get('/jobs', adminAuth, adminGetAllJobs);
adminRouter.patch('/jobs/:id/status', adminAuth, adminUpdateJobStatus);
adminRouter.delete('/jobs/:id', adminAuth, adminDeleteJob);

// Quản lý CV
adminRouter.get('/cvs', adminAuth, adminGetAllCVs);
adminRouter.delete('/cvs/:id', adminAuth, adminDeleteCV);

export default adminRouter;

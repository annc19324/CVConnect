import { Router } from 'express';
import { updateCompany, getMyCompany } from '../controllers/companyController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const companyRouter = Router();

/**
 * Các API quản lý thông tin Công ty - chỉ dành cho Nhà tuyển dụng (RECRUITER)
 */

// Lấy thông tin công ty của Recruiter hiện tại
companyRouter.get('/my', authMiddleware, roleMiddleware(['RECRUITER']), getMyCompany);

// Tạo hoặc cập nhật thông tin công ty
companyRouter.put('/my', authMiddleware, roleMiddleware(['RECRUITER']), updateCompany);

export default companyRouter;

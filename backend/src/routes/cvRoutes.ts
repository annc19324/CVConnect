import { Router } from 'express';
import {
  createCV, updateCV, getMyCVs,
  getCVById, uploadCVPdf, deleteCV
} from '../controllers/cvController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import { uploadPDF } from '../middlewares/uploadMiddleware';

const cvRouter = Router();

/**
 * Tất cả API CV đều yêu cầu đã đăng nhập.
 */

// Tạo CV mới
cvRouter.post('/', authMiddleware, roleMiddleware(['CANDIDATE']), createCV);

// Lấy danh sách CV của bản thân
cvRouter.get('/my', authMiddleware, roleMiddleware(['CANDIDATE']), getMyCVs);

// Xem chi tiết CV (Candidate tự xem hoặc Recruiter xem hồ sơ ứng viên)
cvRouter.get('/:id', authMiddleware, getCVById);

// Cập nhật nội dung CV
cvRouter.put('/:id', authMiddleware, roleMiddleware(['CANDIDATE']), updateCV);

// Xoá CV
cvRouter.delete('/:id', authMiddleware, roleMiddleware(['CANDIDATE']), deleteCV);

// Upload file PDF lên Cloudinary (Sau khi tạo PDF từ @react-pdf/renderer ở Frontend)
cvRouter.post('/:id/upload-pdf', authMiddleware, roleMiddleware(['CANDIDATE']), uploadPDF.single('pdf'), uploadCVPdf);

export default cvRouter;

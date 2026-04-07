import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRouter = Router();

/**
 * Định nghĩa các API xác thực người dùng.
 * Các API POST cho đăng ký và đăng nhập được thực hiện công khai (Public).
 */

// Đăng ký mới (Candidate / Recruiter)
authRouter.post('/register', register);

// Đăng nhập vào hệ thống
authRouter.post('/login', login);

// Lấy thông tin User hiện tại dựa trên Token gửi lên đầu tiên khi trang web được tải
// (Yêu cầu phải có Header Authorization: Bearer <token>)
authRouter.get('/me', authMiddleware, getMe);

export default authRouter;

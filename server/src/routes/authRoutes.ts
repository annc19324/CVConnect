import { Router } from 'express';
import { 
  register, login, getMe, 
  forgotPassword, resetPassword, changePassword 
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRouter = Router();

/**
 * Định nghĩa các API xác thực người dùng.
 */

// Đăng ký mới (Candidate / Recruiter)
authRouter.post('/register', register);

// Đăng nhập vào hệ thống
authRouter.post('/login', login);

// Lấy thông tin User hiện tại
authRouter.get('/me', authMiddleware, getMe);

// Quên mật khẩu & Reset
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

// Đổi mật khẩu (Yêu cầu login)
authRouter.post('/change-password', authMiddleware, changePassword);

export default authRouter;

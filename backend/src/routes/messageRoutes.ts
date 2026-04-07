import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import { authMiddleware } from '../middlewares/authMiddleware';

const messageRouter = Router();

/**
 * Các API tin nhắn - yêu cầu xác thực.
 * Tin nhắn được gắn với một Application cụ thể (phòng chat).
 */

// Gửi tin nhắn mới
messageRouter.post('/', authMiddleware, sendMessage);

// Lấy lịch sử tin nhắn theo Application ID
messageRouter.get('/:applicationId', authMiddleware, getMessages);

export default messageRouter;

import { Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Controller quản lý tin nhắn (Messaging) giữa Recruiter và Candidate.
 * Mỗi cuộc trò chuyện gắn liền với một Application cụ thể.
 */

/**
 * Gửi tin nhắn mới trong một cuộc trò chuyện (Application room).
 * Tin nhắn được lưu vào DB để có lịch sử kể cả khi offline.
 */
export const sendMessage = async (req: any, res: Response) => {
  try {
    const { applicationId, receiverId, content } = req.body;
    const senderId = req.user.userId;

    // 1. Kiểm tra Application có tồn tại không
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện.' });
    }

    // 2. Lưu tin nhắn vào DB
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        applicationId,
        content,
        isRead: false,
      },
      include: {
        sender: { select: { fullName: true, avatar: true } },
      },
    });

    return res.status(201).json({ message: 'Tin nhắn đã được gửi.', data: message });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống khi gửi tin nhắn.' });
  }
};

/**
 * Lấy lịch sử tin nhắn của một Application.
 */
export const getMessages = async (req: any, res: Response) => {
  try {
    const { applicationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { applicationId },
      include: {
        sender: { select: { fullName: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' }, // Tin nhắn cũ nhất trước
    });

    // Đánh dấu tất cả tin nhắn chưa đọc là đã đọc
    await prisma.message.updateMany({
      where: {
        applicationId,
        receiverId: req.user.userId, // Chỉ cập nhật tin nhắn gửi đến mình
        isRead: false,
      },
      data: { isRead: true },
    });

    return res.json({ messages });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

import { Server, Socket } from 'socket.io';
import prisma from '../utils/prisma';
import { verifyToken } from '../utils/jwt';

/**
 * Cấu hình Socket.io nâng cao - Xử lý chat thời gian thực
 * và hệ thống thông báo (Notification) cho toàn bộ ứng dụng.
 */
export const initSocketHandlers = (io: Server) => {
  // Middleware xác thực Socket - Chỉ cho phép User đã đăng nhập kết nối
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Bạn cần đăng nhập để sử dụng tính năng chat.'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Token không hợp lệ.'));
    }

    // Lưu thông tin user vào socket để dùng sau
    (socket as any).user = decoded;
    next();
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`🔌 User "${user.userId}" đã kết nối Socket (ID: ${socket.id})`);

    // Tự động join vào phòng cá nhân để nhận thông báo riêng
    socket.join(`user_${user.userId}`);

    /**
     * Sự kiện: Tham gia phòng chat của một Application.
     * Mỗi Application (đơn ứng tuyển) tạo một phòng chat riêng biệt.
     */
    socket.on('join_chat', (applicationId: string) => {
      socket.join(`chat_${applicationId}`);
      console.log(`💬 User ${user.userId} đã vào phòng chat: ${applicationId}`);
    });

    /**
     * Sự kiện: Rời phòng chat.
     */
    socket.on('leave_chat', (applicationId: string) => {
      socket.leave(`chat_${applicationId}`);
    });

    /**
     * Sự kiện: Gửi tin nhắn mới trong phòng chat.
     * Tin nhắn được lưu vào DB rồi phát lại cho mọi người trong phòng.
     */
    socket.on('send_message', async (data: {
      applicationId: string;
      receiverId: string;
      content: string;
    }) => {
      try {
        // 1. Lưu tin nhắn vào DB
        const message = await prisma.message.create({
          data: {
            senderId: user.userId,
            receiverId: data.receiverId,
            applicationId: data.applicationId,
            content: data.content,
          },
          include: {
            sender: { select: { fullName: true, avatar: true } },
          },
        });

        // 2. Phát tin nhắn tới tất cả người trong phòng chat
        io.to(`chat_${data.applicationId}`).emit('new_message', message);

        // 3. Gửi thông báo cho người nhận (nếu họ không ở trong phòng chat)
        io.to(`user_${data.receiverId}`).emit('notification', {
          type: 'NEW_MESSAGE',
          message: `${message.sender.fullName} đã gửi tin nhắn cho bạn.`,
          applicationId: data.applicationId,
        });
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn qua Socket:', error);
        socket.emit('error', { message: 'Không thể gửi tin nhắn.' });
      }
    });

    /**
     * Sự kiện: Đánh dấu tin nhắn đã đọc.
     */
    socket.on('mark_read', async (applicationId: string) => {
      try {
        await prisma.message.updateMany({
          where: {
            applicationId,
            receiverId: user.userId,
            isRead: false,
          },
          data: { isRead: true },
        });
      } catch (error) {
        console.error('Lỗi khi đánh dấu đã đọc:', error);
      }
    });

    /**
     * Sự kiện: Ngắt kết nối Socket.
     */
    socket.on('disconnect', () => {
      console.log(`❌ User "${user.userId}" đã ngắt kết nối.`);
    });
  });
};

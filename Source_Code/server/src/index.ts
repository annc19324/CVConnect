import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';

// Nạp biến môi trường từ file .env
dotenv.config();

// Import tất cả Routes
import authRouter from './routes/authRoutes';
import jobRouter from './routes/jobRoutes';
import companyRouter from './routes/companyRoutes';
import cvRouter from './routes/cvRoutes';
import applicationRouter from './routes/applicationRoutes';
import messageRouter from './routes/messageRoutes';
import adminRouter from './routes/adminRoutes';

// Import Socket Handler
import { initSocketHandlers } from './sockets/socketHandler';

// ============================
// Khởi tạo Express App
// ============================
const app = express();
const httpServer = createServer(app);

// ============================
// Khởi tạo Socket.io
// ============================
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// ============================
// Middleware cơ bản
// ============================
app.use(helmet());                          // Bảo mật HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());                    // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files (PDF CVs)
app.use('/uploads', express.static(uploadsDir));

// ============================
// Đăng ký tất cả Routes - Tiền tố /api
// ============================
app.use('/api/auth', authRouter);           // Xác thực: đăng ký, đăng nhập, getMe
app.use('/api/jobs', jobRouter);            // Tin tuyển dụng: CRUD, tìm kiếm
app.use('/api/companies', companyRouter);   // Công ty: tạo, cập nhật
app.use('/api/cvs', cvRouter);             // CV: tạo, sửa, xoá, upload PDF
app.use('/api/applications', applicationRouter); // Đơn ứng tuyển: nộp, duyệt
app.use('/api/messages', messageRouter);    // Tin nhắn: gửi, lấy lịch sử
app.use('/api/admin', adminRouter);         // Admin: thống kê, quản lý

// Route kiểm tra API hoạt động
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Chào mừng đến với CVConnect API!',
    status: 'Online',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      companies: '/api/companies',
      cvs: '/api/cvs',
      applications: '/api/applications',
      messages: '/api/messages',
      admin: '/api/admin',
    },
  });
});

// ============================
// Khởi tạo Socket.io Handlers
// ============================
initSocketHandlers(io);

// ============================
// Khởi động Server
// ============================
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 CVConnect Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 Socket.io đang lắng nghe kết nối...`);
});

// Export io để dùng ở các Controller (gửi thông báo realtime)
export { io };

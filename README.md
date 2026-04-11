# CVConnect - Nền Tảng Quản Lý CV và Tuyển Dụng Chuyên Nghiệp

## 1. Giới thiệu dự án

**CVConnect** là một hệ thống web tích hợp toàn diện, giúp thu hẹp khoảng cách giữa ứng viên và nhà tuyển dụng. Nền tảng cho phép người dùng tạo các bản hồ sơ (CV) chuyên nghiệp với khả năng xuất PDF chất lượng cao, đăng tin tuyển dụng linh hoạt và kết nối trực tiếp thông qua hệ thống nhắn tin thời gian thực.

Điểm nổi bật của CVConnect:
- **Tạo CV chuyên nghiệp**: Giao diện điền form thông minh, hỗ trợ xem trước và xuất PDF với font chữ chuẩn tiếng Việt.
- **Chat thời gian thực**: Tích hợp Socket.io giúp ứng viên và nhà tuyển dụng trao đổi ngay lập tức.
- **Hệ thống quản trị mạnh mẽ**: Admin có thể kiểm soát toàn bộ người dùng, tin tuyển dụng và hồ sơ CV trên hệ thống.
- **Bảo mật cao**: Xác thực qua JWT, mã hóa mật khẩu và quy trình khôi phục mật khẩu an toàn qua Email.

---

## 2. Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 19.x | Thư viện xây dựng giao diện người dùng |
| Vite | 6.x | Công cụ build và phát triển nhanh |
| TypeScript | 5.x | Kiểm tra kiểu dữ liệu mạnh mẽ |
| Tailwind CSS | 4.x | Framework CSS hiện đại cho thiết kế giao diện |
| @react-pdf/renderer | 4.x | Render và xuất file PDF CV chuyên nghiệp |
| Lucide React | 0.474.0 | Bộ icon hiện đại |
| Socket.io Client | 4.8.1 | Kết nối WebSocket phía người dùng |
| Axios | 1.7.9 | Xử lý các yêu cầu HTTP tới API |

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Node.js | >= 18 | Môi trường chạy JavaScript server-side |
| Express | 5.x | Web framework xử lý API |
| Prisma ORM | 5.x | Quản lý hạ tầng cơ sở dữ liệu type-safe |
| Socket.io | 4.x | Real-time communication server |
| Bcryptjs | 2.x | Hash mật khẩu bảo mật |
| JSON Web Token | 9.x | Xác thực người dùng qua Token |
| Multer | 1.x | Xử lý tải lên file (CV PDF cục bộ) |
| Nodemailer | 6.x | Gửi email khôi phục mật khẩu |

### Database
| Công nghệ | Mục đích |
|---|---|
| PostgreSQL 14+ | Cơ sở dữ liệu quan hệ chính |
| Prisma Migrate | Đồng bộ cấu trúc bảng từ schema |

---

## 3. Cấu trúc thư mục

```
CVConnect/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/              # Các trang giao diện (LoginPage, CVBuilderPage, AdminDashboard...)
│   │   ├── components/         # Các component tái sử dụng (ChatWindow, CVTemplate...)
│   │   ├── contexts/           # Quản lý AuthContext và SocketContext
│   │   ├── services/           # Service gọi API (api.ts)
│   │   ├── types/              # Định nghĩa TypeScript Interfaces
│   │   ├── App.tsx             # Định tuyến router chính
│   │   └── main.tsx            # Điểm khởi đầu ứng dụng
│   └── package.json
│
├── server/                     # Backend (Express + Node.js)
│   ├── src/
│   │   ├── controllers/        # Logic xử lý API (auth, cv, job, admin, message...)
│   │   ├── routes/             # Định tuyến API endpoints
│   │   ├── middlewares/        # Middleware xác thực và upload file
│   │   ├── sockets/            # Xử lý Socket.io (real-time chat)
│   │   ├── utils/              # Tiện ích: Prisma, JWT, Mailer
│   │   └── index.ts            # Khởi chạy server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Role, CV, Job, Application...)
│   │   └── seed.ts             # Script tạo dữ liệu tài khoản mẫu
│   └── package.json
│
├── Database/
│   └── schema.sql              # File export cấu trúc database
│
└── README.md                   # Hướng dẫn dự án
```

---

## 4. Chức năng chính

### 4.1. Người dùng (Users)
- Đăng ký & Đăng nhập (JWT).
- Đổi mật khẩu & Quên mật khẩu qua Email (Gmail App Password).
- Thay đổi thông tin cá nhân và ảnh đại diện.

### 4.2. Ứng viên (Candidates)
- Xây dựng CV với trình soạn thảo trực quan.
- Xuất PDF CV chuẩn font tiếng Việt (Be Vietnam Pro).
- Tìm kiếm việc làm và nộp đơn trực tuyến.
- Nhắn tin trực tiếp với nhà tuyển dụng.

### 4.3. Nhà tuyển dụng (Recruiters)
- Đăng tin tuyển dụng và quản lý các vị trí đang mở.
- Xem danh sách ứng viên và hồ sơ CV đính kèm.
- Duyệt hoặc từ chối đơn ứng tuyển.
- Chat thời gian thực với ứng viên tiềm năng.

### 4.4. Quản trị viên (Admin)
- Thống kê tổng quan hệ thống (người dùng, hồ sơ, tin đăng).
- Quản lý danh sách người dùng (Xóa, phân quyền).
- Quản lý tin tuyển dụng (Đóng/mở tin, xóa tin vi phạm).
- Quản lý tất cả CV trên hệ thống.

---

## 5. Hướng dẫn chạy dự án

### 5.1. Yêu cầu môi trường
- Node.js >= 18
- PostgreSQL >= 14
- Công cụ quản lý DB (pgAdmin, DBeaver)

### 5.2. Cài đặt Cơ sở dữ liệu
1. Tạo một database mới trong PostgreSQL tên là `cvconnect`.
2. Sử dụng file `Database/schema.sql` để khởi tạo các bảng hoặc chạy migration ở bước sau.

### 5.3. Cấu hình Backend (Server)
1. Di chuyển vào thư mục `server/`.
2. Tạo file `.env` từ `.env.example` và điền:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cvconnect"
JWT_SECRET="your_secret_key"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
FRONTEND_URL="http://localhost:5173"
```
3. Chạy lệnh:
```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed # Tạo tài khoản mẫu
npm run dev
```

### 5.4. Cài đặt Frontend (Client)
1. Di chuyển vào thư mục `client/`.
2. Chạy lệnh:
```bash
npm install
npm run dev
```
3. Truy cập: **http://localhost:5173**

---

## 6. Tài khoản mặc định

Sau khi chạy lệnh `seed`, bạn có thể đăng nhập với các tài khoản (Mật khẩu: `123456`):

| Vai trò | Email | Quyền hạn |
|---|---|---|
| Admin | `admin@example.com` | Quản trị toàn bộ hệ thống |
| Ứng viên | `candidate@example.com` | Tạo CV và tìm việc làm |
| Nhà tuyển dụng | `recruiter@example.com` | Đăng tin và duyệt hồ sơ |

---
*Dự án được phát triển bởi đội ngũ CVConnect.*

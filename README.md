# CVConnect (Mini) - Nền tảng Quản lý CV và Tuyển dụng
CVConnect (mini) là nền tảng web giúp ứng viên xây dựng CV chuyên nghiệp, lưu trữ đám mây và kết nối trực tiếp với nhà tuyển dụng thông qua quy trình nộp đơn nhanh chóng có hỗ trợ tương tác thời gian thực.

## 🚀 Công nghệ sử dụng (Technology Stack)
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, @react-pdf/renderer
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, Socket.io
- **Database**: PostgreSQL
- **Lưu trữ đám mây**: Cloudinary (lưu trữ file PDF)

## 📂 Yêu cầu môi trường (Prerequisites)
Để chạy dự án, máy tính của bạn cần cài đặt:
- Node.js (Phiên bản >= 18.x)
- PostgreSQL (Phiên bản >= 14.x) đang chạy trên máy phân giải cổng 5432.
- Trình duyệt web hiện đại (Chrome, Edge, Firefox).

## ⚙️ Cấu hình biến môi trường (.env)
Dự án yêu cầu các biến môi trường cho Backend. Trong thư mục `server`, hãy copy file `.env.example` thành file `.env` và điền các thông tin của bạn.

Ví dụ nội dung file `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:12345@localhost:5432/cvconnect?schema=public"
JWT_SECRET="cvconnect_super_secret_key_2026"

# Cấu hình Cloudinary để upload PDF
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

FRONTEND_URL="http://localhost:5173"
```

## 🛠 Cách cài đặt và khởi chạy (Installation & Run)
### 1. Khởi tạo Cơ sở dữ liệu (Database Setup)
Di chuyển vào thư mục `server` và chạy Prisma migrations để thiết lập Database:
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```
*(Nếu database đã có hoặc muốn đẩy schema trực tiếp, bạn cũng có thể dùng `npx prisma db push`).*

### 2. Chạy Backend (Server)
Từ thư mục `server`, chạy lệnh khởi động server:
```bash
npm run dev
```
Server backend sẽ chạy tại http://localhost:5000.

### 3. Chạy Frontend (Client)
Mở một terminal mới, di chuyển vào thư mục `client`:
```bash
cd client
npm install
npm run dev
```
Ứng dụng frontend sẽ chạy tại http://localhost:5173.

## 👥 Tài khoản Test mặc định
Để duyệt và chấm dự án nhanh chóng, bạn có thể sử dụng các tài khoản mẫu sau (Mật khẩu: `123456`):
1. **Ứng viên (Candidate)**: `candidate@example.com`
2. **Nhà tuyển dụng (Recruiter)**: `recruiter@example.com`
3. **Quản trị viên (Admin)**: `admin@example.com`

## 📁 Cấu trúc thư mục (Project Structure)
```text
CVConnect/
├── server/                    # 🖥 Node.js + Express API Server
│   ├── prisma/                # Khu vực cấu hình Prisma ORM
│   │   ├── migrations/        # Lịch sử các file SQL thay đổi DB
│   │   ├── seed.ts            # Dữ liệu mẫu (Accounts, Roles)
│   │   └── schema.prisma      # Khai báo cấu trúc bảng CSDL
│   ├── src/
│   │   ├── controllers/       # Xử lý logic API (Auth, CV, Jobs...)
│   │   ├── middlewares/       # JWT Authentication, Upload file (Multer)
│   │   ├── routes/            # Định tuyến các API endpoints
│   │   ├── sockets/           # Real-time Chat (Socket.io)
│   │   ├── utils/             # Kết nối DB, Cloundinary Helpers
│   │   └── index.ts           # Điểm khởi chạy của Server
│   ├── .env.example           # File mẫu biến môi trường
│   └── package.json           # Dependencies của Backend
│
└── client/                    # 🎨 React + Vite Client Application
    ├── src/
    │   ├── components/        # Component tái sử dụng (Chat, CV Template)
    │   ├── contexts/          # State toàn cục (AuthContext)
    │   ├── pages/             # Các trang chính (Dashboard, Builder...)
    │   ├── services/          # Call API (Axios)
    │   ├── types/             # TypeScript Interfaces
    │   ├── App.tsx            # Main Router
    │   └── main.tsx           # Entry point
    ├── index.html             # HTML Root
    ├── tailwind.config.js     # UI Styling
    └── package.json           # Dependencies của Frontend
```

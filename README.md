# CVConnect (Mini) - Nền tảng Quản lý CV và Tuyển dụng

CVConnect (mini) là nền tảng web giúp ứng viên xây dựng CV chuyên nghiệp, lưu trữ đám mây và kết nối trực tiếp với nhà tuyển dụng thông qua quy trình nộp đơn nhanh chóng có hỗ trợ tương tác thời gian thực.

## 🚀 Công nghệ sử dụng (Technology Stack)
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, @react-pdf/renderer
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, Socket.io
- **Database:** PostgreSQL
- **Lưu trữ đám mây:** Cloudinary (lưu trữ file PDF)

---

## 📂 Yêu cầu môi trường (Prerequisites)
Để chạy dự án, máy tính của bạn cần cài đặt:
1. **Node.js** (Phiên bản >= 18.x)
2. **PostgreSQL** (Phiên bản >= 14.x) đang chạy trên máy phân giải cổng `5432`.
3. Trình duyệt web hiện đại (Chrome, Edge, Firefox).

---

## ⚙️ Cấu hình biến môi trường (.env)
Dự án yêu cầu các biến môi trường cho Backend. Trong thư mục `Source_Code/backend`, hãy copy file `.env.example` thành file `.env` và điền các thông tin của bạn.

**Ví dụ nội dung file `.env`:**
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

---

## 🛠 Cách cài đặt và khởi chạy (Installation & Run)

### 1. Khởi tạo Cơ sở dữ liệu (Database Setup)
Di chuyển vào thư mục backend và chạy Prisma migrations để thiết lập Database:
```bash
cd Source_Code/backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```
*(Nếu database đã có hoặc muốn đẩy schema trực tiếp, bạn cũng có thể dùng `npx prisma db push`)*.

### 2. Chạy Backend (Server)
Từ thư mục backend, chạy lệnh khởi động server:
```bash
npm run dev
```
Server backend sẽ chạy tại `http://localhost:5000`.

### 3. Chạy Frontend (Client)
Mở một terminal mới, di chuyển vào thư mục frontend:
```bash
cd Source_Code/frontend
npm install
npm run dev
```
Ứng dụng frontend sẽ chạy tại `http://localhost:5173`.

---

## 👥 Tài khoản Test mặc định
Để duyệt và chấm dự án nhanh chóng, bạn có thể tạo tài khoản từ giao diện hoặc dùng tài khoản mẫu (nếu đã tạo sẵn trong DB):

**1. Ứng viên (Candidate)**
- **Email:** candidate@example.com
- **Mật khẩu:** 123456

**2. Nhà tuyển dụng (Recruiter)**
- **Email:** recruiter@example.com
- **Mật khẩu:** 123456

---

## 📁 Cấu trúc thư mục dự án (Directory Structure)

```text
Source_Code/
├── backend/                   # 🖥 Node.js + Express API Server
│   ├── prisma/                # Khu vực cấu hình Prisma ORM
│   │   ├── migrations/        # Lịch sử các file SQL thay đổi DB (Prisma migrate sinh ra)
│   │   └── schema.prisma      # ✨ File quan trọng: Khai báo cấu trúc bảng CSDL
│   ├── src/
│   │   ├── controllers/       # (Controller) Xử lý logic API (Auth, CV, Jobs...)
│   │   ├── middlewares/       # Cấm truy xuất, phân quyền JWT, Upload file (Multer)
│   │   ├── routes/            # (Router) Định tuyến các API endpoints
│   │   ├── sockets/           # Logic xử lý Real-time (Socket.io)
│   │   ├── utils/             # Cấu hình kết nối DB, Helpers
│   │   └── index.ts           # Điểm khởi chạy của Server
│   ├── .env.example           # File mẫu biến môi trường
│   └── package.json           # Dependencies của Backend
│
└── frontend/                  # 🎨 React + Vite Client Application
    ├── src/
    │   ├── components/        # Component tái sử dụng (Chat Window, CV Template UI)
    │   ├── contexts/          # Quản lý State toàn cục (AuthContext cho Đăng nhập)
    │   ├── pages/             # Layout các trang (Login, Job Detail, CV Builder...)
    │   ├── services/          # Các hàm phụ trách Call API với thư viện Axios
    │   ├── types/             # Định nghĩa Type/Interface cho TypeScript
    │   ├── App.tsx            # Thành phần bọc toàn bộ App, chứa Main Router
    │   └── main.tsx           # Entry code bọc Context Auth cho React
    ├── index.html             # HTML Root của React Single Page Application
    ├── tailwind.config.js     # Cấu hình phong cách UI theo TailwindCSS
    └── package.json           # Dependencies của Frontend
```

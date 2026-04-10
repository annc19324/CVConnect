# CVConnect (Mini) - Nền tảng Quản lý CV và Tuyển dụng

CVConnect (mini) là nền tảng web tích hợp giúp ứng viên xây dựng CV chuyên nghiệp, nhà tuyển dụng đăng tin và quản trị viên quản lý toàn bộ hệ thống.

---

## 📁 Cấu trúc thư mục (Project Structure)
- `client/`: Mã nguồn giao diện người dùng (React + Vite).
- `server/`: Mã nguồn API server (Node.js + Express + Prisma).
- `Database/`: Chứa file `schema.sql` để khởi tạo cơ sở dữ liệu PostgreSQL.
- `README.md`: Hướng dẫn chi tiết cài đặt và sử dụng.

## 🚀 Công nghệ sử dụng
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide Icons, @react-pdf/renderer.
- **Backend**: Node.js, Express.js, Prisma ORM (PostgreSQL), Socket.io (Real-time), Nodemailer.
- **Database**: PostgreSQL (Lưu trữ quan hệ).

## ⚙️ Yêu cầu môi trường
1. **Node.js**: Phiên bản >= 18.x.
2. **PostgreSQL**: Phiên bản >= 14.x đang chạy tại cổng **5432**.
3. **Gmail App Password**: Cần thiết nếu muốn sử dụng tính năng gửi mail khôi phục mật khẩu.

---

## 🛠 Cách cài đặt và khởi chạy (Installation & Setup)

### Bước 1: Khởi tạo Cơ sở dữ liệu
1. Mở công cụ quản lý PostgreSQL (như DBeaver, pgAdmin hoặc CLI).
2. Tạo một database mới tên là `cvconnect`.
3. Chạy nội dung file trong `Database/schema.sql` để tạo cấu trúc bảng.

### Bước 2: Cấu hình và Chạy Backend (Server)
1. Mở Terminal và di chuyển vào thư mục `server/`.
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file `.env` từ `.env.example` và điền thông tin kết nối:
   ```env
   DATABASE_URL="postgresql://postgres:12345@localhost:5432/cvconnect?schema=public"
   JWT_SECRET="cvconnect_super_secret_key_2026"
   EMAIL_USER="annc19324@gmail.com"
   EMAIL_PASS="mdiy ziob kuys tsoh"
   FRONTEND_URL="http://localhost:5173"
   ```
4. Khởi tạo Prisma Client và Dữ liệu mẫu:
   ```bash
   npx prisma generate
   npx prisma db seed
   ```
5. Khởi động server:
   ```bash
   npm run dev
   ```
   *API Server sẽ chạy tại: http://localhost:5000*

### Bước 3: Cấu hình và Chạy Frontend (Client)
1. Mở một Terminal mới và di chuyển vào thư mục `client/`.
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Khởi động giao diện:
   ```bash
   npm run dev
   ```
   *Ứng dụng web sẽ chạy tại: http://localhost:5173*

---

## 👥 Tài khoản đăng nhập mặc định (Mật khẩu: 123456)
- **Quản trị viên (Admin)**: `admin@example.com` - Truy cập `/admin` để quản lý.
- **Ứng viên (Candidate)**: `candidate@example.com` - Dùng để tạo CV và ứng tuyển.
- **Nhà tuyển dụng (Recruiter)**: `recruiter@example.com` - Dùng để đăng tin và duyệt hồ sơ.

---

## ✨ Các chức năng tiêu biểu
- **Quản lý CV**: Tạo CV với giao diện kéo thả/điền form, xuất PDF trực tiếp có hỗ trợ Tiếng Việt (font Be Vietnam Pro), lưu trữ ảnh chân dung.
- **Tuyển dụng**: Đăng tin, lọc hồ sơ, chat trực tiếp thời gian thực giữa Ứng viên và Nhà tuyển dụng.
- **Hệ thống Quản trị**: Theo dõi thống kê, quản lý người dùng, đóng/mở tin tuyển dụng, xóa CV vi phạm.
- **Bảo mật**: JWT Authentication, Mã hóa mật khẩu, Quên mật khẩu qua Email (Gmail SMTP).

---
*Dự án được thực hiện bởi Team CVConnect.*

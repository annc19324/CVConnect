# CVConnect (Mini) - Nền tảng Quản lý CV và Tuyển dụng

CVConnect (mini) là nền tảng web tích hợp giúp ứng viên xây dựng CV chuyên nghiệp, nhà tuyển dụng đăng tin và quản trị viên quản lý hệ thống.

## 📁 Cấu trúc thư mục (Project Structure)
- `Source_Code/`: Mã nguồn chính của dự án (Client + Server).
- `Database/`: File export cơ sở dữ liệu (`schema.sql`).
- `README.md`: Hướng dẫn chung.

## 🚀 Công nghệ sử dụng
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, @react-pdf/renderer.
- **Backend**: Node.js, Express.js, Prisma ORM, Socket.io, Nodemailer (Gửi mail).
- **Database**: PostgreSQL.

## ⚙️ Yêu cầu môi trường
- Node.js (Phiên bản >= 18.x).
- PostgreSQL (Phiên bản >= 14.x) đang chạy tại cổng 5432.
- Tài khoản Gmail và App Password (nếu muốn dùng chức năng quên mật khẩu).

## 🛠 Cách cài đặt và khởi chạy
### 1. Phục hồi Cơ sở dữ liệu
Vào PostgreSQL (DBeaver, pgAdmin hoặc CLI) và chạy file `Database/schema.sql` để tạo cấu trúc bảng.

### 2. Cấu hình Backend
Di chuyển vào `Source_Code/server`:
- `npm install`
- Tạo file `.env` từ `.env.example` và điền thông tin (DATABASE_URL, EMAIL_USER, EMAIL_PASS).
- `npx prisma generate`
- `npx prisma db seed` (Để khởi tạo tài khoản mặc định).
- `npm run dev`

### 3. Cấu hình Frontend
Di chuyển vào `Source_Code/client`:
- `npm install`
- `npm run dev` (Ứng dụng sẽ chạy tại http://localhost:5173).

## 👥 Tài khoản mặc định (Mật khẩu: 123456)
- **Ứng viên**: `candidate@example.com`
- **Nhà tuyển dụng**: `recruiter@example.com`
- **Admin**: `admin@example.com` (Sử dụng tài khoản này để vào trang quản trị).

## ✨ Các chức năng chính
- **Ứng viên**: Tạo CV, quản lý danh sách CV, xuất PDF, ứng tuyển việc làm, chat với nhà tuyển dụng.
- **Nhà tuyển dụng**: Đăng tin tuyển dụng, quản lý tin đăng, duyệt hồ sơ ứng viên, chat realtime.
- **Quản trị viên**: Xem thống kê, quản lý người dùng (xóa, phân quyền), quản lý tin tuyển dụng (đóng/mở tin), quản lý hồ sơ CV.
- **Hệ thống**: Quên mật khẩu qua Email, Đổi mật khẩu, Realtime notifications.

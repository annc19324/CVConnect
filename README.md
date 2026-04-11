# CVConnect (Mini) - Nen tang Quan ly CV va Tuyen dung

CVConnect (mini) la nen tang web tich hop giup ung vien xay dung CV chuyen nghiep, nha tuyen dung dang tin va quan tri vien quan ly toan bo he thong.

---

## Cau truc thu muc (Project Structure)
- client/: Ma nguon giao dien nguoi dung (React + Vite).
- server/: Ma nguon API server (Node.js + Express + Prisma).
- Database/: Chua file schema.sql de khoi tao co so du lieu PostgreSQL.
- README.md: Huong dan chi tiet cai dat va su dung.

## Cong nghe su dung
- Frontend: React (Vite), TypeScript, Tailwind CSS, Lucide Icons, @react-pdf/renderer.
- Backend: Node.js, Express.js, Prisma ORM (PostgreSQL), Socket.io (Real-time), Nodemailer.
- Database: PostgreSQL (Luu tru quan he).

## Yeu cau moi truong
1. Node.js: Phien ban >= 18.x.
2. PostgreSQL: Phien ban >= 14.x dang chay tai cong 5432.
3. Gmail App Password: Can thiet neu muon su dung tinh nang gui mail khoi phuc mat khau.

---

## Cach cai dat va khoi chay (Installation & Setup)

### Buoc 1: Khoi tao Co so du lieu
1. Mo cong cu quan ly PostgreSQL (nhu DBeaver, pgAdmin hoac CLI).
2. Tao mot database moi ten la cvconnect.
3. Chay noi dung file trong Database/schema.sql de tao cau truc bang.

### Buoc 2: Cau hinh va Chay Backend (Server)
1. Mo Terminal va di chuyen vao thu muc server/.
2. Cai dat cac thu vien:
   npm install
3. Tao file .env tu .env.example va dien thong tin ket noi:
   DATABASE_URL="postgresql://user:password@localhost:5432/cvconnect?schema=public"
   JWT_SECRET="your_secret_key"
   EMAIL_USER="your_email@gmail.com"
   EMAIL_PASS="your_app_password"
   FRONTEND_URL="http://localhost:5173"
4. Khoi tao Prisma Client va Du lieu mau:
   npx prisma generate
   npx prisma db seed
5. Khoi dong server:
   npm run dev
   API Server se chay tai: http://localhost:5000

### Buoc 3: Cau hinh va Chay Frontend (Client)
1. Mo mot Terminal moi va di chuyen vao thu muc client/.
2. Cai dat cac thu vien:
   npm install
3. Khoi dong giao dien:
   npm run dev
   Ung dung web se chay tai: http://localhost:5173

---

## Tai khoan dang nhap mac dinh (Mat khau: 123456)
- Quan tri vien (Admin): admin@example.com - Truy cap /admin de quan ly.
- Ung vien (Candidate): candidate@example.com - Dung de tao CV va ung tuyen.
- Nha tuyen dung (Recruiter): recruiter@example.com - Dung de dang tin va duyet ho so.

---

## Cac chuc nang tieu bieu
- Quan ly CV: Tao CV voi giao dien dien form, xuat PDF truc tiep co ho tro Tieng Viet, luu tru anh chan dung.
- Tuyen dung: Dang tin, loc ho so, chat truc tiep thoi gian thuc giua Ung vien va Nha tuyen dung.
- He thong Quan tri: Theo doi thong ke, quan ly nguoi dung, dong/mo tin tuyen dung, xoa CV vi pham.
- Bao mat: JWT Authentication, Ma hoa mat khau, Quen mat khau qua Email.

---
Duan duoc thuc hien boi Team CVConnect.

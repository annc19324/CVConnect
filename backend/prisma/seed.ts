import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Đang khởi động kịch bản Nạp dữ liệu Toàn diện (Full Ecosystem Seed)...');

  // Xóa dữ liệu cũ theo đúng tên model trong Prisma Client
  await prisma.message.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.cV.deleteMany({}); // TRƯỚC ĐÂY LỖI: Model là CV nên Prisma Client dùng cV
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  const pass = await bcrypt.hash('123456', 10);

  // 1. Vai trò
  const roles = await Promise.all([
    prisma.role.create({ data: { name: 'ADMIN' } }),
    prisma.role.create({ data: { name: 'RECRUITER' } }),
    prisma.role.create({ data: { name: 'CANDIDATE' } }),
  ]);

  const [adminRid, recruiterRid, candidateRid] = roles.map(r => r.id);

  // 2. ADMIN
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cvconnect.com',
      password: pass,
      fullName: 'Hệ thống Quản trị viên',
      roleId: adminRid,
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
  });

  // 3. Nhà tuyển dụng & Công ty
  const recruitersData = [
    { name: 'Tập đoàn Công nghệ Alpha', owner: 'Trần Tech Manager', email: 'hr@alpha.tech' },
    { name: 'Sáng tạo Việt JSC', owner: 'Lê Creative Director', email: 'hr@creativeviet.vn' },
    { name: 'Global Outsourcing Hub', owner: 'John Smith', email: 'hr@globalhub.com' },
  ];

  const recruiters = [];
  for (const r of recruitersData) {
    const user = await prisma.user.create({
      data: {
        email: r.email,
        password: pass,
        fullName: r.owner,
        roleId: recruiterRid,
        company: {
          create: {
            name: r.name,
            description: `Môi trường làm việc chuyên nghiệp tại ${r.name}.`,
            logoUrl: `https://i.pravatar.cc/150?u=${r.email}`,
          },
        },
      },
      include: { company: true },
    });
    recruiters.push(user);
  }

  // 4. Ứng viên & CV mẫu
  const candidatesData = [
    { name: 'Nguyễn Văn Backend', email: 'dev1@gmail.com' },
    { name: 'Phạm Thị Design', email: 'design@gmail.com' },
    { name: 'Trương Fullstack', email: 'fs@gmail.com' },
  ];

  const candidates = [];
  for (const c of candidatesData) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        password: pass,
        fullName: c.name,
        roleId: candidateRid,
        cvs: {
          create: {
            title: `Hồ sơ năng lực của ${c.name}`,
            template: 'modern',
            data: { personalInfo: { fullName: c.name, email: c.email, phone: '0901234567', summary: 'Đam mê công việc.' }, education: [], experience: [], skills: ['NodeJS', 'Figma'] },
          },
        },
      },
      include: { cvs: true },
    });
    candidates.push(user);
  }

  // 5. Tin tuyển dụng (Jobs) - 10 tin
  const jobList = [
    { title: 'Frontend Developer (React)', recIdx: 0, requireCV: true, salary: '1500 - 2000' },
    { title: 'Project Manager (Agile)', recIdx: 0, requireCV: true, salary: 'Thỏa thuận' },
    { title: 'UX/UI Designer (Figma)', recIdx: 1, requireCV: true, salary: '1200 - 1800' },
    { title: 'Graphic Artist', recIdx: 1, requireCV: false, salary: '800 - 1000' },
    { title: 'Senior NodeJS Engineer', recIdx: 2, requireCV: true, salary: '3000 - 4500' },
    { title: 'DevOps Specialist', recIdx: 2, requireCV: true, salary: '2500 - 3500' },
    { title: 'Intern Backend Developer', recIdx: 0, requireCV: false, salary: '300 - 500' },
    { title: 'Data Scientist', recIdx: 2, requireCV: true, salary: '4000+' },
    { title: 'React Native Expert', recIdx: 0, requireCV: true, salary: '2000 - 2800' },
    { title: 'HR Manager', recIdx: 1, requireCV: true, salary: '1500 - 2200' },
  ];

  const jobs = [];
  for (const j of jobList) {
    const recruiter = recruiters[j.recIdx];
    const job = await prisma.job.create({
      data: {
        title: j.title,
        description: `Cần tuyển ${j.title} làm việc tại ${recruiter.company?.name}.`,
        requirements: ['Kỹ năng chuyên môn', 'Ngoại ngữ', 'Tinh thần đồng đội'],
        salary: j.salary,
        location: 'Hà Nội / HCM / Remote',
        requireCV: j.requireCV,
        companyId: recruiter.company!.id,
        postedBy: recruiter.id,
      },
    });
    jobs.push(job);
  }

  // 6. Đơn ứng tuyển & Chat mẫu
  const app1 = await prisma.application.create({
    data: {
      jobId: jobs[0].id,
      candidateId: candidates[0].id,
      cvId: candidates[0].cvs[0].id,
      status: 'PENDING',
      coverLetter: 'Tôi rất mong muốn được làm việc tại công ty.',
    },
  });

  await prisma.message.create({
    data: {
      applicationId: app1.id,
      senderId: candidates[0].id,
      receiverId: recruiters[0].id,
      content: 'Dạ chào anh, em vừa nộp hồ sơ xin ứng tuyển vị trí này ạ!',
    },
  });

  console.log('✅ HỆ THỐNG ĐÃ NẠP XONG DỮ LIỆU "KHỦNG":');
  console.log('- 3 Vai trò (ADMIN, RECRUITER, CANDIDATE)');
  console.log('- 1 Tài khoản ADMIN (admin@cvconnect.com / 123456)');
  console.log('- 3 Nhà tuyển dụng & 3 Công ty tương ứng');
  console.log('- 3 Ứng viên tìềm năng kèm CV có sẵn');
  console.log('- 10 Tin tuyển dụng đa dạng các ngành nghề');
  console.log('- 1 Đơn ứng tuyển mẫu & 1 Tin nhắn mẫu (Real-time)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

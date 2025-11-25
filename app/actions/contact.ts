"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Gửi tin nhắn
export async function submitContact(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Lỗi đỏ ở đây sẽ biến mất sau khi chạy `npx prisma generate`
    await prisma.contact.create({
      data: {
        fullName,
        email,
        phone,
        subject,
        message,
      },
    });

    return { success: true, message: "Gửi tin nhắn thành công!" };
  } catch (error) {
    console.error("Lỗi gửi liên hệ:", error);
    return { success: false, message: "Lỗi hệ thống, vui lòng thử lại sau." };
  }
}

// 2. Lấy danh sách tin nhắn (CÓ PHÂN TRANG & LỌC)
export async function getContacts({ 
  page = 1, 
  limit = 10, 
  status = "ALL", 
  search = "" 
}: { 
  page?: number; 
  limit?: number; 
  status?: string; 
  search?: string; 
}) {
  const skip = (page - 1) * limit;
  
  const whereClause: any = {};
  
  // Lọc theo trạng thái
  if (status !== "ALL") {
    whereClause.status = status;
  }

  // Tìm kiếm theo tên hoặc email
  if (search) {
    whereClause.OR = [
      { fullName: { contains: search } }, // Không dùng mode: 'insensitive' vì SQLite hạn chế
      { email: { contains: search } },
    ];
  }

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contact.count({ where: whereClause }),
  ]);

  return {
    contacts,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalItems: total,
  };
}

// 3. Cập nhật trạng thái / Trả lời
export async function updateContact(id: string, data: { status?: string; reply?: string }) {
  await prisma.contact.update({
    where: { id },
    data,
  });
  return { success: true };
}

// 4. Xóa tin nhắn
export async function deleteContact(id: string) {
  await prisma.contact.delete({ where: { id } });
  return { success: true };
}
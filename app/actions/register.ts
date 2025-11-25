"use server";

import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export async function registerCandidate(formData: FormData) {
  try {
    // 1. Lấy dữ liệu text
    const fullName = formData.get("fullName") as string;
    const dob = formData.get("dob") as string;
    const gender = formData.get("gender") as string;
    const cccd = formData.get("cccd") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const school = formData.get("school") as string;
    const province = formData.get("province") as string;
    const grade = formData.get("grade") as string;
    const className = formData.get("className") as string;
    const studentId = formData.get("studentId") as string || "";
    const table = formData.get("table") as string;
    const achievements = formData.get("achievements") as string || "";

    // 2. Xử lý lưu file (3 file: CCCD Trước, Sau, Thẻ HS)
    const cccdFrontFile = formData.get("cccdFrontFile") as File;
    const cccdBackFile = formData.get("cccdBackFile") as File; // Mới
    const studentCardFile = formData.get("studentCardFile") as File;

    let cccdPath = "";
    let cccdBackPath = ""; // Mới
    let studentCardPath = "";

    // Hàm save file local
    const saveFile = async (file: File, prefix: string) => {
      if (!file || file.size === 0) return "";
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {}

      // Thêm timestamp để tên file không trùng
      const fileName = `${prefix}-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      return `/uploads/${fileName}`;
    };

    if (cccdFrontFile) cccdPath = await saveFile(cccdFrontFile, "cccd_front");
    if (cccdBackFile) cccdBackPath = await saveFile(cccdBackFile, "cccd_back"); // Lưu mặt sau
    if (studentCardFile) studentCardPath = await saveFile(studentCardFile, "card");

    // 3. Lưu vào Database
    const newCandidate = await prisma.candidate.create({
      data: {
        fullName, dob, gender, cccd, phone, email,
        school, province, grade, className, studentId,
        table, achievements,
        cccdPath, 
        cccdBackPath,
        studentCardPath,
        status: "PENDING"
      },
    });

    return { success: true, message: "Đăng ký thành công!", id: newCandidate.id };

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return { success: false, message: "Lỗi hệ thống, vui lòng thử lại sau." };
  }
}

// Action Admin giữ nguyên
export async function updateStatus(id: string, status: string) {
    await prisma.candidate.update({
        where: { id },
        data: { status }
    });
    return { success: true };
}

// Action cho Admin: Lấy danh sách (CÓ PHÂN TRANG & LỌC)
export async function getCandidates({
  page = 1,
  limit = 10,
  table = "ALL"
}: {
  page?: number;
  limit?: number;
  table?: string;
} = {}) {
  const skip = (page - 1) * limit;
  const whereClause: any = {};

  // Lọc theo bảng thi
  if (table !== "ALL") {
    whereClause.table = table;
  }

  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.candidate.count({ where: whereClause }),
  ]);

  return {
    candidates,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalItems: total,
  };
}
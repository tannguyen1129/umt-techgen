"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// CẤU HÌNH MẬT KHẨU ADMIN TẠI ĐÂY
const ADMIN_PASSWORD = "admin_umt_2025"; 

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === ADMIN_PASSWORD) {
    // FIX LỖI: Thêm 'await' trước cookies() cho Next.js 15
    const cookieStore = await cookies();
    
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 ngày
      path: "/",
    });
    return { success: true };
  } else {
    return { success: false, message: "Sai mật khẩu!" };
  }
}

export async function logoutAdmin() {
  // FIX LỖI: Thêm 'await' trước cookies()
  (await cookies()).delete("admin_token");
  redirect("/");
}
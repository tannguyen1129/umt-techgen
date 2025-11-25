"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await loginAdmin(formData);
    if (res.success) {
      router.push("/admin"); // Chuyển hướng vào admin nếu đúng
    } else {
      setError(res.message || "Lỗi đăng nhập");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Lock size={32} />
            </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Admin Login</h1>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu quản trị"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
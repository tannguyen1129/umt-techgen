'use server'

import { cookies } from 'next/headers';

// Sử dụng IP LAN của VPS (10.11.10.21) để gọi Backend (Port 4000)
// Đây là đường dẫn mà code chạy trên Server của Next.js dùng để gọi API
const API_URL = "http://10.11.10.21:4000/api"; 

// Hàm loginAdmin - Hàm này chỉ nhận 1 tham số (formData) để dùng dễ dàng với Client Component
export async function loginAdmin(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            // Backend trả về lỗi 401 hoặc 400
            const error = await res.json();
            return { success: false, message: error.message || 'Sai tài khoản hoặc mật khẩu' };
        }

        const data = await res.json();
        
        // LƯU Ý: Backend trả về { access_token: ... }
        // Frontend lưu token này vào cookie
        const cookieStore = await cookies(); 
        
        cookieStore.set('admin_token', data.access_token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400, // 1 ngày
            path: '/',
        });

        return { success: true };
    } catch (e) {
        console.error("Lỗi đăng nhập:", e);
        return { success: false, message: 'Lỗi kết nối đến máy chủ' };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
}
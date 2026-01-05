'use server'

import { revalidatePath } from "next/cache";

// Sử dụng biến môi trường, fallback về localhost nếu thiếu
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// 1. Lấy danh sách
export async function getAnnouncements() {
  try {
    const res = await fetch(`${API_BASE}/announcements`, { 
        cache: 'no-store',
        next: { tags: ['announcements'] } 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

// 2. Tạo thông báo mới
export async function createAnnouncement(data: any) {
  try {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.message || "Lỗi tạo bài viết" };
    }
    
    revalidatePath('/admin/announcements'); // Làm mới dữ liệu
    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối Server" };
  }
}

// 3. Cập nhật thông báo
export async function updateAnnouncement(id: number, data: any) {
  try {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false, message: "Lỗi cập nhật" };
    
    revalidatePath('/admin/announcements');
    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối server" };
  }
}

// 4. Xóa thông báo
export async function deleteAnnouncement(id: number) {
  try {
    await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
    revalidatePath('/admin/announcements');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
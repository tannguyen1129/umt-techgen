'use server'

const API_BASE = "http://10.11.10.21:4000/api"; // Chỉnh lại theo IP của bạn

// 1. Lấy danh sách
export async function getAnnouncements() {
  try {
    const res = await fetch(`${API_BASE}/announcements`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
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
    if (!res.ok) return { success: false, message: "Lỗi tạo bài viết" };
    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối" };
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
    return { success: true };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối server" };
  }
}

// 4. Xóa thông báo
export async function deleteAnnouncement(id: number) {
  try {
    await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
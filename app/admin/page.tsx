"use client";

import { useEffect, useState } from "react";
import { getCandidates, updateStatus } from "@/app/actions/register";
import * as XLSX from "xlsx";
import { Download, Check, X, Eye, LogOut, Filter, ZoomIn, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { logoutAdmin } from "../actions/auth";

// 1. Component Modal Xem ảnh (Dùng thẻ img để tránh lỗi)
const ImageModal = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative bg-white rounded-lg max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header modal */}
        <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-slate-700 text-lg">{alt}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500 hover:text-red-500">
                <X size={24} />
            </button>
        </div>
        
        {/* Body modal chứa ảnh - Dùng thẻ img thuần để đảm bảo hiển thị */}
        <div className="flex-1 bg-slate-100 p-4 overflow-hidden flex items-center justify-center min-h-[400px]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
                src={src} 
                alt={alt} 
                className="max-w-full max-h-[70vh] object-contain shadow-lg rounded"
             />
        </div>
        
        {/* Footer modal */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition">
                Đóng
            </button>
            <a href={src} target="_blank" download className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
                <Download size={18} /> Tải ảnh gốc
            </a>
        </div>
      </div>
    </div>
  );
};

// 2. Định nghĩa kiểu dữ liệu Candidate
type Candidate = {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  cccd: string;
  phone: string;
  email: string;
  school: string;
  province: string;
  grade: string;
  className: string;
  studentId?: string | null;
  table: string;
  achievements?: string | null;
  cccdPath?: string | null;
  cccdBackPath?: string | null;
  studentCardPath?: string | null;
  status: string;
  createdAt: string; // Server trả về chuỗi ISO
};

export default function AdminPage() {
  // State quản lý dữ liệu
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State bộ lọc và phân trang
  const [filterTable, setFilterTable] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // State cho modal xem ảnh
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  // Load dữ liệu khi page hoặc filter thay đổi
  useEffect(() => {
    loadData();
  }, [page, filterTable]); 

  const loadData = async () => {
    setLoading(true);
    try {
        // Gọi Server Action lấy dữ liệu phân trang
        const data = await getCandidates({ 
            page: page, 
            limit: 10, 
            table: filterTable 
        });

        if (data && Array.isArray(data.candidates)) {
            // Ép kiểu dữ liệu trả về cho khớp với type Candidate
            setCandidates(data.candidates as unknown as Candidate[]); 
            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
        } else {
            setCandidates([]);
        }
    } catch (error) {
        console.error("Failed to load candidates", error);
        setCandidates([]);
    } finally {
        setLoading(false);
    }
  };

  const handleVerify = async (id: string, status: string) => {
    if(!confirm("Bạn có chắc chắn muốn thay đổi trạng thái?")) return;
    await updateStatus(id, status);
    loadData(); // Reload lại dữ liệu sau khi update
  };

  const exportExcel = async () => {
    // Tải toàn bộ dữ liệu (không phân trang) để xuất Excel
    const data = await getCandidates({ page: 1, limit: 10000, table: filterTable });
    const fullList = (data.candidates || []) as unknown as Candidate[];

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-"); 
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`; 
        }
        return dateStr;
    };

    const dataToExport = fullList.map((c) => ({
        "Họ tên": c.fullName,
        "Ngày sinh": formatDate(c.dob),
        "Giới tính": c.gender,
        "CCCD": c.cccd,
        "SĐT": c.phone,
        "Email": c.email,
        "Trường": c.school,
        "Tỉnh": c.province,
        "Khối": c.grade,
        "Lớp": c.className,
        "Bảng thi": c.table,
        "Trạng thái": c.status,
        "Link ảnh CCCD Trước": c.cccdPath ? window.location.origin + c.cccdPath : "",
        "Link ảnh CCCD Sau": c.cccdBackPath ? window.location.origin + c.cccdBackPath : "",
        "Link ảnh Thẻ HS": c.studentCardPath ? window.location.origin + c.studentCardPath : "",
        "Ngày đăng ký": new Date(c.createdAt).toLocaleDateString('vi-VN')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    
    const sheetName = filterTable === "ALL" ? "All_Candidates" : `Bang_${filterTable}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const fileName = `Danh_sach_thi_sinh_${filterTable === "ALL" ? "Toan_bo" : "Bang_" + filterTable}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans relative">
      
      {/* Render Modal nếu có ảnh được chọn */}
      {previewImage && (
        <ImageModal 
            src={previewImage.src} 
            alt={previewImage.alt} 
            onClose={() => setPreviewImage(null)} 
        />
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-[1600px] mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản trị viên - UMT TechGen</h1>
            <p className="text-slate-500 text-sm mt-1">
                Tổng số hồ sơ: <span className="font-bold text-blue-600">{totalItems}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
             {/* Nút chuyển sang trang Tin nhắn */}
             <Link href="/admin/contacts" className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition font-medium shadow-sm">
                <MessageSquare size={18} /> Hộp thư đến
             </Link>

             <div className="h-8 w-px bg-slate-300 mx-2 hidden md:block"></div>

             {/* Bộ lọc Bảng thi */}
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    value={filterTable}
                    onChange={(e) => { setFilterTable(e.target.value); setPage(1); }}
                    className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                    <option value="ALL">Tất cả bảng thi</option>
                    <option value="A">Chỉ hiện Bảng A</option>
                    <option value="B">Chỉ hiện Bảng B</option>
                </select>
             </div>

             <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow-sm font-medium">
                <Download size={18} /> Xuất Excel
              </button>
             <button onClick={() => logoutAdmin()} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition font-medium">
                <LogOut size={18} /> Thoát
             </button>
          </div>
        </div>

        {/* Bảng Danh sách Thí sinh */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 min-h-[500px]">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4">Thí sinh</th>
                <th className="px-6 py-4">Thông tin trường</th>
                <th className="px-6 py-4 text-center">Bảng</th>
                <th className="px-6 py-4">Hồ sơ ảnh</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : candidates.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Không tìm thấy thí sinh nào.</td></tr>
              ) : (
                  candidates.map((c) => (
                    <tr key={c.id} className="bg-white border-b hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-base">{c.fullName}</div>
                        <div className="text-xs text-slate-500 mt-1">{c.dob} - {c.gender}</div>
                        <div className="text-xs text-slate-500">CCCD: {c.cccd}</div>
                        <div className="text-xs text-slate-500 mt-1">{c.phone}</div>
                        <div className="text-xs text-blue-600">{c.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{c.school}</div>
                        <div className="text-xs text-slate-500">{c.province}</div>
                        <div className="mt-1 inline-block px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                            Khối {c.grade} - Lớp {c.className}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.table === 'A' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-teal-100 text-teal-700 border border-teal-200'}`}>
                            {c.table}
                        </span>
                      </td>
                      
                      {/* Cột Xem ảnh */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                            {c.cccdPath && (
                                <button 
                                    onClick={() => setPreviewImage({ src: c.cccdPath!, alt: `CCCD Trước - ${c.fullName}` })}
                                    className="p-2 bg-slate-100 rounded hover:bg-blue-100 text-blue-600 transition" title="Xem CCCD Trước"
                                >
                                    <Eye size={16} /> <span className="text-[10px] font-bold">Trước</span>
                                </button>
                            )}
                            {c.cccdBackPath && (
                                <button 
                                    onClick={() => setPreviewImage({ src: c.cccdBackPath!, alt: `CCCD Sau - ${c.fullName}` })}
                                    className="p-2 bg-slate-100 rounded hover:bg-blue-100 text-blue-600 transition" title="Xem CCCD Sau"
                                >
                                    <Eye size={16} /> <span className="text-[10px] font-bold">Sau</span>
                                </button>
                            )}
                            {c.studentCardPath && (
                                <button 
                                    onClick={() => setPreviewImage({ src: c.studentCardPath!, alt: `Thẻ HS - ${c.fullName}` })}
                                    className="p-2 bg-slate-100 rounded hover:bg-purple-100 text-purple-600 transition" title="Xem Thẻ HS"
                                >
                                    <Eye size={16} /> <span className="text-[10px] font-bold">Thẻ</span>
                                </button>
                            )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            c.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : 
                            c.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                            {c.status === 'PENDING' ? 'Chờ duyệt' : c.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                            <button onClick={() => handleVerify(c.id, "APPROVED")} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-600 hover:text-white transition border border-green-200" title="Duyệt"><Check size={18} /></button>
                            <button onClick={() => handleVerify(c.id, "REJECTED")} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition border border-red-200" title="Từ chối"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (Pagination) */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">Trang {page} / {totalPages > 0 ? totalPages : 1}</span>
            <div className="flex gap-2">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 text-sm text-slate-600 transition"
                >
                    <ChevronLeft size={16} /> Trước
                </button>
                <button 
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 text-sm text-slate-600 transition"
                >
                    Sau <ChevronRight size={16} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
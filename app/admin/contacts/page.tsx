"use client";

import { useEffect, useState } from "react";
import { getContacts, updateContact, deleteContact } from "@/app/actions/contact";
import { Check, X, Eye, Trash2, Search, Filter, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Modal xem chi tiết (Đã bỏ phần trả lời, chỉ hiển thị thông tin)
const ContactModal = ({ contact, onClose, onUpdate }: { contact: any; onClose: () => void; onUpdate: () => void }) => {
  
  const handleMarkAsRead = async () => {
    // Chỉ đánh dấu là ĐÃ XEM
    await updateContact(contact.id, { status: "READ" });
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Chi tiết liên hệ</h3>
            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500" /></button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Thông tin người gửi */}
            <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Người gửi</span>
                    <p className="font-medium text-slate-900 text-base">{contact.fullName}</p>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Thời gian</span>
                    <p className="font-medium text-slate-900 text-base">{new Date(contact.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Email</span>
                    <p className="font-medium text-blue-600 text-base">{contact.email}</p>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Số điện thoại</span>
                    <p className="font-medium text-slate-900 text-base">{contact.phone || "---"}</p>
                </div>
            </div>

            {/* Nội dung tin nhắn */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <span className="block text-slate-500 text-xs uppercase font-bold mb-2">Chủ đề: <span className="text-slate-800">{contact.subject}</span></span>
                <div className="text-slate-800 whitespace-pre-wrap text-sm leading-relaxed">
                    {contact.message}
                </div>
            </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-sm">Đóng</button>
            {contact.status === 'UNREAD' && (
                <button 
                    onClick={handleMarkAsRead}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center gap-2"
                >
                    <Check size={16} /> Đánh dấu đã xem
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State bộ lọc & Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [page, statusFilter, search]); 

  const loadData = async () => {
    setLoading(true);
    try {
        const data = await getContacts({ page, status: statusFilter, search });
        // @ts-ignore
        setContacts(data.contacts);
        setTotalPages(data.totalPages);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tin nhắn này?")) return;
    await deleteContact(id);
    loadData();
  };

  const handleMarkRead = async (id: string) => {
    await updateContact(id, { status: "READ" });
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-600">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="text-blue-600" /> Quản lý Liên hệ
            </h1>
            <p className="text-slate-500 text-sm mt-1">Xem danh sách thắc mắc từ thí sinh.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/admin" className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition">
                Quay lại Dashboard
             </Link>
          </div>
        </div>

        {/* Toolbar: Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-2">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    {/* Fix màu chữ select */}
                    <select 
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white min-w-[150px] cursor-pointer hover:border-blue-400 transition"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="UNREAD">Chưa đọc</option>
                        <option value="READ">Đã xem</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                {/* Fix màu chữ input search */}
                <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 min-h-[400px]">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 border-b">
              <tr>
                <th className="px-6 py-3">Người gửi</th>
                <th className="px-6 py-3">Chủ đề</th>
                <th className="px-6 py-3 w-1/3">Nội dung</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-center">Ngày gửi</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : contacts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400 italic">Không tìm thấy tin nhắn nào.</td></tr>
              ) : (
                  contacts.map((msg) => (
                    <tr key={msg.id} className={`border-b hover:bg-slate-50 transition ${msg.status === 'UNREAD' ? 'bg-blue-50/40' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{msg.fullName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{msg.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded font-medium whitespace-nowrap">
                            {msg.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="truncate max-w-xs text-slate-600">{msg.message}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                            msg.status === 'UNREAD' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-green-50 text-green-600 border-green-100'
                        }`}>
                            {msg.status === 'UNREAD' ? 'Mới' : 'Đã xem'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-slate-500">
                        {new Date(msg.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                            {msg.status === 'UNREAD' && (
                                <button onClick={() => handleMarkRead(msg.id)} className="p-2 hover:bg-blue-100 text-blue-600 rounded transition" title="Đánh dấu đã đọc"><Check size={16}/></button>
                            )}
                            <button onClick={() => setSelectedContact(msg)} className="p-2 hover:bg-slate-200 text-slate-700 rounded transition" title="Xem chi tiết"><Eye size={16}/></button>
                            <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-red-100 text-red-600 rounded transition" title="Xóa"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Render Modal nếu có */}
      {selectedContact && (
        <ContactModal 
            contact={selectedContact} 
            onClose={() => setSelectedContact(null)} 
            onUpdate={loadData}
        />
      )}
    </div>
  );
}
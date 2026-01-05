"use client";

import { useEffect, useState } from "react";
// Import từ file action vừa tách ở Bước 1
import { getAnnouncements, createAnnouncement, deleteAnnouncement, updateAnnouncement } from "@/app/actions/announcement";
import { getCurrentRole, logoutAdmin } from "@/app/actions/auth"; // Import check role
import { useRouter } from "next/navigation";
import { 
  Megaphone, Trash2, Plus, Loader2, Pencil, Save, X, 
  FileText, ListChecks, Calendar, LayoutTemplate, 
  LayoutDashboard, MessageSquare, LogOut, CheckCircle, AlertCircle, AlertTriangle
} from "lucide-react";
import Link from "next/link";

// --- MẪU SOẠN THẢO SẴN (TEMPLATES) ---
const SAMPLE_TEMPLATES = [
    {
        name: "Công bố Kết quả",
        icon: <ListChecks size={16}/>,
        content: `<h3>🎉 Chúc mừng các thí sinh xuất sắc vượt qua vòng thi!</h3>
<p>Ban Tổ chức xin trân trọng thông báo danh sách các thí sinh đã đạt điểm cao nhất và bước tiếp vào vòng trong:</p>
<div style="overflow-x:auto;">
<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f1f5f9;">
    <tr>
      <th style="padding: 10px;">SBD</th>
      <th style="padding: 10px;">Họ và tên</th>
      <th style="padding: 10px;">Trường</th>
      <th style="padding: 10px;">Kết quả</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px;">S001</td>
      <td style="padding: 10px;">Nguyễn Văn A</td>
      <td style="padding: 10px;">THPT Chuyên Lê Hồng Phong</td>
      <td style="padding: 10px; color: green; font-weight: bold;">Đậu</td>
    </tr>
  </tbody>
</table>
</div>
<p style="margin-top: 15px;">📧 Thông tin chi tiết về vòng thi tiếp theo đã được gửi qua email.</p>`
    },
    {
        name: "Lịch trình",
        icon: <Calendar size={16}/>,
        content: `<p>Thân gửi các bạn thí sinh,</p>
<p>Ban Tổ chức xin thông báo về việc <strong>thay đổi thời gian/địa điểm</strong> như sau:</p>
<ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 15px;">
    <li><strong>Thời gian cũ:</strong> 08:00 - 11:30, Thứ Bảy</li>
    <li><strong>Thời gian mới:</strong> <span style="color: #e11d48; font-weight: bold;">13:30 - 17:00, Chủ Nhật</span></li>
    <li><strong>Hình thức:</strong> Online qua Microsoft Teams</li>
</ul>
<div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 10px 15px; color: #9a3412;">
    <strong>Lưu ý:</strong> Các bạn vui lòng vào phòng chờ trước 15 phút.
</div>`
    },
    {
        name: "Tin chung",
        icon: <FileText size={16}/>,
        content: `<p><strong>UMT TechGen 2025</strong> chính thức khởi động!</p>
<p>Đây là sân chơi học thuật dành riêng cho học sinh THPT đam mê công nghệ với tổng giải thưởng lên đến <strong>100 triệu đồng</strong>.</p>
<h3>1. Đối tượng tham gia</h3>
<p>Tất cả học sinh THPT trên toàn quốc yêu thích Toán - Tin và Lập trình.</p>
<p><em>Hẹn gặp lại các bạn tại đấu trường công nghệ đỉnh cao này! 🚀</em></p>`
    }
];

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed top-24 right-4 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-10 backdrop-blur-md max-w-sm w-full ${type === 'success' ? 'bg-white/95 border-emerald-100 text-emerald-800' : 'bg-white/95 border-red-100 text-red-800'}`}>
            {type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            <p className="text-sm font-medium flex-1">{message}</p>
        </div>
    );
};

export default function AdminAnnouncements() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState("VIEWER"); // Mặc định Viewer
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    type: "NEWS",
    summary: "",
    content: "" 
  });

  useEffect(() => { 
      loadData(); 
      checkRole();
  }, []);

  const checkRole = async () => {
      const r = await getCurrentRole();
      setRole(r);
  };

  const loadData = async () => {
    setLoading(true);
    try {
        const data = await getAnnouncements();
        // Kiểm tra xem data trả về có phải mảng không (phòng trường hợp lỗi)
        setList(Array.isArray(data) ? data : []);
    } catch (e) {
        setList([]);
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
      setFormData({
          title: item.title,
          type: item.type,
          summary: item.summary || "",
          content: item.content || ""
      });
      setEditingId(item.id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setFormData({ title: "", type: "NEWS", summary: "", content: "" });
      setEditingId(null);
      setShowForm(false);
  };

  const applyTemplate = (templateContent: string) => {
      if(confirm("Áp dụng mẫu sẽ ghi đè nội dung hiện tại. Bạn có chắc chắn?")) {
          setFormData({ ...formData, content: templateContent });
      }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!formData.title || !formData.summary) {
        setToast({ message: "Vui lòng nhập đủ Tiêu đề và Tóm tắt!", type: 'error' });
        return;
    }
    
    // Nút loading UI
    const btn = e.nativeEvent.submitter;
    const originalText = btn.innerText;
    btn.innerText = "Đang lưu...";
    btn.disabled = true;

    let res;
    if (editingId) {
        res = await updateAnnouncement(editingId, formData);
    } else {
        res = await createAnnouncement(formData);
    }

    if (res.success) {
        setToast({ message: editingId ? "Cập nhật thành công!" : "Đăng bài thành công!", type: 'success' });
        handleCancel();
        await loadData();
    } else {
        setToast({ message: "Lỗi: " + (res.message || "Vui lòng kiểm tra backend"), type: 'error' });
    }
    btn.innerText = originalText;
    btn.disabled = false;
  };

  const handleDelete = async (id: number) => {
    if(confirm("Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?")) {
        const res = await deleteAnnouncement(id);
        if (res.success) {
            setToast({ message: "Đã xóa bài viết", type: 'success' });
            loadData();
        } else {
            setToast({ message: "Lỗi khi xóa bài", type: 'error' });
        }
    }
  };

  const handleLogout = async () => {
      await logoutAdmin();
      router.push("/admin/login");
  };

  const isViewer = role === 'VIEWER';

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8 font-sans relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-[1600px] mx-auto min-h-[85vh] flex flex-col gap-6">
        
        {/* --- HEADER ĐỒNG BỘ --- */}
        <div className="flex justify-between items-center bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
             <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <Megaphone size={18} />
                    </div>
                    Quản trị viên <span className="text-slate-300 font-light">|</span> UMT TechGen
                </h1>
                <p className="text-slate-500 text-xs mt-1 font-medium ml-10">
                    Phiên: <span className="font-bold text-blue-600 uppercase">{role}</span>
                </p>
             </div>
             
             <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition font-bold text-sm group">
                <LogOut size={16} /> <span className="hidden sm:inline">Đăng xuất</span>
             </button>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Link href="/admin/dashboard" className="bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 hover:text-blue-600 transition font-bold text-sm">
                    <LayoutDashboard size={18}/> Dashboard
                </Link>
                <Link href="/admin/announcements" className="bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm">
                    <Megaphone size={18}/> Thông báo
                </Link>
                <Link href="/admin/contacts" className="bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition font-bold text-sm">
                    <MessageSquare size={18} /> Hộp thư
                </Link>
             </div>

             {/* Nút Tạo Mới (Ẩn nếu là Viewer) */}
             {!isViewer && !showForm && (
                <button 
                    onClick={() => setShowForm(true)} 
                    className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-sm active:scale-95"
                >
                    <Plus size={18} /> Soạn thông báo mới
                </button>
             )}
        </div>

        {/* --- FORM SOẠN THẢO --- */}
        {showForm && !isViewer && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 animate-in slide-in-from-top-5">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        {editingId ? <><Pencil size={20} className="text-orange-500"/> Cập nhật bài viết</> : <><Plus size={20} className="text-blue-500"/> Bài viết mới</>}
                    </h3>
                    <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                            <input required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-slate-800 placeholder:font-normal transition" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nhập tiêu đề thật hấp dẫn..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phân loại <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-blue-500 appearance-none transition" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="NEWS">📰 Tin tức (News)</option>
                                    <option value="RESULT">🏆 Kết quả thi (Result)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><LayoutTemplate size={16}/></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tóm tắt ngắn <span className="text-red-500">*</span></label>
                        <textarea required className="w-full p-3 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm leading-relaxed transition" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} placeholder="Mô tả ngắn gọn nội dung (sẽ hiển thị ở danh sách bên ngoài)..."></textarea>
                    </div>

                    {/* EDITOR SECTION */}
                    <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 gap-2">
                            <label className="block text-sm font-bold text-slate-700">Nội dung chi tiết (HTML)</label>
                            
                            {/* Templates */}
                            <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mx-2 hidden sm:block">Mẫu nhanh:</span>
                                {SAMPLE_TEMPLATES.map((tpl, idx) => (
                                    <button 
                                        key={idx}
                                        type="button"
                                        onClick={() => applyTemplate(tpl.content)}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-md transition font-medium shadow-sm"
                                        title={`Chèn mẫu ${tpl.name}`}
                                    >
                                        {tpl.icon} {tpl.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea 
                            className="w-full p-4 border border-slate-200 rounded-xl h-80 font-mono text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" 
                            value={formData.content} 
                            onChange={e => setFormData({...formData, content: e.target.value})} 
                            placeholder="<p>Nội dung chi tiết...</p>"
                        ></textarea>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                            <span className="font-bold text-slate-500">Mẹo:</span> Sử dụng các thẻ HTML cơ bản như &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;table&gt; để trình bày đẹp hơn.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={handleCancel} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">Hủy bỏ</button>
                        <button type="submit" className={`px-8 py-3 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transform active:scale-95 transition-all ${editingId ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}>
                            <Save size={20}/> {editingId ? 'Lưu thay đổi' : 'Đăng bài ngay'}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* --- DANH SÁCH BÀI VIẾT --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-700">Danh sách đã đăng ({list.length})</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-400 gap-3">
                    <Loader2 className="animate-spin text-orange-500" size={40}/>
                    <span className="font-medium">Đang tải dữ liệu...</span>
                </div>
            ) : list.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-400 gap-4 opacity-70">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><Megaphone size={32} className="opacity-50"/></div>
                    <p>Chưa có thông báo nào. {isViewer ? '' : 'Hãy bấm nút "Soạn thông báo mới" ở trên!'}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Tiêu đề</th>
                                <th className="px-6 py-5">Loại</th>
                                <th className="px-6 py-5">Ngày đăng</th>
                                {!isViewer && <th className="px-6 py-5 text-center">Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {list.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-800 text-base group-hover:text-blue-700 transition-colors line-clamp-1">{item.title}</div>
                                        <div className="text-slate-500 text-xs mt-1 line-clamp-1">{item.summary}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wide ${
                                            item.type === 'RESULT' 
                                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                            : 'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                            {item.type === 'RESULT' ? 'Kết quả' : 'Tin tức'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 font-mono text-xs">
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    
                                    {!isViewer && (
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(item)} className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 rounded-xl transition shadow-sm active:scale-95" title="Sửa bài viết">
                                                    <Pencil size={18}/>
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition shadow-sm active:scale-95" title="Xóa bài viết">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement, deleteAnnouncement, updateAnnouncement } from "@/app/actions/announcement";
import { 
  Megaphone, Trash2, Plus, ArrowLeft, Loader2, Pencil, Save, X, 
  FileText, ListChecks, Calendar, LayoutTemplate 
} from "lucide-react";
import Link from "next/link";

// --- MẪU SOẠN THẢO SẴN (TEMPLATES) ---
const SAMPLE_TEMPLATES = [
    {
        name: "Công bố Kết quả (Bảng)",
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
    <tr>
      <td style="padding: 10px;">S002</td>
      <td style="padding: 10px;">Trần Thị B</td>
      <td style="padding: 10px;">THPT Gia Định</td>
      <td style="padding: 10px; color: green; font-weight: bold;">Đậu</td>
    </tr>
  </tbody>
</table>
</div>
<p style="margin-top: 15px;">📧 Thông tin chi tiết về vòng thi tiếp theo đã được gửi qua email. Các bạn vui lòng kiểm tra hộp thư (kể cả mục Spam).</p>`
    },
    {
        name: "Thông báo Lịch trình",
        icon: <Calendar size={16}/>,
        content: `<p>Thân gửi các bạn thí sinh,</p>
<p>Ban Tổ chức xin thông báo về việc <strong>thay đổi thời gian/địa điểm</strong> như sau:</p>
<ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 15px;">
    <li><strong>Thời gian cũ:</strong> 08:00 - 11:30, Thứ Bảy</li>
    <li><strong>Thời gian mới:</strong> <span style="color: #e11d48; font-weight: bold;">13:30 - 17:00, Chủ Nhật</span></li>
    <li><strong>Hình thức:</strong> Online qua Microsoft Teams</li>
</ul>
<div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 10px 15px; color: #9a3412;">
    <strong>Lưu ý:</strong> Các bạn vui lòng vào phòng chờ trước 15 phút để điểm danh và kiểm tra thiết bị.
</div>
<p style="margin-top: 15px;">Trân trọng,<br>Ban Tổ chức UMT TechGen.</p>`
    },
    {
        name: "Tin tức chung",
        icon: <FileText size={16}/>,
        content: `<p><strong>UMT TechGen 2025</strong> chính thức khởi động!</p>
<p>Đây là sân chơi học thuật dành riêng cho học sinh THPT đam mê công nghệ với tổng giải thưởng lên đến <strong>100 triệu đồng</strong>.</p>
<h3>1. Đối tượng tham gia</h3>
<p>Tất cả học sinh THPT trên toàn quốc yêu thích Toán - Tin và Lập trình.</p>
<h3>2. Cách thức đăng ký</h3>
<p>Các bạn truy cập đường link đăng ký tại trang chủ hoặc quét mã QR bên dưới.</p>
<p><em>Hẹn gặp lại các bạn tại đấu trường công nghệ đỉnh cao này! 🚀</em></p>`
    }
];

export default function AdminAnnouncements() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "NEWS",
    summary: "",
    content: "" 
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAnnouncements();
    setList(data);
    setLoading(false);
  };

  const handleEdit = (item: any) => {
      setFormData({
          title: item.title,
          type: item.type,
          summary: item.summary,
          content: item.content
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
        alert("Vui lòng nhập đủ Tiêu đề và Tóm tắt!");
        return;
    }
    
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
        alert(editingId ? "Cập nhật thành công!" : "Đăng bài thành công!");
        handleCancel();
        await loadData();
    } else {
        alert("Lỗi: " + (res.message || "Vui lòng kiểm tra backend"));
        btn.innerText = originalText;
        btn.disabled = false;
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?")) {
        const res = await deleteAnnouncement(id);
        if (res.success) {
            loadData();
        } else {
            alert("Lỗi khi xóa bài.");
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                        <Megaphone size={24}/>
                    </div> 
                    Quản lý Thông báo
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Soạn thảo, đăng tải tin tức và công bố kết quả thi.</p>
            </div>
            <Link href="/admin" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition shadow-sm flex items-center gap-2">
                <ArrowLeft size={18}/> Quay lại
            </Link>
        </div>

        {/* --- NÚT TẠO MỚI --- */}
        {!showForm && (
            <button 
                onClick={() => setShowForm(true)} 
                className="w-full py-6 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-3xl text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-400 transition flex flex-col items-center justify-center gap-2 mb-10 group"
            >
                <div className="p-3 bg-blue-100 rounded-full group-hover:scale-110 transition-transform">
                    <Plus size={24}/>
                </div>
                <span>Soạn thông báo mới</span>
            </button>
        )}

        {/* --- FORM SOẠN THẢO --- */}
        {showForm && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-10 animate-in slide-in-from-top-5 ring-1 ring-slate-900/5">
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
                            <input required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-slate-800 placeholder:font-normal" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nhập tiêu đề thật hấp dẫn..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phân loại <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-blue-500 appearance-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="NEWS">📰 Tin tức (News)</option>
                                    <option value="RESULT">🏆 Kết quả thi (Result)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><LayoutTemplate size={16}/></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tóm tắt ngắn <span className="text-red-500">*</span></label>
                        <textarea required className="w-full p-3 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm leading-relaxed" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} placeholder="Mô tả ngắn gọn nội dung (sẽ hiển thị ở danh sách bên ngoài)..."></textarea>
                    </div>

                    {/* EDITOR SECTION */}
                    <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 gap-2">
                            <label className="block text-sm font-bold text-slate-700">Nội dung chi tiết (HTML)</label>
                            
                            {/* --- THANH CÔNG CỤ MẪU NHANH --- */}
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-center mr-1">Mẫu nhanh:</span>
                                {SAMPLE_TEMPLATES.map((tpl, idx) => (
                                    <button 
                                        key={idx}
                                        type="button"
                                        onClick={() => applyTemplate(tpl.content)}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg transition font-medium"
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-700">Danh sách đã đăng ({list.length})</h3>
            </div>

            {loading ? (
                <div className="p-20 text-center flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 className="animate-spin text-blue-500" size={40}/>
                    <span className="font-medium">Đang tải dữ liệu...</span>
                </div>
            ) : list.length === 0 ? (
                <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><Megaphone size={32} className="opacity-50"/></div>
                    <p>Chưa có thông báo nào. Hãy bấm nút "Soạn thông báo mới" ở trên!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Tiêu đề</th>
                                <th className="px-6 py-5">Loại</th>
                                <th className="px-6 py-5">Ngày đăng</th>
                                <th className="px-6 py-5 text-center">Thao tác</th>
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
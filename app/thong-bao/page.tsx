"use client";

import { useState, useEffect } from "react";
import { getAnnouncements } from "@/app/actions/announcement"; 
import { 
  Megaphone, ListChecks, Calendar, ChevronRight, 
  Search, X, FileText, Download, Paperclip // <-- Import thêm icon
} from "lucide-react";

// Component Modal Chi Tiết
const DetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    if (!item) return null;

    // Lấy URL API từ biến môi trường
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header Modal */}
                <div className={`p-6 border-b flex justify-between items-start gap-4 ${item.type === 'RESULT' ? 'bg-blue-50/50 border-blue-100' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${item.type === 'RESULT' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                {item.type === 'RESULT' ? 'Kết quả thi' : 'Thông báo'}
                            </span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                                <Calendar size={14}/> {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{item.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition"><X size={20}/></button>
                </div>

                {/* Body Modal */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white custom-scrollbar">
                    
                    {/* --- KHỐI HIỂN THỊ FILE ĐÍNH KÈM (MỚI) --- */}
                    {item.filePath && (
                        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between group hover:border-blue-300 transition-colors shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                                        {item.fileName || "Tài liệu đính kèm"}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium mt-0.5">Văn bản chính thức từ BTC</div>
                                </div>
                            </div>
                            <a 
                                href={`${API_URL}${item.filePath}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-sm"
                            >
                                <Download size={16} /> <span className="hidden sm:inline">Tải về</span>
                            </a>
                        </div>
                    )}
                    {/* ------------------------------------------ */}

                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AnnouncementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    async function fetch() {
        const res = await getAnnouncements();
        // Sắp xếp giảm dần theo ngày (nếu API chưa sort)
        if (Array.isArray(res)) {
             setData(res);
        }
    }
    fetch();
  }, []);

  const filteredData = data.filter(item => filter === "ALL" || item.type === filter);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] -translate-x-10 translate-y-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="text-blue-300 font-bold tracking-wider uppercase text-sm mb-3 block animate-fade-in-up">News Center</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 animate-fade-in-up delay-100">Thông báo & Kết quả</h1>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-lg animate-fade-in-up delay-200">
                Cập nhật những tin tức mới nhất về cuộc thi và danh sách các thí sinh xuất sắc qua từng vòng.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-5xl">
        {/* Filter Bar */}
        <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-blue-900/5 border border-slate-200 flex flex-wrap gap-1 mb-10 justify-center w-fit mx-auto">
            <button onClick={() => setFilter("ALL")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>Tất cả</button>
            <button onClick={() => setFilter("RESULT")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'RESULT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><ListChecks size={18}/> Kết quả thi</button>
            <button onClick={() => setFilter("NEWS")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'NEWS' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><Megaphone size={18}/> Thông báo chung</button>
        </div>

        {/* Timeline Content */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {filteredData.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    
                    {/* Icon Tròn ở giữa */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:static transition-transform group-hover:scale-110 duration-300">
                        {item.type === 'RESULT' ? <ListChecks size={18} className="text-blue-600" /> : <Megaphone size={18} className="text-orange-500" />}
                    </div>
                    
                    {/* Card Nội dung */}
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] ml-auto md:ml-0 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer group-card" onClick={() => setSelectedItem(item)}>
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${item.type === 'RESULT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                {item.type === 'RESULT' ? 'Kết quả' : 'News'}
                            </span>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">{item.summary}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center text-blue-600 text-sm font-bold group/btn">
                                Xem chi tiết <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform"/>
                            </div>
                            
                            {/* Icon ghim giấy nếu có file */}
                            {item.filePath && (
                                <div className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                    <Paperclip size={12} /> File đính kèm
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {filteredData.length === 0 && (
            <div className="text-center py-20 text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-50"/>
                <p>Chưa có thông báo nào trong mục này.</p>
            </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { getAnnouncements } from "@/app/actions/announcement"; // Import hàm lấy dữ liệu
import { 
  Megaphone, ListChecks, Calendar, Clock, ChevronRight, 
  Search, X 
} from "lucide-react";

// Component Modal Chi Tiết (Giữ nguyên giao diện, chỉ sửa logic render nội dung)
const DetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    if (!item) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
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
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white custom-scrollbar prose prose-slate max-w-none text-slate-700">
                    {/* Render HTML từ database */}
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
            </div>
        </div>
    );
}

export default function AnnouncementsPage() {
  const [data, setData] = useState<any[]>([]); // Dữ liệu thật
  const [filter, setFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Load data khi vào trang
  useEffect(() => {
    async function fetch() {
        const res = await getAnnouncements();
        setData(res);
    }
    fetch();
  }, []);

  const filteredData = data.filter(item => filter === "ALL" || item.type === filter);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <div className="bg-blue-900 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-20 -translate-y-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Thông báo & Kết quả</h1>
            <p className="text-blue-200 max-w-3xl mx-auto text-lg">Cập nhật những tin tức mới nhất và danh sách thí sinh xuất sắc qua từng vòng thi.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-5xl">
        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2 mb-8 justify-center">
            <button onClick={() => setFilter("ALL")} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>Tất cả</button>
            <button onClick={() => setFilter("RESULT")} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'RESULT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50'}`}><ListChecks size={18}/> Kết quả thi</button>
            <button onClick={() => setFilter("NEWS")} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'NEWS' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-orange-50'}`}><Megaphone size={18}/> Thông báo chung</button>
        </div>

        {/* Timeline Content */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {filteredData.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:static">
                        {item.type === 'RESULT' ? <ListChecks size={18} className="text-blue-600" /> : <Megaphone size={18} className="text-orange-500" />}
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] ml-auto md:ml-0 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setSelectedItem(item)}>
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${item.type === 'RESULT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                {item.type === 'RESULT' ? 'Kết quả' : 'News'}
                            </span>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">{item.summary}</p>
                        <div className="flex items-center text-blue-600 text-sm font-bold group/btn">Xem chi tiết <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform"/></div>
                    </div>
                </div>
            ))}
        </div>

        {filteredData.length === 0 && (
            <div className="text-center py-20 text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-50"/>
                <p>Chưa có thông báo nào.</p>
            </div>
        )}
      </div>
    </div>
  );
}
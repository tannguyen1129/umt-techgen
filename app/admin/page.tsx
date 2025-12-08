"use client";

import { useEffect, useState } from "react";
import { getCandidates, updateStatus, deleteCandidate, updateCandidateInfo } from "@/app/actions/register";
import * as XLSX from "xlsx";
import { 
  Download, Check, X, Eye, LogOut, Filter, MessageSquare, 
  ChevronLeft, ChevronRight, User, Calendar, CreditCard, 
  Phone, Mail, School, Award, FileBadge, CheckCircle, AlertCircle, 
  Loader2, Clock, FileSpreadsheet, AlertTriangle,
  Trash2, LayoutDashboard, StickyNote, Save, Pencil, Megaphone
} from "lucide-react";
import Link from "next/link";
import { logoutAdmin } from "../actions/auth";
import { useRouter } from "next/navigation";
import { EditModal } from "@/components/EditModal";

// --- TYPES ---
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
  note?: string; 
  createdAt: string;
};

// --- HELPER FORMAT DATE ---
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "---";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "---";
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        return "---";
    }
};

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <div className={`fixed top-24 right-4 z-[100] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-10 duration-300 backdrop-blur-md max-w-sm w-full
        ${type === 'success' ? 'bg-white/95 border-emerald-100 text-emerald-800 ring-1 ring-emerald-500/10' : 'bg-white/95 border-red-100 text-red-800 ring-1 ring-red-500/10'}
      `}>
        <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-0.5">{type === 'success' ? 'Thành công!' : 'Lỗi!'}</h4>
          <p className="text-sm opacity-90 leading-snug">{message}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition"><X size={16} /></button>
      </div>
    );
};

// --- CONFIRM MODAL COMPONENT ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onCancel}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50/50">
              <AlertTriangle size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed px-4">{message}</p>
          </div>
          <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/50">
            <button onClick={onCancel} className="py-4 text-slate-600 font-bold hover:bg-white transition border-r border-slate-100 text-sm uppercase tracking-wide">
              Hủy bỏ
            </button>
            <button onClick={onConfirm} className="py-4 text-blue-600 font-bold hover:bg-white transition text-sm uppercase tracking-wide">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    );
};

// --- MODAL XEM ẢNH ---
const ImageModal = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative bg-transparent w-full max-w-5xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition backdrop-blur-sm z-50">
            <X size={24} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-h-[80vh] w-auto object-contain shadow-2xl rounded-lg border border-white/10" />
        <div className="mt-6 flex items-center gap-4 bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
            <span className="text-white font-medium text-lg">{alt}</span>
            <div className="w-px h-6 bg-white/20"></div>
            <a href={src} target="_blank" download className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition uppercase tracking-wide">
                <Download size={16} /> Tải ảnh gốc
            </a>
        </div>
      </div>
    </div>
  );
};

// --- MODAL CHI TIẾT (CÓ SAVE NOTE) ---
const DetailModal = ({ 
    candidate, 
    onClose, 
    onVerify, 
    onDelete, 
    onSaveNote, // <-- Nhận prop này
    onViewImage 
}: { 
    candidate: Candidate; 
    onClose: () => void; 
    onVerify: (id: string, status: string, note?: string) => void; 
    onDelete: (id: string) => void; 
    onSaveNote: (id: string, note: string) => void; // <-- Type cho prop
    onViewImage: (src: string, alt: string) => void 
}) => {
    const [note, setNote] = useState(candidate.note || "");
    const [isSaving, setIsSaving] = useState(false);

    // Hàm xử lý lưu note riêng
    const handleSaveNoteClick = async () => {
        setIsSaving(true);
        await onSaveNote(candidate.id, note);
        setIsSaving(false);
    };

    if (!candidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20">
                            {candidate.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{candidate.fullName}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-xs font-mono border border-slate-200">ID: {candidate.id.slice(0, 8)}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> Đăng ký: {formatDate(candidate.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Cột Trái: Thông tin */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={18}/></div>
                                    Thông tin cá nhân
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Ngày sinh</span>
                                        <p className="text-slate-900 font-medium flex items-center gap-2"><Calendar size={16} className="text-slate-400"/> {formatDate(candidate.dob)}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Giới tính</span>
                                        <p className="text-slate-900 font-medium">{candidate.gender}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Số CCCD</span>
                                        <p className="text-slate-900 font-medium flex items-center gap-2"><CreditCard size={16} className="text-slate-400"/> {candidate.cccd}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Điện thoại</span>
                                        <p className="text-blue-600 font-bold flex items-center gap-2"><Phone size={16} className="text-slate-400"/> {candidate.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Email liên hệ</span>
                                        <p className="text-slate-900 font-medium flex items-center gap-2"><Mail size={16} className="text-slate-400"/> {candidate.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><School size={18}/></div>
                                    Thông tin trường học
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Trường THPT</span>
                                        <p className="text-slate-900 font-medium text-lg">{candidate.school}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Tỉnh/Thành phố</span>
                                            <p className="text-slate-900 font-medium">{candidate.province}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Lớp học</span>
                                            <p className="text-slate-900 font-medium">Khối {candidate.grade} - Lớp {candidate.className}</p>
                                        </div>
                                    </div>
                                    {candidate.studentId && (
                                        <div className="pt-3 border-t border-slate-50">
                                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Mã học sinh</span>
                                            <p className="text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded w-fit">{candidate.studentId}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cột Phải */}
                        <div className="lg:col-span-5 space-y-6">
                            
                             {/* --- PHẦN GHI CHÚ ADMIN (ĐÃ CÓ NÚT SAVE RIÊNG) --- */}
                             <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                                        <StickyNote size={18}/> Ghi chú Admin
                                    </h3>
                                    {/* Nút Lưu Ghi Chú Riêng */}
                                    <button 
                                        onClick={handleSaveNoteClick}
                                        disabled={isSaving}
                                        className="text-xs bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={12} className="animate-spin"/> : <Save size={12}/>} Lưu
                                    </button>
                                </div>
                                <textarea 
                                    className="w-full text-sm p-3 rounded-xl border border-yellow-200 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 min-h-[100px]"
                                    placeholder="Ghi chú vấn đề hồ sơ (Lưu ý: Có thể lưu mà không cần Duyệt/Hủy)..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                            {/* --------------------------- */}

                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
                                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Award size={18}/></div>
                                    Nội dung dự thi
                                </h3>
                                <div className="mb-5">
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-2">Bảng thi đấu</span>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                                        candidate.table === 'A' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-teal-50 border-teal-200 text-teal-700'
                                    }`}>
                                        <span className="font-bold text-lg">Bảng {candidate.table}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-2">Thành tích liên quan</span>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 italic leading-relaxed">
                                        {candidate.achievements ? `"${candidate.achievements}"` : "Thí sinh không ghi chú thêm thành tích."}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileBadge size={18}/></div>
                                    Hồ sơ minh chứng
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { src: candidate.cccdPath, title: "CCCD Mặt trước" },
                                        { src: candidate.cccdBackPath, title: "CCCD Mặt sau" },
                                        { src: candidate.studentCardPath, title: "Thẻ Học sinh", full: true }
                                    ].map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => img.src && onViewImage(img.src, `${img.title} - ${candidate.fullName}`)}
                                            className={`relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-slate-100 transition-all hover:shadow-md ${img.full ? 'col-span-2 aspect-[3/1]' : 'aspect-[4/3]'}`}
                                        >
                                            {img.src ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={img.src} alt={img.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-center justify-center">
                                                        <Eye className="text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition duration-300" size={28} />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                    <AlertCircle size={24} className="mb-1 opacity-50"/>
                                                    <span className="text-xs font-medium">Chưa có ảnh</span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                                                {img.title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái:</span>
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                                candidate.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                candidate.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {candidate.status === 'APPROVED' && <CheckCircle size={12}/>}
                                {candidate.status === 'REJECTED' && <AlertCircle size={12}/>}
                                {candidate.status === 'PENDING' && <Loader2 size={12} className="animate-spin"/>}
                                {candidate.status === 'PENDING' ? 'Chờ duyệt' : candidate.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                            </span>
                        </div>
                        <button 
                            onClick={() => onDelete(candidate.id)}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition font-bold text-xs flex items-center gap-2 group h-full"
                            title="Xóa hồ sơ"
                        >
                            <Trash2 size={16} className="group-hover:text-red-600"/> 
                            <span className="hidden sm:inline">Xóa</span>
                        </button>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={() => onVerify(candidate.id, "REJECTED", note)} className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition font-bold text-sm flex items-center justify-center gap-2">
                            <X size={18}/> Từ chối
                        </button>
                        <button onClick={() => onVerify(candidate.id, "APPROVED", note)} className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition font-bold text-sm flex items-center justify-center gap-2">
                            <Check size={18}/> Duyệt hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [filterTable, setFilterTable] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);

  const router = useRouter();

  useEffect(() => { loadData(); }, [page, filterTable, filterStatus]); 

  const loadData = async () => {
    setLoading(true);
    try {
        const data = await getCandidates({ page: page, limit: 10, table: filterTable, status: filterStatus });
        if (data && Array.isArray(data.candidates)) {
            const validData = data.candidates.filter((c: any) => c && c.id);
            setCandidates(validData as unknown as Candidate[]); 
            setTotalPages(data.totalPages || 1);
            setTotalItems(data.totalItems || 0);
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

  const handleVerify = (id: string, status: string, note: string = "") => {
    const actionText = status === 'APPROVED' ? 'DUYỆT' : 'TỪ CHỐI';
    setConfirmModal({
      isOpen: true,
      title: `Xác nhận ${actionText.toLowerCase()}`,
      message: `Bạn có chắc chắn muốn ${actionText} hồ sơ thí sinh này không? Hành động này sẽ cập nhật trạng thái trên hệ thống.`,
      onConfirm: async () => {
        setConfirmModal(null); 
        const res = await updateStatus(id, status, note);
        if (res.success) {
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, status, note } : c));
            if (selectedCandidate && selectedCandidate.id === id) {
                setSelectedCandidate(prev => prev ? { ...prev, status, note } : null);
            }
            setToast({ message: `Đã ${actionText.toLowerCase()} hồ sơ thành công!`, type: 'success' });
        } else {
            setToast({ message: "Cập nhật thất bại, vui lòng thử lại.", type: 'error' });
        }
      }
    });
  };

  // --- LOGIC MỚI: LƯU NOTE MÀ KHÔNG ĐỔI STATUS ---
  const handleSaveNote = async (id: string, note: string) => {
      // Tìm candidate hiện tại để lấy status cũ
      const currentCandidate = candidates.find(c => c.id === id);
      const currentStatus = currentCandidate ? currentCandidate.status : "PENDING"; // Mặc định PENDING nếu không tìm thấy

      // Gọi API updateStatus nhưng giữ nguyên status cũ, chỉ đổi note
      const res = await updateStatus(id, currentStatus, note);
      
      if (res.success) {
          setCandidates(prev => prev.map(c => c.id === id ? { ...c, note } : c));
          if (selectedCandidate?.id === id) {
              setSelectedCandidate(prev => prev ? { ...prev, note } : null);
          }
          setToast({ message: "Đã lưu ghi chú thành công!", type: 'success' });
      } else {
          setToast({ message: "Lỗi khi lưu ghi chú.", type: 'error' });
      }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
        isOpen: true,
        title: "Xác nhận xóa hồ sơ",
        message: "Hành động này KHÔNG THỂ hoàn tác. Bạn có chắc chắn muốn xóa hoàn toàn dữ liệu thí sinh này khỏi hệ thống không?",
        onConfirm: async () => {
          setConfirmModal(null); 
          const res = await deleteCandidate(id);
          if (res.success) {
              setCandidates(prev => prev.filter(c => c.id !== id));
              setTotalItems(prev => prev - 1);
              if (selectedCandidate && selectedCandidate.id === id) {
                  setSelectedCandidate(null);
              }
              setToast({ message: "Đã xóa hồ sơ thành công!", type: 'success' });
          } else {
              setToast({ message: res.message || "Xóa thất bại, vui lòng thử lại.", type: 'error' });
          }
        }
      });
  }

  const exportExcel = async () => {
    const data = await getCandidates({ page: 1, limit: 10000, table: filterTable, status: filterStatus });
    const fullList = (data.candidates || []) as unknown as Candidate[];

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
        "Trạng thái": c.status === 'APPROVED' ? 'Đã duyệt' : c.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt',
        "Ghi chú": c.note || "",
        "Link ảnh CCCD Trước": c.cccdPath ? window.location.origin + c.cccdPath : "",
        "Link ảnh CCCD Sau": c.cccdBackPath ? window.location.origin + c.cccdBackPath : "",
        "Link ảnh Thẻ HS": c.studentCardPath ? window.location.origin + c.studentCardPath : "",
        "Ngày đăng ký": formatDate(c.createdAt) 
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    const sheetName = filterTable === "ALL" ? "All_Candidates" : `Bang_${filterTable}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const fileName = `Danh_sach_thi_sinh_${filterTable}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setToast({ message: "Đã xuất file Excel thành công!", type: 'success' });
  };

  const handleUpdateInfo = async (id: string, newData: any) => {
    const res = await updateCandidateInfo(id, newData);
    if (res.success) {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...newData } : c));
        if (selectedCandidate?.id === id) setSelectedCandidate(prev => prev ? { ...prev, ...newData } : null);
        setEditCandidate(null);
        setToast({ message: "Cập nhật thành công!", type: 'success' });
    } else {
        setToast({ message: "Lỗi cập nhật", type: 'error' });
    }
};

  const handleLogout = async () => {
      await logoutAdmin();
      router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8 font-sans relative">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {previewImage && (
        <ImageModal src={previewImage.src} alt={previewImage.alt} onClose={() => setPreviewImage(null)} />
      )}

      {confirmModal && (
        <ConfirmModal 
          isOpen={confirmModal.isOpen} 
          title={confirmModal.title} 
          message={confirmModal.message} 
          onConfirm={confirmModal.onConfirm} 
          onCancel={() => setConfirmModal(null)} 
        />
      )}

      {editCandidate && (
        <EditModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onSave={handleUpdateInfo} 
        />
      )}

      {selectedCandidate && (
        <DetailModal 
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onVerify={handleVerify}
            onDelete={handleDelete}
            onSaveNote={handleSaveNote} // <-- Truyền hàm lưu note mới vào modal
            onViewImage={(src, alt) => setPreviewImage({ src, alt })}
        />
      )}

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200/60 p-6 md:p-8 max-w-[1600px] mx-auto min-h-[85vh] flex flex-col">
        
        {/* Header Dashboard */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-slate-100 gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Award size={18} />
                </div>
                Quản trị viên <span className="text-slate-300 font-light">|</span> UMT TechGen
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500"/>
                Hệ thống đang hoạt động • Tổng số hồ sơ: <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{totalItems}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">

            <Link href="/admin/dashboard" className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition font-bold text-sm shadow-sm group">
                <LayoutDashboard size={18} className="text-slate-400 group-hover:text-blue-600 transition"/> 
                Dashboard
            </Link>

            <Link href="/admin/announcements" className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 transition font-bold text-sm shadow-sm group">
        <Megaphone size={18} className="text-slate-400 group-hover:text-orange-600 transition"/> 
        Thông báo
    </Link>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block"></div>

             <Link href="/admin/contacts" className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition font-bold text-sm shadow-sm">
                <MessageSquare size={18} /> Hộp thư đến
             </Link>

             <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block"></div>

             {/* FILTER STATUS (MỚI) */}
             <div className="relative group">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition" size={18} />
                <select 
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-bold text-sm appearance-none hover:bg-white transition min-w-[160px]"
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Từ chối</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronLeft size={16} className="-rotate-90"/>
                </div>
             </div>

             {/* FILTER TABLE */}
             <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400"></div>
                <select 
                    value={filterTable}
                    onChange={(e) => { setFilterTable(e.target.value); setPage(1); }}
                    className="pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-bold text-sm appearance-none hover:bg-white transition min-w-[150px]"
                >
                    <option value="ALL">Tất cả bảng thi</option>
                    <option value="A">Chỉ hiện Bảng A</option>
                    <option value="B">Chỉ hiện Bảng B</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronLeft size={16} className="-rotate-90"/>
                </div>
             </div>

             <button onClick={exportExcel} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 font-bold text-sm active:scale-95">
                <FileSpreadsheet size={18} /> Xuất Excel
             </button>
             
             <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-red-100 hover:border-red-200 transition font-bold text-sm">
                <LogOut size={18} />
             </button>
          </div>
        </div>

        {/* Bảng Danh sách */}
        <div className="flex-1 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Thông tin thí sinh</th>
                <th className="px-6 py-4">Trường & Lớp</th>
                <th className="px-6 py-4 text-center">Bảng thi</th>
                <th className="px-6 py-4 text-center">Ngày đăng ký</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4">Ghi chú</th> 
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                  <tr><td colSpan={7} className="px-6 py-24 text-center text-slate-400 font-medium"><div className="flex flex-col items-center gap-3"><Loader2 className="animate-spin text-blue-500" size={32}/>Đang tải dữ liệu...</div></td></tr>
              ) : candidates.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-24 text-center text-slate-400 italic bg-slate-50/30">Chưa có dữ liệu nào.</td></tr>
              ) : (
                  candidates.map((c) => (
                    <tr key={c.id} className="bg-white hover:bg-slate-50/80 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                {c.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition cursor-pointer" onClick={() => setSelectedCandidate(c)}>
                                    {c.fullName}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide flex items-center gap-1">
                                    {c.gender} • {formatDate(c.dob)}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                    <CreditCard size={10}/> {c.cccd}
                                </div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 text-sm">{c.school}</div>
                        <div className="text-xs text-slate-500 mt-1">{c.province}</div>
                        <div className="mt-1.5 inline-block px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600 border border-slate-200">
                            Khối {c.grade} • {c.className}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${c.table === 'A' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                            Bảng {c.table}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                          <div className="text-xs font-mono font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block text-slate-600">
                            {formatDate(c.createdAt)}
                          </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wide font-bold border flex items-center justify-center gap-1.5 mx-auto w-fit min-w-[100px] ${
                            c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            c.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            {c.status === 'APPROVED' && <CheckCircle size={12}/>}
                            {c.status === 'REJECTED' && <X size={12}/>}
                            {c.status === 'PENDING' && <Loader2 size={12} className="animate-spin"/>}
                            {c.status === 'PENDING' ? 'Chờ duyệt' : c.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </td>

                      {/* CỘT GHI CHÚ (MỚI) */}
                      <td className="px-6 py-4">
                        {c.note ? (
                            <span className="text-xs text-slate-500 italic truncate max-w-[150px] block border-b border-dashed border-slate-300 pb-0.5" title={c.note}>
                                {c.note}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                            {/* Xem Chi Tiết */}
                            <button 
                                onClick={() => setSelectedCandidate(c)} 
                                className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm active:scale-95" 
                                title="Xem chi tiết"
                            >
                                <Eye size={16} />
                            </button>

                            {/* 2. NÚT SỬA (THÊM MỚI VÀO ĐÂY) 👇 */}
      <button 
          onClick={(e) => { 
              e.stopPropagation(); 
              setEditCandidate(c); // <-- Kích hoạt Modal Edit tại đây
          }} 
          className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition shadow-sm active:scale-95" 
          title="Cập nhật thông tin"
      >
          <Pencil size={16} />
      </button>
                            
                            {/* Duyệt Nhanh */}
                            {c.status !== 'APPROVED' && (
                                <button 
                                    onClick={() => handleVerify(c.id, "APPROVED")} 
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition border border-emerald-200 active:scale-95 shadow-sm" 
                                    title="Duyệt nhanh"
                                >
                                    <Check size={16} strokeWidth={3} />
                                </button>
                            )}

                             {/* NÚT XÓA Ở BẢNG */}
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(c.id);
                                }} 
                                className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm active:scale-95" 
                                title="Xóa hồ sơ"
                            >
                                <Trash2 size={16} />
                            </button>
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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trang {page} / {totalPages > 0 ? totalPages : 1}</span>
            <div className="flex gap-2">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 flex items-center gap-1 text-sm font-bold text-slate-600 transition bg-slate-50"
                >
                    <ChevronLeft size={16} /> Trước
                </button>
                <button 
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 flex items-center gap-1 text-sm font-bold text-slate-600 transition bg-slate-50"
                >
                    Sau <ChevronRight size={16} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
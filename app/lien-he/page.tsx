"use client";

import { MapPin, Phone, Mail, Send, Facebook, Globe, Loader2, CheckCircle, XCircle, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { submitContact } from "@/app/actions/contact";

// Component Toast Thông báo
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-fade-in-up ${
      type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle size={24} className="text-green-500" /> : <XCircle size={24} className="text-red-500" />}
      <div>
        <h4 className="font-bold text-sm">{type === 'success' ? 'Thành công!' : 'Lỗi!'}</h4>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
    </div>
  );
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
        const res = await submitContact(formData);
        if (res.success) {
            setToast({ message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.", type: 'success' });
            const form = document.getElementById("contact-form") as HTMLFormElement;
            if (form) form.reset();
        } else {
            setToast({ message: res.message || "Có lỗi xảy ra.", type: 'error' });
        }
    } catch (error) {
        setToast({ message: "Lỗi kết nối hệ thống.", type: 'error' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans text-slate-600">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 1. HERO HEADER */}
      <div className="bg-blue-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Liên hệ Ban Tổ Chức</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Chúng tôi luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của thí sinh và phụ huynh về UMT TechGen 2025.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 2. CỘT TRÁI: THÔNG TIN LIÊN HỆ CHI TIẾT */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    Thông tin trực tiếp
                </h3>
                
                <div className="space-y-8">
                    {/* VĂN PHÒNG */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Văn phòng Ban Tổ Chức</span>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">
                                Văn phòng Khoa Công nghệ (P.508), Tòa nhà Sáng tạo, Trường Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh.
                            </p>
                        </div>
                    </div>

                    {/* HOTLINE/ZALO */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition">
                            <Phone size={20} />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Hotline/Zalo</span>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-slate-800 font-bold text-sm">Mr. Huỳnh Lê Phú Trung</p>
                                    <p className="text-slate-500 text-xs mb-1">Trưởng Ban Tổ chức</p>
                                    <a href="tel:0767138667" className="text-green-600 font-bold hover:underline block text-sm">(+84) 767 138 667</a>
                                </div>
                                <div className="border-t border-slate-100 pt-2">
                                    <p className="text-slate-800 font-bold text-sm">Mr. Sơn Tân</p>
                                    <p className="text-slate-500 text-xs mb-1">Phó Ban Tổ chức</p>
                                    <a href="tel:0818126177" className="text-green-600 font-bold hover:underline block text-sm">(+84) 818 126 177</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EMAIL HỖ TRỢ */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition">
                            <Mail size={20} />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Email hỗ trợ</span>
                            <div className="space-y-1">
                                <a href="mailto:techgen@umt.edu.vn" className="text-slate-700 text-sm hover:text-blue-600 transition block font-medium">
                                    techgen@umt.edu.vn
                                </a>
                                <a href="mailto:trung.huynhlephu@umt.edu.vn" className="text-slate-700 text-sm hover:text-blue-600 transition block font-medium">
                                    trung.huynhlephu@umt.edu.vn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* KÊNH THÔNG TIN CHÍNH THỨC */}
             <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Kênh thông tin chính thức</h3>
                <div className="space-y-2">
                    <Link href="https://www.facebook.com/UMTUniversity" target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition group">
                        <div className="bg-white/10 p-1.5 rounded text-blue-200 group-hover:text-white"><Facebook size={16} /></div>
                        <span className="text-sm font-medium">Facebook Trường UMT</span>
                    </Link>
                    <Link href="https://www.umt.edu.vn/vi-vn/" target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition group">
                        <div className="bg-white/10 p-1.5 rounded text-blue-200 group-hover:text-white"><Globe size={16} /></div>
                        <span className="text-sm font-medium">Website Trường UMT</span>
                    </Link>
                    <Link href="https://www.facebook.com/sotumthcmc" target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition group">
                        <div className="bg-white/10 p-1.5 rounded text-blue-200 group-hover:text-white"><Facebook size={16} /></div>
                        <span className="text-sm font-medium">Facebook Khoa Công Nghệ</span>
                    </Link>
                    <Link href="https://sot.umtoj.edu.vn" target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition group">
                        <div className="bg-white/10 p-1.5 rounded text-blue-200 group-hover:text-white"><ExternalLink size={16} /></div>
                        <span className="text-sm font-medium">Hệ thống UMTOJ</span>
                    </Link>
                    <Link href="https://www.facebook.com/apc.umt" target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition group">
                        <div className="bg-white/10 p-1.5 rounded text-orange-200 group-hover:text-white"><Facebook size={16} /></div>
                        <span className="text-sm font-medium">Facebook CLB Lập trình ứng dụng</span>
                    </Link>
                </div>
             </div>
          </div>

          {/* 3. CỘT PHẢI: FORM & MAP */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form Gửi tin nhắn */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
                
                <form id="contact-form" action={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                            <input name="fullName" type="text" placeholder="Nguyễn Văn A" required className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email liên hệ</label>
                            <input name="email" type="email" placeholder="example@gmail.com" required className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white" />
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                            <input name="phone" type="tel" placeholder="090..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Chủ đề cần hỗ trợ</label>
                            <div className="relative">
                                <select name="subject" className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white appearance-none cursor-pointer">
                                    <option value="Đăng ký dự thi">Vấn đề đăng ký dự thi</option>
                                    <option value="Thể lệ & Bảng đấu">Hỏi về thể lệ & Bảng đấu</option>
                                    <option value="Kỹ thuật UMTOJ">Hỗ trợ kỹ thuật UMTOJ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Nội dung tin nhắn</label>
                        <textarea name="message" rows={4} required placeholder="Nhập nội dung thắc mắc của bạn..." className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:border-blue-500 outline-none transition resize-none bg-slate-50 focus:bg-white"></textarea>
                    </div>

                    <button 
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Đang gửi...</> : <>Gửi tin nhắn <Send size={18} /></>}
                    </button>
                </form>
            </div>

            {/* Google Maps - Đã cập nhật vị trí UMT chính xác (QQFX+V2) */}
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 overflow-hidden h-80 relative group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.161604102818!2d106.78121031526065!3d10.772662361730853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752420c9a62b75%3A0x8c51734507844993!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBRdeG6o24gbMO9IHbDoCBDw7RuZyBuZ2jhu4cgVFAuSENNIChVTVQp!5e0!3m2!1svi!2s" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl grayscale group-hover:grayscale-0 transition duration-500"
                ></iframe>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs font-bold text-slate-700 pointer-events-none border border-white/50">
                    Trụ sở chính UMT (Cát Lái)
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
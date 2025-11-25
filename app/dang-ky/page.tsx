"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Loader2, UploadCloud, User, Calendar, CreditCard, Phone, Mail, School, MapPin, GraduationCap, Award, FileCheck, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { registerCandidate } from "@/app/actions/register";

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-fade-in-up ${
      type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle size={24} className="text-green-500" /> : <AlertCircle size={24} className="text-red-500" />}
      <div>
        <h4 className="font-bold text-sm">{type === 'success' ? 'Thành công!' : 'Lỗi!'}</h4>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
    </div>
  );
};

// --- SCHEMA VALIDATION ---
const formSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên"),
  dob: z.string().min(1, "Vui lòng chọn ngày sinh"),
  gender: z.enum(["Nam", "Nữ"], { message: "Vui lòng chọn giới tính" }),
  cccd: z.string().min(9, "Số CCCD không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  email: z.string().email("Email không hợp lệ"),
  school: z.string().min(5, "Vui lòng nhập tên trường"),
  province: z.string().min(2, "Vui lòng nhập Tỉnh/Thành phố"),
  grade: z.enum(["10", "11", "12"], { message: "Vui lòng chọn khối lớp" }),
  className: z.string().min(1, "Vui lòng nhập tên lớp"),
  studentId: z.string().optional(),
  table: z.enum(["A", "B"], { message: "Vui lòng chọn bảng thi" }),
  achievements: z.string().optional(),
  
  confirmInfo: z.boolean().refine((val) => val === true, {
    message: "Bạn phải cam kết thông tin là chính xác",
  }),
  confirmRules: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý tuân thủ quy định",
  }),
});

type FormDataSchema = z.infer<typeof formSchema>;

export default function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // State cho file ảnh
  const [cccdFrontFile, setCccdFrontFile] = useState<File | null>(null);
  const [cccdBackFile, setCccdBackFile] = useState<File | null>(null);
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { studentId: "", achievements: "" },
  });

  const onSubmit = async (data: FormDataSchema) => {
    // Validate file thủ công
    if (!cccdFrontFile) { setToast({message: "Thiếu ảnh mặt trước CCCD", type: 'error'}); return; }
    if (!cccdBackFile) { setToast({message: "Thiếu ảnh mặt sau CCCD", type: 'error'}); return; }
    if (!studentCardFile) { setToast({message: "Thiếu ảnh Thẻ học sinh", type: 'error'}); return; }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
         if (key !== 'confirmInfo' && key !== 'confirmRules') {
             formData.append(key, value as string);
         }
      });

      formData.append("cccdFrontFile", cccdFrontFile);
      formData.append("cccdBackFile", cccdBackFile);
      formData.append("studentCardFile", studentCardFile);

      const result = await registerCandidate(formData);
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setToast({ message: result.message, type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Lỗi kết nối, vui lòng thử lại.", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Đăng ký thành công!</h2>
          <p className="text-slate-600 mb-8 text-lg">Hồ sơ của bạn đã được ghi nhận. Ban tổ chức sẽ liên hệ sớm nhất qua email.</p>
          <Link href="/" className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-600/30">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 font-sans text-slate-600">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Form */}
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Đơn đăng ký tham dự</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Hãy điền đầy đủ thông tin mà BTC yêu cầu bên dưới để tham gia tranh tài tại <span className="text-blue-600 font-bold">UMT TechGen 2025</span>.
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* --- 1. THÔNG TIN CÁ NHÂN --- */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 border-b border-slate-100 pb-4">
                <User className="text-blue-500" /> Thông tin thí sinh
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("fullName")} placeholder="Nguyễn Văn A" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition outline-none" />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs font-medium">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Ngày sinh <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("dob")} type="date" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition outline-none" />
                    </div>
                    {errors.dob && <p className="text-red-500 text-xs font-medium">{errors.dob.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Giới tính <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-400 transition w-full">
                            <input {...register("gender")} type="radio" value="Nam" className="w-4 h-4 text-blue-600" /> 
                            <span className="font-medium text-slate-700">Nam</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-400 transition w-full">
                            <input {...register("gender")} type="radio" value="Nữ" className="w-4 h-4 text-blue-600" /> 
                            <span className="font-medium text-slate-700">Nữ</span>
                        </label>
                    </div>
                    {errors.gender && <p className="text-red-500 text-xs font-medium">{errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Số CCCD <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("cccd")} placeholder="12 số trên CCCD" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition outline-none" />
                    </div>
                    {errors.cccd && <p className="text-red-500 text-xs font-medium">{errors.cccd.message}</p>}
                </div>
                
                {/* FILE UPLOAD GROUP */}
                <div className="md:col-span-2 grid md:grid-cols-2 gap-6 mt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">CCCD Mặt trước <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer group text-center h-32">
                            <UploadCloud className="mb-2 text-slate-400 group-hover:text-blue-500 transition" />
                            <span className="text-xs text-slate-500 font-medium truncate max-w-full px-2">
                                {cccdFrontFile ? cccdFrontFile.name : "Kéo thả hoặc chọn ảnh"}
                            </span>
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && setCccdFrontFile(e.target.files[0])} /> 
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">CCCD Mặt sau <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer group text-center h-32">
                            <UploadCloud className="mb-2 text-slate-400 group-hover:text-blue-500 transition" />
                            <span className="text-xs text-slate-500 font-medium truncate max-w-full px-2">
                                {cccdBackFile ? cccdBackFile.name : "Kéo thả hoặc chọn ảnh"}
                            </span>
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && setCccdBackFile(e.target.files[0])} /> 
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("phone")} placeholder="090..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition outline-none" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("email")} type="email" placeholder="example@gmail.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition outline-none" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                </div>
            </div>
          </div>

          {/* --- 2. THÔNG TIN TRƯỜNG --- */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
             <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 border-b border-slate-100 pb-4">
                <School className="text-emerald-500" /> Thông tin trường học
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Tên Trường THPT <span className="text-red-500">*</span></label>
                    <input {...register("school")} placeholder="Nhập tên trường đầy đủ" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition outline-none" />
                    {errors.school && <p className="text-red-500 text-xs font-medium">{errors.school.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("province")} placeholder="TP. Hồ Chí Minh" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition outline-none" />
                    </div>
                    {errors.province && <p className="text-red-500 text-xs font-medium">{errors.province.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Khối lớp <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        {["10", "11", "12"].map(g => (
                            <label key={g} className="flex items-center justify-center gap-1 cursor-pointer bg-slate-50 px-3 py-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 transition w-full font-medium text-sm">
                                <input {...register("grade")} type="radio" value={g} className="accent-emerald-600 w-4 h-4" /> 
                                Khối {g}
                            </label>
                        ))}
                    </div>
                    {errors.grade && <p className="text-red-500 text-xs font-medium">{errors.grade.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Lớp <span className="text-red-500">*</span></label>
                    <input {...register("className")} placeholder="VD: 10A1" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition outline-none" />
                    {errors.className && <p className="text-red-500 text-xs font-medium">{errors.className.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Mã học sinh (nếu có)</label>
                    <input {...register("studentId")} placeholder="MSSV..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition outline-none" />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-700">Ảnh Thẻ học sinh <span className="text-red-500">*</span></label>
                    <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 transition cursor-pointer group text-center h-32">
                        <UploadCloud className="mb-2 text-slate-400 group-hover:text-emerald-500 transition" />
                        <span className="text-xs text-slate-500 font-medium truncate max-w-full px-2">
                            {studentCardFile ? studentCardFile.name : "Kéo thả hoặc chọn ảnh thẻ"}
                        </span>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && setStudentCardFile(e.target.files[0])} />
                    </div>
                </div>
            </div>
          </div>

          {/* --- 3. ĐĂNG KÝ BẢNG THI --- */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 border-b border-slate-100 pb-4">
                <GraduationCap className="text-orange-500" /> Nội dung đăng ký thi
            </h2>
            
            <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800 mb-6 border border-orange-100">
                <p className="mb-1 font-bold">Lưu ý chọn bảng thi:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Bảng A:</strong> Dành cho học sinh Chuyên Tin hoặc đã có giải thưởng cấp Tỉnh trở lên không đạt giải Quốc gia</li>
                    <li><strong>Bảng B:</strong> Dành cho học sinh không chuyên, chưa có giải thưởng.</li>
                </ul>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Chọn bảng thi <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="relative flex items-start gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 transition group">
                            <input {...register("table")} type="radio" value="A" className="mt-1 w-5 h-5 accent-blue-600" /> 
                            <div>
                                <span className="block font-bold text-slate-800 group-hover:text-blue-700">Bảng A</span>
                                <span className="text-xs text-slate-500">Chuyên Tin hoặc có giải cấp tỉnh</span>
                            </div>
                        </label>
                        <label className="relative flex items-start gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border-2 border-slate-200 hover:border-teal-500 transition group">
                            <input {...register("table")} type="radio" value="B" className="mt-1 w-5 h-5 accent-teal-600" /> 
                            <div>
                                <span className="block font-bold text-slate-800 group-hover:text-teal-700">Bảng B</span>
                                <span className="text-xs text-slate-500">Không chuyên hoặc mới bắt đầu</span>
                            </div>
                        </label>
                    </div>
                    {errors.table && <p className="text-red-500 text-xs font-medium">{errors.table.message}</p>}
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Thành tích liên quan (nếu có)</label>
                    <div className="relative">
                        <Award size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input {...register("achievements")} placeholder="Ví dụ: Giải Nhất HSG Tỉnh 2024..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition outline-none" />
                    </div>
                </div>
            </div>
          </div>

          {/* --- 4. CAM KẾT --- */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-slate-800"></div>
             <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                 <FileCheck className="text-slate-800" /> Cam kết & Xác nhận
             </h2>
             <div className="space-y-4">
                 <label className="flex gap-3 cursor-pointer items-start group">
                     <input {...register("confirmInfo")} type="checkbox" className="mt-1 w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                     <span className="text-sm text-slate-700 group-hover:text-slate-900 transition">Tôi cam kết toàn bộ thông tin khai báo trên là hoàn toàn chính xác và chịu trách nhiệm về tính trung thực của hồ sơ.</span>
                 </label>
                 {errors.confirmInfo && <p className="text-red-500 text-xs ml-8 font-medium">{errors.confirmInfo.message}</p>}

                 <label className="flex gap-3 cursor-pointer items-start group">
                     <input {...register("confirmRules")} type="checkbox" className="mt-1 w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                     <span className="text-sm text-slate-700 group-hover:text-slate-900 transition">Tôi đã đọc, hiểu rõ và đồng ý tuân thủ mọi quy định trong <Link href="/the-le" target="_blank" className="text-blue-600 font-bold hover:underline">Thể lệ cuộc thi</Link>.</span>
                 </label>
                 {errors.confirmRules && <p className="text-red-500 text-xs ml-8 font-medium">{errors.confirmRules.message}</p>}
             </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-6 gap-4">
            <Link href="/" className="w-full md:w-auto px-8 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-center">
                Hủy bỏ & Quay lại
            </Link>
            <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : "Gửi đơn đăng ký ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
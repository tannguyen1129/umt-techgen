"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Trophy, Users, Star } from "lucide-react";

export default function Home() {
  // Logic chuyển ảnh tự động (Carousel)
  const heroImages = [
    "/images/Logo_Techgen_2025.jpg",
    "/images/Banner.png", 
    "/images/logo-umt.png",
    "/images/logo-kcn.png",
    "/images/logo-apc-ngang.png",
    "/images/umt-01.jpg",
    "/images/umt-02.jpg",
    "/images/umt-03.jpg",
    "/images/umt-04.jpg",
    "/images/umt-05.jpg",
    "/images/umt-06.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="flex flex-col gap-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 px-4 py-2 rounded-full shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-900 tracking-wide uppercase">Sắp mở đăng ký mùa giải 2025</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
              UMT TechGen <span className="text-blue-600 block mt-2">2025</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-lg">
              Giải mã công nghệ - Khơi nguồn đam mê
            </p>
            
            <p className="text-slate-600 leading-relaxed text-lg">
              Sân chơi lập trình chuyên nghiệp quy mô toàn quốc dành cho học sinh THPT. 
              Nơi tư duy tỏa sáng và cơ hội nhận học bổng đại học giá trị.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/dang-ky" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-xl hover:shadow-blue-600/30 transform hover:-translate-y-1">
                Đăng ký ngay <ArrowRight size={20} />
              </Link>
              <Link href="/chuong-trinh" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition shadow-sm">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>

          {/* Slideshow hình ảnh */}
          <div className="relative lg:h-[550px] flex flex-col items-center justify-center">
             <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg mx-auto transform rotate-1 hover:rotate-0 transition duration-500">
                {/* Khung ảnh */}
                <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center mb-6 border border-slate-100">
                  {heroImages.map((src, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center p-6 ${
                            index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <Image 
                            src={src} 
                            alt={`TechGen Image ${index}`} 
                            fill 
                            className="object-contain" 
                            priority={index === 0}
                            onError={(e) => console.error("Lỗi tải ảnh:", src)}
                        />
                    </div>
                  ))}
                </div>

                {/* HASHTAGS SECTION - Nằm trong khung trắng luôn */}
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        '#UMTTechGen2025', 
                        '#GiaiMaCongNghe', 
                        '#KhoiNguonDamMe', 
                        '#UMTOJ',
                        '#SchoolofTechnology',
                        '#APC'
                    ].map((tag, idx) => (
                        <span key={idx} className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 cursor-default transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
             </div>
             
             {/* Background decoration */}
             <div className="absolute top-10 right-10 w-full h-full bg-blue-100 rounded-3xl -z-10 rotate-6 scale-90 opacity-50"></div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAM SUMMARY - ĐÃ SỬA LỖI ẨN CHỮ & GIÃN CÁCH */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm block mb-2">Về cuộc thi</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-6">Mục tiêu & Giá trị</h2>
          <p className="text-slate-600 text-lg mb-12 max-w-3xl mx-auto">
            TechGen 2025 không chỉ là một kỳ thi, mà là bệ phóng tài năng công nghệ trẻ. 
            Chúng tôi tìm kiếm những "chiến binh" code xuất sắc nhất để trao tặng các suất học bổng toàn phần.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
             {/* Card 1 */}
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                   <Trophy size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-900 mb-3">Giải thưởng lớn</h4>
                <p className="text-base text-slate-600 leading-relaxed">Học bổng lên tới 100% học phí toàn khóa học.</p>
             </div>

             {/* Card 2 */}
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                   <Users size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-900 mb-3">Kết nối chuyên gia</h4>
                <p className="text-base text-slate-600 leading-relaxed">Được mentoring trực tiếp bởi giảng viên Khoa Công nghệ.</p>
             </div>

             {/* Card 3 */}
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                   <Star size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-900 mb-3">Trải nghiệm Đại học</h4>
                <p className="text-base text-slate-600 leading-relaxed">Nhận giải vinh danh tại Campus UMT hiện đại chuẩn quốc tế.</p>
             </div>
          </div>

          <Link href="/chuong-trinh" className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:gap-3 transition-all hover:underline">
            Xem chi tiết chương trình <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 3. TIMELINE SUMMARY */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Lộ trình cuộc thi</h2>
                    <p className="text-slate-400 max-w-xl text-lg">Hành trình 5 tháng từ Sơ loại đến Chung kết vinh quang. Hãy chuẩn bị sẵn sàng!</p>
                </div>
                <Link href="/lich-trinh" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition backdrop-blur-md shrink-0 border border-white/10 text-white">
                    Xem lịch trình chi tiết
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-14 left-0 w-full h-0.5 bg-slate-800 -z-0 transform -translate-y-1/2"></div>
                
                <div className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition group hover:-translate-y-1">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-900/50 group-hover:scale-110 transition text-white">1</div>
                    <div className="text-blue-400 font-bold text-sm mb-2">Tháng 11 - 12/2025</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Vòng Sơ Loại</h3>
                    <p className="text-slate-400 text-sm">Thi trực tuyến trên hệ thống UMTOJ. Chọn lọc các thí sinh tiềm năng.</p>
                </div>

                <div className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition group hover:-translate-y-1">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-900/50 group-hover:scale-110 transition text-white">2</div>
                    <div className="text-blue-400 font-bold text-sm mb-2">Tháng 01 - 03/2026</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Vòng Chính Thức</h3>
                    <p className="text-slate-400 text-sm">Thử thách thuật toán nâng cao. Tập huấn chuyên môn cùng chuyên gia.</p>
                </div>

                <div className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-orange-500 transition group hover:-translate-y-1">
                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-orange-900/50 group-hover:scale-110 transition text-white">3</div>
                    <div className="text-orange-400 font-bold text-sm mb-2">Tháng 04/2026</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Vòng Chung Kết</h3>
                    <p className="text-slate-400 text-sm">Tranh tài trực tuyến & Lễ trao giải vinh danh tại UMT.</p>
                </div>
            </div>
        </div>
      </section>

      {/* 4. RULES SUMMARY */}
      <section className="py-24 bg-blue-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bạn thuộc bảng đấu nào?</h2>
                <p className="text-slate-600 text-lg">Cuộc thi được thiết kế công bằng cho mọi đối tượng học sinh THPT.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link href="/the-le" className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                        <span className="text-3xl font-bold">A</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Bảng A</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">Dành cho học sinh trường Chuyên hoặc đã có giải thưởng Tin học cấp Tỉnh trở lên.</p>
                    <span className="text-blue-600 font-bold text-sm group-hover:underline flex items-center gap-2">Xem điều kiện chi tiết <ArrowRight size={16} /></span>
                </Link>

                <Link href="/the-le" className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1">
                    <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition duration-300">
                        <span className="text-3xl font-bold">B</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Bảng B</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">Dành cho học sinh trường THPT không Chuyên, chưa đạt giải, đam mê công nghệ.</p>
                    <span className="text-teal-600 font-bold text-sm group-hover:underline flex items-center gap-2">Xem điều kiện chi tiết <ArrowRight size={16} /></span>
                </Link>
            </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Sẵn sàng chinh phục đỉnh cao công nghệ?</h2>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-xl">Đừng bỏ lỡ cơ hội khẳng định bản thân và giành lấy những suất học bổng giá trị từ UMT.</p>
            <Link href="/dang-ky" className="inline-block bg-white text-blue-900 px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-2xl transform hover:scale-105">
                Đăng ký tham gia ngay
            </Link>
        </div>
      </section>

    </div>
  );
}
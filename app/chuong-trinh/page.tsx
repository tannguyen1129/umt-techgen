import { Target, Cpu, BookOpen, GraduationCap, Video, Users, CheckCircle, Zap } from "lucide-react";

export default function ProgramPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-12 -translate-x-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800 border border-blue-700 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
            Tổng quan cuộc thi
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Chương trình & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Mục đích</span>
          </h1>
          <p className="text-blue-100 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Không chỉ là một kỳ thi, UMT TechGen là hành trình khai phá tiềm năng, nơi kiến thức Toán học và Tin học giao thoa để giải quyết các vấn đề thực tiễn.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        
        {/* 2. MỤC ĐÍCH (GOALS) */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Sân chơi chuyên nghiệp</h3>
            <p className="text-slate-600 leading-relaxed">
              Tạo môi trường thi đấu công bằng cho học sinh THPT toàn quốc, giúp các em cọ xát và làm quen với áp lực thi đấu chuẩn quốc tế.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition duration-300">
            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Khơi nguồn đam mê</h3>
            <p className="text-slate-600 leading-relaxed">
              Khơi dậy tư duy thuật toán và kỹ năng giải quyết vấn đề - những hành trang cốt lõi cho kỷ nguyên số.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition duration-300">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tìm kiếm tài năng</h3>
            <p className="text-slate-600 leading-relaxed">
              Phát hiện và bồi dưỡng các nhân tố xuất sắc, tạo nguồn tuyển sinh chất lượng cao cho ngành CNTT.
            </p>
          </div>
        </div>

        {/* 3. NỘI DUNG CHUYÊN MÔN */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="md:w-1/2 relative">
             {/* Decorative box representing code/system */}
             <div className="aspect-square bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="space-y-4 font-mono text-sm text-blue-200 opacity-80">
                   <p><span className="text-purple-400">const</span> <span className="text-yellow-300">exam</span> = &#123;</p>
                   <p className="pl-4">type: <span className="text-green-300">"Competitive Programming"</span>,</p>
                   <p className="pl-4">subjects: [<span className="text-green-300">"Math"</span>, <span className="text-green-300">"Informatics"</span>],</p>
                   <p className="pl-4">platform: <span className="text-green-300">"UMTOJ"</span>,</p>
                   <p className="pl-4">difficulty: <span className="text-red-400">"High"</span></p>
                   <p>&#125;;</p>
                </div>
                <div className="absolute bottom-6 right-6">
                   <div className="flex items-center gap-2 text-white font-bold text-xl">
                      <Cpu className="animate-spin-slow" /> UMT TechGen
                   </div>
                </div>
             </div>
          </div>
          
          <div className="md:w-1/2 space-y-6">
             <h2 className="text-3xl font-bold text-slate-900">Nội dung thi đấu</h2>
             <p className="text-lg text-slate-600">
                Đề thi được xây dựng bám sát chương trình THPT chuyên Tin, nhưng mở rộng với hướng tiếp cận hiện đại:
             </p>
             
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                   <div className="mt-1 bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                   <div>
                      <h4 className="font-bold text-slate-800">Kết hợp Toán & Tin</h4>
                      <p className="text-slate-500 text-sm">Vận dụng tư duy toán học để tối ưu hóa giải thuật lập trình.</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <div className="mt-1 bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                   <div>
                      <h4 className="font-bold text-slate-800">Kỹ năng giải quyết vấn đề</h4>
                      <p className="text-slate-500 text-sm">Đánh giá khả năng phân tích bài toán thực tế và chuyển hóa thành code.</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <div className="mt-1 bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                   <div>
                      <h4 className="font-bold text-slate-800">Hệ thống chấm tự động</h4>
                      <p className="text-slate-500 text-sm">Thi trực tuyến trên hệ thống UMT Online Judge (UMTOJ) chuẩn ACM/ICPC.</p>
                   </div>
                </li>
             </ul>
          </div>
        </div>

        {/* 4. ĐIỂM NHẤN: TRAINING & SUPPORT - ĐÃ FIX MÀU CHỮ ĐẬM HƠN */}
        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 mb-20 border border-blue-100">
           <div className="text-center mb-12">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Quyền lợi đặc biệt</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4">Chuỗi Hướng dẫn chuyên môn (Training)</h2>
              <p className="text-slate-800 font-medium max-w-3xl mx-auto mt-4 text-lg">
                 Không để thí sinh "bơi" một mình, BTC tổ chức các buổi training xen kẽ giữa các vòng thi để trang bị kiến thức nền tảng vững chắc.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                    <Video size={24} />
                 </div>
                 <h4 className="font-bold text-xl text-slate-900 mb-3">Học trực tuyến</h4>
                 <p className="text-slate-700 leading-relaxed">
                    Tổ chức qua Microsoft Teams, linh hoạt cho thí sinh cả nước tham gia.
                 </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                    <BookOpen size={24} />
                 </div>
                 <h4 className="font-bold text-xl text-slate-900 mb-3">Nội dung chuyên sâu</h4>
                 <p className="text-slate-700 leading-relaxed">
                    Ôn tập Toán - Tin trọng tâm, tư duy thuật toán và kỹ thuật lập trình nâng cao.
                 </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6">
                    <Users size={24} />
                 </div>
                 <h4 className="font-bold text-xl text-slate-900 mb-3">Mentor chất lượng</h4>
                 <p className="text-slate-700 leading-relaxed">
                    Được hướng dẫn trực tiếp bởi Giảng viên và sinh viên Khoa Công Nghệ đạt giải Olympic Tin học sinh viên.
                 </p>
              </div>
           </div>

           {/* Lịch trình dự kiến của training */}
           <div className="mt-12 border-t border-blue-200/60 pt-8">
              <h4 className="font-bold text-slate-900 mb-6 text-center text-lg">Lộ trình Training dự kiến</h4>
              
              <div className="flex flex-wrap justify-center gap-4">
                  {/* Đợt 1 */}
                  <div className="bg-white px-5 py-3 rounded-xl border border-blue-100 text-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 transition flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">Đợt 1</div>
                    <span className="text-sm font-medium">Trước Vòng Chính thức 1 <span className="text-slate-400 mx-1">|</span> Tháng 01/2026</span>
                  </div>

                  {/* Đợt 2 */}
                  <div className="bg-white px-5 py-3 rounded-xl border border-blue-100 text-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 transition flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">Đợt 2</div>
                    <span className="text-sm font-medium">Trước Vòng Chính thức 2 <span className="text-slate-400 mx-1">|</span> Tháng 03/2026</span>
                  </div>

                  {/* Đợt 3 */}
                  <div className="bg-white px-5 py-3 rounded-xl border border-blue-100 text-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 transition flex items-center gap-2">
                    <div className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase">Đợt 3</div>
                    <span className="text-sm font-medium">Trước Vòng Chung kết <span className="text-slate-400 mx-1">|</span> Tháng 04/2026</span>
                  </div>
              </div>
           </div>
        </div>

        {/* 5. QUYỀN LỢI HỌC BỔNG */}
        <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Cơ cấu Học bổng hấp dẫn</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 transition cursor-default">
                    <div className="text-4xl font-extrabold text-blue-600 mb-2">100%</div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Học bổng Global</h3>
                    <p className="text-slate-500 text-xs mt-2">Dành cho giải Đặc biệt</p>
                </div>
                <div className="p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 transition cursor-default">
                    <div className="text-4xl font-extrabold text-blue-500 mb-2">60%</div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Học bổng Unique</h3>
                    <p className="text-slate-500 text-xs mt-2">Dành cho giải Nhất</p>
                </div>
                <div className="p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 transition cursor-default">
                    <div className="text-4xl font-extrabold text-blue-400 mb-2">50%</div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Học bổng Liberal</h3>
                    <p className="text-slate-500 text-xs mt-2">Dành cho giải Nhì</p>
                </div>
            </div>
            <p className="mt-8 text-slate-500 text-sm italic">
                * Học bổng được áp dụng cho toàn khóa học và có giá trị bảo lưu tối đa 02 năm.
            </p>
        </div>

      </div>
    </div>
  );
}
import { Calendar, MapPin, Video, Monitor, Star, Award } from "lucide-react";

export default function TimelinePage() {
  // Dữ liệu đã được lọc bỏ các phần nội bộ BTC & Tách lẻ vòng sơ loại
  const events = [
    {
      id: 1,
      phase: "Giai đoạn 1: Vòng Sơ loại",
      items: [
        {
          date: "01/12 - 06/12/2025",
          title: "Vòng Sơ loại 1",
          type: "Online",
          location: "Hệ thống thi trắc nghiệm/Hệ thống UMTOJ",
          desc: "Thí sinh làm bài thi trắc nghiệm và lập trình cơ bản trực tuyến.",
          highlight: false,
        },
        {
          date: "15/12 - 21/12/2025",
          title: "Vòng Sơ loại 2",
          type: "Online",
          location: "Hệ thống thi trắc nghiệm/Hệ thống UMTOJ",
          desc: "Cơ hội thứ 2 để các thí sinh tích lũy điểm số.",
          highlight: false,
        },
        {
          date: "25/12 - 30/12/2025",
          title: "Vòng Sơ loại 3",
          type: "Online",
          location: "Hệ thống thi trắc nghiệm/Hệ thống UMTOJ",
          desc: "Đợt sơ loại cuối cùng chốt danh sách vào vòng trong.",
          highlight: false,
        },
      ],
    },
    {
      id: 2,
      phase: "Giai đoạn 2: Training & Thi chính thức",
      items: [
        {
          date: "01/01 - 25/01/2026",
          title: "Training Đợt 1",
          type: "Training",
          location: "Microsoft Teams",
          desc: "Ôn tập kiến thức Toán - Tin trọng tâm cùng chuyên gia.",
          highlight: false,
        },
        {
          date: "26/01 - 01/02/2026",
          title: "Vòng thi Chính thức 1",
          type: "Online",
          location: "Hệ thống UMTOJ",
          desc: "Thử thách lập trình nâng cao. Sàng lọc thí sinh.",
          highlight: true,
        },
        {
          date: "02/02 - 01/03/2026",
          title: "Training Đợt 2",
          type: "Training",
          location: "Microsoft Teams",
          desc: "Nâng cao tư duy thuật toán và kỹ năng giải quyết vấn đề.",
          highlight: false,
        },
        {
          date: "02/03 - 08/03/2026",
          title: "Vòng thi Chính thức 2",
          type: "Online",
          location: "Hệ thống UMTOJ",
          desc: "Vòng thi quyết định chọn ra Top thí sinh vào Chung kết.",
          highlight: true,
        },
      ],
    },
    {
      id: 3,
      phase: "Giai đoạn 3: Về đích",
      items: [
        {
          date: "09/03 - 05/04/2026",
          title: "Training Đợt 3",
          type: "Training",
          location: "Microsoft Teams",
          desc: "Chuẩn bị kỹ năng chuyên sâu cho Vòng Chung kết.",
          highlight: false,
        },
        {
          date: "06/04 - 12/04/2026",
          title: "Vòng Chung kết UMT TechGen",
          type: "Final",
          location: "Trực tuyến/Tập trung",
          desc: "Tranh tài đỉnh cao giữa các tài năng xuất sắc nhất.",
          highlight: true,
          icon: <Star className="text-yellow-500 fill-yellow-500" size={24} />,
        },
        {
          date: "20/04/2026",
          title: "Lễ Tổng kết & Trao giải",
          type: "Event",
          location: "Hội trường Lầu 9, Tòa nhà Sáng tạo, Trường UMT",
          desc: "Vinh danh quán quân và trao học bổng.",
          highlight: true,
          icon: <Award className="text-orange-500" size={24} />,
        },
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header - Responsive Padding */}
      <div className="bg-blue-900 text-white pt-12 pb-16 md:pt-16 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Lộ trình cuộc thi</h1>
          <p className="text-blue-200 max-w-3xl mx-auto text-base md:text-lg">
            Hành trình chinh phục công nghệ với các mốc thời gian quan trọng dành cho thí sinh.
          </p>
        </div>
      </div>

      {/* Timeline Content - Responsive Margin */}
      <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-20 max-w-5xl">
        {events.map((phase) => (
          <div key={phase.id} className="mb-12 md:mb-16">
            {/* Phase Header - Responsive Text */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 sticky top-20 md:top-24 z-30">
              <span className="bg-blue-100 text-blue-800 text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1 rounded-full uppercase shrink-0">
                Giai đoạn {phase.id}
              </span>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{phase.phase}</h2>
            </div>

            {/* Phase Items Container - Responsive Padding */}
            <div className="relative pl-0 md:pl-8">
              
              {/* Cột mốc thời gian */}
              <div className="space-y-6 md:space-y-8">
                  {phase.items.map((item, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row gap-4 md:gap-6 group items-start"> 
                      
                      {/* 1. CỘT NGÀY THÁNG (Responsive: Flex order thay đổi hoặc style riêng) */}
                      {/* Mobile: Full width width margin bottom. Desktop: Width cố định, text right */}
                      <div className="w-full md:w-48 md:text-right shrink-0 md:mt-1"> 
                        <div className="inline-flex items-center gap-2 text-blue-700 font-bold bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg shadow-sm whitespace-nowrap w-full md:w-auto justify-center md:justify-end">
                            <Calendar size={16} className="shrink-0" />
                            <span className="text-sm">{item.date}</span>
                        </div>
                      </div>

                      {/* 2. TRỤC GIỮA (Hidden on Mobile) */}
                      <div className="hidden md:flex flex-col items-center relative self-stretch mx-2">
                        {/* Dot */}
                        <div className={`w-4 h-4 rounded-full border-2 z-10 mt-3 bg-white transition-all duration-300 group-hover:scale-125
                            ${item.highlight ? 'border-orange-500 ring-4 ring-orange-100' : 'border-blue-500 ring-4 ring-blue-50'}
                        `}></div>
                        
                        {/* Line nối */}
                        {index !== phase.items.length - 1 && (
                            <div className="w-0.5 bg-slate-200 absolute top-8 bottom-[-2rem] left-1/2 -translate-x-1/2"></div>
                        )}
                      </div>

                      {/* 3. NỘI DUNG */}
                      <div className={`flex-1 bg-white p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg relative w-full
                          ${item.highlight ? 'border-orange-200 shadow-orange-50' : 'border-slate-200 shadow-sm'}
                      `}>
                        {/* Mũi tên chỉ vào timeline (Desktop only) */}
                        <div className={`hidden md:block absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b transform rotate-45
                            ${item.highlight ? 'border-orange-200' : 'border-slate-200'}
                        `}></div>

                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                          <div className="flex items-center gap-3">
                            {item.icon ? item.icon : (
                                <div className={`w-2 h-2 rounded-full shrink-0 ${item.highlight ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                            )}
                            <h3 className={`text-lg md:text-xl font-bold leading-tight ${item.highlight ? 'text-slate-900' : 'text-slate-800'}`}>
                                {item.title}
                            </h3>
                          </div>
                          
                          {/* Type Badge - Responsive size */}
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border tracking-wide shrink-0 self-start sm:self-auto ${
                            item.type === 'Online' ? 'bg-green-50 text-green-700 border-green-100' :
                            item.type === 'Training' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                          }`}>
                            {item.type}
                          </span>
                        </div>

                        <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">{item.desc}</p>

                        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 bg-slate-50 p-2 rounded-lg w-fit border border-slate-100 max-w-full">
                            {item.location.includes("Teams") ? <Video size={14} className="shrink-0" /> : 
                             item.location.includes("UMTOJ") ? <Monitor size={14} className="shrink-0" /> : 
                             <MapPin size={14} className="shrink-0" />}
                            <span className="font-medium truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
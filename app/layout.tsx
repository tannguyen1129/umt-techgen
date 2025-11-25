import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { Inter } from "next/font/google";
import { Lock, Code, Facebook, Globe, Mail, Phone, MapPin } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UMT TechGen 2025",
  description: "Giải mã công nghệ - Khơi nguồn đam mê",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
          <div className="container mx-auto px-4 h-24 flex justify-between items-center">
            
            {/* LOGO GROUP */}
            <Link href="/" className="flex items-center gap-6">
              <div className="relative h-14 w-40 md:h-16 md:w-48">
                <Image src="/images/logo-umt.png" alt="UMT" fill className="object-contain" />
              </div>
              <div className="h-10 w-[1px] bg-slate-300 hidden sm:block"></div>
              <div className="relative h-14 w-44 md:h-16 md:w-52 hidden sm:block">
                <Image src="/images/logo-kcn.png" alt="KCN" fill className="object-contain" />
              </div>
            </Link>

            {/* MENU LINKS */}
            <div className="hidden xl:flex gap-8 text-base font-semibold text-slate-700">
              <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
              <Link href="/chuong-trinh" className="hover:text-blue-600 transition">Chương trình</Link>
              <Link href="/lich-trinh" className="hover:text-blue-600 transition">Mốc thời gian</Link>
              <Link href="/the-le" className="hover:text-blue-600 transition">Thể lệ</Link>
              <Link href="/doi-tac" className="hover:text-blue-600 transition">Đối tác</Link>
              <Link href="/lien-he" className="hover:text-blue-600 transition">Liên hệ</Link>
            </div>

            <Link href="/dang-ky" className="bg-blue-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 text-sm md:text-base whitespace-nowrap">
              Đăng ký ngay
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="pt-24 min-h-screen">
            {children}
        </main>

        {/* FOOTER - THIẾT KẾ MỚI */}
        <footer className="bg-[#0B1120] text-slate-400 py-16 border-t border-slate-800">
          <div className="container mx-auto px-4">
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm mb-16">
                {/* Cột 1: Đơn vị tổ chức */}
                <div className="flex flex-col items-start">
                    <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b-2 border-blue-600 pb-1 inline-block">Đơn vị tổ chức</h5>
                    <div className="relative h-16 w-48 mb-4">
                        <Image src="/images/logo-umt-white.png" alt="UMT" fill className="object-contain object-left" />
                    </div>
                    <p className="leading-relaxed text-slate-400">
                        Trường Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh (UMT)
                    </p>
                </div>

                {/* Cột 2: Đơn vị chuyên môn */}
                <div className="flex flex-col items-start">
                    <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b-2 border-blue-600 pb-1 inline-block">Đơn vị chuyên môn</h5>
                    <div className="relative h-16 w-56 mb-4">
                         {/* Logo trắng không nền */}
                        <Image src="/images/logo-kcn-white-1.png" alt="Khoa Công Nghệ" fill className="object-contain object-left" />
                    </div>
                    <p className="leading-relaxed text-slate-400">
                        Khoa Công nghệ (School of Technology)
                    </p>
                </div>

                {/* Cột 3: Đơn vị vận hành */}
                <div className="flex flex-col items-start">
                    <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b-2 border-blue-600 pb-1 inline-block">Đơn vị vận hành</h5>
                    <div className="relative h-16 w-48 mb-4">
                        {/* Logo APC ngang không nền */}
                        <Image src="/images/logo-apc-ngang.png" alt="APC" fill className="object-contain object-left" />
                    </div>
                    <p className="leading-relaxed text-slate-400">
                        Câu lạc bộ Lập trình ứng dụng (Applied Programming Club)
                    </p>
                </div>

                {/* Cột 4: Liên hệ chi tiết */}
                <div>
                    <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b-2 border-blue-600 pb-1 inline-block">Liên hệ</h5>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <MapPin size={16} className="text-blue-500 shrink-0 mt-1" />
                            <span>P.508, Tòa nhà Sáng tạo, Trường Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh, Số 2 Khu phố 9, Đường 60CL, Phường Cát Lái, Thành phố Hồ Chí Minh</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone size={16} className="text-green-500 shrink-0 mt-1" />
                            <div>
                                <p>Mr. Trung: <a href="tel:0767138667" className="hover:text-white transition">0767 138 667</a></p>
                                <p>Mr. Tân: <a href="tel:0818126177" className="hover:text-white transition">0818 126 177</a></p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <Mail size={16} className="text-orange-500 shrink-0 mt-1" />
                            <div>
                                <a href="mailto:techgen@umt.edu.vn" className="block hover:text-white transition">techgen@umt.edu.vn</a>
                                <a href="mailto:trung.huynhlephu@umt.edu.vn" className="block hover:text-white transition">trung.huynhlephu@umt.edu.vn</a>
                            </div>
                        </li>
                    </ul>

                    {/* Kênh thông tin chính thức (Icons) */}
                    <div className="mt-6 pt-6 border-t border-slate-800 flex gap-4">
                        <a href="https://www.facebook.com/UMTUniversity" target="_blank" title="Facebook UMT" className="text-slate-500 hover:text-blue-500 transition"><Facebook size={18} /></a>
                        <a href="https://www.umt.edu.vn/vi-vn/" target="_blank" title="Website UMT" className="text-slate-500 hover:text-blue-400 transition"><Globe size={18} /></a>
                        <a href="https://www.facebook.com/sotumthcmc" target="_blank" title="Facebook Khoa CN" className="text-slate-500 hover:text-blue-600 transition"><Facebook size={18} /></a>
                        <a href="https://www.facebook.com/apc.umt" target="_blank" title="Facebook APC" className="text-slate-500 hover:text-orange-500 transition"><Facebook size={18} /></a>
                        <a href="https://sot.umtoj.edu.vn" target="_blank" title="UMTOJ" className="text-slate-500 hover:text-green-500 transition font-bold text-xs border border-slate-600 px-1 rounded">OJ</a>
                    </div>
                </div>
            </div>

            {/* DÒNG BẢN QUYỀN & CREDITS */}
            <div className="text-center pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col items-center gap-4">
                <p>© 2025 UMT TechGen. Bản quyền thuộc về Trường Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh.</p>
                
                {/* Credit line - Highlight nhẹ */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 hover:border-blue-900/50 transition group cursor-default">
                    <Code size={14} className="text-blue-500 group-hover:text-blue-400" />
                    <span>Website cuộc thi do đội ngũ <span className="text-slate-300 font-medium">Câu lạc bộ Lập trình ứng dụng (APC)</span> xây dựng và vận hành</span>
                </div>

                <Link href="/admin" className="flex items-center gap-1 text-slate-700 hover:text-slate-500 transition-all opacity-10 hover:opacity-100 mt-4">
                    <Lock size={10} />
                    <span>Admin Portal</span>
                </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
import React from "react";
import Link from "next/link";
import { SearchCheck, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors pb-safe">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group py-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <SearchCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                Lost & Found <span className="text-emerald-600 dark:text-emerald-400">MJU</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed [text-wrap:balance]">
              แพลตฟอร์มศูนย์กลางรับแจ้งของหายและของที่เก็บได้สำหรับนักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              เมนูลัด
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/items?type=LOST" className="inline-block py-1 hover:text-blue-600 transition">
                  รายการของหาย
                </Link>
              </li>
              <li>
                <Link href="/items?type=FOUND" className="inline-block py-1 hover:text-blue-600 transition">
                  รายการของที่เก็บได้
                </Link>
              </li>
              <li>
                <Link href="/items/new" className="inline-block py-1 hover:text-blue-600 transition">
                  + แจ้งประกาศใหม่
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic note */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              วัตถุประสงค์
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed [text-wrap:balance]">
              จัดทำขึ้นเพื่อการศึกษาและการเรียนรู้การพัฒนาเว็บแอปพลิเคชันสมัยใหม่ด้วย Next.js, Prisma, Tailwind CSS และ Auth.js
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 sm:pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <p>© {currentYear} Lost & Found MJU (มหาวิทยาลัยแม่โจ้). สงวนลิขสิทธิ์ทุกประการ</p>
          <p className="flex items-center justify-center gap-1">
            <span>พัฒนาด้วย</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>เพื่อสังคมชาวแม่โจ้</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

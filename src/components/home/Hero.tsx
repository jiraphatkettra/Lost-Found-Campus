"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/items?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push("/items");
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-slate-900/60 dark:via-slate-950 dark:to-transparent">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold ring-1 ring-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>พื้นที่ช่วยเหลือของนักศึกษาและบุคลากรมหาวิทยาลัย</span>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            ของหายในมหาลัย? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ให้เพื่อน ๆ ช่วยตามหา
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            ระบบจับคู่สิ่งของอัจฉริยะ ค้นหาง่าย แจ้งเตือนทันทีเมื่อพบของที่ตรงกัน
          </p>
        </div>

        {/* Big Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-xl mx-auto flex items-center p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        >
          <div className="pl-3 sm:pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาของที่หาย เช่น หูฟัง, บัตรนักศึกษา, กระเป๋า..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer shrink-0"
          >
            ค้นหา
          </button>
        </form>

        {/* Dual CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link
            href="/items/new?type=LOST"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            <span>แจ้งของหาย</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/items/new?type=FOUND"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <span>แจ้งเจอของ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

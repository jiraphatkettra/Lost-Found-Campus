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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-60 sm:w-72 h-60 sm:h-72 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container with Floating Orbs */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
        {/* Floating Colorful Balls (Orbs) - Scattered dynamically with organic depth & larger on desktop */}
        {/* Ball 1: Rose / Coral (Top-Left high & wide) */}
        <div className="absolute -top-6 sm:-top-8 lg:-top-12 left-1 sm:-left-4 lg:-left-24 xl:-left-32 pointer-events-none select-none z-0">
          <div className="relative w-9 h-9 sm:w-16 sm:h-16 lg:w-28 lg:h-28 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-300 shadow-md sm:shadow-xl shadow-rose-500/25 dark:from-rose-500/40 dark:via-pink-500/30 dark:to-rose-400/20 dark:shadow-[0_0_40px_rgba(244,63,94,0.4)] dark:border dark:border-rose-400/35 backdrop-blur-xs animate-float-slow">
            <div className="absolute top-2 left-2.5 w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-7 lg:h-7 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Ball 2: Sky / Blue (Upper-Right near headline - Prominent Giant Orb) */}
        <div className="absolute top-4 sm:top-6 lg:top-8 -right-1 sm:-right-4 lg:-right-20 xl:-right-28 pointer-events-none select-none z-0">
          <div className="relative w-10 h-10 sm:w-18 sm:h-18 lg:w-32 lg:h-32 rounded-full bg-gradient-to-tr from-blue-400 via-sky-400 to-indigo-300 shadow-md sm:shadow-xl shadow-blue-500/25 dark:from-blue-500/40 dark:via-sky-500/30 dark:to-indigo-400/20 dark:shadow-[0_0_45px_rgba(59,130,246,0.4)] dark:border dark:border-blue-400/35 backdrop-blur-xs animate-float-reverse">
            <div className="absolute top-2.5 left-3 w-3 h-3 sm:w-5 sm:h-5 lg:w-8 lg:h-8 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Ball 3: Amber / Gold (Mid-Upper Left - Tucked closer inward to subtitle) */}
        <div className="absolute top-[26%] sm:top-[28%] lg:top-[24%] left-3 sm:left-8 lg:left-0 xl:left-4 pointer-events-none select-none z-0 hidden min-[400px]:block">
          <div className="relative w-7 h-7 sm:w-10 sm:h-10 lg:w-16 lg:h-16 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-orange-400 shadow-md sm:shadow-lg shadow-amber-500/25 dark:from-amber-400/40 dark:via-yellow-500/30 dark:to-orange-400/20 dark:shadow-[0_0_28px_rgba(245,158,11,0.4)] dark:border dark:border-amber-400/35 backdrop-blur-xs animate-float-pulse">
            <div className="absolute top-1.5 left-2 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Ball 4: Emerald / Mint (Mid-Right - Pushed wide past search bar) */}
        <div className="absolute top-[48%] sm:top-[50%] lg:top-[46%] -right-2 sm:-right-6 lg:-right-28 xl:-right-36 pointer-events-none select-none z-0 hidden min-[400px]:block">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 lg:w-20 lg:h-20 rounded-full bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-400 shadow-md sm:shadow-lg shadow-emerald-500/25 dark:from-emerald-400/40 dark:via-teal-500/30 dark:to-cyan-400/20 dark:shadow-[0_0_35px_rgba(16,185,129,0.4)] dark:border dark:border-emerald-400/35 backdrop-blur-xs animate-float-slow">
            <div className="absolute top-2 left-2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Ball 5: Violet / Purple (Mid-Lower Left - Pushed wide to the left) */}
        <div className="absolute top-[62%] sm:top-[60%] lg:top-[56%] -left-1 sm:-left-6 lg:-left-20 xl:-left-28 pointer-events-none select-none z-0">
          <div className="relative w-6 h-6 sm:w-10 sm:h-10 lg:w-16 lg:h-16 rounded-full bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 shadow-md sm:shadow-lg shadow-purple-500/25 dark:from-purple-500/40 dark:via-violet-500/30 dark:to-indigo-400/20 dark:shadow-[0_0_30px_rgba(168,85,247,0.4)] dark:border dark:border-purple-400/35 backdrop-blur-xs animate-float-reverse">
            <div className="absolute top-1.5 left-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-4 lg:h-4 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Ball 6: Fuchsia / Pink (Bottom-Right - Tucked closer to CTA buttons) */}
        <div className="absolute -bottom-3 sm:-bottom-1 lg:-bottom-4 right-3 sm:right-8 lg:right-4 xl:right-10 pointer-events-none select-none z-0">
          <div className="relative w-7 h-7 sm:w-12 sm:h-12 lg:w-24 lg:h-24 rounded-full bg-gradient-to-tr from-fuchsia-400 via-pink-400 to-rose-400 shadow-md sm:shadow-xl shadow-fuchsia-500/25 dark:from-fuchsia-500/40 dark:via-pink-500/30 dark:to-rose-400/20 dark:shadow-[0_0_38px_rgba(217,70,239,0.4)] dark:border dark:border-fuchsia-400/35 backdrop-blur-xs animate-float-pulse">
            <div className="absolute top-2 left-2 w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Ball 7: Cyan / Sky (Bottom-Left - Delicate accent orb underneath CTA) */}
        <div className="absolute -bottom-5 sm:-bottom-3 lg:-bottom-6 left-8 sm:left-16 lg:left-16 xl:left-24 pointer-events-none select-none z-0 hidden sm:block">
          <div className="relative w-5 h-5 sm:w-7 sm:h-7 lg:w-11 lg:h-11 rounded-full bg-gradient-to-tr from-cyan-300 via-sky-400 to-blue-400 shadow-md shadow-cyan-500/25 dark:from-cyan-400/40 dark:via-sky-500/30 dark:to-blue-400/20 dark:shadow-[0_0_22px_rgba(6,182,212,0.4)] dark:border dark:border-cyan-400/35 backdrop-blur-xs animate-float-slow">
            <div className="absolute top-1 left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-white/75 dark:bg-white/45 blur-[1px]" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-semibold ring-1 ring-blue-500/20 max-w-[260px] min-[360px]:max-w-none">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">ศูนย์ช่วยเหลือของนักศึกษาและบุคลากรมหาวิทยาลัย</span>
        </div>

        {/* Heading */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl min-[360px]:text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            ของหายในมหาลัย? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ให้เพื่อน ๆ ช่วยตามหา
            </span>
          </h1>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed px-2">
            ระบบจับคู่สิ่งของอัจฉริยะ ค้นหาง่าย แจ้งเตือนทันทีเมื่อพบของที่ตรงกัน
          </p>
        </div>

        {/* Big Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl mx-auto flex items-center p-1 sm:p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        >
          <div className="pl-2.5 sm:pl-4 text-slate-400 shrink-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาของที่หาย เช่น หูฟัง, บัตร..."
            className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer shrink-0"
          >
            ค้นหา
          </button>
        </form>

        {/* Dual CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-2 w-full max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/items/new?type=LOST"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            <span>แจ้งของหาย</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/items/new?type=FOUND"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <span>แจ้งเจอของ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

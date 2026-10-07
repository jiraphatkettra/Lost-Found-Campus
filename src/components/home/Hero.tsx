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
        {/* Floating Colorful Balls (Orbs) - Positioned close around text and content */}
        {/* Ball 1: Rose / Coral (Top-Left near Badge & Title) */}
        <div className="absolute -top-2 sm:top-0 md:top-2 -left-1 sm:left-2 md:-left-8 lg:-left-14 pointer-events-none select-none z-0">
          <div className="relative w-8 h-8 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-300 shadow-md sm:shadow-lg shadow-rose-500/25 dark:from-rose-500/40 dark:via-pink-500/30 dark:to-rose-400/20 dark:shadow-[0_0_25px_rgba(244,63,94,0.35)] dark:border dark:border-rose-400/30 backdrop-blur-xs animate-float-slow">
            <div className="absolute top-1.5 left-2 w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full bg-white/70 dark:bg-white/40 blur-[1px]" />
          </div>
        </div>

        {/* Ball 2: Sky / Blue (Top-Right near Title) */}
        <div className="absolute top-0 sm:top-2 md:top-3 -right-1 sm:right-2 md:-right-8 lg:-right-14 pointer-events-none select-none z-0">
          <div className="relative w-9 h-9 sm:w-14 md:w-16 sm:h-14 md:h-16 rounded-full bg-gradient-to-tr from-blue-400 via-sky-400 to-indigo-300 shadow-md sm:shadow-lg shadow-blue-500/25 dark:from-blue-500/40 dark:via-sky-500/30 dark:to-indigo-400/20 dark:shadow-[0_0_30px_rgba(59,130,246,0.35)] dark:border dark:border-blue-400/30 backdrop-blur-xs animate-float-reverse">
            <div className="absolute top-1.5 left-2 w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full bg-white/70 dark:bg-white/40 blur-[1px]" />
          </div>
        </div>

        {/* Ball 3: Amber / Gold (Middle-Left near Subtitle / Search) */}
        <div className="absolute top-[36%] sm:top-[38%] left-0 sm:left-2 md:-left-10 lg:-left-16 pointer-events-none select-none z-0 hidden min-[400px]:block">
          <div className="relative w-6 h-6 sm:w-9 md:w-11 sm:h-9 md:h-11 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-orange-400 shadow-md shadow-amber-500/25 dark:from-amber-400/40 dark:via-yellow-500/30 dark:to-orange-400/20 dark:shadow-[0_0_20px_rgba(245,158,11,0.35)] dark:border dark:border-amber-400/30 backdrop-blur-xs animate-float-pulse">
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white/70 dark:bg-white/40 blur-[1px]" />
          </div>
        </div>

        {/* Ball 4: Emerald / Mint (Middle-Right near Search) */}
        <div className="absolute top-[44%] sm:top-[46%] right-0 sm:right-2 md:-right-10 lg:-right-16 pointer-events-none select-none z-0 hidden min-[400px]:block">
          <div className="relative w-7 h-7 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-400 shadow-md shadow-emerald-500/25 dark:from-emerald-400/40 dark:via-teal-500/30 dark:to-cyan-400/20 dark:shadow-[0_0_25px_rgba(16,185,129,0.35)] dark:border dark:border-emerald-400/30 backdrop-blur-xs animate-float-slow">
            <div className="absolute top-1.5 left-1.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/70 dark:bg-white/40 blur-[1px]" />
          </div>
        </div>

        {/* Ball 5: Violet / Purple (Bottom-Left near CTA) */}
        <div className="absolute -bottom-2 sm:bottom-1 md:bottom-2 left-1 sm:left-4 md:-left-6 lg:-left-12 pointer-events-none select-none z-0">
          <div className="relative w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 rounded-full bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 shadow-md shadow-purple-500/25 dark:from-purple-500/40 dark:via-violet-500/30 dark:to-indigo-400/20 dark:shadow-[0_0_20px_rgba(168,85,247,0.35)] dark:border dark:border-purple-400/30 backdrop-blur-xs animate-float-reverse">
            <div className="absolute top-1 left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/70 dark:bg-white/40 blur-[1px]" />
          </div>
        </div>

        {/* Ball 6: Fuchsia / Pink (Bottom-Right near CTA) */}
        <div className="absolute -bottom-1 sm:bottom-2 md:bottom-3 right-1 sm:right-4 md:-right-6 lg:-right-12 pointer-events-none select-none z-0">
          <div className="relative w-7 h-7 sm:w-9 md:w-11 sm:h-9 md:h-11 rounded-full bg-gradient-to-tr from-fuchsia-400 via-pink-400 to-rose-400 shadow-md shadow-fuchsia-500/25 dark:from-fuchsia-500/40 dark:via-pink-500/30 dark:to-rose-400/20 dark:shadow-[0_0_22px_rgba(217,70,239,0.35)] dark:border dark:border-fuchsia-400/30 backdrop-blur-xs animate-float-pulse">
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white/70 dark:bg-white/40 blur-[1px]" />
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

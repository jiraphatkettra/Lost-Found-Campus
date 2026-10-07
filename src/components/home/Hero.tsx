"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ArrowRight,
  Headphones,
  Smartphone,
  KeyRound,
  CreditCard,
  Backpack,
  Glasses,
} from "lucide-react";

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
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-blue-50/40 via-white to-transparent dark:from-slate-900/50 dark:via-slate-950 dark:to-transparent">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-56 sm:w-72 h-56 sm:h-72 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-3.5 sm:px-6 text-center">
        {/*
          Floating Material Icons:
          - Mobile (<640px): Curated, minimal, sits close to the text column, safely within screen edges (no clipping, no overlapping text).
          - Tablet (640px-1023px): Balanced proximity to the text column.
          - Desktop (>=1024px): Prominent playful floating cards with vibrant glassmorphic gradients.
        */}

        {/* Item 1: Headphones (หูฟัง) - Rose / Pink (Top-Left of headline) */}
        <div className="absolute top-0 sm:top-2 lg:-top-6 left-2 sm:left-4 md:left-8 lg:-left-16 pointer-events-none select-none z-0">
          <div className="relative -rotate-12 w-7 h-7 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-300 shadow-sm sm:shadow-lg shadow-rose-500/20 dark:from-rose-500/35 dark:via-pink-500/25 dark:to-rose-400/20 dark:shadow-[0_0_30px_rgba(244,63,94,0.35)] dark:border dark:border-rose-400/30 backdrop-blur-xs flex items-center justify-center animate-float-slow">
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <Headphones className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-12 lg:h-12 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 2: Smartphone (มือถือ) - Sky / Blue (Top-Right of headline) */}
        <div className="absolute top-1 sm:top-3 lg:-top-3 right-2 sm:right-4 md:right-8 lg:-right-14 pointer-events-none select-none z-0">
          <div className="relative rotate-6 w-7 h-7 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-blue-400 via-sky-400 to-indigo-300 shadow-sm sm:shadow-lg shadow-blue-500/20 dark:from-blue-500/35 dark:via-sky-500/25 dark:to-indigo-400/20 dark:shadow-[0_0_35px_rgba(59,130,246,0.35)] dark:border dark:border-blue-400/30 backdrop-blur-xs flex items-center justify-center animate-float-reverse">
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <Smartphone className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-12 lg:h-12 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 3: Student Card / Wallet (บัตร/กระเป๋าตัง) - Violet / Purple (Mid-Left flanking search) */}
        <div className="absolute top-[48%] sm:top-[46%] lg:top-[42%] left-1.5 sm:left-3 md:left-6 lg:-left-12 pointer-events-none select-none z-0">
          <div className="relative -rotate-6 w-6 h-6 sm:w-9 sm:h-9 md:w-12 md:h-12 lg:w-18 lg:h-18 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 shadow-sm sm:shadow-md shadow-purple-500/20 dark:from-purple-500/35 dark:via-violet-500/25 dark:to-indigo-400/20 dark:shadow-[0_0_25px_rgba(168,85,247,0.35)] dark:border dark:border-purple-400/30 backdrop-blur-xs flex items-center justify-center animate-float-pulse">
            <div className="absolute top-0.5 left-1 w-1 h-1 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <CreditCard className="w-3 h-3 sm:w-4.5 sm:h-4.5 md:w-6 md:h-6 lg:w-9 lg:h-9 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 4: Glasses / Key (แว่นตา / กุญแจ) - Emerald / Mint (Mid-Right flanking search) */}
        <div className="absolute top-[50%] sm:top-[48%] lg:top-[44%] right-1.5 sm:right-3 md:right-6 lg:-right-12 pointer-events-none select-none z-0">
          <div className="relative rotate-12 w-6 h-6 sm:w-9 sm:h-9 md:w-12 md:h-12 lg:w-18 lg:h-18 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-400 shadow-sm sm:shadow-md shadow-emerald-500/20 dark:from-emerald-400/35 dark:via-teal-500/25 dark:to-cyan-400/20 dark:shadow-[0_0_25px_rgba(16,185,129,0.35)] dark:border dark:border-emerald-400/30 backdrop-blur-xs flex items-center justify-center animate-float-slow">
            <div className="absolute top-0.5 left-1 w-1 h-1 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <Glasses className="w-3 h-3 sm:w-4.5 sm:h-4.5 md:w-6 md:h-6 lg:w-9 lg:h-9 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 5: Key (กุญแจห้อง) - Amber (Near CTA buttons, subtle) */}
        <div className="absolute bottom-1 sm:bottom-2 lg:-bottom-2 left-3 sm:left-8 md:left-14 lg:left-0 pointer-events-none select-none z-0 hidden min-[360px]:block">
          <div className="relative -rotate-12 w-6 h-6 sm:w-8 sm:h-8 md:w-11 md:h-11 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-orange-400 shadow-xs sm:shadow-sm shadow-amber-500/20 dark:from-amber-400/35 dark:via-yellow-500/25 dark:to-orange-400/20 dark:shadow-[0_0_20px_rgba(245,158,11,0.35)] dark:border dark:border-amber-400/30 backdrop-blur-xs flex items-center justify-center animate-float-pulse">
            <KeyRound className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-7 lg:h-7 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 6: Backpack (กระเป๋าเป้) - Fuchsia / Pink (Bottom-Right flanking CTA) */}
        <div className="absolute bottom-1 sm:bottom-2 lg:-bottom-2 right-3 sm:right-8 md:right-14 lg:right-0 pointer-events-none select-none z-0">
          <div className="relative rotate-6 w-6.5 h-6.5 sm:w-9 sm:h-9 md:w-12 md:h-12 lg:w-18 lg:h-18 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-tr from-fuchsia-400 via-pink-400 to-rose-400 shadow-xs sm:shadow-md shadow-fuchsia-500/20 dark:from-fuchsia-500/35 dark:via-pink-500/25 dark:to-rose-400/20 dark:shadow-[0_0_25px_rgba(217,70,239,0.35)] dark:border dark:border-fuchsia-400/30 backdrop-blur-xs flex items-center justify-center animate-float-reverse">
            <Backpack className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-6 md:h-6 lg:w-9 lg:h-9 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Content Flow */}
        <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
          {/* Minimalist Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-2xs sm:text-xs font-semibold shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">ศูนย์ช่วยเหลือของหายประจำมหาวิทยาลัย</span>
          </div>

          {/* Headline */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              ของหายในมหาลัย? <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                ให้เพื่อน ๆ ช่วยตามหา
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed px-2">
              ค้นหาของที่หาย หรือแจ้งของที่เก็บได้ แจ้งเตือนทันทีเมื่อพบของที่ตรงกัน
            </p>
          </div>

          {/* Minimal Search Bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md sm:max-w-lg mx-auto flex items-center p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-slate-900 shadow-md ring-1 ring-slate-200/80 dark:ring-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
          >
            <div className="pl-3 sm:pl-4 text-slate-400 shrink-0">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ค้นหาของที่หาย เช่น หูฟัง, บัตร..."
              className="flex-1 min-w-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              ค้นหา
            </button>
          </form>

          {/* Dual CTA buttons */}
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3.5 pt-1 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/items/new?type=LOST"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              <span>แจ้งของหาย</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/items/new?type=FOUND"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
              <span>แจ้งเจอของ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

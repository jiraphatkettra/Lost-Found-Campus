"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHeroParallax } from "@/lib/scroll/useHeroParallax";
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
  const heroRef = useRef<HTMLElement>(null);
  useHeroParallax(heroRef);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/items?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push("/items");
    }
  };

  return (
    <section
      ref={heroRef}
      className="motion-hero-parallax relative overflow-hidden min-h-[calc(78svh-4rem)] sm:min-h-0 flex flex-col justify-center pt-8 pb-10 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b-0 lg:border-b lg:border-slate-200/60 lg:dark:border-slate-800/60 bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 lg:from-blue-50/40 lg:via-white lg:to-transparent lg:dark:from-slate-900/50 lg:dark:via-slate-950 lg:dark:to-transparent"
    >
      {/* Decorative subtle ambient glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-purple-500/15 dark:from-blue-600/20 dark:via-indigo-600/15 dark:to-purple-600/15 rounded-full blur-3xl pointer-events-none select-none lg:top-1/4 lg:bg-none lg:bg-blue-400/10 lg:dark:bg-blue-600/10"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-56 sm:w-72 h-56 sm:h-72 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none select-none"
      />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center w-full my-auto sm:my-0">
        {/*
          Floating Material Icons:
          - Mobile (<768px): Hidden on the sides to eliminate visual clutter; uses the compact center cluster instead.
          - Tablet (768px-1023px): Elegantly spread around both flanks, matching desktop spread without duplication.
          - Desktop (>=1024px): Prominent playful floating cards with vibrant glassmorphic gradients.
        */}

        {/* Item 1: Headphones (หูฟัง) - Rose / Pink (Top-Left of headline) */}
        <div className="absolute top-0 sm:top-2 md:top-5 lg:-top-6 left-2 sm:left-4 md:left-10 lg:-left-16 pointer-events-none select-none z-0 hidden md:block">
          <div className="relative -rotate-12 w-8 h-8 md:w-13 md:h-13 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-300 shadow-sm sm:shadow-lg shadow-rose-500/20 dark:from-rose-500/35 dark:via-pink-500/25 dark:to-rose-400/20 dark:shadow-[0_0_30px_rgba(244,63,94,0.35)] dark:border dark:border-rose-400/30 backdrop-blur-xs flex items-center justify-center animate-float-slow">
            <div className="absolute top-1 left-1.5 w-2 h-2 lg:w-5 lg:h-5 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <Headphones className="w-4 h-4 md:w-6.5 md:h-6.5 lg:w-12 lg:h-12 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 2: Smartphone (มือถือ) - Sky / Blue (Top-Right of headline) */}
        <div className="absolute top-1 sm:top-3 md:top-2 lg:-top-3 right-2 sm:right-4 md:right-9 lg:-right-14 pointer-events-none select-none z-0 hidden md:block">
          <div className="relative rotate-12 w-8 h-8 md:w-13 md:h-13 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-blue-400 via-sky-400 to-indigo-300 shadow-sm sm:shadow-lg shadow-blue-500/20 dark:from-blue-500/35 dark:via-sky-500/25 dark:to-indigo-400/20 dark:shadow-[0_0_35px_rgba(59,130,246,0.35)] dark:border dark:border-blue-400/30 backdrop-blur-xs flex items-center justify-center animate-float-reverse">
            <div className="absolute top-1 left-1.5 w-2 h-2 lg:w-5 lg:h-5 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <Smartphone className="w-4 h-4 md:w-6.5 md:h-6.5 lg:w-12 lg:h-12 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 3: Student Card / Wallet (บัตร/กระเป๋าตัง) - Violet / Purple (Mid-Left flanking search) */}
        <div className="absolute top-[48%] sm:top-[46%] md:top-[46%] lg:top-[42%] left-1.5 sm:left-3 md:left-4 lg:-left-12 pointer-events-none select-none z-0 hidden md:block">
          <div className="relative -rotate-6 w-12 h-12 md:w-12 md:h-12 lg:w-18 lg:h-18 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 shadow-md shadow-purple-500/20 dark:from-purple-500/35 dark:via-violet-500/25 dark:to-indigo-400/20 dark:shadow-[0_0_25px_rgba(168,85,247,0.35)] dark:border dark:border-purple-400/30 backdrop-blur-xs flex items-center justify-center animate-float-pulse">
            <div className="absolute top-0.5 left-1 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <CreditCard className="w-6 h-6 md:w-6 md:h-6 lg:w-9 lg:h-9 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 4: Glasses / Key (แว่นตา / กุญแจ) - Emerald / Mint (Mid-Right flanking search) */}
        <div className="absolute top-[50%] sm:top-[48%] md:top-[41%] lg:top-[44%] right-1.5 sm:right-3 md:right-5 lg:-right-12 pointer-events-none select-none z-0 hidden md:block">
          <div className="relative rotate-12 w-12 h-12 md:w-12 md:h-12 lg:w-18 lg:h-18 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-400 shadow-md shadow-emerald-500/20 dark:from-emerald-400/35 dark:via-teal-500/25 dark:to-cyan-400/20 dark:shadow-[0_0_25px_rgba(168,85,247,0.35)] dark:border dark:border-emerald-400/30 backdrop-blur-xs flex items-center justify-center animate-float-slow">
            <div className="absolute top-0.5 left-1 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-white/40 dark:bg-white/20 blur-[1px]" />
            <Glasses className="w-6 h-6 md:w-6 md:h-6 lg:w-9 lg:h-9 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 5: Key (กุญแจห้อง) - Amber (Near CTA buttons, subtle) */}
        <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 lg:-bottom-2 left-3 sm:left-8 md:left-14 lg:left-0 pointer-events-none select-none z-0 hidden md:block">
          <div className="relative -rotate-12 w-11 h-11 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-orange-400 shadow-sm shadow-amber-500/20 dark:from-amber-400/35 dark:via-yellow-500/25 dark:to-orange-400/20 dark:shadow-[0_0_20px_rgba(245,158,11,0.35)] dark:border dark:border-amber-400/30 backdrop-blur-xs flex items-center justify-center animate-float-pulse">
            <KeyRound className="w-5 h-5 md:w-5 md:h-5 lg:w-7 lg:h-7 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Item 6: Backpack (กระเป๋าเป้) - Fuchsia / Pink (Bottom-Right flanking CTA) */}
        <div className="absolute bottom-1 sm:bottom-2 md:bottom-1 lg:-bottom-2 right-3 sm:right-8 md:right-11 lg:right-0 pointer-events-none select-none z-0 hidden md:block">
          <div className="relative rotate-8 w-12 h-12 md:w-12 md:h-12 lg:w-18 lg:h-18 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-fuchsia-400 via-pink-400 to-rose-400 shadow-md shadow-fuchsia-500/20 dark:from-fuchsia-500/35 dark:via-pink-500/25 dark:to-rose-400/20 dark:shadow-[0_0_25px_rgba(217,70,239,0.35)] dark:border dark:border-fuchsia-400/30 backdrop-blur-xs flex items-center justify-center animate-float-reverse">
            <Backpack className="w-6 h-6 md:w-6 md:h-6 lg:w-9 lg:h-9 text-white drop-shadow-xs relative z-10" />
          </div>
        </div>

        {/* Content Flow */}
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {/* Mobile Decorative Icon Cluster (Hidden on >= 768px to prevent duplication with flanking items) */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center mb-3.5 sm:mb-5 pointer-events-none select-none md:hidden"
          >
            {/* Tile 1: Headphones (Left end, 40px) */}
            <div className="relative -rotate-12 w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-300 shadow-md shadow-rose-500/25 dark:from-rose-500/35 dark:via-pink-500/25 dark:to-rose-400/20 dark:shadow-[0_0_16px_rgba(244,63,94,0.3)] dark:border dark:border-rose-400/30 flex items-center justify-center translate-y-2 animate-float-subtle">
              <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/40 dark:bg-white/20 blur-[0.5px]" />
              <Headphones className="w-5 h-5 sm:w-6.5 sm:h-6.5 text-white drop-shadow-xs" />
            </div>

            {/* Tile 2: Smartphone (Mid-left, 48px) */}
            <div
              className="relative rotate-6 -ml-2 sm:-ml-2.5 w-12 h-12 sm:w-15 sm:h-15 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-400 via-sky-400 to-indigo-300 shadow-md shadow-blue-500/25 dark:from-blue-500/35 dark:via-sky-500/25 dark:to-indigo-400/20 dark:shadow-[0_0_18px_rgba(59,130,246,0.3)] dark:border dark:border-blue-400/30 flex items-center justify-center translate-y-0.5 animate-float-subtle-reverse"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/40 dark:bg-white/20 blur-[0.5px]" />
              <Smartphone className="w-6 h-6 sm:w-7.5 sm:h-7.5 text-white drop-shadow-xs" />
            </div>

            {/* Tile 3: Student Card / Wallet (Center peak, 56px) */}
            <div
              className="relative -rotate-3 -ml-2 sm:-ml-2.5 z-10 w-14 h-14 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 shadow-lg shadow-purple-500/30 dark:from-purple-500/35 dark:via-violet-500/25 dark:to-indigo-400/20 dark:shadow-[0_0_24px_rgba(168,85,247,0.35)] dark:border dark:border-purple-400/30 flex items-center justify-center -translate-y-1.5 animate-float-subtle"
              style={{ animationDelay: "2.4s" }}
            >
              <div className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-white/40 dark:bg-white/20 blur-[0.5px]" />
              <CreditCard className="w-7 h-7 sm:w-9 sm:h-9 text-white drop-shadow-xs" />
            </div>

            {/* Tile 4: Glasses (Mid-right, 48px) */}
            <div
              className="relative rotate-8 -ml-2 sm:-ml-2.5 w-12 h-12 sm:w-15 sm:h-15 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-400 shadow-md shadow-emerald-500/25 dark:from-emerald-400/35 dark:via-teal-500/25 dark:to-cyan-400/20 dark:shadow-[0_0_18px_rgba(52,211,153,0.3)] dark:border dark:border-emerald-400/30 flex items-center justify-center translate-y-0.5 animate-float-subtle-reverse"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/40 dark:bg-white/20 blur-[0.5px]" />
              <Glasses className="w-6 h-6 sm:w-7.5 sm:h-7.5 text-white drop-shadow-xs" />
            </div>

            {/* Tile 5: Backpack (Right end, 40px) */}
            <div
              className="relative -rotate-8 -ml-2 sm:-ml-2.5 w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-fuchsia-400 via-pink-400 to-rose-400 shadow-md shadow-fuchsia-500/25 dark:from-fuchsia-500/35 dark:via-pink-500/25 dark:to-rose-400/20 dark:shadow-[0_0_16px_rgba(217,70,239,0.3)] dark:border dark:border-fuchsia-400/30 flex items-center justify-center translate-y-2 animate-float-subtle"
              style={{ animationDelay: "1.8s" }}
            >
              <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/40 dark:bg-white/20 blur-[0.5px]" />
              <Backpack className="w-5 h-5 sm:w-6.5 sm:h-6.5 text-white drop-shadow-xs" />
            </div>
          </div>

          {/* Minimalist Top Badge - Mobile-safe, no right edge clipping */}
          <div className="inline-flex max-w-full items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-medium sm:font-semibold shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">ศูนย์ช่วยเหลือของหายประจำ ม.แม่โจ้</span>
          </div>

          {/* Headline with Thai Typography balance and proper leading */}
          <div className="mt-4 sm:mt-6 w-full">
            <h1 className="text-[clamp(2rem,10vw,3rem)] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] sm:leading-[1.2] lg:leading-[1.2] [text-wrap:balance]">
              ของหายใน ม.แม่โจ้? <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                <span className="whitespace-nowrap">ให้เพื่อน ๆ</span> ช่วยตามหา
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed [text-wrap:balance] px-1 sm:px-2">
              ค้นหาของที่หาย หรือ<span className="whitespace-nowrap">แจ้งของที่เก็บได้ใน ม.แม่โจ้</span> แจ้งเตือนทันทีเมื่อพบของที่ตรงกัน
            </p>
          </div>

          {/* Minimal Search Bar (Shifted lower for balanced breathing room) */}
          <form
            onSubmit={handleSearch}
            className="mt-8 min-[380px]:mt-10 sm:mt-10 lg:mt-8 w-full max-w-md sm:max-w-lg mx-auto flex items-center p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-slate-900 shadow-md ring-1 ring-slate-200/80 dark:ring-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all min-h-[44px] sm:min-h-[48px]"
          >
            <div className="pl-3 sm:pl-4 text-slate-400 shrink-0">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ค้นหาของที่หายใน ม.แม่โจ้ เช่น หูฟัง, บัตร..."
              className="flex-1 min-w-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[38px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              ค้นหา
            </button>
          </form>

          {/* Dual CTA buttons: Shifted down proportionally */}
          <div className="mt-5 min-[380px]:mt-6 sm:mt-6 lg:mt-6 flex flex-row items-center justify-center gap-2 sm:gap-3 pt-0.5 w-full max-w-[280px] min-[360px]:max-w-[320px] sm:max-w-sm lg:max-w-md mx-auto">
            <Link
              href="/items/new?type=LOST"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-4 lg:px-5 h-9.5 sm:h-10 lg:h-11 min-h-[38px] sm:min-h-[40px] lg:min-h-[44px] rounded-lg sm:rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs lg:text-sm font-semibold lg:font-bold shadow-sm lg:shadow-md shadow-rose-600/15 lg:shadow-rose-600/20 transition active:scale-95"
            >
              <span>แจ้งของหาย</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </Link>
            <Link
              href="/items/new?type=FOUND"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-4 lg:px-5 h-9.5 sm:h-10 lg:h-11 min-h-[38px] sm:min-h-[40px] lg:min-h-[44px] rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs lg:text-sm font-semibold lg:font-bold shadow-sm lg:shadow-md shadow-indigo-600/15 lg:shadow-indigo-600/20 transition active:scale-95"
            >
              <span>แจ้งเจอของ</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

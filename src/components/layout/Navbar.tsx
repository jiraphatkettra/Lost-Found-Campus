"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  SearchCheck,
  Search,
  Plus,
  Home,
  ListFilter,
  Menu,
  ChevronDown,
  Gift,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";
import { MobileDrawer } from "./MobileDrawer";
import { Dropdown } from "@/components/ui/Dropdown";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/items?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 ${
          scrolled ? "shadow-sm dark:shadow-slate-950/40" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Left: Logo & Nav Links */}
            <div className="flex items-center gap-2 sm:gap-3 xl:gap-6 shrink-0">
              {/* Logo */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 sm:gap-2.5 group shrink-0 whitespace-nowrap"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  <SearchCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-extrabold text-sm min-[380px]:text-base sm:text-lg text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  <span className="hidden min-[380px]:inline">Lost & Found </span>
                  <span className="min-[380px]:hidden">L&F </span>
                  <span className="text-blue-600">Campus</span>
                </span>
              </Link>

              {/* Desktop Navigation links (>=1024px) */}
              <nav className="hidden lg:flex items-center gap-1 shrink-0">
                <NavLink href="/" icon={<Home className="w-4 h-4" />}>
                  หน้าแรก
                </NavLink>
                <NavLink href="/items" icon={<ListFilter className="w-4 h-4" />}>
                  รายการสิ่งของ
                </NavLink>
                {session?.user && (
                  <NavLink href="/my-items">
                    ประกาศของฉัน
                  </NavLink>
                )}
              </nav>
            </div>

            {/* Middle: Desktop Quick Search input (>=1280px) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden xl:flex items-center relative w-44 2xl:w-64 transition-all focus-within:w-64 2xl:focus-within:w-72"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาของที่หาย..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* CTA Dropdown "+ แจ้งใหม่" (Desktop) */}
              <div className="hidden sm:block shrink-0">
                <Dropdown
                  align="right"
                  className="w-48"
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0">
                      <Plus className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">แจ้งใหม่</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-80 shrink-0" />
                    </button>
                  }
                >
                  <div className="p-1 space-y-0.5">
                    <Link
                      href="/items/new?type=LOST"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Search className="w-4 h-4" />
                      <span>แจ้งของหาย (Lost)</span>
                    </Link>
                    <Link
                      href="/items/new?type=FOUND"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                    >
                      <Gift className="w-4 h-4" />
                      <span>แจ้งเจอของ (Found)</span>
                    </Link>
                  </div>
                </Dropdown>
              </div>

              {/* Theme Toggle (Light / Dark) */}
              <ThemeToggle />

              {/* Auth state: Notification + UserMenu OR Login Button */}
              {status === "loading" ? (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ) : session?.user ? (
                <>
                  <NotificationBell />
                  <div className="hidden sm:block">
                    <UserMenu user={session.user as any} />
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>เข้าสู่ระบบ</span>
                </Link>
              )}

              {/* Hamburger Button (Mobile & Tablet <1024px) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="เปิดเมนูนำทาง"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={session?.user as any}
      />
    </>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/Avatar";
import {
  X,
  Search,
  PlusCircle,
  Home,
  ListChecks,
  Handshake,
  ShieldAlert,
  LogOut,
  LogIn,
} from "lucide-react";

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export function MobileDrawer({ open, onClose, user }: MobileDrawerProps) {
  const pathname = usePathname();
  const prevPathname = React.useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl p-5 sm:p-6 pb-safe pt-safe flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250 overflow-y-auto">
        <div className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-base bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Lost & Found MJU
            </span>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              aria-label="ปิดเมนู"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info if logged in */}
          {user ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <Avatar src={user.image} name={user.name} size="md" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full min-h-[48px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm shadow-sm active:scale-95 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบด้วย Google</span>
            </Link>
          )}

          {/* Quick Actions (CTA buttons) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/items/new?type=LOST"
              onClick={onClose}
              className="min-h-[52px] flex flex-col items-center justify-center p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition text-center active:scale-95"
            >
              <Search className="w-4 h-4 mb-1" />
              <span>แจ้งของหาย</span>
            </Link>
            <Link
              href="/items/new?type=FOUND"
              onClick={onClose}
              className="min-h-[52px] flex flex-col items-center justify-center p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition text-center active:scale-95"
            >
              <PlusCircle className="w-4 h-4 mb-1" />
              <span>แจ้งเจอของ</span>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-98"
            >
              <Home className="w-4 h-4 text-blue-600 shrink-0" />
              <span>หน้าแรก</span>
            </Link>
            <Link
              href="/items"
              onClick={onClose}
              className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-98"
            >
              <Search className="w-4 h-4 text-blue-600 shrink-0" />
              <span>รายการสิ่งของทั้งหมด</span>
            </Link>
            {user && (
              <>
                <Link
                  href="/my-items"
                  onClick={onClose}
                  className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-98"
                >
                  <ListChecks className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ประกาศของฉัน</span>
                </Link>
                <Link
                  href="/my-items?tab=received"
                  onClick={onClose}
                  className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-98"
                >
                  <Handshake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>คำขอของฉัน (Claims)</span>
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition active:scale-98"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>จัดการระบบ (ADMIN)</span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Footer logout */}
        {user && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

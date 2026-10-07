"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import {
  ListChecks,
  Handshake,
  ShieldAlert,
  LogOut,
  ChevronDown,
} from "lucide-react";

export interface UserMenuProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const isAdmin = user.role === "ADMIN";

  return (
    <Dropdown
      align="right"
      className="w-60"
      trigger={
        <button
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap shrink-0"
          aria-label="เมนูผู้ใช้งาน"
        >
          <Avatar src={user.image} name={user.name} size="sm" />
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] xl:max-w-[130px] truncate">
            {user.name || "ผู้ใช้งาน"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      }
    >
      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-400">ลงชื่อเข้าใช้ในชื่อ</p>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
          {user.name}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {user.email}
        </p>
      </div>

      <div className="py-1">
        <Link
          href="/my-items"
          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <ListChecks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>ประกาศของฉัน</span>
        </Link>

        <Link
          href="/my-items?tab=received"
          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <Handshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>คำขอของฉัน (Claims)</span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
          >
            <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>จัดการระบบ (ADMIN)</span>
          </Link>
        )}
      </div>

      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </Dropdown>
  );
}

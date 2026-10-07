"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ArrowRight } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  link: string;
  readAt: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
        setRecentNotifications(data.notifications?.slice(0, 5) || []);
      }
    } catch {
      // ignore network errors
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 60 seconds when document is visible (Section 4.2)
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setUnreadCount(0);
      setRecentNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
    } catch {
      // ignore
    }
  };

  return (
    <Dropdown
      align="right"
      className="w-80 sm:w-96"
      trigger={
        <button
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      }
    >
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          การแจ้งเตือน
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>อ่านทั้งหมด</span>
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {recentNotifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
            ยังไม่มีการแจ้งเตือน
          </div>
        ) : (
          recentNotifications.map((n) => (
            <Link
              key={n.id}
              href={n.link}
              className={`block p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                !n.readAt ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {n.title}
                </p>
                {!n.readAt && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                )}
              </div>
              {n.body && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {n.body}
                </p>
              )}
            </Link>
          ))
        )}
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          href="/notifications"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1"
        >
          <span>ดูการแจ้งเตือนทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Dropdown>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Bell,
  CheckCheck,
  HandHelping,
  CheckCircle,
  XCircle,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  link: string;
  readAt: string | Date | null;
  createdAt: string | Date;
}

export interface NotificationListProps {
  initialNotifications: NotificationItem[];
}

export function NotificationList({
  initialNotifications,
}: NotificationListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications
  );
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleMarkAllRead = async () => {
    try {
      setIsMarkingAll(true);
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });

      if (!res.ok) throw new Error("ไม่สามารถอัปเดตการแจ้งเตือนได้");

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      toast.success("ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว");
    } catch {
      toast.error("เกิดข้อผิดพลาดในการทำเครื่องหมายอ่าน");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleClickItem = async (notif: NotificationItem) => {
    if (!notif.readAt) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notif.id] }),
        });
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notif.id ? { ...n, readAt: new Date().toISOString() } : n
          )
        );
      } catch (err) {
        console.error("Mark read error:", err);
      }
    }

    if (notif.link) {
      router.push(notif.link);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "CLAIM_RECEIVED":
        return <HandHelping className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "CLAIM_ACCEPTED":
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "CLAIM_REJECTED":
        return <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case "MATCH_FOUND":
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "ITEM_HIDDEN":
        return <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="ไม่มีการแจ้งเตือนในขณะนี้"
        description="เมื่อมีผู้ตอบรับคำขอ หรือมีประกาศที่อาจตรงกับสิ่งของที่คุณตามหา การแจ้งเตือนจะแสดงที่นี่"
        action={{
          label: "ดูรายการสิ่งของทั้งหมด",
          href: "/items",
        }}
      />
    );
  }

  // แยกกลุ่ม "วันนี้" กับ "ก่อนหน้านี้"
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayList = notifications.filter(
    (n) => new Date(n.createdAt) >= today
  );
  const earlierList = notifications.filter(
    (n) => new Date(n.createdAt) < today
  );

  const renderGroup = (title: string, list: NotificationItem[]) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 px-1">
          {title} ({list.length})
        </h3>
        <div className="space-y-2">
          {list.map((item) => {
            const isUnread = !item.readAt;
            return (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                  isUnread
                    ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs hover:border-blue-300"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getNotifIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-semibold truncate ${
                        isUnread
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {item.body && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {item.body}
                    </p>
                  )}
                </div>

                {isUnread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            ยังไม่อ่าน{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {unreadCount}
            </span>{" "}
            รายการ
          </span>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            loading={isMarkingAll}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            อ่านทั้งหมด
          </Button>
        )}
      </div>

      {renderGroup("วันนี้", todayList)}
      {renderGroup("ก่อนหน้านี้", earlierList)}
    </div>
  );
}

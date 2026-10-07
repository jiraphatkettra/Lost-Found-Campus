"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { ItemStatus } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Search, ArchiveRestore, RefreshCw } from "lucide-react";

export interface StatusChangerProps {
  itemId: string;
  initialStatus: ItemStatus;
}

const STATUS_CONFIG: Array<{
  value: ItemStatus;
  label: string;
  shortLabel: string;
  icon: typeof Search;
  activeColor: string;
}> = [
  {
    value: "SEARCHING",
    label: "กำลังตามหา",
    shortLabel: "ตามหา",
    icon: Search,
    activeColor: "bg-amber-500 text-white shadow-xs",
  },
  {
    value: "FOUND",
    label: "พบของแล้ว",
    shortLabel: "พบแล้ว",
    icon: Check,
    activeColor: "bg-blue-600 text-white shadow-xs",
  },
  {
    value: "RETURNED",
    label: "ส่งคืนเรียบร้อย",
    shortLabel: "ส่งคืนแล้ว",
    icon: ArchiveRestore,
    activeColor: "bg-emerald-600 text-white shadow-xs",
  },
];

export function StatusChanger({ itemId, initialStatus }: StatusChangerProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<ItemStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    currentStatus,
    (_state, newStatus: ItemStatus) => newStatus
  );

  const handleStatusChange = async (newStatus: ItemStatus) => {
    if (newStatus === currentStatus) return;

    const previousStatus = currentStatus;

    startTransition(async () => {
      setOptimisticStatus(newStatus);
      setCurrentStatus(newStatus);

      try {
        const res = await fetch(`/api/items/${itemId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
          throw new Error("Failed to update status");
        }

        toast.success("อัปเดตสถานะสำเร็จ");
        router.refresh();
      } catch (error) {
        console.error("Status update error:", error);
        setCurrentStatus(previousStatus);
        setOptimisticStatus(previousStatus);
        toast.error("ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง");
      }
    });
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <span>ปรับเปลี่ยนสถานะประกาศ:</span>
          {isPending && (
            <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
          )}
        </span>
        <span className="text-2xs text-slate-400">คลิกเพื่ออัปเดต</span>
      </div>

      {/* Segmented Control Bar (Full width, responsive labels so no overflow on mobile) */}
      <div className="flex w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 p-1 shadow-2xs">
        {STATUS_CONFIG.map((s) => {
          const isSelected = optimisticStatus === s.value;
          const Icon = s.icon;

          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handleStatusChange(s.value)}
              className={`flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-2xs min-[360px]:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? s.activeColor
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate min-[400px]:hidden">{s.shortLabel}</span>
              <span className="truncate hidden min-[400px]:inline">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

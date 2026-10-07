"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { ItemStatus } from "@prisma/client";
import { ITEM_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Search, ArchiveRestore } from "lucide-react";

export interface StatusChangerProps {
  itemId: string;
  initialStatus: ItemStatus;
}

export function StatusChanger({ itemId, initialStatus }: StatusChangerProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<ItemStatus>(initialStatus);
  const [, startTransition] = useTransition();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SEARCHING":
        return <Search className="w-3.5 h-3.5" />;
      case "FOUND":
        return <Check className="w-3.5 h-3.5" />;
      case "RETURNED":
        return <ArchiveRestore className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        ปรับสถานะ:
      </span>
      <div className="flex w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-1 shadow-2xs">
        {ITEM_STATUSES.map((s) => {
          const isSelected = optimisticStatus === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handleStatusChange(s.value as ItemStatus)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-2xs min-[360px]:text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {getStatusIcon(s.value)}
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

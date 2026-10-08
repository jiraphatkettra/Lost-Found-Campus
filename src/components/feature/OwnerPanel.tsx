"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ItemStatus } from "@prisma/client";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Check,
} from "lucide-react";
import { TYPE_SCALE } from "@/lib/ui";

export interface OwnerPanelProps {
  itemId: string;
  itemTitle: string;
  initialStatus: ItemStatus;
}

const STEPS: Array<{
  value: ItemStatus;
  label: string;
  order: number;
}> = [
  { value: "SEARCHING", label: "กำลังตามหา", order: 0 },
  { value: "FOUND", label: "พบของแล้ว", order: 1 },
  { value: "RETURNED", label: "ส่งคืนเรียบร้อย", order: 2 },
];

export function OwnerPanel({
  itemId,
  itemTitle,
  initialStatus,
}: OwnerPanelProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<ItemStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    currentStatus,
    (_state, newStatus: ItemStatus) => newStatus
  );

  const activeIndex = STEPS.findIndex((s) => s.value === optimisticStatus);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "เกิดข้อผิดพลาดในการลบประกาศ");
        return;
      }

      toast.success("ลบประกาศเรียบร้อยแล้ว");
      setDeleteModalOpen(false);
      router.push("/my-items");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อลบประกาศได้");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 pt-2">
      {/* 1. Header & Stepper */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`${TYPE_SCALE.h2} text-slate-900 dark:text-white`}>
              จัดการประกาศ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              เลือกสถานะที่ตรงกับความคืบหน้าปัจจุบัน
            </p>
          </div>
          {isPending && (
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>กำลังบันทึก...</span>
            </span>
          )}
        </div>

        {/* 3-Step Progress Stepper (Accessible Keyboard & Screen Reader) */}
        <div
          role="radiogroup"
          aria-label="สถานะการติดตาม"
          aria-live="polite"
          className="relative pt-3 pb-1"
        >
          {/* Connecting Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{
                width: activeIndex === 0 ? "0%" : activeIndex === 1 ? "50%" : "100%",
              }}
            />
          </div>

          {/* Stepper Buttons */}
          <div className="relative z-10 flex items-start justify-between">
            {STEPS.map((s, idx) => {
              const isSelected = optimisticStatus === s.value;
              const isPast = idx < activeIndex;

              return (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleStatusChange(s.value)}
                  className="flex flex-col items-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1 -m-1 transition-all"
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-xs scale-110"
                        : isPast
                        ? "bg-blue-600 text-white hover:scale-105"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Action Buttons (Hierarchy: Outline Edit + Ghost Red Delete) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          href={`/items/${itemId}/edit`}
          className="min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs transition active:scale-95"
        >
          <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>แก้ไขประกาศ</span>
        </Link>

        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          <span>ลบประกาศ</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="ยืนยันการลบประกาศ"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-700 dark:text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <p>
              คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                &ldquo;{itemTitle}&rdquo;
              </span>
              ? เมื่อลบแล้วข้อมูลทั้งหมดจะไม่สามารถกู้คืนได้
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              ยกเลิก
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              ยืนยันการลบ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

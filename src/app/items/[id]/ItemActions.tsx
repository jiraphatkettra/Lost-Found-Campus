"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ItemStatus } from "@prisma/client";
import { StatusChanger } from "@/components/feature/StatusChanger";
import { ClaimForm } from "@/components/feature/ClaimForm";
import { ReportModal } from "@/components/feature/ReportModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  HandHelping,
  Flag,
  LogIn,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
} from "lucide-react";

export interface UserClaimSummary {
  id: string;
  status: string;
}

export interface ItemActionsProps {
  itemId: string;
  itemTitle: string;
  itemType: string;
  initialStatus: ItemStatus;
  isOwner: boolean;
  isLoggedIn: boolean;
  userClaim?: UserClaimSummary | null;
}

export function ItemActions({
  itemId,
  itemTitle,
  itemType,
  initialStatus,
  isOwner,
  isLoggedIn,
  userClaim: initialUserClaim,
}: ItemActionsProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [userClaim, setUserClaim] = useState<UserClaimSummary | null | undefined>(
    initialUserClaim
  );

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

  // 1. เจ้าของประกาศ (Owner Management Card)
  if (isOwner) {
    return (
      <div className="pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3 sm:space-y-4">
        {/* Status Changer Segmented Control */}
        <StatusChanger itemId={itemId} initialStatus={initialStatus} />

        {/* Dedicated 2-Column Action Buttons: Always 100% visible, never cut off */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <Link
            href={`/items/${itemId}/edit`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs transition active:scale-95"
          >
            <Pencil className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>แก้ไขประกาศ</span>
          </Link>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
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

  // 2. ผู้ใช้ทั่วไป (Non-Owner Actions)
  const isLost = itemType === "LOST";
  const claimButtonLabel = isLost ? "ฉันเจอของชิ้นนี้" : "นี่คือของของฉัน";

  return (
    <div className="space-y-3 pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Claim Action / Status */}
        {!isLoggedIn ? (
          <Link
            href={`/login?callbackUrl=/items/${itemId}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition active:scale-95 text-center"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบเพื่อ{claimButtonLabel}</span>
          </Link>
        ) : userClaim ? (
          <div className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2.5 text-xs">
            {userClaim.status === "PENDING" && (
              <>
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  คุณได้ส่งคำขอแล้ว (รอเจ้าของประกาศตอบรับ)
                </span>
              </>
            )}
            {userClaim.status === "ACCEPTED" && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  เจ้าของตอบรับคำขอของคุณแล้ว ข้อมูลติดต่อแสดงอยู่ด้านบน
                </span>
              </>
            )}
            {userClaim.status === "REJECTED" && (
              <>
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  คำขอของคุณถูกปฏิเสธโดยเจ้าของประกาศ
                </span>
              </>
            )}
          </div>
        ) : initialStatus === "RETURNED" ? (
          <div className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs text-center font-medium">
            ประกาศนี้ปิดรับคำขอแล้ว (ส่งคืนสำเร็จ)
          </div>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setClaimModalOpen(true)}
            className="flex-1 justify-center py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20"
            leftIcon={<HandHelping className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            {claimButtonLabel}
          </Button>
        )}

        {/* Report Button */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-xs font-semibold transition cursor-pointer shrink-0"
            title="รายงานประกาศนี้"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="inline sm:inline">รายงาน</span>
          </button>
        )}
      </div>

      {/* Claim Form Modal */}
      <ClaimForm
        itemId={itemId}
        itemType={itemType}
        itemTitle={itemTitle}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onSuccess={() => {
          setUserClaim({ id: "new", status: "PENDING" });
          router.refresh();
        }}
      />

      {/* Report Modal */}
      <ReportModal
        itemId={itemId}
        itemTitle={itemTitle}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}

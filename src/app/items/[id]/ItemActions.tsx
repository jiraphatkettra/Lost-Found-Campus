"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ItemStatus } from "@prisma/client";
import { OwnerPanel } from "@/components/feature/OwnerPanel";
import { ClaimForm } from "@/components/feature/ClaimForm";
import { ReportModal } from "@/components/feature/ReportModal";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import {
  HandHelping,
  Flag,
  LogIn,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
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
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [cancellingClaim, setCancellingClaim] = useState(false);
  const [userClaim, setUserClaim] = useState<UserClaimSummary | null | undefined>(
    initialUserClaim
  );

  // 1. เจ้าของประกาศ -> แสดง OwnerPanel (หัวข้อ 5.6)
  if (isOwner) {
    return (
      <OwnerPanel
        itemId={itemId}
        itemTitle={itemTitle}
        initialStatus={initialStatus}
      />
    );
  }

  // 2. ยกเลิกคำขอของผู้ใช้ (กรณี PENDING)
  const handleCancelClaim = async () => {
    if (!userClaim?.id) return;
    try {
      setCancellingClaim(true);
      const res = await fetch(`/api/claims/${userClaim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ไม่สามารถยกเลิกคำขอได้");
      }
      toast.success("ยกเลิกคำขอเรียบร้อยแล้ว");
      setUserClaim(null);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setCancellingClaim(false);
    }
  };

  // 3. ผู้ใช้ทั่วไป (Non-Owner Actions)
  const isLost = itemType === "LOST";
  const claimButtonLabel = isLost ? "ฉันพบของชิ้นนี้" : "นี่คือของของฉัน";

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Main CTA / Claim Action / Status */}
        {!isLoggedIn ? (
          <Link
            href={`/login?callbackUrl=/items/${itemId}`}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm transition active:scale-95 text-center"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบเพื่อติดต่อ</span>
          </Link>
        ) : userClaim ? (
          <div className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {userClaim.status === "PENDING" && (
                <>
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                    รอเจ้าของประกาศตอบรับคำขอ
                  </span>
                </>
              )}
              {userClaim.status === "ACCEPTED" && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-emerald-700 dark:text-emerald-400 truncate">
                    เจ้าของตอบรับแล้ว ข้อมูลติดต่อแสดงด้านล่าง
                  </span>
                </>
              )}
              {userClaim.status === "REJECTED" && (
                <>
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-rose-600 dark:text-rose-400 truncate">
                    คำขอของคุณถูกปฏิเสธโดยเจ้าของ
                  </span>
                </>
              )}
            </div>

            {userClaim.status === "PENDING" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelClaim}
                loading={cancellingClaim}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs shrink-0"
                leftIcon={<Ban className="w-3.5 h-3.5" />}
              >
                ยกเลิกคำขอ
              </Button>
            )}
          </div>
        ) : initialStatus === "RETURNED" ? (
          <div className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs text-center font-medium">
            ประกาศนี้ปิดรับคำขอแล้ว (ส่งคืนเรียบร้อย)
          </div>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setClaimModalOpen(true)}
            className="flex-1 justify-center min-h-[44px] text-sm font-medium shadow-sm"
            leftIcon={<HandHelping className="w-4 h-4" />}
          >
            {claimButtonLabel}
          </Button>
        )}

        {/* Report Link (Tertiary / Ghost text button) */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
            title="รายงานประกาศนี้"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>รายงาน</span>
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

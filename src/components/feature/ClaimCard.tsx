"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/date";
import { Check, X, Ban, Phone, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

export interface ClaimData {
  id: string;
  itemId: string;
  claimantId: string;
  message: string;
  claimantContact: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | string;
  createdAt: string | Date;
  claimant?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface ClaimCardProps {
  claim: ClaimData;
  isOwner?: boolean;
  isClaimant?: boolean;
  onStatusChange?: (updatedClaim: ClaimData) => void;
}

export function ClaimCard({
  claim,
  isOwner = false,
  isClaimant = false,
  onStatusChange,
}: ClaimCardProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: "ACCEPT" | "REJECT" | "CANCEL") => {
    try {
      setLoadingAction(action);
      const res = await fetch(`/api/claims/${claim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการดำเนินการ");
      }

      if (action === "ACCEPT") {
        toast.success("ตอบรับคำขอเรียบร้อยแล้ว");
      } else if (action === "REJECT") {
        toast.success("ปฏิเสธคำขอแล้ว");
      } else {
        toast.success("ยกเลิกคำขอแล้ว");
      }

      if (onStatusChange) {
        onStatusChange(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusBadge = () => {
    switch (claim.status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5" /> ตอบรับแล้ว
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <X className="w-3.5 h-3.5" /> ปฏิเสธแล้ว
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Ban className="w-3.5 h-3.5" /> ยกเลิกแล้ว
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" /> รอการตอบรับ
          </span>
        );
    }
  };

  return (
    <div className="p-3.5 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={claim.claimant?.image}
            name={claim.claimant?.name || "ผู้ใช้"}
            size="sm"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {claim.claimant?.name || "ผู้ใช้งาน"}
            </h4>
            <span className="text-3xs sm:text-xs text-slate-400">
              {formatRelativeTime(claim.createdAt)}
            </span>
          </div>
        </div>
        <div className="shrink-0">{getStatusBadge()}</div>
      </div>

      <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <p className="whitespace-pre-line leading-relaxed break-words">{claim.message}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-2xs sm:text-xs">ติดต่อ:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 select-all font-mono text-xs">
            {claim.claimantContact}
          </span>
        </div>

        {/* Action Buttons */}
        {claim.status === "PENDING" && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction("REJECT")}
                  loading={loadingAction === "REJECT"}
                  disabled={loadingAction !== null}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900"
                  leftIcon={<X className="w-3.5 h-3.5" />}
                >
                  ปฏิเสธ
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAction("ACCEPT")}
                  loading={loadingAction === "ACCEPT"}
                  disabled={loadingAction !== null}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  ตอบรับ
                </Button>
              </>
            )}

            {isClaimant && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("CANCEL")}
                loading={loadingAction === "CANCEL"}
                disabled={loadingAction !== null}
                className="text-slate-500 hover:text-rose-600"
                leftIcon={<Ban className="w-3.5 h-3.5" />}
              >
                ยกเลิกคำขอ
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

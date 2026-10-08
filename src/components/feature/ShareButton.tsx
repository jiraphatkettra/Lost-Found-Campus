"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  title = "Lost & Found MJU (ม.แม่โจ้)",
  text = "ดูรายละเอียดสิ่งของนี้ใน Lost & Found MJU (ม.แม่โจ้)",
  url,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // ตรวจสอบ Web Share API บน mobile/browser ที่รองรับ
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        // หากผู้ใช้กดยกเลิกใน share dialog ไม่ต้องแสดง error
        if ((err as Error)?.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: คัดลอกลิงก์ไปยังคลิปบอร์ด
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("คัดลอกลิงก์เรียบร้อยแล้ว");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.error("ไม่สามารถคัดลอกลิงก์ได้");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={`rounded-xl shrink-0 whitespace-nowrap text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
      leftIcon={
        copied ? (
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <Share2 className="w-4 h-4 shrink-0" />
        )
      }
    >
      <span className="whitespace-nowrap">{copied ? "คัดลอกแล้ว" : "แชร์"}</span>
    </Button>
  );
}

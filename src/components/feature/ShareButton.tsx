"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  title = "Lost & Found Campus",
  text = "ดูรายละเอียดสิ่งของนี้ใน Lost & Found Campus",
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
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={`rounded-xl ${className}`}
      leftIcon={
        copied ? (
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Share2 className="w-4 h-4" />
        )
      }
    >
      {copied ? "คัดลอกแล้ว" : "แชร์"}
    </Button>
  );
}

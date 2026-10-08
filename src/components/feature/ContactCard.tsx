"use client";

import React, { useState } from "react";
import { Phone, Copy, Check, ShieldCheck, Shield } from "lucide-react";
import { toast } from "sonner";
import { SURFACES } from "@/lib/ui";

export interface ContactCardProps {
  contact: string;
  isOwner?: boolean;
  isAdmin?: boolean;
  isAcceptedClaimant?: boolean;
}

export function ContactCard({
  contact,
  isOwner = false,
  isAdmin = false,
  isAcceptedClaimant = false,
}: ContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact);
      setCopied(true);
      toast.success("คัดลอกข้อมูลติดต่อแล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("ไม่สามารถคัดลอกได้");
    }
  };

  // ดึงเฉพาะตัวเลขถ้าเป็นเบอร์โทร
  const cleanPhone = contact.replace(/[^0-9]/g, "");
  const isPhoneNumber = cleanPhone.length >= 9 && cleanPhone.length <= 11;

  // ข้อความแยกตามบทบาทผู้ดูตามสเปก v2.1 หัวข้อ 5.5
  let headerTitle = "ข้อมูลติดต่อ";
  let statusBadge: React.ReactNode = null;
  let helperNote = "สามารถติดต่อเพื่อนัดหมายส่งมอบของ หรือสอบถามรายละเอียดเพิ่มเติมได้ทันที";

  if (isOwner) {
    headerTitle = "ข้อมูลติดต่อของคุณ";
    statusBadge = null;
    helperNote = "แสดงให้ผู้ที่คุณรับคำขอแล้วเท่านั้น";
  } else if (isAcceptedClaimant) {
    headerTitle = "ข้อมูลติดต่อเจ้าของประกาศ";
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 whitespace-nowrap shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap">ยืนยันสิทธิ์แล้ว</span>
      </span>
    );
    helperNote = "ติดต่อเพื่อนัดหมายส่งมอบของ หรือสอบถามรายละเอียดเพิ่มเติม";
  } else if (isAdmin) {
    headerTitle = "ข้อมูลติดต่อ";
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0">
        <Shield className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap">มุมมองผู้ดูแล</span>
      </span>
    );
    helperNote = "ข้อมูลติดต่อเฉพาะสำหรับผู้ดูแลระบบ";
  }

  return (
    <div className={`${SURFACES.accent} p-4 space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200 min-w-0">
          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{headerTitle}</span>
        </div>
        {statusBadge}
      </div>

      <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2.5 bg-white/90 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
        <span className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-100 select-all tracking-normal break-all tabular-nums">
          {contact}
        </span>

        <div className="flex items-center gap-2 shrink-0 self-start min-[380px]:self-auto">
          {isPhoneNumber && (
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition active:scale-95 whitespace-nowrap shadow-xs sm:hidden"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">โทร</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer whitespace-nowrap shadow-xs"
            title="คัดลอกข้อมูลติดต่อ"
            aria-label="คัดลอกข้อมูลติดต่อ"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-600 whitespace-nowrap">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="whitespace-nowrap">คัดลอก</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
        * {helperNote}
      </p>
    </div>
  );
}

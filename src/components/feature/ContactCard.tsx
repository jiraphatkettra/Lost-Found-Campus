"use client";

import React, { useState } from "react";
import { Phone, Copy, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ContactCardProps {
  contact: string;
}

export function ContactCard({ contact }: ContactCardProps) {
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

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>ข้อมูลติดต่อเจ้าของประกาศ</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3 h-3" />
          <span>ยืนยันสิทธิ์แล้ว</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 bg-white/90 dark:bg-slate-900/80 p-2 sm:p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
        <span className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-200 select-all font-mono tracking-wide truncate">
          {contact}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {isPhoneNumber && (
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition active:scale-95 sm:hidden"
            >
              <Phone className="w-3 h-3" />
              <span>โทร</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            title="คัดลอกข้อมูลติดต่อ"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>คัดลอก</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-3xs sm:text-2xs text-emerald-700/90 dark:text-emerald-400/90 leading-tight">
        * สามารถติดต่อเพื่อนัดหมายส่งมอบของ หรือสอบถามรายละเอียดเพิ่มเติมได้ทันที
      </p>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Flag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export interface ReportModalProps {
  itemId: string;
  itemTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REPORT_REASONS = [
  { value: "SPAM", label: "สแปม หรือการโฆษณาที่ไม่เกี่ยวข้อง" },
  { value: "INAPPROPRIATE", label: "เนื้อหาไม่เหมาะสม / หยาบคาย" },
  { value: "FAKE", label: "ข้อมูลเท็จ หรือการหลอกลวง" },
  { value: "OTHER", label: "เหตุผลอื่น ๆ" },
] as const;

export function ReportModal({
  itemId,
  itemTitle,
  isOpen,
  onClose,
  onSuccess,
}: ReportModalProps) {
  const [reason, setReason] = useState<string>("SPAM");
  const [detail, setDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/items/${itemId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          detail: detail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการส่งรายงาน");
      }

      toast.success("ส่งรายงานให้ผู้ดูแลระบบเรียบร้อยแล้ว ขอบคุณที่ช่วยดูแลชุมชน");
      setReason("SPAM");
      setDetail("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งรายงาน";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="รายงานประกาศไม่เหมาะสม">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p>
            คุณกำลังรายงานประกาศ{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              &quot;{itemTitle}&quot;
            </span>{" "}
            รายงานจะถูกส่งให้ผู้ดูแลระบบตรวจสอบอย่างเคร่งครัด
          </p>
        </div>

        <FormField label="เหตุผลในการรายงาน" required>
          <div className="space-y-2 pt-1">
            {REPORT_REASONS.map((r) => (
              <label
                key={r.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition text-sm ${
                  reason === r.value
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 font-medium"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField
          label="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
          helperText={`ไม่เกิน 300 ตัวอักษร (${detail.length}/300)`}
          error={errorMsg || undefined}
        >
          <textarea
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={300}
            placeholder="อธิบายข้อมูลเพิ่มเติมเพื่อช่วยผู้ดูแลระบบตรวจสอบ..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />
        </FormField>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="danger"
            loading={isSubmitting}
            leftIcon={<Flag className="w-4 h-4" />}
          >
            ส่งรายงาน
          </Button>
        </div>
      </form>
    </Modal>
  );
}

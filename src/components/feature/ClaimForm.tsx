"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { HandHelping, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { contactRegex } from "@/lib/schemas";

export interface ClaimFormProps {
  itemId: string;
  itemType: "LOST" | "FOUND" | string;
  itemTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ClaimForm({
  itemId,
  itemType,
  itemTitle,
  isOpen,
  onClose,
  onSuccess,
}: ClaimFormProps) {
  const [message, setMessage] = useState("");
  const [claimantContact, setClaimantContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLost = itemType === "LOST";
  const modalTitle = isLost ? "ฉันเจอของชิ้นนี้" : "นี่คือของของฉัน";

  const validate = () => {
    const errs: Record<string, string> = {};
    if (message.trim().length < 10) {
      errs.message = "ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร";
    } else if (message.trim().length > 500) {
      errs.message = "ข้อความต้องไม่เกิน 500 ตัวอักษร";
    }

    if (!claimantContact.trim()) {
      errs.claimantContact = "กรุณากรอกข้อมูลติดต่อของคุณ";
    } else if (!contactRegex.test(claimantContact.trim())) {
      errs.claimantContact = "ข้อมูลติดต่อต้องเป็นเบอร์โทรศัพท์ (0xxxxxxxxx) หรืออีเมลที่ถูกต้อง";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/items/${itemId}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          claimantContact: claimantContact.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการส่งคำขอ");
      }

      toast.success("ส่งคำขอยืนยันเรียบร้อยแล้ว เจ้าของประกาศจะได้รับการแจ้งเตือน");
      setMessage("");
      setClaimantContact("");
      setErrors({});
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งคำขอ";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
          <HandHelping className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p>
            คุณกำลังส่งคำขอยืนยันสำหรับประกาศ{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              &quot;{itemTitle}&quot;
            </span>{" "}
            ข้อมูลติดต่อของคุณจะแสดงให้เจ้าของประกาศเห็น เพื่อให้ติดต่อกลับหาคุณได้
          </p>
        </div>

        <FormField
          label="ข้อความยืนยัน / รายละเอียดเพิ่มเติม"
          required
          error={errors.message}
          helperText={`ระบุจุดสังเกต หรือหลักฐานยืนยัน (${message.length}/500 ตัวอักษร)`}
        >
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isLost
                ? "ระบุสถานที่หรือลักษณะของที่พบ เช่น พบวางอยู่บนโต๊ะชั้น 2..."
                : "ระบุจุดสังเกตเฉพาะ หรือหลักฐาน เช่น มีสติ๊กเกอร์ติดด้านหลัง..."
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />
        </FormField>

        <FormField
          label="ข้อมูลติดต่อของคุณ"
          required
          error={errors.claimantContact}
          helperText="เบอร์โทรศัพท์ (0812345678) หรืออีเมล"
        >
          <input
            type="text"
            value={claimantContact}
            onChange={(e) => setClaimantContact(e.target.value)}
            placeholder="0812345678 หรือ name@domain.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            variant="primary"
            loading={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            ส่งคำขอ
          </Button>
        </div>
      </form>
    </Modal>
  );
}

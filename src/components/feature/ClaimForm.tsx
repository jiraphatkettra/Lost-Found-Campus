"use client";

// 1. import ทั้งหมด
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { HandHelping, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClaimSchema, CreateClaimInput } from "@/lib/schemas";

// 2. type ของ Props ของ Component ตามสไตล์อาจารย์
export type ClaimFormProps = {
  itemId: string;
  itemType: "LOST" | "FOUND" | string;
  itemTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function ClaimForm({
  itemId,
  itemType,
  itemTitle,
  isOpen,
  onClose,
  onSuccess,
}: ClaimFormProps) {
  // 3. State และ Hook จัดการฟอร์มด้วย React Hook Form + Zod Schema
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClaimInput>({
    resolver: zodResolver(createClaimSchema),
    defaultValues: {
      message: "",
      claimantContact: "",
    },
  });

  const messageValue = watch("message") || "";
  const isLost = itemType === "LOST";
  const modalTitle = isLost ? "ฉันเจอของชิ้นนี้" : "นี่คือของของฉัน";

  // 4. ฟังก์ชันจัดการเหตุการณ์การส่งฟอร์ม (Event Handler)
  const handleValidSubmit = async (data: CreateClaimInput) => {
    try {
      const res = await fetch(`/api/items/${itemId}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.message.trim(),
          claimantContact: data.claimantContact.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการส่งคำขอ");
      }

      toast.success("ส่งคำขอยืนยันเรียบร้อยแล้ว เจ้าของประกาศจะได้รับการแจ้งเตือน");
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งคำขอ";
      toast.error(msg);
    }
  };

  // 5. return ส่วนแสดงผล JSX
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-4" noValidate>
        {/* ข้อความชี้แจง */}
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

        {/* ช่องกรอกข้อความยืนยัน */}
        <FormField
          label="ข้อความยืนยัน / รายละเอียดเพิ่มเติม"
          required
          error={errors.message?.message}
          helperText={`ระบุจุดสังเกต หรือหลักฐานยืนยัน (${messageValue.length}/500 ตัวอักษร)`}
        >
          <textarea
            rows={4}
            {...register("message")}
            placeholder={
              isLost
                ? "ระบุสถานที่หรือลักษณะของที่พบ เช่น พบวางอยู่บนโต๊ะชั้น 2..."
                : "ระบุจุดสังเกตเฉพาะ หรือหลักฐาน เช่น มีสติ๊กเกอร์ติดด้านหลัง..."
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />
        </FormField>

        {/* ช่องกรอกข้อมูลติดต่อ */}
        <FormField
          label="ข้อมูลติดต่อของคุณ"
          required
          error={errors.claimantContact?.message}
          helperText="เบอร์โทรศัพท์ (0812345678) หรืออีเมล"
        >
          <input
            type="text"
            {...register("claimantContact")}
            placeholder="0812345678 หรือ name@domain.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </FormField>

        {/* ปุ่มควบคุม */}
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
            disabled={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            ส่งคำขอ
          </Button>
        </div>
      </form>
    </Modal>
  );
}

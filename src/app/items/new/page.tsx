"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemForm } from "@/components/feature/ItemForm";
import { CreateItemInput } from "@/lib/schemas";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

function NewItemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const preselectedType = typeParam === "FOUND" ? "FOUND" : "LOST";

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateItemInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "เกิดข้อผิดพลาดในการบันทึกประกาศ");
        return;
      }

      toast.success("สร้างประกาศเรียบร้อยแล้ว");
      router.push(`/items/${result.id}`);
      router.refresh();
    } catch (error) {
      console.error("Create item error:", error);
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/items"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>กลับหน้ารายการสิ่งของ</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
        <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>สร้างประกาศใหม่</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {preselectedType === "LOST" ? "แจ้งของหาย (Lost)" : "แจ้งเจอของ (Found)"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            กรอกรายละเอียดของสิ่งของให้ชัดเจน เพื่อให้ระบบช่วยจับคู่และส่งต่อความช่วยเหลือได้เร็วที่สุด
          </p>
        </div>

        <ItemForm
          key={preselectedType}
          defaultValues={{ type: preselectedType }}
          onSubmit={handleSubmit}
          submitLabel={preselectedType === "LOST" ? "ประกาศแจ้งของหาย" : "ประกาศแจ้งเจอของ"}
          isSubmitting={loading}
        />
      </div>
    </div>
  );
}

export default function NewItemPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="h-96 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
        </div>
      }
    >
      <NewItemContent />
    </Suspense>
  );
}

"use client";

// 1. นำเข้าโมดูลและคอมโพเนนต์
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ItemForm } from "@/components/feature/ItemForm";
import { CreateItemInput } from "@/lib/schemas";
import { Item } from "@prisma/client";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";

// 2. กำหนดชนิดข้อมูล Props ตามสไตล์อาจารย์
export type EditItemClientProps = {
  item: Item;
};

// 3. คอมโพเนนต์หน้าแก้ไขประกาศ (Client Component)
export function EditItemClient({ item }: EditItemClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 4. ฟังก์ชันส่งข้อมูลการแก้ไขไปยัง API (PUT /api/items/[id])
  const handleSubmit = async (data: CreateItemInput) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "เกิดข้อผิดพลาดในการบันทึกการแก้ไข");
        return;
      }

      toast.success("บันทึกการแก้ไขเรียบร้อยแล้ว");
      router.push(`/items/${item.id}`);
      router.refresh();
    } catch (error) {
      console.error("Update item error:", error);
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
      <div className="mb-4 sm:mb-6">
        <Link
          href={`/items/${item.id}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition group py-1.5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="truncate">ยกเลิกและกลับหน้ารายละเอียด</span>
        </Link>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-2xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขประกาศ</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.3] [text-wrap:balance]">
            แก้ไขข้อมูลประกาศ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed [text-wrap:balance]">
            ปรับปรุงรายละเอียดสิ่งของ สถานที่ วันที่ หรือรูปภาพให้เป็นปัจจุบัน
          </p>
        </div>

        <ItemForm
          defaultValues={{
            type: item.type,
            title: item.title,
            category: item.category as CreateItemInput["category"],
            location: item.location as CreateItemInput["location"],
            date: item.date,
            description: item.description,
            contact: item.contact,
            imageUrl: item.imageUrl || "",
          }}
          onSubmit={handleSubmit}
          submitLabel="บันทึกการแก้ไข"
          isSubmitting={loading}
        />
      </div>
    </div>
  );
}

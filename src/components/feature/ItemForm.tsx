"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItemSchema, CreateItemInput } from "@/lib/schemas";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/feature/ImageUploader";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";
import Link from "next/link";
import {
  PackageSearch,
  Gift,
  FileText,
  MapPin,
  Lock,
  Save,
  ImageIcon,
} from "lucide-react";

// 2. type ของ Props และ type ของข้อมูลในฟอร์ม
export type ItemFormProps = {
  defaultValues?: Partial<CreateItemInput> & { customLocation?: string };
  onSubmit: (data: CreateItemInput) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
};

// Type ของข้อมูลระหว่างกรอกในฟอร์ม (สกัดจาก Zod Schema ตามสไตล์อาจารย์)
export type ItemFormValues = {
  type: "LOST" | "FOUND";
  title: string;
  category: "BOOK" | "ELECTRONICS" | "CARD" | "BAG" | "CLOTHES" | "KEYS" | "OTHER";
  location: string;
  customLocation?: string;
  date: string | Date;
  description: string;
  contact: string;
  imageUrl?: string | null;
};

export function ItemForm({
  defaultValues,
  onSubmit,
  submitLabel = "บันทึกข้อมูล",
  isSubmitting = false,
}: ItemFormProps) {
  // 3. กำหนดค่าเริ่มต้นของฟิลด์ข้อมูล
  const formattedDefaultDate = defaultValues?.date
    ? new Date(defaultValues.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const rawLocation = defaultValues?.location || "LIBRARY";
  const isOtherLoc = rawLocation.startsWith("OTHER:") || rawLocation === "OTHER";
  const initialLocation = isOtherLoc ? "OTHER" : rawLocation;
  const initialCustomLocation = rawLocation.startsWith("OTHER:")
    ? rawLocation.slice(6).trim()
    : defaultValues?.customLocation || "";

  // 4. Hook จัดการฟอร์มด้วย React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(createItemSchema) as any,
    defaultValues: {
      type: defaultValues?.type || "LOST",
      title: defaultValues?.title || "",
      category: defaultValues?.category || "BOOK",
      location: initialLocation,
      customLocation: initialCustomLocation,
      date: formattedDefaultDate,
      description: defaultValues?.description || "",
      contact: defaultValues?.contact || "",
      imageUrl: defaultValues?.imageUrl || "",
    },
    mode: "onBlur",
  });

  const selectedType = watch("type");

  // 5. ฟังก์ชันจัดการเหตุการณ์การส่งฟอร์ม (Event Handler)
  const handleValidSubmit = async (data: ItemFormValues) => {
    const finalLocation =
      data.location === "OTHER" && data.customLocation?.trim()
        ? `OTHER: ${data.customLocation.trim()}`
        : data.location;
    await onSubmit({
      ...data,
      date: new Date(data.date),
      location: finalLocation,
    } as CreateItemInput);
  };

  // 6. return ส่วนแสดงผล JSX
  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-4 sm:space-y-5">
      {/* หมวดที่ 1: ข้อมูลสิ่งของ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-2xs space-y-3.5 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm sm:text-base">ข้อมูลสิ่งของ</h3>
        </div>

        {/* Type Selection: ของหาย / ของเจอ */}
        <FormField
          label="ประเภทประกาศ"
          error={errors.type?.message as string | undefined}
          required
        >
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-1">
            <label
              className={`min-h-[42px] sm:min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border cursor-pointer font-semibold text-xs sm:text-sm transition ${
                selectedType === "LOST"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
              }`}
            >
              <input
                type="radio"
                value="LOST"
                {...register("type")}
                className="sr-only"
              />
              <PackageSearch className="w-4 h-4 shrink-0" />
              <span className="truncate">ของหาย (Lost)</span>
            </label>
            <label
              className={`min-h-[42px] sm:min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border cursor-pointer font-semibold text-xs sm:text-sm transition ${
                selectedType === "FOUND"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
              }`}
            >
              <input
                type="radio"
                value="FOUND"
                {...register("type")}
                className="sr-only"
              />
              <Gift className="w-4 h-4 shrink-0" />
              <span className="truncate">ของที่พบ (Found)</span>
            </label>
          </div>
        </FormField>

        {/* Title */}
        <FormField
          label="ชื่อสิ่งของ"
          id="title"
          error={errors.title?.message as string | undefined}
          required
        >
          <input
            id="title"
            type="text"
            placeholder="เช่น พวงกุญแจหมี, กระเป๋าสตางค์สีดำ, AirPods"
            {...register("title")}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition"
          />
        </FormField>

        {/* Category */}
        <FormField
          label="หมวดหมู่"
          id="category"
          error={errors.category?.message as string | undefined}
          required
        >
          <select
            id="category"
            {...register("category")}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Description */}
        <FormField
          label="รายละเอียดสิ่งของ"
          id="description"
          error={errors.description?.message as string | undefined}
          required
        >
          <textarea
            id="description"
            rows={3}
            placeholder="ระบุจุดสังเกต สี ตำหนิ หรือลักษณะเฉพาะอย่างละเอียด (อย่างน้อย 10 ตัวอักษร)"
            {...register("description")}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition resize-none"
          />
        </FormField>
      </div>

      {/* หมวดที่ 2: สถานที่และเวลา */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-2xs space-y-3.5 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-sm sm:text-base">สถานที่และเวลา</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField
            label="สถานที่ / อาคาร"
            id="location"
            error={errors.location?.message as string | undefined}
            required
          >
            <select
              id="location"
              {...register("location")}
              className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition cursor-pointer"
            >
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="วันที่ทำหาย / วันที่พบ"
            id="date"
            error={errors.date?.message as string | undefined}
            required
          >
            <div className="relative">
              <input
                id="date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("date")}
                className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition"
              />
            </div>
          </FormField>

          {watch("location") === "OTHER" && (
            <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <FormField
                label="โปรดระบุสถานที่ใน ม.แม่โจ้"
                id="customLocation"
                error={errors.customLocation?.message as string | undefined}
                required
              >
                <input
                  id="customLocation"
                  type="text"
                  placeholder="เช่น ซุ้มแปดเหลี่ยม, หน้าตึกสถาปัตย์, โรงอาหารคาวบอย, สระว่ายน้ำอุบลรัตนราชกัญญา..."
                  {...register("customLocation")}
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </FormField>
            </div>
          )}
        </div>
      </div>

      {/* หมวดที่ 3: รูปภาพและการติดต่อ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-2xs space-y-3.5 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          <ImageIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-sm sm:text-base">รูปภาพและการติดต่อ</h3>
        </div>

        {/* Image Uploader */}
        <FormField
          label="รูปภาพสิ่งของ (ไม่บังคับ)"
          error={errors.imageUrl?.message as string | undefined}
          helperText="หากไม่มี จะใช้รูปไอคอนตามหมวดหมู่อัตโนมัติ"
        >
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={(url) => {
                  field.onChange(url);
                  clearErrors("imageUrl");
                }}
              />
            )}
          />
        </FormField>

        {/* Contact */}
        <FormField
          label="ข้อมูลติดต่อ (เบอร์โทร 9-10 หลัก หรืออีเมล)"
          id="contact"
          error={errors.contact?.message as string | undefined}
          required
        >
          <input
            id="contact"
            type="text"
            placeholder="เช่น 0812345678 หรือ student@university.ac.th"
            {...register("contact")}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition"
          />
          <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              เพื่อความเป็นส่วนตัว ข้อมูลติดต่อจะเปิดเผยเฉพาะเมื่อมีคำขอยืนยันที่ได้รับการยอมรับแล้วเท่านั้น
            </span>
          </div>
        </FormField>
      </div>

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-2">
        <Link
          href="/items"
          className="min-h-[42px] sm:min-h-[44px] h-10 sm:h-11 flex items-center justify-center px-4 sm:px-5 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition active:scale-95"
        >
          ยกเลิก
        </Link>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
          className="w-full sm:w-auto min-h-[42px] sm:min-h-[44px] h-10 sm:h-11 text-xs sm:text-sm font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

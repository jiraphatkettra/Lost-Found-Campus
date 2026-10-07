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
  Calendar,
  Lock,
  Save,
  ImageIcon,
} from "lucide-react";

export interface ItemFormProps {
  defaultValues?: Partial<CreateItemInput>;
  onSubmit: (data: CreateItemInput) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function ItemForm({
  defaultValues,
  onSubmit,
  submitLabel = "บันทึกข้อมูล",
  isSubmitting = false,
}: ItemFormProps) {
  const formattedDefaultDate = defaultValues?.date
    ? new Date(defaultValues.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const {
    register,
    handleSubmit,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      type: defaultValues?.type || "LOST",
      title: defaultValues?.title || "",
      category: defaultValues?.category || "BOOK",
      location: defaultValues?.location || "LIBRARY",
      date: formattedDefaultDate,
      description: defaultValues?.description || "",
      contact: defaultValues?.contact || "",
      imageUrl: defaultValues?.imageUrl || "",
    },
    mode: "onBlur",
  });

  const selectedType = watch("type");

  const handleValidSubmit = async (data: any) => {
    await onSubmit(data as CreateItemInput);
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-8">
      {/* หมวดที่ 1: ข้อมูลสิ่งของ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-base">ข้อมูลสิ่งของ</h3>
        </div>

        {/* Type Selection: ของหาย / ของเจอ */}
        <FormField
          label="ประเภทประกาศ"
          error={errors.type?.message as string | undefined}
          required
        >
          <div className="grid grid-cols-2 gap-3 mt-1">
            <label
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer font-semibold text-sm transition ${
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
              <PackageSearch className="w-4 h-4" />
              <span>ของหาย (Lost)</span>
            </label>
            <label
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer font-semibold text-sm transition ${
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
              <Gift className="w-4 h-4" />
              <span>ของที่พบ (Found)</span>
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
            placeholder="เช่น พวงกุญแจหมีสีน้ำตาล, กระเป๋าสตางค์หนังสีดำ, หูฟัง AirPods"
            {...register("title")}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition"
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
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition cursor-pointer"
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
            rows={4}
            placeholder="ระบุจุดสังเกต สี ตำหนิ หรือลักษณะเฉพาะอย่างละเอียด (อย่างน้อย 10 ตัวอักษร)"
            {...register("description")}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition resize-none"
          />
        </FormField>
      </div>

      {/* หมวดที่ 2: สถานที่และเวลา */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-base">สถานที่และเวลา</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="สถานที่ / อาคาร"
            id="location"
            error={errors.location?.message as string | undefined}
            required
          >
            <select
              id="location"
              {...register("location")}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition cursor-pointer"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition"
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* หมวดที่ 3: รูปภาพและการติดต่อ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-base">รูปภาพและการติดต่อ</h3>
        </div>

        {/* Image Uploader */}
        <FormField
          label="รูปภาพสิ่งของ (ไม่บังคับ)"
          error={errors.imageUrl?.message as string | undefined}
          helperText="หากไม่มีรูปภาพ ระบบจะใช้รูปสัญลักษณ์ตามหมวดหมู่อัตโนมัติ"
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
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition"
          />
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              เพื่อความเป็นส่วนตัว ข้อมูลติดต่อจะเปิดเผยเฉพาะเมื่อมีคำขอยืนยันที่ได้รับการตอบรับแล้วเท่านั้น
            </span>
          </div>
        </FormField>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/items"
          className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition"
        >
          ยกเลิก
        </Link>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

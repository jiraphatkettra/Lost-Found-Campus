"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export interface ImageUploaderProps {
  value?: string | null;
  onChange: (value: string) => void;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    setErrorMsg(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      const err = "รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG และ WebP เท่านั้น";
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const err = "ขนาดรูปภาพต้องไม่เกิน 3 MB";
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    // สร้าง local preview แสดงผลทันที
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการอัปโหลด");
      }

      onChange(data.url);
      toast.success("อัปโหลดรูปภาพสำเร็จ");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ไม่สามารถอัปโหลดรูปภาพได้";
      setErrorMsg(msg);
      toast.error(msg);
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    setLocalPreview(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentImageUrl = localPreview || value;

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="image-file-upload-input"
      />

      {currentImageUrl ? (
        <div className="relative inline-block border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-slate-50 dark:bg-slate-900 group">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt="พรีวิวรูปภาพ"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                <Loader2 className="w-5 h-5 animate-spin mb-1" />
                <span className="text-[11px] font-semibold">กำลังอัปโหลด...</span>
              </div>
            )}
          </div>
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-red-600 text-white backdrop-blur-xs transition shadow-sm cursor-pointer"
              aria-label="ลบรูปภาพ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-3.5 sm:p-5 border-2 border-dashed rounded-xl sm:rounded-2xl cursor-pointer transition-colors duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
              : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-2.5 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-1.5" />
              <p className="text-xs sm:text-sm font-medium">กำลังอัปโหลดรูปภาพ...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl mb-1.5 sm:mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                ลากไฟล์มาวางที่นี่ หรือ <span className="text-blue-600 dark:text-blue-400">เลือกไฟล์</span>
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                JPEG, PNG, WebP ขนาดไม่เกิน 3 MB
              </p>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Smartphone,
  BookOpen,
  CreditCard,
  Backpack,
  Shirt,
  KeyRound,
  Package,
  ZoomIn,
  X,
} from "lucide-react";
import { CATEGORY_PLACEHOLDER_MAP, CATEGORY_LABEL_MAP } from "@/lib/constants";

export interface ItemGalleryProps {
  imageUrl?: string | null;
  title: string;
  category: string;
}

export function ItemGallery({ imageUrl, title, category }: ItemGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const placeholderConfig = CATEGORY_PLACEHOLDER_MAP[category] || {
    label: category,
    iconName: "Package",
    gradient: "from-slate-500/10 to-slate-500/20 text-slate-600 dark:text-slate-400",
  };
  const categoryName = CATEGORY_LABEL_MAP[category] || category;

  const renderCategoryIcon = (cat: string) => {
    const iconClass = "w-16 h-16 sm:w-20 sm:h-20 opacity-80";
    switch (cat) {
      case "BOOK":
        return <BookOpen className={iconClass} />;
      case "ELECTRONICS":
        return <Smartphone className={iconClass} />;
      case "CARD":
        return <CreditCard className={iconClass} />;
      case "BAG":
        return <Backpack className={iconClass} />;
      case "CLOTHES":
        return <Shirt className={iconClass} />;
      case "KEYS":
        return <KeyRound className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  return (
    <>
      <div className="w-full lg:sticky lg:top-24 max-h-[min(70vh,560px)]">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 shadow-xs group">
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative w-full h-full block cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl overflow-hidden"
              title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
              aria-label={`ดูรูปภาพขนาดเต็มของ ${title}`}
            >
              {/* ชั้นล่าง: เบลอพื้นหลัง เพื่อให้รูปไม่ว่าสัดส่วนใดดูเต็มกรอบอย่างสวยงาม */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-cover scale-110 blur-2xl opacity-60 dark:opacity-40"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>

              {/* ชั้นบน: รูปจริง object-contain เพื่อไม่ให้เพี้ยนหรือถูกครอป */}
              <div className="relative w-full h-full p-2 sm:p-3">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  priority
                  className="object-contain drop-shadow-xs transition-transform duration-250 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>

              {/* Zoom hint badge */}
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>ขยายรูป</span>
              </span>
            </button>
          ) : (
            /* ไม่มีรูปภาพ: แสดง placeholder ตามหมวดหมู่ในอัตราส่วน 4:3 เท่าเดิม */
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br ${placeholderConfig.gradient}`}
              aria-label={`ไม่มีรูปภาพสำหรับ ${title}`}
            >
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 shadow-2xs mb-3 text-slate-700 dark:text-slate-200">
                {renderCategoryIcon(category)}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {categoryName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ไม่มีรูปภาพประกอบ
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal เมื่อคลิกดูรูปเต็ม */}
      {imageUrl && lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`รูปภาพขนาดเต็มของ ${title}`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="ปิดรูปภาพขนาดเต็ม"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

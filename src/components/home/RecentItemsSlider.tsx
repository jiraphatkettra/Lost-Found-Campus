"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ItemCardData } from "@/types";
import { ItemCard } from "@/components/feature/ItemCard";
import { Reveal } from "@/components/motion/Reveal";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface RecentItemsSliderProps {
  items: ItemCardData[];
}

export function RecentItemsSlider({ items }: RecentItemsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  const total = items.length;

  // เลื่อน scroll container ไปยังการ์ด index ที่กำหนด
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const targetCard = container.children[index] as HTMLElement | undefined;
      if (targetCard) {
        const offsetLeft = targetCard.offsetLeft - container.offsetLeft;
        container.scrollTo({
          left: offsetLeft,
          behavior: "smooth",
        });
      }
    },
    []
  );

  // เลื่อนไปทางขวาอัตโนมัติ (Next slide) สำหรับโทรศัพท์และแท็บเล็ต
  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % total;
      scrollToIndex(next);
      return next;
    });
  }, [total, scrollToIndex]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => {
      const next = (prev - 1 + total) % total;
      scrollToIndex(next);
      return next;
    });
  }, [total, scrollToIndex]);

  // Auto-slide ทุก ๆ 3.5 วินาที เมื่อไม่โดน pause หรือกำลังแตะสัมผัส
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      if (!isInteracting.current) {
        nextSlide();
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  // ตรวจจับ scroll จากการใช้นิ้วปัด (swipe) เพื่อซิงค์ index ของ dot
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth * 0.85; // โดยประมาณ
    if (cardWidth > 0) {
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex >= 0 && newIndex < total && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* 1. Desktop View (>=1024px): Standard 3-column Grid with Staggered Reveal */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Reveal key={item.id} staggerIndex={index}>
            <ItemCard item={item} />
          </Reveal>
        ))}
      </div>

      {/* 2. Mobile & Tablet View (<1024px): Auto-sliding Horizontal Carousel with Reveal */}
      <Reveal className="lg:hidden">
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => {
            isInteracting.current = true;
            setIsPaused(true);
          }}
          onTouchEnd={() => {
            isInteracting.current = false;
            // รอ 2 วิค่อยเริ่ม auto slide ต่อ
            setTimeout(() => setIsPaused(false), 2000);
          }}
        >
          {/* Horizontal Scroll Track */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-[84%] min-[380px]:w-[80%] sm:w-[55%] snap-center transition-transform"
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          {/* Carousel Controls (Mobile / Tablet) */}
          {total > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
            {/* Dots Pagination */}
            <div className="flex items-center gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    scrollToIndex(idx);
                  }}
                  aria-label={`ไปที่ประกาศที่ ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-6 bg-blue-600 dark:bg-blue-400"
                      : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Slide Navigation Buttons & Auto-slide Indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-2xs font-semibold text-slate-400 mr-1">
                {currentIndex + 1} / {total}
              </span>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                aria-label={isPaused ? "เล่นสไลด์อัตโนมัติ" : "หยุดสไลด์ชั่วคราว"}
                title={isPaused ? "เล่นสไลด์อัตโนมัติ" : "หยุดสไลด์ชั่วคราว"}
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={prevSlide}
                aria-label="ก่อนหน้า"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="ถัดไป"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      </Reveal>
    </div>
  );
}

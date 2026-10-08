"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  staggerIndex?: number;
  maxBlur?: number;
  maxDistance?: number;
  startThreshold?: number;
  travelDistance?: number;
  staggerStep?: number;
}

/**
 * Reveal Component (v2.3 Motion Layer):
 * สร้างเอฟเฟกต์ Blur-in + Stagger + Fade-in ผูกกับตำแหน่งการสกรอลล์ (B3, B4, B10)
 * - เลื่อนลง: เบลอ (blur) → คมชัด, เลื่อนขึ้นจากล่างเล็กน้อย, ปรับความสว่างเต็มที่
 * - เลื่อนขึ้น: ย้อนกลับได้อย่างนุ่มนวล (Bidirectional)
 * - รองรับ Progressive Enhancement (No-JS), Reduced Motion, และเข้าถึงด้วยคีย์บอร์ด (Focus)
 */
export function Reveal({
  children,
  className = "",
  as: Component = "div",
  staggerIndex = 0,
  maxBlur,
  maxDistance,
  startThreshold = 0.92,
  travelDistance,
  staggerStep,
}: RevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isIntersectingRef = useRef(false);

  // ตรวจจับและปรับพารามิเตอร์ตามขนาดหน้าจอ (Desktop / Tablet / Mobile)
  const getResponsiveParams = useCallback(() => {
    if (typeof window === "undefined") {
      return {
        blur: maxBlur ?? 10,
        dist: maxDistance ?? 40,
        play: travelDistance ?? 0.35,
        step: staggerStep ?? 0.06,
      };
    }

    const width = window.innerWidth;
    if (width >= 1024) {
      // Desktop
      return {
        blur: maxBlur ?? 10,
        dist: maxDistance ?? 40,
        play: travelDistance ?? 0.35,
        step: staggerStep ?? 0.06,
      };
    } else if (width >= 768) {
      // Tablet
      return {
        blur: maxBlur ?? 8,
        dist: maxDistance ?? 32,
        play: travelDistance ?? 0.4,
        step: staggerStep ?? 0.05,
      };
    } else {
      // Mobile
      return {
        blur: maxBlur ?? 6,
        dist: maxDistance ?? 24,
        play: travelDistance ?? 0.45,
        step: staggerStep ?? 0.04,
      };
    }
  }, [maxBlur, maxDistance, travelDistance, staggerStep]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    // ตรวจจับ Reduced Motion
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-reduced-motion") === "true"
    ) {
      el.style.setProperty("--p", "1");
      el.style.setProperty("--blur", "0px");
      el.style.setProperty("--y", "0px");
      el.style.setProperty("--opacity", "1");
      el.setAttribute("data-active", "complete");
      return;
    }

    const updateMotion = () => {
      if (!containerRef.current || !isIntersectingRef.current) return;
      if (isFocused) {
        containerRef.current.style.setProperty("--p", "1");
        containerRef.current.style.setProperty("--blur", "0px");
        containerRef.current.style.setProperty("--y", "0px");
        containerRef.current.style.setProperty("--opacity", "1");
        containerRef.current.setAttribute("data-active", "complete");
        return;
      }

      const node = containerRef.current;
      const vh = window.innerHeight || 1;
      const rect = node.getBoundingClientRect();
      const { blur, dist, play, step } = getResponsiveParams();

      const startLine = vh * startThreshold;
      const playRange = Math.max(10, vh * play);
      const rawProgress = (startLine - rect.top) / playRange;

      // Stagger (จำกัดไม่เกิน 8 ใบ)
      const staggerOffset = Math.min(staggerIndex, 8) * step;
      const clampedP = Math.max(0, Math.min(1, rawProgress - staggerOffset));

      // Smoothstep easing: 3p^2 - 2p^3
      const smoothP = clampedP * clampedP * (3 - 2 * clampedP);

      const blurValue = Math.max(0, (1 - smoothP) * blur);
      const yValue = (1 - smoothP) * dist;
      const opacityValue = smoothP;

      node.style.setProperty("--p", smoothP.toFixed(3));
      node.style.setProperty("--blur", `${blurValue.toFixed(1)}px`);
      node.style.setProperty("--y", `${yValue.toFixed(1)}px`);
      node.style.setProperty("--opacity", opacityValue.toFixed(3));

      if (smoothP >= 0.999) {
        node.setAttribute("data-active", "complete");
      } else {
        node.removeAttribute("data-active");
      }
    };

    // ใช้ IntersectionObserver ควบคุมการเปิด/ปิดการคำนวณ rAF เฉพาะช่วงที่อยู่ในจอ
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateMotion();
        }
      },
      {
        rootMargin: "80px 0px 80px 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observer.observe(el);

    const onScrollOrResize = () => {
      if (isIntersectingRef.current) {
        updateMotion();
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // คำนวณครั้งแรกเมื่อ mount
    updateMotion();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [
    isFocused,
    startThreshold,
    staggerIndex,
    getResponsiveParams,
  ]);

  // เมื่อเด็กข้างในได้รับ Focus (เช่น Tab เข้ามาที่ลิงก์/ปุ่ม) ให้แสดงผลคมชัดทันที
  const handleFocusCapture = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty("--p", "1");
      containerRef.current.style.setProperty("--blur", "0px");
      containerRef.current.style.setProperty("--y", "0px");
      containerRef.current.style.setProperty("--opacity", "1");
      containerRef.current.setAttribute("data-active", "complete");
    }
  };

  return (
    <Component
      ref={containerRef}
      onFocusCapture={handleFocusCapture}
      className={`motion-reveal ${className}`}
    >
      {children}
    </Component>
  );
}

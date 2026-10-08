"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface ScrollProgressState {
  progress: number;
  scrollY: number;
  isScrolling: boolean;
  isReducedMotion: boolean;
}

const LERP_FACTOR = 0.12;
const SNAP_EPSILON = 0.0005;
const JUMP_DELTA_THRESHOLD = 0.25;

/**
 * Hook สำหรับติดตามความคืบหน้าการสกรอลล์ทั้งหน้า (0.0 ถึง 1.0)
 * พร้อมระบบความเฉื่อย (lerp), ตรวจจับการกระโดดตำแหน่งฉับพลัน,
 * รองรับ reduced-motion และหยุดคำนวณเมื่อแท็บไม่ได้ทำงาน
 */
export function useScrollProgress(): ScrollProgressState {
  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    scrollY: 0,
    isScrolling: false,
    isReducedMotion: false,
  });

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isReducedMotionRef = useRef(false);
  const isTabVisibleRef = useRef(true);

  // คำนวณ target progress จากตำแหน่งสกรอลล์ปัจจุบัน
  const computeTarget = useCallback(() => {
    if (typeof window === "undefined") return { progress: 0, scrollY: 0 };
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const rawProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
    return { progress: rawProgress, scrollY };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ตรวจสอบ prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = mediaQuery.matches;

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
      if (e.matches) {
        currentProgressRef.current = targetProgressRef.current;
        setState((prev) => ({
          ...prev,
          progress: targetProgressRef.current,
          isReducedMotion: true,
        }));
      } else {
        setState((prev) => ({ ...prev, isReducedMotion: false }));
      }
    };
    mediaQuery.addEventListener("change", handleReducedMotionChange);

    // เปิดใช้งาน data-motion="ready" เมื่อ mount เสร็จบนเบราว์เซอร์
    document.documentElement.setAttribute("data-motion", "ready");

    // คำนวณค่าเริ่มต้น
    const initial = computeTarget();
    targetProgressRef.current = initial.progress;
    currentProgressRef.current = initial.progress;
    targetScrollYRef.current = initial.scrollY;

    setState({
      progress: initial.progress,
      scrollY: initial.scrollY,
      isScrolling: false,
      isReducedMotion: isReducedMotionRef.current,
    });

    // Loop อนิเมชั่น Lerp ด้วย requestAnimationFrame
    const updateLoop = () => {
      if (!isTabVisibleRef.current) {
        rafIdRef.current = null;
        return;
      }

      if (isReducedMotionRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        setState((prev) => ({
          ...prev,
          progress: targetProgressRef.current,
          scrollY: targetScrollYRef.current,
          isScrolling: false,
        }));
        rafIdRef.current = null;
        return;
      }

      const diff = targetProgressRef.current - currentProgressRef.current;

      // ตรวจจับการกระโดดตำแหน่งไกล (Anchor click, History Back/Forward, รีเฟรชกลางหน้า)
      if (Math.abs(diff) > JUMP_DELTA_THRESHOLD) {
        currentProgressRef.current = targetProgressRef.current;
      } else if (Math.abs(diff) > SNAP_EPSILON) {
        currentProgressRef.current += diff * LERP_FACTOR;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      setState({
        progress: currentProgressRef.current,
        scrollY: targetScrollYRef.current,
        isScrolling: Math.abs(diff) > SNAP_EPSILON,
        isReducedMotion: false,
      });

      // ถ้ายังไม่ถึงเป้าหมาย ให้รันเฟรมต่อไป
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > SNAP_EPSILON) {
        rafIdRef.current = requestAnimationFrame(updateLoop);
      } else {
        rafIdRef.current = null;
      }
    };

    const startLoop = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateLoop);
      }
    };

    const onScroll = () => {
      const { progress, scrollY } = computeTarget();
      targetProgressRef.current = progress;
      targetScrollYRef.current = scrollY;

      // ถ้ามี Reduced motion ให้อัปเดตทันที
      if (isReducedMotionRef.current) {
        currentProgressRef.current = progress;
        setState((prev) => ({ ...prev, progress, scrollY, isScrolling: false }));
        return;
      }

      startLoop();
    };

    const onResize = () => {
      onScroll();
    };

    // หยุด loop เมื่อแท็บถูกสลับซ่อน (ประหยัดพลังงาน)
    const onVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (isTabVisibleRef.current) {
        onScroll();
      } else if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [computeTarget]);

  return state;
}

export interface ElementScrollOptions {
  startThreshold?: number; // สัดส่วนความสูงจอที่เริ่มเล่น (ค่าเริ่มต้น 0.92 = 92% vh)
  travelDistance?: number; // ระยะเล่นตามสัดส่วน vh (ค่าเริ่มต้น 0.35 = 35% vh)
  staggerIndex?: number;   // ลำดับในการ stagger (0, 1, 2, ...)
  staggerStep?: number;    // ระยะหน่วงต่อดัชนี (ค่าเริ่มต้น 0.06)
  maxBlur?: number;        // blur เริ่มต้น (px)
  maxDistance?: number;    // translateY เริ่มต้น (px)
}

/**
 * Hook สำหรับคำนวณความคืบหน้าของ element แต่ละตัวเมื่อเข้าจอ
 * และเขียนค่า CSS custom properties (--p, --blur, --y, --opacity)
 */
export function useElementProgress(
  elementRef: React.RefObject<HTMLElement | null>,
  options: ElementScrollOptions = {}
) {
  const {
    startThreshold = 0.92,
    travelDistance = 0.35,
    staggerIndex = 0,
    staggerStep = 0.06,
    maxBlur = 10,
    maxDistance = 40,
  } = options;

  const [progress, setProgress] = useState(1); // ค่าเริ่มต้น 1 เพื่อ progressive enhancement
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === "undefined") return;

    // ตรวจจับ prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      el.style.setProperty("--blur", "0px");
      el.style.setProperty("--y", "0px");
      el.style.setProperty("--opacity", "1");
      setProgress(1);
      return;
    }

    const updateElementProgress = () => {
      if (!elementRef.current || !isIntersectingRef.current) return;
      const target = elementRef.current;
      const vh = window.innerHeight || 1;
      const rect = target.getBoundingClientRect();

      const startLine = vh * startThreshold;
      const playDistance = Math.max(10, vh * travelDistance);
      const rawP = (startLine - rect.top) / playDistance;

      // หักลบ Stagger (จำกัดไม่เกิน 8 ชิ้น)
      const clampedStagger = Math.min(staggerIndex, 8) * staggerStep;
      const p = Math.max(0, Math.min(1, rawP - clampedStagger));

      // Smoothstep: p * p * (3 - 2 * p)
      const smoothP = p * p * (3 - 2 * p);

      const blurVal = Math.max(0, (1 - smoothP) * maxBlur);
      const yVal = (1 - smoothP) * maxDistance;
      const opacityVal = smoothP;

      target.style.setProperty("--p", smoothP.toFixed(3));
      target.style.setProperty("--blur", `${blurVal.toFixed(1)}px`);
      target.style.setProperty("--y", `${yVal.toFixed(1)}px`);
      target.style.setProperty("--opacity", opacityVal.toFixed(3));

      setProgress(smoothP);
    };

    // ใช้ IntersectionObserver เปิด/ปิดการคำนวณเฉพาะเมื่อ element ใกล้เข้าจอ
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateElementProgress();
        }
      },
      {
        rootMargin: "100px 0px 100px 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observer.observe(el);

    const onScroll = () => {
      if (isIntersectingRef.current) {
        updateElementProgress();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // คำนวณครั้งแรก
    updateElementProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [
    elementRef,
    startThreshold,
    travelDistance,
    staggerIndex,
    staggerStep,
    maxBlur,
    maxDistance,
  ]);

  return progress;
}

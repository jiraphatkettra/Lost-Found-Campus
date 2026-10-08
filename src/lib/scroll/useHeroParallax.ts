"use client";

import { useEffect } from "react";

/**
 * useHeroParallax: จัดการ Parallax และการหรี่ของส่วน Hero เมื่อเลื่อนลง (B2)
 * - Desktop (>=1024): Parallax 0.5x, Opacity -> 0.35, Blur -> 4px, Scale -> 0.97
 * - Tablet (768-1023): Parallax 0.4x, Opacity -> 0.35, Blur -> 4px, Scale -> 0.97
 * - Mobile (<768): ปิด Parallax, Opacity -> 0.5, ไม่ใช้ Blur และ Scale
 * - หยุดคำนวณทันทีเมื่อเลื่อนพ้น Hero
 */
export function useHeroParallax(heroRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof window === "undefined") return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-reduced-motion") === "true"
    ) {
      el.style.setProperty("--hero-parallax", "0px");
      el.style.setProperty("--hero-opacity", "1");
      el.style.setProperty("--hero-blur", "0px");
      el.style.setProperty("--hero-scale", "1");
      return;
    }

    let rafId: number | null = null;

    const update = () => {
      if (!heroRef.current) return;
      const target = heroRef.current;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const height = target.offsetHeight || 600;
      const width = window.innerWidth;

      if (scrollY <= 0) {
        target.style.setProperty("--hero-parallax", "0px");
        target.style.setProperty("--hero-opacity", "1");
        target.style.setProperty("--hero-blur", "0px");
        target.style.setProperty("--hero-scale", "1");
        rafId = null;
        return;
      }

      // ถ้าเลื่อนพ้น Hero ไปแล้ว ให้หยุดคำนวณ
      if (scrollY > height * 1.4) {
        rafId = null;
        return;
      }

      const ratio = Math.min(1, Math.max(0, scrollY / height));

      if (width >= 1024) {
        // Desktop
        const parallaxY = scrollY * 0.5;
        const opacity = 1 - ratio * 0.65;
        const blur = ratio * 4;
        const scale = 1 - ratio * 0.03;

        target.style.setProperty("--hero-parallax", `${parallaxY.toFixed(1)}px`);
        target.style.setProperty("--hero-opacity", opacity.toFixed(3));
        target.style.setProperty("--hero-blur", `${blur.toFixed(1)}px`);
        target.style.setProperty("--hero-scale", scale.toFixed(3));
      } else if (width >= 768) {
        // Tablet
        const parallaxY = scrollY * 0.4;
        const opacity = 1 - ratio * 0.65;
        const blur = ratio * 4;
        const scale = 1 - ratio * 0.03;

        target.style.setProperty("--hero-parallax", `${parallaxY.toFixed(1)}px`);
        target.style.setProperty("--hero-opacity", opacity.toFixed(3));
        target.style.setProperty("--hero-blur", `${blur.toFixed(1)}px`);
        target.style.setProperty("--hero-scale", scale.toFixed(3));
      } else {
        // Mobile: ไม่เลื่อน Parallax, หรี่ลงอย่างเดียว
        const opacity = 1 - ratio * 0.5;
        target.style.setProperty("--hero-parallax", "0px");
        target.style.setProperty("--hero-opacity", opacity.toFixed(3));
        target.style.setProperty("--hero-blur", "0px");
        target.style.setProperty("--hero-scale", "1");
      }

      rafId = null;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [heroRef]);
}

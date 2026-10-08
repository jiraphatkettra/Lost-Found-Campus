"use client";

import React, { useEffect } from "react";

export interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * MotionProvider: ตัวควบคุมสถานะชั้นการเคลื่อนไหว (Motion Layer)
 * ตั้งค่า data-motion="ready" บน <html> เพื่อเปิดใช้งาน Progressive Enhancement
 * และดูแลการสลับสถานะ reduced-motion อย่างแม่นยำ
 */
export function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // ตั้งค่า data-motion="ready" ยืนยันว่า JS พร้อมทำงาน
    document.documentElement.setAttribute("data-motion", "ready");

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      document.documentElement.setAttribute("data-reduced-motion", "true");
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.setAttribute("data-reduced-motion", "true");
      } else {
        document.documentElement.removeAttribute("data-reduced-motion");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      document.documentElement.removeAttribute("data-motion");
      document.documentElement.removeAttribute("data-reduced-motion");
    };
  }, []);

  return <>{children}</>;
}

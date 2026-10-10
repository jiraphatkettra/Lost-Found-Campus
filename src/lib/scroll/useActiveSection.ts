"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 1. กำหนดชนิดข้อมูลของ Section และสถานะการเลื่อนหน้าจอ
export type SectionItem = {
  id: string;
  label: string;
  sublabel?: string;
  index: number;
};

export const DEFAULT_HOME_SECTIONS: SectionItem[] = [
  { id: "hero", label: "ค้นหาของ", sublabel: "ศูนย์ช่วยเหลือ ม.แม่โจ้", index: 1 },
  { id: "stats", label: "ภาพรวม", sublabel: "สถิติในระบบ", index: 2 },
  { id: "how-it-works", label: "ขั้นตอน", sublabel: "วิธีใช้งาน", index: 3 },
  { id: "latest-items", label: "ล่าสุด", sublabel: "ประกาศสิ่งของ", index: 4 },
  { id: "cta-bottom", label: "เริ่มเลย", sublabel: "สร้างประกาศ", index: 5 },
];

export type ActiveSectionState = {
  activeSection: SectionItem;
  activeIndex: number;
  previousSection: SectionItem | null;
  nextSections: SectionItem[];
  totalSections: number;
};

export type UseActiveSectionOptions = {
  readingLineRatio?: number; // สัดส่วนตำแหน่งเส้นอ่าน (ค่าเริ่มต้น 0.55 = 55% vh)
  sections?: SectionItem[];
};

/**
 * Custom Hook: useActiveSection
 * สำหรับระบุหัวข้อ (Section) ที่กำลังแสดงผลอยู่บนหน้าจอตามการเลื่อน (Scroll Position)
 */
export function useActiveSection(
  options: UseActiveSectionOptions = {}
): ActiveSectionState {
  const { readingLineRatio = 0.55, sections = DEFAULT_HOME_SECTIONS } = options;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const determineActiveSection = useCallback(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const readingLine = window.innerHeight * readingLineRatio;
    let foundIndex = 0;

    // หา section ที่ครอบคลุมเส้นอ่าน หรืออยู่ใกล้ที่สุด
    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= readingLine) {
          foundIndex = i;
        }
      }
    }

    // กรณีเลื่อนลงมาล่างสุด ให้ถือว่า section สุดท้าย active
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 30) {
      foundIndex = sections.length - 1;
    }

    if (foundIndex !== activeIndexRef.current) {
      activeIndexRef.current = foundIndex;
      setActiveIndex(foundIndex);
    }
  }, [sections, readingLineRatio]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    determineActiveSection();

    const onScroll = () => {
      determineActiveSection();
    };

    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const idx = sections.findIndex((s) => s.id === hash);
        if (idx !== -1) {
          activeIndexRef.current = idx;
          setActiveIndex(idx);
          return;
        }
      }
      determineActiveSection();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, [determineActiveSection, sections]);

  const activeSection = sections[activeIndex] || sections[0];
  const previousSection = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const nextSections = sections.slice(activeIndex + 1);

  return {
    activeSection,
    activeIndex,
    previousSection,
    nextSections,
    totalSections: sections.length,
  };
}

"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES, LOCATIONS, ITEM_STATUSES, formatLocationName } from "@/lib/constants";
import {
  Search,
  SlidersHorizontal,
  X,
  PackageSearch,
  Gift,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "new";
  const initialQ = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter changes
      if (key !== "page") {
        params.delete("page");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router]
  );

  // Debounce search input 300 ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (searchParams.get("q") || "")) {
        updateFilter("q", searchTerm);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, searchParams, updateFilter]);

  const clearAllFilters = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const removeSingleFilter = (key: string) => {
    if (key === "q") {
      setSearchTerm("");
    }
    updateFilter(key, "");
  };

  const activeFiltersCount =
    (currentType ? 1 : 0) +
    (currentCategory ? 1 : 0) +
    (currentLocation ? 1 : 0) +
    (currentStatus ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const getCategoryLabel = (val: string) =>
    CATEGORIES.find((c) => c.value === val)?.label || val;
  const getLocationLabel = (val: string) => formatLocationName(val);
  const getStatusLabel = (val: string) =>
    ITEM_STATUSES.find((s) => s.value === val)?.label || val;

  return (
    <div className="space-y-3 mb-6 sm:mb-8">
      {/* Main Filter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-3.5 transition-colors">
        {/* Top Controls: Search Input + Sort + Filter Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ หรือรายละเอียด..."
              className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 min-h-[40px] sm:min-h-[42px] text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition"
            />
          </div>

          {/* Quick Sort Dropdown (Tablet & Desktop) */}
          <div className="hidden sm:flex items-center shrink-0">
            <select
              value={currentSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              aria-label="เรียงลำดับ"
              className="py-2 pl-3 pr-8 min-h-[40px] sm:min-h-[42px] text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="new">ใหม่สุด</option>
              <option value="old">เก่าสุด</option>
            </select>
          </div>

          {/* Filter Modal Trigger Button */}
          <div className="shrink-0">
            <Button
              variant={activeFiltersCount > 0 ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsMobileModalOpen(true)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />}
              className="px-2.5 sm:px-3.5 py-2 min-h-[40px] sm:min-h-[42px] text-xs sm:text-sm whitespace-nowrap"
            >
              <span>ตัวกรอง</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-white text-blue-600 rounded-full text-2xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/*
          Horizontal Scrollable Quick Filter Chips Bar
          Compact, proportionate pill badges
        */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none no-scrollbar">
          {/* All */}
          <button
            type="button"
            onClick={() => updateFilter("type", "")}
            className={`shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              currentType === "" && !currentCategory
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            ทั้งหมด
          </button>

          {/* Lost */}
          <button
            type="button"
            onClick={() => updateFilter("type", "LOST")}
            className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              currentType === "LOST"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40"
            }`}
          >
            <PackageSearch className="w-3.5 h-3.5" />
            <span>ของหาย</span>
          </button>

          {/* Found */}
          <button
            type="button"
            onClick={() => updateFilter("type", "FOUND")}
            className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              currentType === "FOUND"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>ของที่พบ</span>
          </button>

          <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

          {/* Category Chips */}
          {CATEGORIES.map((c) => {
            const isCatActive = currentCategory === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => updateFilter("category", isCatActive ? "" : c.value)}
                className={`shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs transition cursor-pointer whitespace-nowrap ${
                  isCatActive
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 px-1">
          <span className="text-xs text-slate-400 font-medium">ตัวกรอง:</span>

          {currentType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {currentType === "LOST" ? "ของหาย" : "ของที่พบ"}
              <button
                type="button"
                onClick={() => removeSingleFilter("type")}
                className="hover:text-blue-900 cursor-pointer ml-0.5"
                aria-label="ลบตัวกรองประเภท"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
              {getCategoryLabel(currentCategory)}
              <button
                type="button"
                onClick={() => removeSingleFilter("category")}
                className="hover:text-purple-900 cursor-pointer ml-0.5"
                aria-label="ลบตัวกรองหมวดหมู่"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentLocation && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              {getLocationLabel(currentLocation)}
              <button
                type="button"
                onClick={() => removeSingleFilter("location")}
                className="hover:text-emerald-900 cursor-pointer ml-0.5"
                aria-label="ลบตัวกรองสถานที่"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentStatus && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              {getStatusLabel(currentStatus)}
              <button
                type="button"
                onClick={() => removeSingleFilter("status")}
                className="hover:text-amber-900 cursor-pointer ml-0.5"
                aria-label="ลบตัวกรองสถานะ"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              &quot;{searchTerm}&quot;
              <button
                type="button"
                onClick={() => removeSingleFilter("q")}
                className="hover:text-slate-900 cursor-pointer ml-0.5"
                aria-label="ลบคำค้นหา"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-1 cursor-pointer"
          >
            ล้างทั้งหมด
          </button>
        </div>
      )}

      {/* Advanced Filters Modal (Accessible on all screens) */}
      <Modal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        title="ตัวกรองและเรียงลำดับ"
      >
        <div className="space-y-4 pt-1">
          {/* Type Filter */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              ประเภทประกาศ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "", label: "ทั้งหมด" },
                { val: "LOST", label: "ของหาย" },
                { val: "FOUND", label: "ของที่พบ" },
              ].map((t) => (
                <button
                  key={t.val}
                  type="button"
                  onClick={() => updateFilter("type", t.val)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    currentType === t.val
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              หมวดหมู่
            </label>
            <select
              value={currentCategory}
              onChange={(e) => updateFilter("category", e.target.value)}
              aria-label="เลือกหมวดหมู่ในโมดัล"
              className="w-full py-2.5 px-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            >
              <option value="">ทุกหมวดหมู่</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              สถานที่ / อาคาร
            </label>
            <select
              value={currentLocation}
              onChange={(e) => updateFilter("location", e.target.value)}
              aria-label="เลือกสถานที่ในโมดัล"
              className="w-full py-2.5 px-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            >
              <option value="">ทุกสถานที่ / อาคาร</option>
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              สถานะประกาศ
            </label>
            <select
              value={currentStatus}
              onChange={(e) => updateFilter("status", e.target.value)}
              aria-label="เลือกสถานะในโมดัล"
              className="w-full py-2.5 px-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            >
              <option value="">ทุกสถานะ</option>
              {ITEM_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              เรียงลำดับ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateFilter("sort", "new")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  currentSort === "new"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" /> ใหม่ล่าสุด
              </button>
              <button
                type="button"
                onClick={() => updateFilter("sort", "old")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  currentSort === "old"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" /> เก่าที่สุด
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="md"
              onClick={clearAllFilters}
              className="flex-1"
            >
              ล้างทั้งหมด
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsMobileModalOpen(false)}
              className="flex-1"
            >
              ดูผลลัพธ์
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

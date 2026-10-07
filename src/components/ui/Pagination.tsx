"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  total?: number;
  page?: number;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  total = 0,
  page,
  pageSize = 12,
  currentPage,
  totalPages: propTotalPages,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activePage = currentPage ?? page ?? 1;
  const calculatedTotalPages =
    propTotalPages ?? (total > 0 ? Math.ceil(total / pageSize) : 1);

  if (calculatedTotalPages <= 1) return null;

  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || newPage > calculatedTotalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 mt-8">
      {total > 0 ? (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          แสดง{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {(activePage - 1) * pageSize + 1}
          </span>{" "}
          ถึง{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {Math.min(activePage * pageSize, total)}
          </span>{" "}
          จากทั้งหมด{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {total}
          </span>{" "}
          รายการ
        </p>
      ) : (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          หน้า {activePage} จาก {calculatedTotalPages}
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigateToPage(activePage - 1)}
          disabled={activePage <= 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="หน้าก่อนหน้า"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          {activePage} / {calculatedTotalPages}
        </span>

        <button
          onClick={() => navigateToPage(activePage + 1)}
          disabled={activePage >= calculatedTotalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="หน้าถัดไป"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

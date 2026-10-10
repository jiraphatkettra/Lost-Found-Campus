// 1. นำเข้าโมดูลและคอมโพเนนต์
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "@/components/feature/ItemCard";
import { FilterBar } from "@/components/feature/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ItemType, Category, ItemStatus, Prisma } from "@prisma/client";
import { ItemCardData } from "@/types";
import { Plus, AlertTriangle, Layers } from "lucide-react";

// 2. กำหนดชนิดข้อมูลของ Search Parameters (Dynamic Query Props)
export type ItemsPageProps = {
  searchParams: Promise<{
    type?: string;
    q?: string;
    category?: string;
    location?: string;
    status?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
};

// 3. คอมโพเนนต์หน้ารายการของหายและของที่พบ (Server Component)
export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  // อ่านค่าเงื่อนไขการค้นหาจาก URL Parameters
  const params = await searchParams;
  const { type, q, category, location, status, sort = "new" } = params;

  // คำนวณการแบ่งหน้า (Pagination)
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const limit = Math.min(24, Math.max(1, parseInt(params.limit || "12", 10) || 12));
  const skip = (page - 1) * limit;

  // กำหนดเงื่อนไขการกรองข้อมูล (Query Filter)
  const where: Prisma.ItemWhereInput = {
    isHidden: false, // กรองเฉพาะประกาศที่เปิดเผยต่อสาธารณะ
  };

  if (type === "LOST" || type === "FOUND") {
    where.type = type as ItemType;
  }

  if (category) {
    where.category = category as Category;
  }

  if (location) {
    if (location === "OTHER") {
      where.location = { startsWith: "OTHER" };
    } else {
      where.location = location;
    }
  }

  if (status) {
    where.status = status as ItemStatus;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const orderBy: Prisma.ItemOrderByWithRelationInput =
    sort === "old" ? { createdAt: "asc" } : { createdAt: "desc" };

  let items: ItemCardData[] = [];
  let total = 0;
  let isError = false;

  try {
    const [count, fetchedItems] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
    ]);

    total = count;
    items = fetchedItems as ItemCardData[];
  } catch (error) {
    console.error("Error fetching items in items/page.tsx:", error);
    isError = true;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
      {/* ส่วนหัวของหน้าเว็บ (Page Header) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
              พบ {total} รายการ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.3] [text-wrap:balance]">
            รายการของหายและของที่พบ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 [text-wrap:balance]">
            ค้นหา ตรวจสอบรายละเอียด หรือส่งคำขอรับสิ่งของคืนในมหาวิทยาลัยแม่โจ้
          </p>
        </div>

        <Link
          href="/items/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 h-10 sm:h-11 min-h-[40px] sm:min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-blue-600/20 transition active:scale-95 w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>สร้างประกาศใหม่</span>
        </Link>
      </div>

      {/* Filter Component (Sticky on tablet/desktop, natural flow on mobile) */}
      <div className="static sm:sticky sm:top-16 z-20">
        <Suspense
          fallback={
            <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl mb-8" />
          }
        >
          <FilterBar />
        </Suspense>
      </div>

      {/* Content Area */}
      {isError ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-12 text-center my-8 shadow-xs">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-2xl text-rose-600 w-fit mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            เกิดข้อผิดพลาดในการโหลดข้อมูล
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง
          </p>
          <Link
            href="/items"
            className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition"
          >
            ลองใหม่อีกครั้ง
          </Link>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="ไม่พบรายการที่ตรงกับเงื่อนไข"
          description="ลองปรับเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูรายการสิ่งของทั้งหมด"
          action={{
            label: "ล้างตัวกรองและดูทั้งหมด",
            href: "/items",
          }}
        />
      ) : (
        <>
          {/* Items Grid: Mobile 1 col, Tablet 2 cols, Desktop 3 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

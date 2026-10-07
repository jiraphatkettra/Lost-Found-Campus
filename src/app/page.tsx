import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentItemsSlider } from "@/components/home/RecentItemsSlider";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowRight, Sparkles, PlusCircle } from "lucide-react";
import { ItemCardData } from "@/types";

export const revalidate = 60; // แคช 60 วินาทีตามสเปก Section 7.1

export default async function HomePage() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // คำนวณสถิติจากฐานข้อมูลจริง (ไม่นับ isHidden)
  const [searchingCount, returnedCount, recentCount, latestItems] =
    await Promise.all([
      prisma.item.count({
        where: {
          status: "SEARCHING",
          isHidden: false,
        },
      }),
      prisma.item.count({
        where: {
          status: "RETURNED",
          isHidden: false,
        },
      }),
      prisma.item.count({
        where: {
          createdAt: { gte: oneWeekAgo },
          isHidden: false,
        },
      }),
      prisma.item.findMany({
        where: {
          isHidden: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
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

  return (
    <div className="space-y-4">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Stats Strip */}
      <StatsStrip
        searchingCount={searchingCount}
        returnedCount={returnedCount}
        recentCount={recentCount}
      />

      {/* 3. How It Works */}
      <HowItWorks />

      {/* 4. Latest Items */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>อัปเดตล่าสุด</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ประกาศสิ่งของล่าสุด
            </h2>
          </div>

          <Link
            href="/items"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition group self-start sm:self-auto"
          >
            <span>ดูทั้งหมด</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestItems.length === 0 ? (
          <EmptyState
            title="ยังไม่มีประกาศในขณะนี้"
            description="เป็นคนแรกที่แจ้งของหายหรือของที่เก็บได้ เพื่อช่วยเหลือเพื่อน ๆ ในมหาวิทยาลัย"
            action={{
              label: "สร้างประกาศใหม่",
              href: "/items/new",
            }}
          />
        ) : (
          <RecentItemsSlider items={latestItems as unknown as ItemCardData[]} />
        )}
      </section>

      {/* 5. Bottom CTA Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-white text-center shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              พบของที่ไม่มีเจ้าของ หรือทำของสำคัญหาย?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              ร่วมเป็นส่วนหนึ่งในการสร้างสังคมมหาวิทยาลัยที่อบอุ่นและช่วยเหลือซึ่งกันและกัน แจ้งประกาศได้ทันทีในไม่กี่ขั้นตอน
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/items/new?type=FOUND"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-md hover:bg-blue-50 transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>แจ้งเจอของ</span>
              </Link>
              <Link
                href="/items/new?type=LOST"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/30 transition active:scale-95"
              >
                <span>แจ้งของหาย</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

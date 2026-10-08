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
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 60; // แคช 60 วินาทีตามสเปก Section 7.1

export default async function HomePage() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // คำนวณสถิติจากฐานข้อมูลจริง (ไม่นับ isHidden) พร้อมระบบป้องกันกรณีเชื่อมต่อฐานข้อมูลไม่ได้ตอน build บน Vercel
  let searchingCount = 0;
  let returnedCount = 0;
  let recentCount = 0;
  let latestItems: any[] = [];

  try {
    [searchingCount, returnedCount, recentCount, latestItems] =
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
  } catch (error) {
    console.error("Home page: Failed to fetch items/stats from database (check DATABASE_URL):", error);
  }

  return (
    <MotionProvider>
      <div className="space-y-0">
        {/* 1. Hero Section */}
        <div id="hero">
          <Hero />
        </div>

        {/* 2. Stats Strip */}
        <div id="stats">
          <StatsStrip
            searchingCount={searchingCount}
            returnedCount={returnedCount}
            recentCount={recentCount}
          />
        </div>

        {/* 3. How It Works */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* 4. Latest Items */}
        <section id="latest-items" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 lg:py-16">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>อัปเดตล่าสุด</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.3] [text-wrap:balance]">
                  ประกาศสิ่งของล่าสุด
                </h2>
              </div>

              <Link
                href="/items"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition group self-start sm:self-auto py-1"
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          {latestItems.length === 0 ? (
            <EmptyState
              title="ยังไม่มีประกาศในขณะนี้"
              description="เป็นคนแรกที่แจ้งของหายหรือของที่เก็บได้ เพื่อช่วยเหลือเพื่อน ๆ ใน ม.แม่โจ้"
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
        <section id="cta-bottom" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 lg:py-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-10 lg:p-12 text-white text-center shadow-xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-[1.3] [text-wrap:balance]">
                  พบของที่ไม่มีเจ้าของ หรือทำของสำคัญหาย?
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed [text-wrap:balance] max-w-xl mx-auto">
                  ร่วมเป็นส่วนหนึ่งในการสร้างสังคมมหาวิทยาลัยแม่โจ้ที่อบอุ่นและช่วยเหลือซึ่งกันและกัน แจ้งประกาศได้ทันทีในไม่กี่ขั้นตอน
                </p>
                <div className="pt-2 flex flex-col min-[380px]:flex-row justify-center gap-2.5 sm:gap-3.5 max-w-md mx-auto">
                  <Link
                    href="/items/new?type=FOUND"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 h-12 min-h-[48px] rounded-xl bg-white text-blue-600 font-bold text-xs min-[360px]:text-sm shadow-md hover:bg-blue-50 transition active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4 shrink-0" />
                    <span>แจ้งเจอของ</span>
                  </Link>
                  <Link
                    href="/items/new?type=LOST"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 h-12 min-h-[48px] rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs min-[360px]:text-sm border border-blue-400/30 transition active:scale-95"
                  >
                    <span>แจ้งของหาย</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </MotionProvider>
  );
}

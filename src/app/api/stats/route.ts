import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // แคชที่เซิร์ฟเวอร์ 60 วินาทีตามข้อ 7.1

export async function GET() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [searchingCount, returnedCount, recentCount] = await Promise.all([
      prisma.item.count({
        where: { status: "SEARCHING", isHidden: false },
      }),
      prisma.item.count({
        where: { status: "RETURNED", isHidden: false },
      }),
      prisma.item.count({
        where: {
          createdAt: { gte: oneWeekAgo },
          isHidden: false,
        },
      }),
    ]);

    return NextResponse.json({
      searchingCount,
      returnedCount,
      recentCount,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลสถิติได้" },
      { status: 500 }
    );
  }
}

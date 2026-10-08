import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/admin/stats - สถิติภาพรวมระบบทั้งหมด (ADMIN เท่านั้น)
export async function GET() {
  try {
    const session = await auth();
    // @ts-expect-error - session user role
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้ดูแลระบบ" },
        { status: 403 }
      );
    }

    const [
      totalItems,
      lostItems,
      foundItems,
      returnedItems,
      hiddenItems,
      totalUsers,
      totalReports,
      openReports,
      totalClaims,
      pendingClaims,
      recentItems,
    ] = await Promise.all([
      prisma.item.count(),
      prisma.item.count({ where: { type: "LOST" } }),
      prisma.item.count({ where: { type: "FOUND" } }),
      prisma.item.count({ where: { status: "RETURNED" } }),
      prisma.item.count({ where: { isHidden: true } }),
      prisma.user.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.claim.count(),
      prisma.claim.count({ where: { status: "PENDING" } }),
      prisma.item.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          type: true,
          category: true,
          status: true,
          isHidden: true,
          createdAt: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        totalItems,
        lostItems,
        foundItems,
        returnedItems,
        hiddenItems,
        totalUsers,
        totalReports,
        openReports,
        totalClaims,
        pendingClaims,
        recentItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงสถิติภาพรวม" },
      { status: 500 }
    );
  }
}

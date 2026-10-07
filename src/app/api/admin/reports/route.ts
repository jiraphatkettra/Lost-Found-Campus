import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/admin/reports - ดึงรายการรายงานทั้งหมด (ADMIN เท่านั้น)
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

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
            location: true,
            status: true,
            isHidden: true,
            imageUrl: true,
            ownerId: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/reports error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงรายการรายงาน" },
      { status: 500 }
    );
  }
}

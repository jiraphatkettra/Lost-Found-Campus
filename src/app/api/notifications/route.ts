import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/notifications - ดึงรายการแจ้งเตือนและจำนวนที่ยังไม่อ่าน
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนดูการแจ้งเตือน" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({
        where: {
          userId,
          readAt: null,
        },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return NextResponse.json(
      {
        unreadCount,
        notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงการแจ้งเตือน" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - ทำเครื่องหมายว่าอ่านแล้ว (เฉพาะรายการ หรือทั้งหมด)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { all, ids } = body;

    const now = new Date();

    if (all) {
      await prisma.notification.updateMany({
        where: {
          userId,
          readAt: null,
        },
        data: {
          readAt: now,
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (Array.isArray(ids) && ids.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId,
        },
        data: {
          readAt: now,
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: "กรุณาระบุ ids หรือ all: true" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการแจ้งเตือน" },
      { status: 500 }
    );
  }
}

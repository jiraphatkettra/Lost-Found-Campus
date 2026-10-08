import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET /api/admin/users - รายชื่อผู้ใช้ทั้งหมดในระบบ (ADMIN เท่านั้น)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    // @ts-expect-error - session user role
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้ดูแลระบบ" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const role = searchParams.get("role");

    const where: Prisma.UserWhereInput = {};

    if (role && (role === "USER" || role === "ADMIN")) {
      where.role = role;
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            items: true,
            claims: true,
          },
        },
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงรายชื่อผู้ใช้" },
      { status: 500 }
    );
  }
}

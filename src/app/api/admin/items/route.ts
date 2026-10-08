import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ItemType, Category, ItemStatus, Prisma } from "@prisma/client";

// GET /api/admin/items - ดึงรายการประกาศทั้งหมดในระบบสำหรับ Admin (รวมประกาศที่ถูกซ่อน)
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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const q = searchParams.get("q")?.trim();
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const visibility = searchParams.get("visibility"); // ALL | VISIBLE | HIDDEN
    const sort = searchParams.get("sort") || "new";

    const where: Prisma.ItemWhereInput = {};

    if (type && (type === "LOST" || type === "FOUND")) {
      where.type = type as ItemType;
    }

    if (category && category !== "ALL") {
      where.category = category as Category;
    }

    if (status && status !== "ALL") {
      where.status = status as ItemStatus;
    }

    if (visibility === "VISIBLE") {
      where.isHidden = false;
    } else if (visibility === "HIDDEN") {
      where.isHidden = true;
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
        { owner: { name: { contains: q } } },
        { owner: { email: { contains: q } } },
      ];
    }

    const orderBy: Prisma.ItemOrderByWithRelationInput =
      sort === "old" ? { createdAt: "asc" } : { createdAt: "desc" };

    const [total, items] = await Promise.all([
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
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              claims: true,
              reports: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("GET /api/admin/items error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงรายการประกาศสำหรับแอดมิน" },
      { status: 500 }
    );
  }
}

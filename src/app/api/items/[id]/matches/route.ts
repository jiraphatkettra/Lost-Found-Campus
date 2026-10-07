import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { findMatchingItems } from "@/lib/match";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/items/[id]/matches - ดึงรายการที่น่าจะตรงกัน (สูงสุด 5 รายการ)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "ไม่พบประกาศนี้" }, { status: 404 });
    }

    const matches = await findMatchingItems(item);

    const sanitizedMatches = matches.map((m) => ({
      ...m,
      contact: session?.user ? m.contact : "ล็อกอินเพื่อดูข้อมูลติดต่อ",
    }));

    return NextResponse.json(sanitizedMatches, { status: 200 });
  } catch (error) {
    console.error("GET /api/items/[id]/matches error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการคำนวณรายการที่ตรงกัน" },
      { status: 500 }
    );
  }
}

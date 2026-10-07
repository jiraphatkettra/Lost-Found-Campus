import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkItemOwnership } from "@/lib/permissions";
import { ItemStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: ItemStatus[] = ["SEARCHING", "FOUND", "RETURNED"];

// PATCH /api/items/[id]/status - เปลี่ยนสถานะประกาศ (เฉพาะเจ้าของ)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    const ownership = await checkItemOwnership(id, session?.user?.id);
    if (!ownership.authorized) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: "สถานะไม่ถูกต้อง",
          details: { status: "สถานะต้องเป็น SEARCHING, FOUND หรือ RETURNED" },
        },
        { status: 400 }
      );
    }

    // กฎ v2 [MUST]: เมื่อประกาศเปลี่ยนเป็น RETURNED ให้ Claim ที่ยัง PENDING ทั้งหมดกลายเป็น CANCELLED
    const updatedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.item.update({
        where: { id },
        data: { status: status as ItemStatus },
      });

      if (status === "RETURNED") {
        await tx.claim.updateMany({
          where: {
            itemId: id,
            status: "PENDING",
          },
          data: {
            status: "CANCELLED",
          },
        });
      }

      return item;
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/items/[id]/status error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะประกาศ" },
      { status: 500 }
    );
  }
}

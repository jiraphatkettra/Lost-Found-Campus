import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notify";
import { ItemStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/items/[id] - ปรับปรุงสถานะ หรือสลับซ่อน/แสดงประกาศ (ADMIN เท่านั้น)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    // @ts-expect-error - session user role
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้" },
        { status: 403 }
      );
    }

    const { id: itemId } = await params;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "ไม่พบข้อมูลประกาศนี้" }, { status: 404 });
    }

    const body = await request.json();
    const { action, isHidden, status } = body;

    if (action === "TOGGLE_HIDE" || typeof isHidden === "boolean") {
      const nextHiddenState = typeof isHidden === "boolean" ? isHidden : !item.isHidden;

      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.item.update({
          where: { id: itemId },
          data: { isHidden: nextHiddenState },
        });

        if (nextHiddenState) {
          await createNotification(
            {
              userId: item.ownerId,
              type: "ITEM_HIDDEN",
              title: "ประกาศของคุณถูกซ่อนโดยผู้ดูแลระบบ",
              body: `ประกาศ "${item.title}" ถูกระงับการแสดงผลโดยผู้ดูแลระบบ กรุณาตรวจสอบความถูกต้องของข้อมูล`,
              link: `/items/${item.id}`,
            },
            tx
          );
        }

        return res;
      });

      return NextResponse.json(updated, { status: 200 });
    }

    if (action === "SET_STATUS" && status) {
      if (!["SEARCHING", "FOUND", "RETURNED"].includes(status)) {
        return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
      }

      const updated = await prisma.item.update({
        where: { id: itemId },
        data: { status: status as ItemStatus },
      });

      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json({ error: "คำสั่งไม่ถูกต้อง" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/admin/items/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลประกาศ" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/items/[id] - ลบประกาศอย่างถาวร (ADMIN เท่านั้น)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    // @ts-expect-error - session user role
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้" },
        { status: 403 }
      );
    }

    const { id: itemId } = await params;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "ไม่พบข้อมูลประกาศนี้" }, { status: 404 });
    }

    await prisma.item.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      { message: `ลบประกาศ "${item.title}" สำเร็จเรียบร้อยแล้ว` },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/items/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบประกาศ" },
      { status: 500 }
    );
  }
}

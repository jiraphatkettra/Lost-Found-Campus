import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateItemSchema } from "@/lib/schemas";
import { checkItemOwnership } from "@/lib/permissions";
import { canViewItemContact } from "@/lib/contact-visibility";
import { ItemType, Category } from "@prisma/client";
import { ZodError } from "zod";

function formatZodErrors(error: ZodError) {
  const details: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (field && !details[field]) {
      details[field] = issue.message;
    }
  }
  return details;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/items/[id] - ดูรายละเอียดประกาศ
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "ไม่พบข้อมูลประกาศนี้" }, { status: 404 });
    }

    // กฎ 4.4: ถ้าถูกซ่อน (isHidden) เฉพาะเจ้าของหรือ ADMIN เท่านั้นที่มองเห็นได้
    const isOwner = session?.user?.id === item.ownerId;
    // @ts-expect-error - session user role
    const isAdmin = session?.user?.role === "ADMIN";

    if (item.isHidden && !isOwner && !isAdmin) {
      return NextResponse.json({ error: "ไม่พบข้อมูลประกาศนี้" }, { status: 404 });
    }

    // กฎ 4.1 [MUST]: ตรวจสอบการเปิดเผยข้อมูลติดต่อ
    const canSeeContact = await canViewItemContact(
      item.id,
      item.ownerId,
      session?.user
        ? {
            id: session.user.id,
            // @ts-expect-error - session user role
            role: session.user.role,
          }
        : null
    );

    const sanitizedItem = {
      ...item,
      contact: canSeeContact ? item.contact : null,
    };

    return NextResponse.json(sanitizedItem, { status: 200 });
  } catch (error) {
    console.error("GET /api/items/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลประกาศ" },
      { status: 500 }
    );
  }
}

// PUT /api/items/[id] - แก้ไขประกาศ (เฉพาะเจ้าของ)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const validation = updateItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
          details: formatZodErrors(validation.error),
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const resolvedLocation =
      data.location === "OTHER" && data.customLocation?.trim()
        ? `OTHER: ${data.customLocation.trim()}`
        : data.location;

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type as ItemType }),
        ...(data.title && { title: data.title }),
        ...(data.category && { category: data.category as Category }),
        ...(resolvedLocation && { location: resolvedLocation }),
        ...(data.date && { date: data.date }),
        ...(data.description && { description: data.description }),
        ...(data.contact && { contact: data.contact }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("PUT /api/items/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขประกาศ" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - ลบประกาศ (เฉพาะเจ้าของ)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ลบประกาศสำเร็จ" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/items/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบประกาศ" },
      { status: 500 }
    );
  }
}

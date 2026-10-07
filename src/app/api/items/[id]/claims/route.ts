import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createClaimSchema } from "@/lib/schemas";
import { checkClaimRateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notify";
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

// GET /api/items/[id]/claims - ดึงรายการ Claim ของประกาศ (เฉพาะเจ้าของประกาศ หรือ ADMIN)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนดูรายการคำขอ" },
        { status: 401 }
      );
    }

    const { id: itemId } = await params;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, ownerId: true },
    });

    if (!item) {
      return NextResponse.json({ error: "ไม่พบประกาศนี้" }, { status: 404 });
    }

    // @ts-expect-error - session user role
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.id === item.ownerId;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์ดูรายการคำขอของประกาศนี้" },
        { status: 403 }
      );
    }

    const claims = await prisma.claim.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
      include: {
        claimant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(claims, { status: 200 });
  } catch (error) {
    console.error("GET /api/items/[id]/claims error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงรายการคำขอ" },
      { status: 500 }
    );
  }
}

// POST /api/items/[id]/claims - ส่ง Claim ขอรับของหรือแจ้งว่าเจอ
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนส่งคำขอ" },
        { status: 401 }
      );
    }

    const { id: itemId } = await params;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "ไม่พบประกาศนี้" }, { status: 404 });
    }

    // กฎ v2 [MUST]: ห้าม Claim ประกาศของตัวเอง
    if (item.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "ไม่สามารถส่งคำขอรับของในประกาศของตนเองได้" },
        { status: 403 }
      );
    }

    // กฎ v2 [MUST]: ห้าม Claim ประกาศที่ RETURNED หรือ isHidden = true
    if (item.status === "RETURNED" || item.isHidden) {
      return NextResponse.json(
        { error: "ประกาศนี้ปิดรับคำขอแล้วหรือส่งคืนเรียบร้อยแล้ว" },
        { status: 400 }
      );
    }

    // Rate Limit (สูงสุด 20 รายการ / 24 ชั่วโมง)
    const rateCheck = await checkClaimRateLimit(session.user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.message },
        { status: 429 }
      );
    }

    // กฎ v2 [MUST]: ผู้ใช้หนึ่งคนมี Claim ที่ PENDING หรือ ACCEPTED ได้ 1 รายการต่อ 1 ประกาศ
    const existingActiveClaim = await prisma.claim.findFirst({
      where: {
        itemId,
        claimantId: session.user.id,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existingActiveClaim) {
      return NextResponse.json(
        { error: "คุณมีคำขอที่อยู่ระหว่างดำเนินการสำหรับประกาศนี้อยู่แล้ว" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const validation = createClaimSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
          details: formatZodErrors(validation.error),
        },
        { status: 400 }
      );
    }

    const { message, claimantContact } = validation.data;

    // สร้าง Claim และการแจ้งเตือน CLAIM_RECEIVED ใน Transaction เดียวกัน [MUST]
    const newClaim = await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: {
          itemId,
          claimantId: session.user!.id!,
          message,
          claimantContact,
          status: "PENDING",
        },
        include: {
          claimant: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      await createNotification(
        {
          userId: item.ownerId,
          type: "CLAIM_RECEIVED",
          title: `มีคำขอใหม่สำหรับ "${item.title}"`,
          body: `${session.user?.name || "มีผู้ใช้"} ได้ส่งคำขอยืนยันสำหรับประกาศของคุณ`,
          link: `/items/${item.id}`,
        },
        tx
      );

      return claim;
    });

    return NextResponse.json(newClaim, { status: 201 });
  } catch (error) {
    console.error("POST /api/items/[id]/claims error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งคำขอ" },
      { status: 500 }
    );
  }
}

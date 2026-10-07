import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateClaimSchema } from "@/lib/schemas";
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

// PATCH /api/claims/[id] - จัดการสถานะ Claim (ACCEPT/REJECT โดยเจ้าของประกาศ, CANCEL โดยผู้ขอ)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนจัดการคำขอ" },
        { status: 401 }
      );
    }

    const { id: claimId } = await params;
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        item: true,
      },
    });

    if (!claim) {
      return NextResponse.json({ error: "ไม่พบคำขอนี้" }, { status: 404 });
    }

    const body = await request.json();
    const validation = updateClaimSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "คำสั่งไม่ถูกต้อง",
          details: formatZodErrors(validation.error),
        },
        { status: 400 }
      );
    }

    const { action } = validation.data;
    const userId = session.user.id;

    if (action === "ACCEPT" || action === "REJECT") {
      // เฉพาะเจ้าของประกาศเท่านั้นที่สามารถ ACCEPT หรือ REJECT ได้
      if (claim.item.ownerId !== userId) {
        return NextResponse.json(
          { error: "คุณไม่ใช่เจ้าของประกาศนี้ จึงไม่สามารถตอบรับหรือปฏิเสธคำขอได้" },
          { status: 403 }
        );
      }

      if (claim.status !== "PENDING") {
        return NextResponse.json(
          { error: `ไม่สามารถดำเนินการได้เนื่องจากคำขอนี้มีสถานะเป็น ${claim.status} อยู่แล้ว` },
          { status: 400 }
        );
      }

      const targetStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
      const notifType = action === "ACCEPT" ? "CLAIM_ACCEPTED" : "CLAIM_REJECTED";
      const notifTitle =
        action === "ACCEPT"
          ? `คำขอสำหรับ "${claim.item.title}" ได้รับการตอบรับแล้ว`
          : `คำขอสำหรับ "${claim.item.title}" ถูกปฏิเสธ`;
      const notifBody =
        action === "ACCEPT"
          ? "เจ้าของประกาศตอบรับคำขอของคุณแล้ว ตอนนี้คุณสามารถดูข้อมูลติดต่อของเจ้าของได้ทันที"
          : "เจ้าของประกาศได้ปฏิเสธคำขอยืนยันนี้";

      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.claim.update({
          where: { id: claimId },
          data: { status: targetStatus },
        });

        await createNotification(
          {
            userId: claim.claimantId,
            type: notifType,
            title: notifTitle,
            body: notifBody,
            link: `/items/${claim.item.id}`,
          },
          tx
        );

        return res;
      });

      return NextResponse.json(updated, { status: 200 });
    } else if (action === "CANCEL") {
      // ผู้ขอยกเลิกได้เฉพาะของตนเอง และต้องยังเป็น PENDING
      if (claim.claimantId !== userId) {
        return NextResponse.json(
          { error: "คุณไม่มีสิทธิ์ยกเลิกคำขอนี้" },
          { status: 403 }
        );
      }

      if (claim.status !== "PENDING") {
        return NextResponse.json(
          { error: "สามารถยกเลิกได้เฉพาะคำขอที่ยังอยู่ระหว่างดำเนินการ (PENDING) เท่านั้น" },
          { status: 400 }
        );
      }

      const updated = await prisma.claim.update({
        where: { id: claimId },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json({ error: "คำสั่งไม่ถูกต้อง" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/claims/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการจัดการคำขอ" },
      { status: 500 }
    );
  }
}

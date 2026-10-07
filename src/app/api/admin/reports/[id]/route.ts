import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateReportSchema } from "@/lib/schemas";
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

// PATCH /api/admin/reports/[id] - ดำเนินการกับรายงาน (HIDE_ITEM / DISMISS) (ADMIN เท่านั้น)
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

    const { id: reportId } = await params;
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { item: true },
    });

    if (!report) {
      return NextResponse.json({ error: "ไม่พบข้อมูลรายงานนี้" }, { status: 404 });
    }

    const body = await request.json();
    const validation = updateReportSchema.safeParse(body);

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

    if (action === "HIDE_ITEM") {
      const updated = await prisma.$transaction(async (tx) => {
        const resolvedReport = await tx.report.update({
          where: { id: reportId },
          data: { status: "RESOLVED" },
        });

        await tx.item.update({
          where: { id: report.itemId },
          data: { isHidden: true },
        });

        await createNotification(
          {
            userId: report.item.ownerId,
            type: "ITEM_HIDDEN",
            title: "ประกาศของคุณถูกซ่อนโดยผู้ดูแลระบบ",
            body: `ประกาศ "${report.item.title}" ถูกระงับการแสดงผลหลังจากการตรวจสอบรายงาน`,
            link: `/items/${report.itemId}`,
          },
          tx
        );

        return resolvedReport;
      });

      return NextResponse.json(updated, { status: 200 });
    } else if (action === "DISMISS") {
      const dismissed = await prisma.report.update({
        where: { id: reportId },
        data: { status: "DISMISSED" },
      });

      return NextResponse.json(dismissed, { status: 200 });
    }

    return NextResponse.json({ error: "คำสั่งไม่ถูกต้อง" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/admin/reports/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการจัดการรายงาน" },
      { status: 500 }
    );
  }
}

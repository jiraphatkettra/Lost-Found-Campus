import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createReportSchema } from "@/lib/schemas";
import { checkReportRateLimit } from "@/lib/rate-limit";
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

// POST /api/items/[id]/report - รายงานประกาศ (ต้องล็อกอิน)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนรายงานประกาศ" },
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

    // Rate Limit (สูงสุด 10 รายการ / 24 ชั่วโมง)
    const rateCheck = await checkReportRateLimit(session.user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.message },
        { status: 429 }
      );
    }

    // ตรวจสอบว่าเคยรายงานประกาศนี้ไปแล้วหรือไม่
    const existingReport = await prisma.report.findUnique({
      where: {
        itemId_reporterId: {
          itemId,
          reporterId: session.user.id,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "คุณได้ส่งรายงานสำหรับประกาศนี้ไปแล้ว" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const validation = createReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
          details: formatZodErrors(validation.error),
        },
        { status: 400 }
      );
    }

    const { reason, detail } = validation.data;

    const report = await prisma.report.create({
      data: {
        itemId,
        reporterId: session.user.id,
        reason,
        detail: detail || null,
        status: "OPEN",
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("POST /api/items/[id]/report error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งรายงาน" },
      { status: 500 }
    );
  }
}

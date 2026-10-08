import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createItemSchema, listItemsQuerySchema } from "@/lib/schemas";
import { ItemType, Category, ItemStatus, Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { checkItemRateLimit } from "@/lib/rate-limit";
import { findMatchingItems } from "@/lib/match";
import { createNotificationsBatch } from "@/lib/notify";

// ฟังก์ชันจัดรูปแบบ Zod Error ให้ตรงกับ contract: { error: string, details?: Record<string, string> }
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

// GET /api/items - ดึงรายการประกาศทั้งหมด พร้อม filter, pagination, sort
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parseQuery = listItemsQuerySchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 12,
      sort: searchParams.get("sort") ?? "new",
      q: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const queryData = parseQuery.success
      ? parseQuery.data
      : { page: 1, limit: 12, sort: "new" as const };

    const page = Math.max(1, queryData.page);
    const limit = Math.min(24, Math.max(1, queryData.limit));
    const skip = (page - 1) * limit;

    const location = searchParams.get("location");

    // ซ่อนประกาศที่ isHidden = true เสมอจากรายการสาธารณะ
    const where: Prisma.ItemWhereInput = {
      isHidden: false,
    };

    if (queryData.type) {
      where.type = queryData.type as ItemType;
    }

    if (queryData.category) {
      where.category = queryData.category as Category;
    }

    if (location) {
      if (location === "OTHER") {
        where.location = { startsWith: "OTHER" };
      } else {
        where.location = location;
      }
    }

    if (queryData.status) {
      where.status = queryData.status as ItemStatus;
    }

    if (queryData.q) {
      where.OR = [
        { title: { contains: queryData.q } },
        { description: { contains: queryData.q } },
      ];
    }

    const orderBy: Prisma.ItemOrderByWithRelationInput =
      queryData.sort === "old"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

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
              image: true,
            },
          },
        },
      }),
    ]);

    // กฎ v2 [MUST]: ตัดฟิลด์ contact ออกจาก response รายการสาธารณะอย่างเข้มงวด
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitizedItems = items.map(({ contact: _, ...rest }) => rest);

    return NextResponse.json(
      {
        items: sanitizedItems,
        total,
        page,
        pageSize: limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลประกาศ" },
      { status: 500 }
    );
  }
}

// POST /api/items - สร้างประกาศใหม่ (ต้องล็อกอิน)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนสร้างประกาศ" },
        { status: 401 }
      );
    }

    // Rate Limit (สูงสุด 10 รายการ / 24 ชั่วโมง)
    const rateCheck = await checkItemRateLimit(session.user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.message },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = createItemSchema.safeParse(body);

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

    const newItem = await prisma.item.create({
      data: {
        type: data.type as ItemType,
        title: data.title,
        category: data.category as Category,
        location: resolvedLocation,
        date: data.date,
        description: data.description,
        contact: data.contact,
        imageUrl: data.imageUrl || null,
        ownerId: session.user.id,
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

    // ตรวจสอบความตรงกันเพื่อส่งการแจ้งเตือน MATCH_FOUND (คะแนน >= 3, สูงสุด 5 คน)
    try {
      const matches = await findMatchingItems(newItem);
      const notifications = matches
        .filter((match) => match.ownerId !== session.user?.id)
        .slice(0, 5)
        .map((match) => ({
          userId: match.ownerId,
          type: "MATCH_FOUND" as const,
          title: `พบประกาศที่อาจตรงกับ "${match.title}"`,
          body: `มีผู้แจ้งประกาศ "${newItem.title}" ที่มีคุณสมบัติและสถานที่ใกล้เคียงกัน`,
          link: `/items/${newItem.id}`,
        }));

      if (notifications.length > 0) {
        await createNotificationsBatch(notifications);
      }
    } catch (matchErr) {
      console.error("Match notification error:", matchErr);
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างประกาศ" },
      { status: 500 }
    );
  }
}

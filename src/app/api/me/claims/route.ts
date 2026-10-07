import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/me/claims?role=received|sent
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนดูรายการคำขอของคุณ" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "sent";
    const userId = session.user.id;

    if (role === "received") {
      // คำขอที่ผู้ใช้อื่นส่งเข้ามายังประกาศของเรา
      const claims = await prisma.claim.findMany({
        where: {
          item: {
            ownerId: userId,
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          item: {
            select: {
              id: true,
              title: true,
              type: true,
              category: true,
              location: true,
              status: true,
              imageUrl: true,
              contact: true,
              ownerId: true,
            },
          },
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
    } else {
      // คำขอที่ผู้ใช้ส่งไปหาประกาศของผู้อื่น
      const claims = await prisma.claim.findMany({
        where: {
          claimantId: userId,
        },
        orderBy: { createdAt: "desc" },
        include: {
          item: {
            select: {
              id: true,
              title: true,
              type: true,
              category: true,
              location: true,
              status: true,
              imageUrl: true,
              contact: true,
              ownerId: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      // กฎ 4.1: ถ้า status ของ claim ไม่ใช่ ACCEPTED ให้ตัด contact ของ item ออก
      const sanitizedClaims = claims.map((claim) => {
        const canSeeContact = claim.status === "ACCEPTED";
        return {
          ...claim,
          item: {
            ...claim.item,
            contact: canSeeContact ? claim.item.contact : null,
          },
        };
      });

      return NextResponse.json(sanitizedClaims, { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/me/claims error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ" },
      { status: 500 }
    );
  }
}

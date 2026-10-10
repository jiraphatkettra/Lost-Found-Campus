import { prisma } from "@/lib/prisma";

// กำหนดชนิดข้อมูลบริบทของผู้ใช้งานที่กำลังดูประกาศ
export type ViewerContext = {
  id?: string | null;
  role?: string | null;
};

/**
 * ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึงข้อมูลติดต่อของผู้ลงประกาศ
 * เพื่อความปลอดภัยและความเป็นส่วนตัว อนุญาตให้ดูได้เฉพาะกรณี:
 * 1. เจ้าของประกาศ
 * 2. ผู้ดูแลระบบ (ADMIN)
 * 3. ผู้ที่มีคำขอ (Claim) สถานะ ACCEPTED ในประกาศนั้น
 */
export async function canViewItemContact(
  itemId: string,
  itemOwnerId: string,
  viewer?: ViewerContext | null
): Promise<boolean> {
  if (!viewer?.id) {
    return false;
  }

  // 1. เจ้าของประกาศ
  if (viewer.id === itemOwnerId) {
    return true;
  }

  // 2. ผู้ดูแลระบบ (ADMIN)
  if (viewer.role === "ADMIN") {
    return true;
  }

  // 3. ผู้ใช้งานที่ได้รับการยอมรับคำขอ (Claim Status: ACCEPTED)
  const acceptedClaim = await prisma.claim.findFirst({
    where: {
      itemId,
      claimantId: viewer.id,
      status: "ACCEPTED",
    },
    select: { id: true },
  });

  return Boolean(acceptedClaim);
}

import { prisma } from "@/lib/prisma";

export interface ViewerContext {
  id?: string | null;
  role?: string | null;
}

/**
 * กฎการเปิดเผยข้อมูลติดต่อ (Item.contact) [MUST]:
 * เปิดเผยเฉพาะเมื่อผู้ดูเป็นอย่างใดอย่างหนึ่ง:
 * 1. เจ้าของประกาศ
 * 2. ADMIN
 * 3. ผู้ที่มี Claim สถานะ ACCEPTED ในประกาศนั้น
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

  // 2. ADMIN
  if (viewer.role === "ADMIN") {
    return true;
  }

  // 3. ผู้ที่มี Claim สถานะ ACCEPTED ในประกาศนั้น
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

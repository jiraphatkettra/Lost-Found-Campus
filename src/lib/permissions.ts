import { prisma } from "@/lib/prisma";

export function isItemOwner(ownerId: string, userId?: string | null): boolean {
  if (!userId) return false;
  return ownerId === userId;
}

export async function checkItemOwnership(itemId: string, userId?: string | null) {
  if (!userId) {
    return { authorized: false, status: 401, error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ", item: null };
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    return { authorized: false, status: 404, error: "ไม่พบข้อมูลประกาศนี้", item: null };
  }

  if (item.ownerId !== userId) {
    return { authorized: false, status: 403, error: "คุณไม่มีสิทธิ์แก้ไขหรือลบประกาศนี้", item };
  }

  return { authorized: true, status: 200, error: null, item };
}

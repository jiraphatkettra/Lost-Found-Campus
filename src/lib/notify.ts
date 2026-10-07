import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type NotificationType =
  | "CLAIM_RECEIVED"
  | "CLAIM_ACCEPTED"
  | "CLAIM_REJECTED"
  | "MATCH_FOUND"
  | "ITEM_HIDDEN";

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link: string;
}

/**
 * สร้างการแจ้งเตือน (รองรับทั้งเรียกเดี่ยวๆ หรือส่ง Prisma Transaction Client เข้ามา)
 */
export async function createNotification(
  params: CreateNotificationParams,
  tx?: Prisma.TransactionClient
) {
  const db = tx || prisma;
  return db.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body ?? null,
      link: params.link,
    },
  });
}

/**
 * สร้างการแจ้งเตือนเป็นชุด (เช่น MATCH_FOUND หลายคน)
 */
export async function createNotificationsBatch(
  notifications: CreateNotificationParams[],
  tx?: Prisma.TransactionClient
) {
  if (notifications.length === 0) return;
  const db = tx || prisma;
  return db.notification.createMany({
    data: notifications.map((n) => ({
      userId: n.userId,
      type: n.type,
      title: n.title,
      body: n.body ?? null,
      link: n.link,
    })),
  });
}

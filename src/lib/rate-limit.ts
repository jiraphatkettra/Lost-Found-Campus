import { prisma } from "@/lib/prisma";

export interface RateLimitResult {
  allowed: boolean;
  message?: string;
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * ตรวจสอบโควตาการสร้างประกาศ (สูงสุด 10 รายการ / 24 ชั่วโมง / คน)
 */
export async function checkItemRateLimit(userId: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);
  const count = await prisma.item.count({
    where: {
      ownerId: userId,
      createdAt: { gte: since },
    },
  });

  if (count >= 10) {
    return {
      allowed: false,
      message: "คุณสร้างประกาศเกินขีดจำกัดแล้ว (สูงสุด 10 รายการต่อ 24 ชั่วโมง)",
    };
  }

  return { allowed: true };
}

/**
 * ตรวจสอบโควตาการส่ง Claim (สูงสุด 20 รายการ / 24 ชั่วโมง / คน)
 */
export async function checkClaimRateLimit(userId: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);
  const count = await prisma.claim.count({
    where: {
      claimantId: userId,
      createdAt: { gte: since },
    },
  });

  if (count >= 20) {
    return {
      allowed: false,
      message: "คุณส่งคำขอรับของเกินขีดจำกัดแล้ว (สูงสุด 20 รายการต่อ 24 ชั่วโมง)",
    };
  }

  return { allowed: true };
}

/**
 * ตรวจสอบโควตาการส่งรายงาน Report (สูงสุด 10 รายการ / 24 ชั่วโมง / คน)
 */
export async function checkReportRateLimit(userId: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);
  const count = await prisma.report.count({
    where: {
      reporterId: userId,
      createdAt: { gte: since },
    },
  });

  if (count >= 10) {
    return {
      allowed: false,
      message: "คุณส่งรายงานเกินขีดจำกัดแล้ว (สูงสุด 10 รายการต่อ 24 ชั่วโมง)",
    };
  }

  return { allowed: true };
}

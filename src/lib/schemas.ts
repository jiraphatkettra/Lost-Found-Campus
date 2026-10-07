import { z } from "zod";

export const ITEM_TYPES = ["LOST", "FOUND"] as const;
export const CATEGORIES = [
  "BOOK",
  "ELECTRONICS",
  "CARD",
  "BAG",
  "CLOTHES",
  "KEYS",
  "OTHER",
] as const;
export const LOCATIONS = [
  "LIBRARY",
  "CANTEEN",
  "BUILDING_A",
  "BUILDING_B",
  "SPORTS_CENTER",
  "PARKING",
  "OTHER",
] as const;

export const ITEM_STATUSES = ["SEARCHING", "FOUND", "RETURNED"] as const;
export const CLAIM_STATUSES = ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"] as const;
export const REPORT_REASONS = ["SPAM", "INAPPROPRIATE", "FAKE", "OTHER"] as const;
export const REPORT_STATUSES = ["OPEN", "RESOLVED", "DISMISSED"] as const;

// ตรวจสอบข้อมูลติดต่อ: ต้องเป็นอีเมล หรือเบอร์โทรไทย 9–10 หลัก (ขึ้นต้นด้วย 0)
export const contactRegex = /(^0[0-9]{8,9}$)|(^[^\s@]+@[^\s@]+\.[^\s@]+$)/;

export const createItemSchema = z.object({
  type: z.enum(ITEM_TYPES, {
    message: "กรุณาเลือกประเภท",
  }),
  title: z
    .string({
      message: "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร",
    })
    .min(3, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  category: z.enum(CATEGORIES, {
    message: "กรุณาเลือกหมวดหมู่",
  }),
  location: z.enum(LOCATIONS, {
    message: "กรุณาเลือกสถานที่",
  }),
  date: z.coerce.date().refine(
    (d) => {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      return d <= todayEnd;
    },
    {
      message: "วันที่ต้องไม่เกินวันนี้",
    }
  ),
  description: z
    .string({
      message: "รายละเอียดสั้นเกินไป",
    })
    .min(10, "รายละเอียดสั้นเกินไป")
    .max(1000, "รายละเอียดต้องไม่เกิน 1000 ตัวอักษร"),
  contact: z
    .string({
      message: "ข้อมูลติดต่อไม่ถูกต้อง (ต้องเป็นอีเมล หรือเบอร์โทรศัพท์ 9-10 หลัก)",
    })
    .regex(contactRegex, "ข้อมูลติดต่อไม่ถูกต้อง (ต้องเป็นอีเมล หรือเบอร์โทรศัพท์ 9-10 หลัก)"),
  imageUrl: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        // รองรับทั้ง relative path (/uploads/...) และ absolute URL (http/https/blob)
        if (
          val.startsWith("/") ||
          val.startsWith("http://") ||
          val.startsWith("https://") ||
          val.startsWith("blob:")
        ) {
          return true;
        }
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "ลิงก์รูปไม่ถูกต้อง",
      }
    )
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export const updateItemSchema = createItemSchema.partial();

export const createClaimSchema = z.object({
  message: z
    .string({
      message: "ข้อความต้องมีความยาว 10–500 ตัวอักษร",
    })
    .min(10, "ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร")
    .max(500, "ข้อความต้องไม่เกิน 500 ตัวอักษร"),
  claimantContact: z
    .string({
      message: "ข้อมูลติดต่อไม่ถูกต้อง (ต้องเป็นอีเมล หรือเบอร์โทรศัพท์ 9-10 หลัก)",
    })
    .regex(contactRegex, "ข้อมูลติดต่อไม่ถูกต้อง (ต้องเป็นอีเมล หรือเบอร์โทรศัพท์ 9-10 หลัก)"),
});

export const updateClaimSchema = z.object({
  action: z.enum(["ACCEPT", "REJECT", "CANCEL"] as const, {
    message: "คำสั่งไม่ถูกต้อง (ต้องเป็น ACCEPT, REJECT หรือ CANCEL)",
  }),
});

export const createReportSchema = z.object({
  reason: z.enum(REPORT_REASONS, {
    message: "กรุณาเลือกเหตุผลในการรายงาน",
  }),
  detail: z
    .string()
    .max(300, "รายละเอียดต้องไม่เกิน 300 ตัวอักษร")
    .optional()
    .nullable(),
});

export const updateReportSchema = z.object({
  action: z.enum(["HIDE_ITEM", "DISMISS"] as const, {
    message: "คำสั่งไม่ถูกต้อง (ต้องเป็น HIDE_ITEM หรือ DISMISS)",
  }),
});

export const listItemsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(24).default(12),
  sort: z.enum(["new", "old"]).default("new"),
  q: z.string().optional(),
  type: z.enum(ITEM_TYPES).optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(ITEM_STATUSES).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type UpdateClaimInput = z.infer<typeof updateClaimSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ListItemsQueryInput = z.infer<typeof listItemsQuerySchema>;

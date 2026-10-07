import { prisma } from "@/lib/prisma";
import { Item } from "@prisma/client";

export interface MatchScoreResult {
  item: Item;
  score: number;
}

/**
 * คำนวณคะแนนความตรงกันตามกฎหัวข้อ 6.7:
 * - ข้าม type (LOST ↔ FOUND) และ status = SEARCHING
 * - หมวดหมู่ตรงกัน: +3
 * - สถานที่ตรงกัน: +2
 * - วันที่ห่างกันไม่เกิน 7 วัน: +1
 * - คัดเฉพาะคะแนน >= 3 และส่งคืนสูงสุด 5 รายการ
 */
export async function findMatchingItems(targetItem: Item): Promise<Item[]> {
  const oppositeType = targetItem.type === "LOST" ? "FOUND" : "LOST";

  // ดึงรายการที่ type ตรงข้าม และสถานะกำลังตามหา (SEARCHING)
  const candidates = await prisma.item.findMany({
    where: {
      type: oppositeType,
      status: "SEARCHING",
      isHidden: false,
      id: { not: targetItem.id },
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

  const scored: { item: typeof candidates[0]; score: number }[] = [];
  const targetDate = new Date(targetItem.date).getTime();

  for (const candidate of candidates) {
    let score = 0;

    // หมวดหมู่ตรงกัน +3
    if (candidate.category === targetItem.category) {
      score += 3;
    }

    // สถานที่ตรงกัน +2
    if (candidate.location === targetItem.location) {
      score += 2;
    }

    // วันที่ห่างกันไม่เกิน 7 วัน (7 * 24 * 60 * 60 * 1000 ms) +1
    const candidateDate = new Date(candidate.date).getTime();
    const diffDays = Math.abs(candidateDate - targetDate) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      score += 1;
    }

    // เฉพาะคะแนน >= 3
    if (score >= 3) {
      scored.push({ item: candidate, score });
    }
  }

  // เรียงจากคะแนนมากไปน้อย ถ้าเท่ากันเรียงตามวันที่สร้างล่าสุด สูงสุด 5 รายการ
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime();
  });

  return scored.slice(0, 5).map((s) => s.item);
}

import { prisma } from "@/lib/prisma";
import { Item } from "@prisma/client";

// กำหนดชนิดข้อมูลผลลัพธ์การให้คะแนนความตรงกัน
export type MatchScoreResult = {
  item: Item;
  score: number;
};

/**
 * ฟังก์ชันค้นหาและจับคู่ประกาศที่น่าจะตรงกัน (Match Suggestions)
 * หลักการคำนวณคะแนน (Scoring Algorithm):
 * 1. ค้นหารายการที่มีประเภทตรงข้าม (เช่น หากเป็นของหาย จะจับคู่กับของที่พบ) และมีสถานะกำลังค้นหา (SEARCHING)
 * 2. หมวดหมู่ตรงกัน: +3 คะแนน
 * 3. สถานที่เกิดเหตุตรงกัน: +2 คะแนน
 * 4. วันที่เกิดเหตุใกล้เคียงกันไม่เกิน 7 วัน: +1 คะแนน
 * คัดเลือกเฉพาะรายการที่มีคะแนนตั้งแต่ 3 คะแนนขึ้นไป และส่งคืนสูงสุด 5 อันดับแรก
 */
export async function findMatchingItems(targetItem: Item): Promise<Item[]> {
  const oppositeType = targetItem.type === "LOST" ? "FOUND" : "LOST";

  // ดึงรายการที่มีประเภทตรงข้ามและยังไม่ปิดประกาศ
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

    // หมวดหมู่ตรงกัน (+3 คะแนน)
    if (candidate.category === targetItem.category) {
      score += 3;
    }

    // สถานที่ตรงกัน (+2 คะแนน)
    if (candidate.location === targetItem.location) {
      score += 2;
    }

    // วันที่ห่างกันไม่เกิน 7 วัน (+1 คะแนน)
    const candidateDate = new Date(candidate.date).getTime();
    const diffDays = Math.abs(candidateDate - targetDate) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      score += 1;
    }

    // กรองเฉพาะรายการที่คะแนนถึงเกณฑ์ (ตั้งแต่ 3 คะแนนขึ้นไป)
    if (score >= 3) {
      scored.push({ item: candidate, score });
    }
  }

  // เรียงลำดับจากคะแนนสูงสุดไปต่ำสุด หากคะแนนเท่ากันเรียงตามวันที่สร้างล่าสุด
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime();
  });

  return scored.slice(0, 5).map((s) => s.item);
}

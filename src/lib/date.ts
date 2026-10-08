import { formatDistanceToNow, format } from "date-fns";
import { th } from "date-fns/locale";

/**
 * แปลงวันที่เป็นข้อความสัมพัทธ์กระชับ เช่น "5 ชั่วโมงที่แล้ว"
 * ตัดคำซ้ำซ้อน "ประมาณ" และแปลง "ที่ผ่านมา" ให้เป็น "ที่แล้ว"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const diffMs = Date.now() - d.getTime();
  // น้อยกว่า 1 นาที
  if (diffMs < 60 * 1000) {
    return "เมื่อสักครู่";
  }

  const raw = formatDistanceToNow(d, {
    addSuffix: true,
    locale: th,
  });

  return raw
    .replace(/^ประมาณ\s*/, "")
    .replace(/ที่ผ่านมา$/, "ที่แล้ว")
    .replace(/เกือบ\s*/, "")
    .replace(/มากกว่า\s*/, "");
}

/**
 * แปลงวันที่เป็นรูปแบบภาษาไทย พ.ศ. เช่น "7 ต.ค. 2569"
 */
export function formatThaiDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const buddhistYear = d.getFullYear() + 543;
  const dayMonth = format(d, "d MMM", { locale: th });
  return `${dayMonth} ${buddhistYear}`;
}

/**
 * แปลงวันที่เป็นรูปแบบภาษาไทยเต็มพร้อมเวลา เช่น "7 ต.ค. 2569 เวลา 14:30 น."
 */
export function formatFullThaiDateTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const buddhistYear = d.getFullYear() + 543;
  const dayMonth = format(d, "d MMM", { locale: th });
  const time = format(d, "HH:mm");
  return `${dayMonth} ${buddhistYear} เวลา ${time} น.`;
}

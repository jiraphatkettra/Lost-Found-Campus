import { formatDistanceToNow, format } from "date-fns";
import { th } from "date-fns/locale";

/**
 * แปลงวันที่เป็นข้อความสัมพัทธ์ เช่น "2 ชั่วโมงที่แล้ว"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: th,
  });
}

/**
 * แปลงวันที่เป็นรูปแบบภาษาไทย เช่น "7 ต.ค. 2026"
 */
export function formatThaiDate(date: Date | string | number): string {
  const d = new Date(date);
  return format(d, "d MMM yyyy", { locale: th });
}

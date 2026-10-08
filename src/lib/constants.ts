// ค่าคงที่และป้ายภาษาไทยทั้งหมดของระบบ Lost & Found Campus v2 (ห้ามเขียนข้อความซ้ำกระจายในหลายไฟล์)

export const CATEGORIES = [
  {
    value: "BOOK",
    label: "หนังสือ / สมุด",
    iconName: "BookOpen",
    gradient: "from-amber-500/10 to-amber-500/20 text-amber-600 dark:text-amber-400",
  },
  {
    value: "ELECTRONICS",
    label: "อุปกรณ์อิเล็กทรอนิกส์",
    iconName: "Smartphone",
    gradient: "from-blue-500/10 to-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    value: "CARD",
    label: "บัตร / กระเป๋าสตางค์",
    iconName: "CreditCard",
    gradient: "from-violet-500/10 to-violet-500/20 text-violet-600 dark:text-violet-400",
  },
  {
    value: "BAG",
    label: "กระเป๋า / เป้",
    iconName: "Backpack",
    gradient: "from-emerald-500/10 to-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    value: "CLOTHES",
    label: "เสื้อผ้า / เครื่องแต่งกาย",
    iconName: "Shirt",
    gradient: "from-pink-500/10 to-pink-500/20 text-pink-600 dark:text-pink-400",
  },
  {
    value: "KEYS",
    label: "กุญแจ / คีย์การ์ด",
    iconName: "KeyRound",
    gradient: "from-orange-500/10 to-orange-500/20 text-orange-600 dark:text-orange-400",
  },
  {
    value: "OTHER",
    label: "อื่น ๆ",
    iconName: "Package",
    gradient: "from-slate-500/10 to-slate-500/20 text-slate-600 dark:text-slate-400",
  },
] as const;

export const LOCATIONS = [
  { value: "LIBRARY", label: "สำนักหอสมุด (หอสมุดกลาง ม.แม่โจ้)" },
  { value: "CANTEEN", label: "ศูนย์อาหารเทิดพระเกียรติ (โรงอาหารกลาง)" },
  { value: "BUILDING_70", label: "อาคารเรียนรวม 70 ปี แม่โจ้" },
  { value: "BUILDING_80", label: "อาคารเรียนรวม 80 ปี แม่โจ้" },
  { value: "THEP_BUILDING", label: "อาคารเฉลิมพระเกียรติสมเด็จพระเทพฯ" },
  { value: "AMNUAY_YOTSUK", label: "อาคารอำนวย ยศสุข (ศูนย์กิจการนักศึกษา)" },
  { value: "PAE_PHUEAT", label: "อาคารแผ่พืช" },
  { value: "AGRI_FACULTY", label: "คณะผลิตกรรมการเกษตร" },
  { value: "SCIENCE_FACULTY", label: "คณะวิทยาศาสตร์" },
  { value: "BUSINESS_FACULTY", label: "คณะบริหารธุรกิจ" },
  { value: "ENG_FACULTY", label: "คณะวิศวกรรมและอุตสาหกรรมเกษตร" },
  { value: "INFO_COMM_FACULTY", label: "คณะสารสนเทศและการสื่อสาร" },
  { value: "ARCH_FACULTY", label: "คณะสถาปัตยกรรมศาสตร์ฯ" },
  { value: "LIBERAL_ARTS", label: "คณะศิลปศาสตร์" },
  { value: "ECON_FACULTY", label: "คณะเศรษฐศาสตร์" },
  { value: "SPORTS_CENTER", label: "ศูนย์กีฬาเฉลิมพระเกียรติ / ยิมเนเซียม" },
  { value: "DORMITORY", label: "หอพักนักศึกษา (หอพักใน ม.แม่โจ้)" },
  { value: "BANGKHEN_GATE", label: "ประตูบางเขน (ประตูใหญ่)" },
  { value: "SAITHONG_GATE", label: "ประตูทรายทอง" },
  { value: "FARM_AREA", label: "ฟาร์มมหาวิทยาลัย / แปลงวิจัยเกษตร" },
  { value: "PARKING", label: "ลานจอดรถในมหาวิทยาลัย" },
  { value: "OTHER", label: "สถานที่อื่น ๆ (โปรดระบุ)" },
] as const;

export const ITEM_TYPES = [
  {
    value: "LOST",
    label: "ของหาย",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  {
    value: "FOUND",
    label: "ของที่เก็บได้",
    badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
] as const;

export const ITEM_STATUSES = [
  {
    value: "SEARCHING",
    label: "กำลังตามหา",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    value: "FOUND",
    label: "พบของแล้ว",
    badgeClass: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
  {
    value: "RETURNED",
    label: "ส่งคืนเรียบร้อย",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
] as const;

export const CLAIM_STATUSES = [
  {
    value: "PENDING",
    label: "รอการตรวจสอบ",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    value: "ACCEPTED",
    label: "ตอบรับแล้ว",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    value: "REJECTED",
    label: "ปฏิเสธ",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  {
    value: "CANCELLED",
    label: "ยกเลิกแล้ว",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
] as const;

export const REPORT_REASONS = [
  { value: "SPAM", label: "ข้อความสแปม / โฆษณา" },
  { value: "INAPPROPRIATE", label: "เนื้อหาไม่เหมาะสม / หยาบคาย" },
  { value: "FAKE", label: "ข้อมูลเท็จ / หลอกลวง" },
  { value: "OTHER", label: "เหตุผลอื่น ๆ" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type LocationValue = (typeof LOCATIONS)[number]["value"];
export type ItemTypeValue = (typeof ITEM_TYPES)[number]["value"];
export type ItemStatusValue = (typeof ITEM_STATUSES)[number]["value"];

// Helper maps
export const CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

export const LOCATION_LABEL_MAP: Record<string, string> = {
  ...Object.fromEntries(LOCATIONS.map((l) => [l.value, l.label])),
  // Legacy backward-compatibility
  BUILDING_A: "อาคารเรียนรวม 70 ปี แม่โจ้",
  BUILDING_B: "อาคารเรียนรวม 80 ปี แม่โจ้",
};

/**
 * ฟังก์ชันช่วยแปลงรหัสสถานที่ หรือสถานที่แบบระบุเอง (OTHER: ...) เป็นข้อความภาษาไทย
 */
export function formatLocationName(loc: string | null | undefined): string {
  if (!loc) return "";
  if (loc.startsWith("OTHER:")) {
    const detail = loc.slice(6).trim();
    return detail ? `อื่น ๆ (${detail})` : "สถานที่อื่น ๆ";
  }
  if (loc === "OTHER") return "สถานที่อื่น ๆ";
  return LOCATION_LABEL_MAP[loc] || loc;
}

export const ITEM_TYPE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ITEM_TYPES.map((t) => [t.value, t.label])
);

export const ITEM_STATUS_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ITEM_STATUSES.map((s) => [s.value, s.label])
);

export const ITEM_STATUS_CLASS_MAP: Record<string, string> = Object.fromEntries(
  ITEM_STATUSES.map((s) => [s.value, s.badgeClass])
);

export const ITEM_TYPE_CLASS_MAP: Record<string, string> = Object.fromEntries(
  ITEM_TYPES.map((t) => [t.value, t.badgeClass])
);

export const CLAIM_STATUS_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CLAIM_STATUSES.map((c) => [c.value, c.label])
);

export const CLAIM_STATUS_CLASS_MAP: Record<string, string> = Object.fromEntries(
  CLAIM_STATUSES.map((c) => [c.value, c.badgeClass])
);

export const CATEGORY_PLACEHOLDER_MAP: Record<
  string,
  { label: string; iconName: string; gradient: string }
> = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.value,
    { label: c.label, iconName: c.iconName, gradient: c.gradient },
  ])
);

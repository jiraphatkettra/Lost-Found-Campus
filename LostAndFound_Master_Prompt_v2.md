# MASTER PROMPT v2: Lost & Found Campus (Upgrade Pack)

> **ไฟล์นี้เป็นภาคต่อของ `LostAndFound_Master_Prompt.md` (v1)** ไม่ใช่การเริ่มใหม่
> วิธีใช้: วาง v1 ก่อน แล้ววางไฟล์นี้ต่อท้ายในแชตเดียวกัน จากนั้นสั่งทีละ Phase (หัวข้อ 12)
> เป้าหมายของ v2: แก้ปัญหา "หน้าเว็บโล่ง ขาดลูกเล่น Navbar เรียบเกินไป" และเพิ่มระบบที่เว็บใช้งานจริงต้องมี

---

## 0. กฎลำดับความสำคัญ (PRECEDENCE)

1. **v2 ชนะ v1** เฉพาะหัวข้อที่ระบุว่า "OVERRIDE" ในหัวข้อ 2 เท่านั้น
2. หัวข้ออื่นของ v1 ยังมีผลเต็มที่ รวมถึงบทบาท, กติกา Anti-Drift (v1 หัวข้อ 5) และรูปแบบคำตอบมาตรฐาน
3. ถ้า v1 กับ v2 ขัดกันในจุดที่ไม่ได้ระบุ OVERRIDE ให้ **หยุดและถามก่อน**
4. คำสั่งในแชตที่ขัดกับเอกสาร ให้ถามก่อนเสมอ ห้ามเลือกเองเงียบ ๆ

ป้าย `[MUST]` = บังคับ, `[MUST NOT]` = ห้าม, `[MAY]` = ทำได้เมื่อผู้ใช้สั่ง

---

## 1. Design Brief: ปัญหาที่ผู้ใช้พบ และแนวทางแก้

| ปัญหาที่พบ | สาเหตุที่น่าจะเป็น | วิธีแก้ใน v2 |
|---|---|---|
| Navbar ดูเรียบ ไม่มีชีวิต | มีแค่ลิงก์ + ปุ่ม ไม่มีลำดับความสำคัญทางสายตา | Navbar v2 (หัวข้อ 6) |
| หน้าโล่ง | ไม่มี Hero, ไม่มี Footer, การ์ดไม่มีรูป จึงเป็นกล่องข้อความล้วน | หน้าแรกใหม่ + รูป placeholder ตามหมวดหมู่ (หัวข้อ 7) |
| ขาดลูกเล่น | ไม่มี animation, hover, micro-interaction | Motion spec (หัวข้อ 8) |
| ข้อมูลติดต่อซ่อนอย่างเดียว ผู้ใช้ไม่มีทางติดต่อกันจริง | ไม่มีกลไกขอรับของ | ระบบ Claim (หัวข้อ 4.1) |
| ผู้ใช้ไม่รู้ว่ามีคนตอบรับหรือพบของที่ตรงกัน | ไม่มีการแจ้งเตือน | ระบบแจ้งเตือนในเว็บ (หัวข้อ 4.2) |
| เว็บจริงรับประกาศสแปมได้ | ไม่มีการรายงาน/ควบคุม | Report + Admin + Rate limit (หัวข้อ 4.4, 4.5) |

**ทิศทางดีไซน์:** เป็นมิตร ทันสมัย เหมาะกับนักศึกษา เน้นรูปภาพและสีที่สื่อความหมาย (ไม่ใช่ดีไซน์หรูหรือเกินจำเป็น)

---

## 2. สิ่งที่ OVERRIDE จาก v1

| หัวข้อ v1 | เดิม | ใหม่ใน v2 |
|---|---|---|
| 3.2 นอกขอบเขต: Dark mode | ห้าม | **อนุญาต** (หัวข้อ 8.3) |
| 3.2 นอกขอบเขต: แจ้งเตือน | ห้าม (อีเมล/push) | **อนุญาตเฉพาะแจ้งเตือนในเว็บ** อีเมลและ push ยังห้าม |
| 3.2 นอกขอบเขต: หน้าแอดมิน/รายงาน | ห้าม | **อนุญาตแบบเรียบง่าย** (หัวข้อ 4.4) |
| 3.2 นอกขอบเขต: แชต | ห้าม | **ยังห้าม** ใช้ระบบ Claim แทน |
| 4 Tech Stack: library เพิ่ม | `sonner` เท่านั้น | เพิ่ม `lucide-react`, `date-fns`, `next-themes`, และตัวเก็บรูป (หัวข้อ 5) |
| 6.8 ข้อ 4: ซ่อนข้อมูลติดต่อ | ซ่อนจากคนที่ไม่ล็อกอิน | **เข้มขึ้น** ดูกฎการเปิดเผยในหัวข้อ 4.1 |
| 7 Components: ล็อก 10 ตัว | 10 ตัว | **ล็อกใหม่ 32 ตัว** (หัวข้อ 9) |
| 9.1 สีประเภท/สถานะ | LOST แดง, FOUND น้ำเงิน | สีใหม่ในหัวข้อ 8.1 |
| 9.2 Breakpoints & Layout | Mobile-first พื้นฐาน | **รองรับทั้งโทรศัพท์และแท็บเล็ตอย่างเต็มรูปแบบ** (Mobile <640px, Tablet 640px–1023px, Desktop ≥1024px) ดูหัวข้อ 8.7 |
| 9.1 สติ๊กเกอร์ / กราฟิก UI | ไม่ได้ระบุละเอียด | **ปรับสติ๊กเกอร์ทั้งหมดเป็น Vector (SVG / Lucide Icons)** ห้ามใช้ภาพแตกหรือ emoji (หัวข้อ 8.6) |
| ImageUploader | เสริม | **เป็นฟีเจอร์หลัก** (หัวข้อ 4.3) |
| Footer | ตัดออก | **เพิ่มกลับมา** |

**ยังห้ามเหมือนเดิม:** แผนที่/GPS, หลายภาษา, ระบบชำระเงิน, ระบบแต้ม, ล็อกอินแบบอื่นนอกจาก Google, library นอกรายการ

---

## 3. สรุปฟีเจอร์ใหม่และลำดับความสำคัญ

| ID | ฟีเจอร์ | ความสำคัญ | ตัดได้ไหมถ้าเวลาไม่พอ |
|---|---|---|---|
| UI-1 | Design system + Dark mode | P1 | ไม่ (Dark mode ตัดได้) |
| UI-2 | Navbar v2 | P1 | ไม่ |
| UI-3 | หน้าแรกใหม่ (Hero, สถิติ, ขั้นตอน) + Footer | P1 | ไม่ |
| UI-4 | ItemCard v2, Skeleton, EmptyState, Pagination | P1 | ไม่ |
| F-1 | อัปโหลดรูป + รูป placeholder ตามหมวดหมู่ | P1 | ไม่ |
| F-2 | ระบบ Claim (ขอรับของ/แจ้งว่าเจอ) | P2 | ไม่แนะนำ |
| F-3 | แจ้งเตือนในเว็บ + กระดิ่ง | P2 | ตัดได้ |
| F-4 | Report + Admin | P3 | ตัดได้ |
| F-5 | Rate limit + SEO + ปุ่มแชร์ | P3 | ตัดได้บางส่วน |

---

## 4. ระบบใหม่ (รายละเอียดเชิงสถาปัตยกรรม)

### 4.1 ระบบ Claim (F-2)

**วัตถุประสงค์:** ให้ผู้ใช้ติดต่อกันได้จริงโดยไม่ต้องเปิดเผยข้อมูลติดต่อสาธารณะ และไม่ต้องทำแชต

**Flow:**
1. ประกาศ `LOST`: ผู้ใช้อื่นกด **"ฉันเจอของชิ้นนี้"** / ประกาศ `FOUND`: กด **"นี่คือของฉัน"**
2. กรอกฟอร์มสั้น (ข้อความยืนยัน + ข้อมูลติดต่อของตนเอง)
3. เจ้าของประกาศได้การแจ้งเตือน เปิดดูคำขอ แล้ว **รับ** หรือ **ปฏิเสธ**
4. เมื่อ **รับ** ผู้ขอจะเห็นข้อมูลติดต่อของเจ้าของประกาศ
5. เจ้าของประกาศเปลี่ยนสถานะเป็น `RETURNED` เมื่อส่งคืนเสร็จ

**Data model: Claim**

| Field | ชนิด | หมายเหตุ |
|---|---|---|
| id | String (cuid) | PK |
| itemId | String | FK → Item (onDelete: Cascade) |
| claimantId | String | FK → User |
| message | String | 10–500 ตัวอักษร |
| claimantContact | String | เบอร์หรืออีเมล (กติกาเดียวกับ `contact` ของ v1) |
| status | Enum `PENDING` / `ACCEPTED` / `REJECTED` / `CANCELLED` | default `PENDING` |
| createdAt, updatedAt | DateTime | |

Index: `itemId`, `claimantId`, `status`

**กติกาธุรกิจ `[MUST]` บังคับที่ฝั่งเซิร์ฟเวอร์:**
- ห้าม Claim ประกาศของตัวเอง
- ผู้ใช้หนึ่งคนมี Claim ที่ `PENDING` หรือ `ACCEPTED` ได้ 1 รายการต่อ 1 ประกาศ
- ห้าม Claim ประกาศที่ `RETURNED` หรือ `isHidden = true`
- ผู้ขอยกเลิกได้เฉพาะที่ยัง `PENDING` (เปลี่ยนเป็น `CANCELLED`)
- เมื่อประกาศเปลี่ยนเป็น `RETURNED` ให้ Claim ที่ยัง `PENDING` ทั้งหมดกลายเป็น `CANCELLED`

**กฎการเปิดเผยข้อมูลติดต่อ (`Item.contact`) `[MUST]`:**
เปิดเผยเฉพาะเมื่อผู้ดูเป็นอย่างใดอย่างหนึ่ง: (ก) เจ้าของประกาศ (ข) ADMIN (ค) ผู้ที่มี Claim สถานะ `ACCEPTED` ในประกาศนั้น
**API ต้องตัดฟิลด์ `contact` ออกจาก response เอง** ห้ามพึ่งการซ่อนที่ UI

### 4.2 ระบบแจ้งเตือนในเว็บ (F-3)

**Data model: Notification**

| Field | ชนิด | หมายเหตุ |
|---|---|---|
| id | String (cuid) | PK |
| userId | String | ผู้รับ, FK → User |
| type | Enum `CLAIM_RECEIVED` / `CLAIM_ACCEPTED` / `CLAIM_REJECTED` / `MATCH_FOUND` / `ITEM_HIDDEN` | |
| title | String | ข้อความสั้น |
| body | String? | |
| link | String | path ที่กดแล้วไป เช่น `/items/abc` |
| readAt | DateTime? | null = ยังไม่อ่าน |
| createdAt | DateTime | |

Index: `(userId, readAt)`, `createdAt`

**จุดที่สร้างการแจ้งเตือน (ต้องอยู่ใน transaction เดียวกับการกระทำนั้น):**

| เหตุการณ์ | ผู้รับ | type |
|---|---|---|
| มีคนส่ง Claim | เจ้าของประกาศ | `CLAIM_RECEIVED` |
| เจ้าของรับ Claim | ผู้ขอ | `CLAIM_ACCEPTED` |
| เจ้าของปฏิเสธ Claim | ผู้ขอ | `CLAIM_REJECTED` |
| สร้างประกาศใหม่แล้วตรงกับของคนอื่น (คะแนน ≥ 3 ตาม v1 หัวข้อ 6.7) | เจ้าของประกาศที่ตรงกัน (ไม่ใช่ตัวเอง, ไม่เกิน 5 คน) | `MATCH_FOUND` |
| แอดมินซ่อนประกาศ | เจ้าของประกาศ | `ITEM_HIDDEN` |

**การทำงานฝั่ง UI:** กระดิ่งใน Navbar ดึงจำนวนที่ยังไม่อ่านด้วยการ **polling ทุก 60 วินาที** (ห้ามใช้ WebSocket/SSE) และหยุด poll เมื่อแท็บไม่ active

### 4.3 อัปโหลดรูป (F-1)

- ที่เก็บรูป: **ค่าเริ่มต้น Vercel Blob** (ถ้าผู้ใช้เลือกตัวอื่น เช่น Cloudinary ให้ตอบในหัวข้อ Phase V0)
- Endpoint: `POST /api/upload` (ต้องล็อกอิน) รับเฉพาะ `image/jpeg`, `image/png`, `image/webp`, ขนาด ≤ 3 MB ตรวจที่เซิร์ฟเวอร์ซ้ำ
- Client: `ImageUploader` ต้องมี drag & drop, พรีวิว, ปุ่มลบ, progress/loading, ตรวจชนิดและขนาดก่อนส่ง
- เก็บเฉพาะ URL ใน `Item.imageUrl`
- **รูป placeholder:** ถ้าไม่มีรูป ให้แสดงพื้นไล่สีพร้อมไอคอน lucide ตามหมวดหมู่ (ดูตาราง 8.2) **ห้ามปล่อยการ์ดไม่มีภาพ**
- `[MUST]` ใช้ `next/image` และตั้ง `remotePatterns` ให้ครอบคลุมโดเมนที่เก็บรูปจริง
- `[MUST NOT]` ห้ามเก็บรูปเป็น base64 ในฐานข้อมูล

### 4.4 Report + Admin (F-4)

**Data model: Report**

| Field | ชนิด | หมายเหตุ |
|---|---|---|
| id | String (cuid) | PK |
| itemId | String | FK → Item (onDelete: Cascade) |
| reporterId | String | FK → User |
| reason | Enum `SPAM` / `INAPPROPRIATE` / `FAKE` / `OTHER` | |
| detail | String? | ไม่เกิน 300 ตัวอักษร |
| status | Enum `OPEN` / `RESOLVED` / `DISMISSED` | default `OPEN` |
| createdAt | DateTime | |

Unique: `(itemId, reporterId)` ผู้ใช้หนึ่งคนรายงานประกาศเดียวกันได้ครั้งเดียว

**เพิ่มฟิลด์ใน Item:** `isHidden Boolean @default(false)` ประกาศที่ซ่อนต้องไม่ปรากฏในรายการสาธารณะ/การแนะนำ/สถิติ และเจ้าของยังเห็นพร้อมป้าย "ถูกซ่อนโดยผู้ดูแล"

**การกำหนด ADMIN:** อ่านจาก env `ADMIN_EMAILS` (คั่นด้วยจุลภาค) ตอนล็อกอินแล้วตั้ง `role = ADMIN` ห้ามทำหน้าสมัครแอดมิน

**หน้า `/admin` (เรียบง่าย):** ตารางรายงานสถานะ `OPEN` + ปุ่ม "ซ่อนประกาศ" / "ยกเลิกรายงาน" / "ดูประกาศ" ตรวจสิทธิ์ ADMIN ที่ฝั่งเซิร์ฟเวอร์ทั้งหน้าและ API

### 4.5 Rate limit, SEO, แชร์ (F-5)

- **Rate limit (นับจากฐานข้อมูล ไม่ใช้ Redis):** สร้างประกาศ ≤ 10 รายการ/24 ชม./คน, ส่ง Claim ≤ 20 รายการ/24 ชม./คน, ส่ง Report ≤ 10 รายการ/24 ชม./คน เกินให้ตอบ 429 พร้อมข้อความไทย
- **SEO:** `metadata` ของทุกหน้า, `generateMetadata` ในหน้ารายละเอียด (ชื่อ, คำอธิบาย, รูป OG)
- **ShareButton:** คัดลอกลิงก์ + toast "คัดลอกลิงก์แล้ว" (ใช้ Web Share API ถ้ามี)

### 4.6 Pagination และ Sorting (ส่วนหนึ่งของ UI-4)

- Query: `page` (เริ่ม 1), `limit` (ค่าเริ่มต้น 12, สูงสุด 24), `sort` = `new` | `old`
- Response ของ `GET /api/items`: `{ items, total, page, pageSize }`
- หน้ารายการเป็น Server Component อ่านจาก `searchParams` และใช้ `Pagination` เปลี่ยนหน้าผ่าน URL (แชร์ลิงก์ได้)

---

## 5. Tech Stack เพิ่ม (อนุมัติแล้ว)

| Library | ใช้ทำอะไร |
|---|---|
| `lucide-react` | ไอคอนทั้งหมด (ห้ามใช้ emoji เป็นไอคอน UI) |
| `date-fns` | เวลาแบบ "2 ชั่วโมงที่แล้ว" (locale `th`) |
| `next-themes` | Dark mode |
| `@vercel/blob` (หรือตัวที่ผู้ใช้เลือกใน V0) | เก็บรูป |

`[MUST NOT]` ห้ามเพิ่ม library animation (framer-motion ฯลฯ) ใช้ Tailwind + CSS เท่านั้น
`[MUST]` ก่อนเขียนโค้ดที่ใช้ API ของ library ให้ยึดเวอร์ชันที่ติดตั้งจริง และ **ตรวจเวอร์ชัน Tailwind** เพราะวิธีตั้งค่า dark mode ต่างกันระหว่างเวอร์ชัน ถ้าไม่แน่ใจให้บอกว่าไม่แน่ใจ

---

## 6. Navbar v2 (UI-2)

### 6.1 โครงสร้าง

```
Desktop (≥1024px), สูง 64px
┌────────────────────────────────────────────────────────────────────────────┐
│ [▣] Lost&Found   หน้าแรก  รายการ  ประกาศของฉัน   [🔍 ค้นหา...]   [+ แจ้งใหม่ ▾] 🌙 🔔③ (รูป▾) │
└────────────────────────────────────────────────────────────────────────────┘

Tablet/Mobile (<1024px)
┌──────────────────────────────┐
│ [▣] Lost&Found     🌙 🔔③  ☰ │
└──────────────────────────────┘
```

### 6.2 รายละเอียดที่ต้องมี `[MUST]`

| ส่วน | สเปก |
|---|---|
| พื้นหลัง | `bg-white/80 backdrop-blur-md` + เส้นขอบล่างบาง ๆ; dark: `bg-slate-900/80` |
| เงาเมื่อเลื่อน | เมื่อ `scrollY > 8` เพิ่มเงา (`shadow-sm`) ด้วย transition |
| โลโก้ | ไอคอน lucide (เช่น `SearchCheck`) ในกล่องโค้งไล่สี blue→indigo + ชื่อเว็บตัวหนา |
| NavLink | ไอคอนเล็ก + ข้อความ, หน้าปัจจุบันมีขีดเส้นใต้/พื้นเน้นแบบ pill, hover เปลี่ยนสีนุ่ม ๆ |
| ช่องค้นหา (≥lg) | กด Enter แล้วไป `/items?q=...`; มีไอคอนแว่นขยาย; โฟกัสแล้วขยายความกว้างเล็กน้อย |
| ปุ่ม CTA "+ แจ้งใหม่" | เป็น `Dropdown` มี 2 ตัวเลือก: "แจ้งของหาย" → `/items/new?type=LOST`, "แจ้งเจอของ" → `/items/new?type=FOUND` (ฟอร์มต้อง preselect ตาม query) |
| ThemeToggle | ปุ่มไอคอน ดวงอาทิตย์/ดวงจันทร์ สลับได้ จำค่าไว้ |
| NotificationBell | แสดงเฉพาะเมื่อล็อกอิน, badge ตัวเลขแดง (เกิน 9 แสดง `9+`), กดแล้วเปิด dropdown แสดง 5 รายการล่าสุด + ลิงก์ "ดูทั้งหมด" (`/notifications`) |
| UserMenu | รูปโปรไฟล์วงกลมมีขอบ, กดแล้ว dropdown: ชื่อ+อีเมล / ประกาศของฉัน / คำขอของฉัน / (ADMIN) จัดการระบบ / ออกจากระบบ |
| ยังไม่ล็อกอิน | ปุ่ม "เข้าสู่ระบบด้วย Google" ทรง `rounded-full` มีโลโก้ Google (inline SVG) แทน CTA และกระดิ่ง/UserMenu |
| MobileDrawer | เลื่อนเข้าจากขวา + overlay มืด, มีลิงก์ทั้งหมด + CTA ทั้งสองปุ่ม + ข้อมูลผู้ใช้, ปิดเมื่อกด overlay / Esc / เปลี่ยนหน้า, ล็อกการเลื่อนของ body ขณะเปิด |
| Skeleton | ระหว่างโหลด session แสดงกล่อง skeleton ฝั่งขวา (กันปุ่มกระพริบ) |

### 6.3 Dropdown ที่ใช้ร่วม `[MUST]`

สร้าง `Dropdown` ตัวเดียวใช้ทั้ง CTA, กระดิ่ง, UserMenu รองรับ: ปิดเมื่อคลิกนอก, ปิดด้วย Esc, เปิดด้วยคีย์บอร์ด, `aria-expanded`, `aria-haspopup`, โฟกัสกลับที่ปุ่มเมื่อปิด

---

## 7. หน้าจอที่ต้องออกแบบใหม่ (UI-3, UI-4)

### 7.1 หน้าแรก `/`

```
┌──────────────────────────────────────────────────────┐
│ Navbar                                                │
├──────────────────────────────────────────────────────┤
│  HERO (พื้นไล่สีอ่อน + รูปทรงตกแต่ง blur)              │
│  ของหายในมหาลัย? ให้เพื่อน ๆ ช่วยตามหา                 │
│  คำอธิบายสั้น 1 บรรทัด                                 │
│  [🔍 ค้นหาของที่หาย.........................][ค้นหา]   │
│  [ แจ้งของหาย ]   [ แจ้งเจอของ ]                       │
├──────────────────────────────────────────────────────┤
│  STATS STRIP  (3 การ์ดเลขใหญ่)                         │
│  กำลังตามหา 42 │ ส่งคืนสำเร็จ 128 │ ประกาศสัปดาห์นี้ 17 │
├──────────────────────────────────────────────────────┤
│  HOW IT WORKS (3 ขั้น มีไอคอน)                         │
│  ① แจ้งประกาศ → ② ระบบหาคู่ให้ → ③ ติดต่อรับคืน        │
├──────────────────────────────────────────────────────┤
│  ประกาศล่าสุด            [ดูทั้งหมด →]                 │
│  [ItemCard] [ItemCard] [ItemCard] [ItemCard]          │
├──────────────────────────────────────────────────────┤
│  CTA แถบสุดท้าย: "เจอของใครสักชิ้น? แจ้งเลย"           │
├──────────────────────────────────────────────────────┤
│  Footer                                               │
└──────────────────────────────────────────────────────┘
```

- สถิติคำนวณที่เซิร์ฟเวอร์จากฐานข้อมูลจริง (ไม่นับ `isHidden`) แคชด้วย `revalidate = 60`
- ตัวเลขนับขึ้น (count-up) ได้ แต่ต้องปิดเมื่อผู้ใช้ตั้ง `prefers-reduced-motion`
- Footer: โลโก้, ลิงก์หลัก, ข้อความ "โปรเจกต์วิชา ...", ปีปัจจุบัน

### 7.2 ItemCard v2

```
┌───────────────────────┐
│ [รูป / placeholder]    │  อัตราส่วน 4:3, รูปซูมเล็กน้อยเมื่อ hover
│ [LOST]          ●สถานะ │  ป้ายประเภทมุมซ้ายบน, สถานะมุมขวาบน
├───────────────────────┤
│ ชื่อสิ่งของ (1-2 บรรทัด)│
│ 📍 สถานที่              │  ใช้ไอคอน lucide
│ 🕒 2 ชั่วโมงที่แล้ว      │  date-fns
└───────────────────────┘
```
Hover: ยกขึ้น `-translate-y-1` + `shadow-lg` + transition 200ms ทั้งการ์ดคลิกได้ (เป็น `<Link>`)

### 7.3 หน้ารายการ `/items`

- มี **หัวหน้าเพจ** (ชื่อ + คำอธิบาย + จำนวนผลลัพธ์) ห้ามขึ้นเป็นรายการเปล่า ๆ
- `FilterBar` แบบ sticky ใต้ Navbar บนจอใหญ่; มือถือย่อเป็นปุ่ม "ตัวกรอง" เปิดเป็น Modal
- แสดง chip ของตัวกรองที่ใช้อยู่ พร้อมปุ่มกากบาทลบทีละตัว และ "ล้างทั้งหมด"
- ตัวเลือกเรียง (ใหม่สุด/เก่าสุด), Pagination ท้ายรายการ
- `loading.tsx` ใช้ Skeleton รูปทรงเดียวกับการ์ด 8 ใบ

### 7.4 หน้ารายละเอียด `/items/[id]`

```
Desktop: 2 คอลัมน์ (ซ้าย 60% รูปใหญ่ | ขวา 40% ข้อมูล)
┌─────────────────────┬───────────────────────────┐
│ [รูปใหญ่/placeholder]│ [LOST] ●สถานะ     [แชร์][⚑]│
│                     │ ชื่อสิ่งของ (H1)            │
│                     │ ข้อมูล: หมวดหมู่/สถานที่/วันที่ (รายการไอคอน)│
│                     │ รายละเอียด                  │
│                     │ ผู้โพสต์: (รูป) ชื่อ · เวลา  │
│                     │ ────────────────────────   │
│                     │ [ปุ่มหลัก: ฉันเจอของชิ้นนี้] │
│                     │ หรือ (เจ้าของ) StatusChanger/แก้ไข/ลบ│
└─────────────────────┴───────────────────────────┘
│ รายการที่น่าจะตรงกัน (MatchSuggestions)              │
```
- ผู้ที่ไม่ใช่เจ้าของ: เห็นปุ่ม Claim และปุ่มรายงาน (⚑)
- ผู้ที่มี Claim `ACCEPTED`: เห็นกล่องข้อมูลติดต่อเจ้าของ
- เจ้าของ: เห็นรายการ Claim ที่ได้รับ (ClaimCard) พร้อมปุ่มรับ/ปฏิเสธ

### 7.5 หน้า `/my-items` (อัปเกรด)

แท็บ 3 อัน: **ประกาศของฉัน** / **คำขอที่ได้รับ** / **คำขอที่ส่งไป** มีตัวเลข badge บนแท็บ และ EmptyState ที่มีไอคอนและปุ่มชวนทำต่อในทุกแท็บ

### 7.6 หน้า `/notifications`

รายการแจ้งเตือนทั้งหมดจัดกลุ่ม "วันนี้ / ก่อนหน้า", ยังไม่อ่านมีจุดสีน้ำเงินและพื้นอ่อน, ปุ่ม "อ่านทั้งหมด", กดรายการแล้วทำเครื่องหมายอ่านและไปที่ `link`

### 7.7 หน้า `/admin` (ADMIN เท่านั้น) ดูหัวข้อ 4.4

---

## 8. Visual System v2

### 8.1 Design Tokens (OVERRIDE v1 หัวข้อ 9.1 เฉพาะรายการนี้)

| Token | Light | Dark |
|---|---|---|
| พื้นหลังเว็บ | `slate-50` | `slate-950` |
| การ์ด / พื้นผิว | `white` | `slate-900` |
| เส้นขอบ | `slate-200` | `slate-800` |
| ข้อความหลัก / รอง | `slate-900` / `slate-600` | `slate-50` / `slate-400` |
| สีหลัก (gradient) | `from-blue-600 to-indigo-600` | `from-blue-500 to-indigo-500` |
| ประเภท LOST | `rose-100` / `rose-700` | `rose-950` / `rose-300` |
| ประเภท FOUND | `indigo-100` / `indigo-700` | `indigo-950` / `indigo-300` |
| สถานะ SEARCHING | `amber-100` / `amber-800` | `amber-950` / `amber-300` |
| สถานะ FOUND (พบแล้ว) | `sky-100` / `sky-800` | `sky-950` / `sky-300` |
| สถานะ RETURNED | `emerald-100` / `emerald-800` | `emerald-950` / `emerald-300` |
| Error / Danger | `red-600` | `red-400` |

- มุมโค้ง: การ์ด `rounded-2xl`, ปุ่ม/ช่องกรอก `rounded-xl`, ป้าย `rounded-full`
- เว้นระยะ: section ห่างกัน `py-12 md:py-16`
- ฟอนต์ยังเป็น `Noto Sans Thai` (v1)
- `[MUST]` ทุกสีต้องมีคู่ dark mode, คอนทราสต์ข้อความอ่านได้ชัด

### 8.2 รูป placeholder ตามหมวดหมู่

| หมวดหมู่ | ไอคอน lucide (ตัวอย่าง) | สีพื้นไล่ระดับ |
|---|---|---|
| BOOK | `BookOpen` | amber |
| ELECTRONICS | `Smartphone` | blue |
| CARD | `CreditCard` | violet |
| BAG | `Backpack` | emerald |
| CLOTHES | `Shirt` | pink |
| KEYS | `KeyRound` | orange |
| OTHER | `Package` | slate |

เก็บการแมปไว้ใน `constants.ts` ที่เดียว

### 8.3 Dark mode

- ใช้ `next-themes` โดยตัวเลือก `light` / `dark` / `system` (ค่าเริ่มต้น `system`)
- ป้องกัน flash ตอนโหลดหน้า (`suppressHydrationWarning` ที่ `<html>`)
- `ThemeToggle` ต้อง render หลัง mount เพื่อเลี่ยง hydration mismatch

### 8.4 Motion Spec `[MUST]`

| จุด | พฤติกรรม | เวลา |
|---|---|---|
| ปุ่ม | hover สว่างขึ้น, `active:scale-95` | 150ms |
| การ์ด | hover ยกขึ้น + เงา, รูปซูม `scale-105` | 200–300ms |
| รายการการ์ด | fade-in + เลื่อนขึ้นเล็กน้อย ไล่ทีละใบ (delay ไม่เกิน 60ms/ใบ, สูงสุด 8 ใบแรก) | 300ms |
| Dropdown / Modal | fade + scale จาก 95% | 150ms |
| MobileDrawer | เลื่อนเข้าจากขวา | 250ms |
| Skeleton | shimmer/pulse | วนซ้ำ |
| Toast | จาก `sonner` | ค่าเริ่มต้น |

`[MUST]` เคารพ `prefers-reduced-motion` (ปิด animation ที่ไม่จำเป็นด้วย `motion-reduce:`)
`[MUST NOT]` ห้ามทำ animation ที่ขวางการใช้งาน ห้ามเกิน 400ms

### 8.5 ปุ่มและฟอร์ม

- `Button` variant: `primary` (gradient), `secondary`, `outline`, `ghost`, `danger`; ขนาด `sm`/`md`/`lg`; รองรับ `loading` (spinner) และไอคอนซ้าย/ขวา
- ช่องกรอก: โฟกัสมี ring สีหลัก, error มีขอบแดง + ไอคอน + ข้อความใต้ช่อง
- ฟอร์มยาวแบ่งเป็นกลุ่มด้วยหัวข้อย่อย (ข้อมูลสิ่งของ / สถานที่และเวลา / ติดต่อและรูป)

### 8.6 ข้อกำหนด Vector Graphic System (ปรับสติ๊กเกอร์และกราฟิกทั้งหมดเป็น Vector) `[MUST]`

- **ห้ามใช้สติ๊กเกอร์บิตแมปหรือ Emoji:** ห้ามใช้ภาพ PNG, JPEG หรือ Emoji มาทำเป็นสติ๊กเกอร์ตกแต่ง/ป้ายสถานะ เพราะภาพจะแตก ไม่รองรับจอ Retina/HiDPI และไม่สามารถปรับสีตาม Light/Dark Theme ได้
- **ปรับสติ๊กเกอร์ทั้งหมดเป็น Vector (SVG / Lucide Icons):**
  - **Vector Badges & Stickers:** สติ๊กเกอร์สถานะ (`StatusBadge`), ป้ายประเภท (`TypeBadge`), และป้ายแท็กต่าง ๆ ต้องใช้โครงสร้าง Vector SVG พร้อม dot indicator และสีตาม Design Tokens
  - **Vector หมวดหมู่ & Placeholders:** สติ๊กเกอร์ตัวแทนของทั้ง 7 หมวดหมู่ (หนังสือ, อุปกรณ์อิเล็กทรอนิกส์, บัตร, กระเป๋า, เสื้อผ้า, กุญแจ, อื่น ๆ) ต้องแสดงด้วยไอคอน Vector Lucide คู่กับ gradient container คมชัด 100% ในทุกระดับการซูม
  - **EmptyState & Hero Vectors:** สติ๊กเกอร์ภาพประกอบใน EmptyState และ Hero ต้องเป็น Vector SVG ที่ปรับสีตาม Theme (`currentColor` หรือ palette tokens) ได้อย่างลงตัว
  - **Scalable & Resolution Independent:** ทุกลูกเล่นที่เป็นสติ๊กเกอร์ต้องคงความคมชัดแบบเวกเตอร์แท้ ไม่สูญเสียความละเอียดบนหน้าจอทุกขนาด

### 8.7 ข้อกำหนด Responsive Layout: รองรับโทรศัพท์และแท็บเล็ตอย่างสมบูรณ์แบบ `[MUST]`

ออกแบบระบบ Responsive ให้รองรับการใช้งานอย่างสมบูรณ์แบบทั้งบน **โทรศัพท์ (Mobile)** และ **แท็บเล็ต (Tablet)** รวมถึงจอคอมพิวเตอร์เดสก์ท็อป:

| อุปกรณ์ | Breakpoint | พฤติกรรม Layout และการจัดวาง UI |
|---|---|---|
| **โทรศัพท์ (Mobile)** | `< 640px` (จอแนวตั้งมือถือ) | - Grid รายการสิ่งของแสดง 1 คอลัมน์เต็มความกว้าง (`grid-cols-1`)<br>- Navbar ยุบแสดงปุ่ม Hamburger เพื่อเปิด `MobileDrawer` ด้านข้างขวา<br>- `FilterBar` ยุบเป็นช่องค้นหา + ปุ่ม "ตัวกรอง" เพื่อเปิด Filter Modal แบบเต็มจอ<br>- Touch Target ขั้นต่ำ 44x44px สำหรับปุ่มและเมนู เพื่อให้แตะด้วยนิ้วมือได้สะดวก<br>- ป้องกัน Horizontal Scrollbar 100% |
| **แท็บเล็ต (Tablet)** | `640px – 1023px` (`sm` ถึง `md` / เช่น iPad portrait 768px, 810px, 820px) | - Grid รายการสิ่งของและคำขอ Claim แสดง **2 คอลัมน์** (`sm:grid-cols-2` หรือ `md:grid-cols-2`) ทั้งหน้าแรก, หน้ารายการ และหน้าประกาศของฉัน<br>- Navbar ใช้ Hamburger Menu + `MobileDrawer` เพื่อไม่ให้เมนูล้นจอแนวตั้งแท็บเล็ต หรือแสดงปุ่มหลักที่แตะง่าย<br>- หน้ารายละเอียด `/items/[id]` จัดสัดส่วนให้อ่านง่ายบนแท็บเล็ต (ภาพ 50–60% หรือ stack สวยงาม พร้อม spacing สบายตา)<br>- Filter Modal และ Dropdowns ขยายขนาดพอดีกับหน้าจอแท็บเล็ต ไม่แคบเกินไป<br>- รองรับการแตะสัมผัส (Touchscreen) ด้วยระยะห่าง padding/margin ที่เหมาะสม |
| **เดสก์ท็อป (Desktop)** | `≥ 1024px` (`lg` และ `xl`) | - Grid รายการสิ่งของแสดง **3 คอลัมน์** (`lg:grid-cols-3`)<br>- Navbar แสดงแถบเมนูลิงก์นำทาง, ช่องค้นหาด่วน และ UserMenu เต็มรูปแบบ<br>- `FilterBar` แสดงแถบตัวเลือกทั้งหมดแบบ inline ใต้ Navbar |

---

## 9. Components v2 (ล็อกใหม่ 32 ตัว)

`[MUST NOT]` ห้ามสร้าง component นอกรายการนี้

| ชั้น | Component | หมายเหตุ |
|---|---|---|
| ui (9) | `Button`, `FormField`, `Modal`, `Dropdown`, `Avatar`, `Badge`, `Skeleton`, `EmptyState`, `Pagination` | `Avatar` ต้องมี fallback เป็นตัวอักษรแรกของชื่อ |
| layout (7) | `Navbar`, `NavLink`, `UserMenu`, `NotificationBell`, `MobileDrawer`, `ThemeToggle`, `Footer` | Navbar ประกอบจากตัวอื่นในชั้นนี้ |
| home (3) | `Hero`, `StatsStrip`, `HowItWorks` | ใช้เฉพาะหน้าแรก |
| feature (13) | `ItemCard`, `ItemForm`, `FilterBar`, `StatusBadge`, `TypeBadge`, `StatusChanger`, `MatchSuggestions`, `ImageUploader`, `ShareButton`, `ClaimForm`, `ClaimCard`, `ReportModal`, `NotificationList` | |

โฟลเดอร์: `components/ui`, `components/layout`, `components/home`, `components/feature`

**Server/Client:** `Hero`(ส่วนค้นหาเป็น client), `StatsStrip` (server + count-up เป็น client เล็ก), `ItemCard`, `StatusBadge`, `TypeBadge`, `Footer`, `HowItWorks`, `Skeleton`, `EmptyState` เป็น server ได้; `Navbar` และลูก, `Dropdown`, `Modal`, `FilterBar`, `ItemForm`, `ImageUploader`, `ClaimForm`, `ReportModal`, `StatusChanger`, `ShareButton`, `NotificationList`, `Pagination` (ถ้าใช้ router) เป็น client

---

## 10. API เพิ่ม/แก้ (ต่อจาก v1 หัวข้อ 6.6)

| Method + Path | หน้าที่ | สิทธิ์ | Status |
|---|---|---|---|
| GET `/api/items` (แก้) | เพิ่ม `page`, `limit`, `sort`; ไม่คืน `isHidden=true` ในรายการสาธารณะ; ตัด `contact` ออก | ทุกคน | 200 |
| GET `/api/items/[id]` (แก้) | ตัด `contact` ตามกฎ 4.1 | ทุกคน | 200, 404 |
| GET `/api/stats` | สถิติหน้าแรก | ทุกคน | 200 |
| POST `/api/upload` | อัปโหลดรูป | ล็อกอิน | 201, 400, 401, 413 |
| POST `/api/items/[id]/claims` | ส่ง Claim | ล็อกอิน (ไม่ใช่เจ้าของ) | 201, 400, 401, 403, 404, 409, 429 |
| GET `/api/items/[id]/claims` | ดู Claim ของประกาศ | เจ้าของ / ADMIN | 200, 401, 403, 404 |
| PATCH `/api/claims/[id]` | `ACCEPT` / `REJECT` (เจ้าของประกาศ) หรือ `CANCEL` (ผู้ขอ) | ตามบทบาท | 200, 400, 401, 403, 404, 409 |
| GET `/api/me/claims` | `?role=received|sent` | ล็อกอิน | 200, 401 |
| GET `/api/notifications` | รายการ + `unreadCount` | ล็อกอิน | 200, 401 |
| PATCH `/api/notifications` | ทำเครื่องหมายอ่าน (`ids` หรือ `all`) | ล็อกอิน | 200, 400, 401 |
| POST `/api/items/[id]/report` | รายงานประกาศ | ล็อกอิน | 201, 400, 401, 404, 409, 429 |
| GET `/api/admin/reports` | รายการรายงาน | ADMIN | 200, 401, 403 |
| PATCH `/api/admin/reports/[id]` | `HIDE_ITEM` / `DISMISS` | ADMIN | 200, 401, 403, 404 |

รูปแบบ error ยังเป็นของ v1: `{ "error": "...", "details": { field: "..." } }`

**Zod เพิ่ม:**

| Schema | กติกา |
|---|---|
| `createClaimSchema` | `message` 10–500, `claimantContact` ตามกติกา contact ของ v1 |
| `updateClaimSchema` | `action` enum `ACCEPT` / `REJECT` / `CANCEL` |
| `createReportSchema` | `reason` enum, `detail` ไม่เกิน 300 |
| `listItemsQuerySchema` | `page` ≥ 1, `limit` 1–24, `sort` enum, ตัวกรองเดิม |
| ฟิลด์ใน `createItemSchema` | `imageUrl` ต้องเป็น URL จากโดเมนที่เก็บรูปของระบบ หรือว่าง |

---

## 11. โครงสร้างไฟล์ที่เพิ่ม/เปลี่ยน (Delta จาก v1 หัวข้อ 6.1)

```
src/app/
 ├─ page.tsx                          # เขียนใหม่: หน้าแรก
 ├─ loading.tsx, items/loading.tsx    # Skeleton
 ├─ notifications/page.tsx            # ใหม่ (ต้องล็อกอิน)
 ├─ admin/page.tsx                    # ใหม่ (ADMIN)
 └─ api/
     ├─ stats/route.ts
     ├─ upload/route.ts
     ├─ notifications/route.ts
     ├─ me/claims/route.ts
     ├─ claims/[id]/route.ts
     ├─ items/[id]/claims/route.ts
     ├─ items/[id]/report/route.ts
     └─ admin/reports/route.ts, admin/reports/[id]/route.ts
src/components/ui|layout|home|feature  # ตามหัวข้อ 9
src/lib/
 ├─ rate-limit.ts                     # ฟังก์ชันนับจาก DB
 ├─ notify.ts                         # สร้าง Notification ภายใน transaction
 ├─ contact-visibility.ts             # กฎเปิดเผย contact (ใช้ที่เดียว)
 └─ theme / date.ts                   # ฟังก์ชันจัดรูปแบบเวลา
prisma/schema.prisma                  # เพิ่ม Claim, Notification, Report, Item.isHidden
```
`middleware.ts`: เพิ่ม `/notifications` และ `/admin` (ตรวจแค่ล็อกอิน ส่วนสิทธิ์ ADMIN ตรวจที่ page/API)

**Migration `[MUST]`:** เพิ่มคอลัมน์/ตารางด้วย migration ใหม่ ห้ามลบข้อมูลเดิม ห้ามสั่ง reset ฐานข้อมูลโดยไม่ถามผู้ใช้ก่อน

**env เพิ่มใน `.env.example`:** `ADMIN_EMAILS`, token/ตัวแปรของที่เก็บรูป (เช่น `BLOB_READ_WRITE_TOKEN`)

---

## 12. แผนงาน v2 (ทำทีละ Phase แล้วหยุด)

คำสั่งของผู้ใช้: `ทำ Phase V<N>` ห้ามข้ามไป Phase ถัดไปเอง

| Phase | งาน | เกณฑ์ผ่าน (ผู้ใช้ตรวจเอง) |
|---|---|---|
| **V0** | **ตรวจสถานะปัจจุบัน** ขอข้อมูลจากผู้ใช้: ผลของ `tree src` (ตัด node_modules), `package.json`, เวอร์ชัน Tailwind/Next.js, และคำอธิบายหรือภาพหน้าจอปัจจุบัน แล้วสรุปความต่างระหว่างของจริงกับ v1/v2 + ถามคำถาม (ไม่เกิน 3 ข้อ) เช่น ที่เก็บรูปเลือกตัวไหน ต้องการทำ P3 ไหม | ผู้ใช้ตอบ "ยืนยัน" |
| **V1** | Design system: tokens, dark mode (`next-themes`), `lucide-react`, ปรับ `Button`/`Badge`/`Avatar`/`Skeleton`/`EmptyState`/`Dropdown`/`Modal`/`FormField` | สลับ light/dark ได้ทั้งเว็บ, ปุ่มและป้ายสีถูกต้อง |
| **V2** | Navbar v2 ครบ (ยังไม่ต้องมีกระดิ่งที่ใช้ได้จริง ใส่ตำแหน่งไว้ได้) + `Footer` | ตรงตามหัวข้อ 6.2 ทุกข้อ, ทดสอบทั้งโทรศัพท์และแท็บเล็ต |
| **V3** | หน้าแรกใหม่ + `/api/stats` + ItemCard v2 + หน้ารายการใหม่ + Pagination/Sort + `loading.tsx` | เห็น Hero/สถิติ/ขั้นตอน/การ์ดใหม่, Grid 2 คอลัมน์บนแท็บเล็ต, เปลี่ยนหน้าผ่าน URL ได้ |
| **V4** | อัปโหลดรูป + placeholder Vector ตามหมวด + หน้ารายละเอียดใหม่ + ShareButton + prefill `?type=` | อัปโหลดรูปได้จริง, การ์ดไม่เคยไม่มีภาพ |
| **V5** | ระบบ Claim: migration, API, `ClaimForm`/`ClaimCard`, กฎเปิดเผย contact, แท็บใน `/my-items` | ทดสอบ 2 บัญชี: ขอ → รับ → เห็น contact; บัญชีอื่นไม่เห็น contact แม้ยิง API ตรง |
| **V6** | แจ้งเตือน: migration, `notify.ts`, API, `NotificationBell`, `/notifications`, MATCH_FOUND | กระดิ่งเพิ่มตัวเลขเมื่อมีเหตุการณ์, อ่านแล้วตัวเลขลด |
| **V7** | Report + `/admin` + `ADMIN_EMAILS` + Rate limit | ผู้ใช้ทั่วไปเข้า `/admin` ได้ 403, ซ่อนประกาศแล้วหายจากรายการสาธารณะ, เกินโควตาได้ 429 |
| **V8** | ขัดเกลา: ตรวจสติ๊กเกอร์ทั้งหมดเป็น Vector, ตรวจ Responsive โทรศัพท์และแท็บเล็ต, SEO/metadata, a11y, ตรวจ dark mode ทุกหน้า, reduced-motion, อัปเดต README | ผ่าน Checklist หัวข้อ 13 |

**ถ้าเวลาไม่พอ:** ตัด V7 ก่อน ตามด้วย V6 (V1–V5 คือแกนที่ทำให้เว็บดูสมบูรณ์และใช้งานได้จริง)

---

## 13. Definition of Done v2

**Visual & Vector System**
- [ ] ไม่มีหน้าไหนดูโล่ง: ทุกหน้ามีหัวหน้าเพจ, ไอคอน/ภาพประกอบ, และ EmptyState ที่ออกแบบแล้ว
- [ ] สติ๊กเกอร์ ป้าย และภาพประกอบทั้งหมดเป็น **Vector Graphics (SVG / Lucide Icons)** สเกลได้ไม่แตก และรองรับ Dark mode
- [ ] การ์ดทุกใบมีภาพ (รูปจริงหรือ Vector placeholder ประจำหมวดหมู่)
- [ ] Navbar ครบตามหัวข้อ 6.2, ทดสอบทั้งโทรศัพท์ แท็บเล็ต และเดสก์ท็อป
- [ ] Dark mode ใช้ได้ทุกหน้า ไม่มีข้อความจมพื้น
- [ ] Animation ไม่เกิน 400ms และปิดได้เมื่อ `prefers-reduced-motion`

**Responsive & Device Compatibility**
- [ ] ใช้งานบน **โทรศัพท์ (Mobile <640px)** ได้อย่างสมบูรณ์แบบ ไม่มี scroll แนวนอน และ touch target ≥ 44px
- [ ] ใช้งานบน **แท็บเล็ต (Tablet 640px–1023px)** ได้อย่างสมบูรณ์แบบ: การ์ดเรียง 2 คอลัมน์, Drawer/Modal พอดีจอ, สบายตา
- [ ] ใช้งานบน **เดสก์ท็อป (Desktop ≥1024px)** ได้เต็มประสิทธิภาพ: การ์ดเรียง 3 คอลัมน์, FilterBar แสดงเต็มแถว

**Function / Security**
- [ ] `contact` ไม่หลุดใน response ของผู้ที่ไม่มีสิทธิ์ (ทดสอบด้วยการเรียก API ตรง)
- [ ] Claim, Report, Admin API ตรวจสิทธิ์และ Zod ที่ฝั่งเซิร์ฟเวอร์ทุกตัว
- [ ] Rate limit คืน 429 พร้อมข้อความไทย
- [ ] การแจ้งเตือนสร้างใน transaction เดียวกับการกระทำ
- [ ] Migration ไม่ทำข้อมูลเดิมหาย

**Quality**
- [ ] ไม่มี TypeScript error / `console.error`
- [ ] Components มีเท่าที่กำหนดในหัวข้อ 9
- [ ] README อัปเดต: env ใหม่, วิธีตั้งค่าที่เก็บรูป, วิธีกำหนด ADMIN

---

## 14. ข้อความเริ่มต้น (วางต่อท้ายไฟล์นี้)

```
คุณเข้าใจ v1 และ v2 และกฎลำดับความสำคัญแล้ว
ให้ทำ Phase V0 เท่านั้น: ขอข้อมูลสถานะปัจจุบันของโปรเจกต์ตามที่ระบุ
สรุปความต่างระหว่างของจริงกับเอกสาร และถามคำถามที่จำเป็นจริง ๆ (ไม่เกิน 3 ข้อ)
แล้วหยุดรอคำตอบของฉัน ห้ามเขียนโค้ดใน Phase นี้
```

---

## 15. Changelog

| วันที่ | การเปลี่ยนแปลง |
|---|---|
| 2026-10-07 | สร้าง v2: Design system, Navbar v2, หน้าแรก, ระบบ Claim, แจ้งเตือน, อัปโหลดรูป, Report/Admin, Rate limit |
| 2026-10-07 | อัปเกรด v2.1: เพิ่มข้อกำหนดปรับสติ๊กเกอร์ทั้งหมดเป็น Vector Graphics (SVG/Lucide Icons) และเพิ่มระบบ Responsive เต็มรูปแบบสำหรับโทรศัพท์และแท็บเล็ต (Mobile & Tablet) |

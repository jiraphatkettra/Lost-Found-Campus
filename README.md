# 🎓 Lost & Found Campus (ระบบแจ้งของหายและของที่เก็บได้)

เว็บแอปพลิเคชันสำหรับนักศึกษาและบุคลากรภายในมหาวิทยาลัย ใช้สำหรับแจ้ง **ของหาย (Lost)** หรือ **ของที่เก็บได้ (Found)** พร้อมระบบยืนยันตัวตนด้วย Google OAuth และระบบแนะนำรายการที่น่าจะตรงกันอัตโนมัติ (Rule-based Matching)

---

## 📌 วัตถุประสงค์ทางการศึกษาและการนำหัวข้อวิชาไปใช้

| หัวข้อวิชา | จุดที่ปรากฏในโค้ด | รายละเอียดการทำงาน |
|---|---|---|
| **Next.js App Router** | `src/app/` | ใช้ App Router (`layout.tsx`, `page.tsx`, nested dynamic routes `[id]`) |
| **Server Components** | `items/page.tsx`, `items/[id]/page.tsx`, `my-items/page.tsx`, `ItemCard.tsx`, `StatusBadge.tsx` | ดึงข้อมูลจาก Prisma DB โดยตรงที่ฝั่งเซิร์ฟเวอร์ ลด bundle ขนาด client |
| **Client Components** | `Navbar.tsx`, `FilterBar.tsx`, `ItemForm.tsx`, `StatusChanger.tsx`, `Modal.tsx`, `MatchSuggestions.tsx` | จัดการ UI state, interactive event, optimistic update และ modal |
| **Middleware (Proxy)** | `src/middleware.ts` | ป้องกันการเข้าถึง `/items/new`, `/items/*/edit`, `/my-items` และส่งต่อ `callbackUrl` |
| **Route Handlers** | `src/app/api/` | RESTful API ตามมาตรฐาน CRUD (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) |
| **3-Tier Components** | `components/ui`, `components/layout`, `components/feature` | แยกสถาปัตยกรรมชัดเจน 10 คอมโพเนนต์หลัก |
| **State & Event** | `FilterBar.tsx`, `StatusChanger.tsx`, `Navbar.tsx`, `Modal.tsx` | Debounce การค้นหา 300ms, แท็บกรอง, Mobile drawer, Optimistic UI update |
| **Form CRUD** | `ItemForm.tsx`, `new/page.tsx`, `edit/page.tsx`, `[id]/page.tsx` | สร้าง, ดู, แก้ไข, ลบประกาศ พร้อม Modal ยืนยัน |
| **RHF + Zod** | `src/lib/schemas.ts`, `ItemForm.tsx`, `api/items` | Schema เดียวกัน validate ทั้งฝั่ง Client และ Server พร้อมข้อความแจ้งเตือนภาษาไทย |
| **Google OAuth** | `src/lib/auth.ts`, `api/auth/[...nextauth]` | ซิงค์ User เข้า Prisma DB, ผูกประกาศกับ `ownerId`, ซ่อนข้อมูลติดต่อหากไม่ล็อกอิน |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS (Mobile-first design)
- **Database:** Prisma ORM + SQLite (`dev.db`)
- **Authentication:** Auth.js / NextAuth v5 + Google Provider (JWT Session Strategy)
- **Form & Validation:** React Hook Form + Zod + `@hookform/resolvers`
- **Feedback / Toast:** `sonner`

---

## 🚀 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Installation & Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
คัดลอกไฟล์ `.env.example` เป็น `.env`:
```bash
cp .env.example .env
```

กำหนดค่าในไฟล์ `.env`:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-32-character-secret-key-here"
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
ALLOWED_EMAIL_DOMAIN=""   # เว้นว่าง = ใช้งานได้ทุกอีเมล, ใส่เช่น "student.chula.ac.th" เพื่อจำกัดเฉพาะโดเมน
```

> **คำแนะนำ:** สร้าง `AUTH_SECRET` สุ่มได้จากคำสั่ง `npx auth secret` หรือใส่สตริงยาว 32 ตัวอักษร

---

## 🔑 วิธีสร้าง Google OAuth Client ใน Google Cloud Console

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่ หรือเลือกโปรเจกต์เดิม
3. ไปที่เมนู **APIs & Services** → **OAuth consent screen**:
   - เลือก User Type เป็น **External**
   - กรอก App name, User support email, และ Developer contact email
   - กด Save and Continue จนเสร็จสิ้น
4. ไปที่เมนู **APIs & Services** → **Credentials**:
   - กด **+ CREATE CREDENTIALS** → เลือก **OAuth client ID**
   - Application type: **Web application**
   - Name: `Lost and Found Campus`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google`
5. คัดลอก **Client ID** และ **Client Secret** มาวางในไฟล์ `.env`:
   - `AUTH_GOOGLE_ID="<Client ID>"`
   - `AUTH_GOOGLE_SECRET="<Client Secret>"`

---

## 🗄️ การจัดการฐานข้อมูล (Database Migration)

รันคำสั่ง Migration ของ Prisma เพื่อสร้างตารางและสร้าง Prisma Client:
```bash
npx prisma migrate dev --name init
```

หากต้องการเปิดดูและจัดการข้อมูลผ่าน GUI:
```bash
npx prisma studio
```

---

## 💻 การรันเซิร์ฟเวอร์เพื่อพัฒนา (Development)

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)

---

## 📦 การ Build และ Run Production

```bash
npm run build
npm run start
```

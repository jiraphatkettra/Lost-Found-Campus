import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StatusBadge } from "@/components/feature/StatusBadge";
import { TypeBadge } from "@/components/feature/TypeBadge";
import { MatchSuggestions } from "@/components/feature/MatchSuggestions";
import { ItemActions } from "./ItemActions";
import { ClaimCard } from "@/components/feature/ClaimCard";
import { ShareButton } from "@/components/feature/ShareButton";
import { ContactCard } from "@/components/feature/ContactCard";
import { Avatar } from "@/components/ui/Avatar";
import { ItemGallery } from "@/components/feature/ItemGallery";
import { ItemFacts } from "@/components/feature/ItemFacts";
import { ItemDescription } from "@/components/feature/ItemDescription";
import { BackButton } from "@/components/feature/BackButton";
import { canViewItemContact } from "@/lib/contact-visibility";
import { formatRelativeTime, formatFullThaiDateTime } from "@/lib/date";
import { CONTAINER, TYPE_SCALE, SURFACES } from "@/lib/ui";
import { Lock, ShieldAlert, Inbox, CheckCircle2 } from "lucide-react";

// 2. กำหนดชนิดข้อมูลของ Props สำหรับหน้ารายละเอียดแบบ Dynamic Route (ใบงานที่ 10)
export type ItemDetailPageProps = {
  params: Promise<{ id: string }>;
};

// 3. ฟังก์ชันสร้าง Metadata แบบไดนามิกตามข้อมูลจริงในฐานข้อมูล (generateMetadata)
export async function generateMetadata({
  params,
}: ItemDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    select: { title: true, description: true, imageUrl: true, type: true },
  });

  if (!item) {
    return {
      title: "ไม่พบประกาศ | Lost & Found MJU",
    };
  }

  const typeText = item.type === "LOST" ? "ของหาย" : "ของที่พบ";
  return {
    title: `${item.title} (${typeText}) | Lost & Found MJU`,
    description: item.description.slice(0, 160),
    openGraph: {
      title: `${item.title} (${typeText}) | Lost & Found MJU`,
      description: item.description.slice(0, 160),
      ...(item.imageUrl ? { images: [{ url: item.imageUrl }] } : {}),
    },
  };
}

// 4. คอมโพเนนต์แสดงรายละเอียดประกาศสิ่งของ (Server Component)
export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  // ดึงเซสชันผู้ใช้งานปัจจุบันและรหัสประกาศจาก URL
  const session = await auth();
  const { id } = await params;

  // ค้นหาข้อมูลประกาศจากฐานข้อมูล
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  // หากไม่พบข้อมูลในฐานข้อมูล ให้แสดงหน้า 404 ผ่านฟังก์ชัน notFound()
  if (!item) {
    notFound();
  }

  // @ts-expect-error - session user role
  const isAdmin = session?.user?.role === "ADMIN";
  const isOwner = session?.user?.id === item.ownerId;

  // ตรวจสอบสิทธิ์: หากประกาศถูกซ่อน อนุญาตเฉพาะเจ้าของประกาศหรือผู้ดูแลระบบเท่านั้น
  if (item.isHidden && !isOwner && !isAdmin) {
    notFound();
  }

  // ตรวจสอบสิทธิ์: นโยบายความเป็นส่วนตัวของข้อมูลติดต่อ
  const canSeeContact = await canViewItemContact(
    item.id,
    item.ownerId,
    session?.user
      ? {
          id: session.user.id,
          // @ts-expect-error - session user role
          role: session.user.role,
        }
      : null
  );

  // ดึงรายการ Claim (เฉพาะเจ้าของประกาศ หรือดึงคำขอของตนเองถ้าเป็นผู้ขอ)
  let claimsList: Array<{
    id: string;
    itemId: string;
    claimantId: string;
    message: string;
    claimantContact: string;
    status: string;
    createdAt: Date;
    claimant: { id: string; name: string | null; image: string | null };
  }> = [];

  let userClaimSummary: { id: string; status: string } | null = null;

  if (session?.user?.id) {
    if (isOwner || isAdmin) {
      claimsList = await prisma.claim.findMany({
        where: { itemId: id },
        orderBy: { createdAt: "desc" },
        include: {
          claimant: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    } else {
      const myClaim = await prisma.claim.findFirst({
        where: {
          itemId: id,
          claimantId: session.user.id,
        },
        select: { id: true, status: true },
      });
      if (myClaim) {
        userClaimSummary = myClaim;
      }
    }
  }

  const isClaimAccepted = userClaimSummary?.status === "ACCEPTED";
  const isClaimPending = userClaimSummary?.status === "PENDING";
  const isReturned = item.status === "RETURNED";

  return (
    <div className={`${CONTAINER} py-6 sm:py-8 space-y-6 sm:space-y-8 pb-20 sm:pb-12`}>
      {/* ปุ่มนำทางย้อนกลับ (Navigation) */}
      <div className="pt-1">
        <BackButton fallbackHref="/items" label="กลับไปรายการ" />
      </div>

      {/* แบนเนอร์สถานะถูกซ่อน (เฉพาะเจ้าของหรือผู้ดูแลระบบ) */}
      {item.isHidden && (
        <div className={`${SURFACES.accentRose} p-3.5 sm:p-4 flex items-center gap-3 text-rose-800 dark:text-rose-200 text-sm font-medium`}>
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <p>ประกาศนี้ถูกซ่อนโดยผู้ดูแลระบบ และจะไม่แสดงในรายการค้นหาสาธารณะ</p>
        </div>
      )}

      {/* โครงสร้างการแสดงผลหลัก (Main Content Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* คอลัมน์ซ้าย (7/12): ItemGallery 4:3 sticky */}
        <div className="lg:col-span-7">
          <ItemGallery
            imageUrl={item.imageUrl}
            title={item.title}
            category={item.category}
          />
        </div>

        {/* คอลัมน์ขวา (5/12): การ์ดข้อมูลหลัก Surface 'card' พร้อม divide-y */}
        <div className="lg:col-span-5">
          <div className={`${SURFACES.card} p-5 sm:p-6 lg:p-7 space-y-5 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs`}>
            {/* Section 1: Header Row + Title + Poster Line */}
            <div className="space-y-3.5">
              {/* Header Row: Badges + Ghost Share Button */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <TypeBadge type={item.type} />
                  <StatusBadge status={item.status} />
                </div>
                <div className="shrink-0 ml-auto">
                  <ShareButton title={item.title} />
                </div>
              </div>

              {/* แบนเนอร์สถานะ RETURNED (ถ้าส่งคืนแล้ว) */}
              {isReturned && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>ประกาศนี้ปิดแล้ว ส่งคืนเรียบร้อย</span>
                </div>
              )}

              {/* Title (H1) */}
              <h1 className={`${TYPE_SCALE.h1} text-slate-900 dark:text-white break-words mt-2`}>
                {item.title}
              </h1>

              {/* Poster Line */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <Avatar
                  src={item.owner.image}
                  name={item.owner.name || "ผู้ใช้งาน"}
                  size="sm"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.owner.name || "ผู้ใช้งานทั่วไป"}
                </span>
                <span>·</span>
                <span
                  title={formatFullThaiDateTime(item.createdAt)}
                  className="cursor-help"
                >
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>
            </div>

            {/* Section 2: ItemFacts (หมวดหมู่ / สถานที่ / วันที่) */}
            <div className="pt-5">
              <ItemFacts
                category={item.category}
                location={item.location}
                date={item.date}
              />
            </div>

            {/* ส่วนแสดงรายละเอียดและการจัดการตามสิทธิ์ผู้ใช้งาน */}
            <div className="pt-5 space-y-5">
              {/* กรณีผู้ใช้ทั่วไปหรือยังไม่ได้ล็อกอิน: แสดงปุ่มดำเนินการหลัก */}
              {(!session?.user || (!isOwner && !isClaimAccepted)) && (
                <div>
                  <ItemActions
                    itemId={item.id}
                    itemTitle={item.title}
                    itemType={item.type}
                    initialStatus={item.status}
                    isOwner={false}
                    isLoggedIn={Boolean(session?.user)}
                    userClaim={userClaimSummary}
                  />
                </div>
              )}

              {/* รายละเอียดประกาศ */}
              <ItemDescription description={item.description} />

              {/* ข้อมูลติดต่อ (แสดงผลตามสิทธิ์และการตอบรับคำขอ) */}
              {canSeeContact ? (
                <ContactCard
                  contact={item.contact}
                  isOwner={isOwner}
                  isAdmin={isAdmin && !isOwner}
                  isAcceptedClaimant={isClaimAccepted}
                />
              ) : (
                /* ข้อความล็อกข้อมูลติดต่อเพื่อความเป็นส่วนตัว */
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    ข้อมูลติดต่อจะแสดงเมื่อคุณส่งคำขอ (Claim) และได้รับการตอบรับจากเจ้าของประกาศ
                  </span>
                </div>
              )}

              {/* แผงจัดการของเจ้าของประกาศ (Owner Actions) */}
              {isOwner && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <ItemActions
                    itemId={item.id}
                    itemTitle={item.title}
                    itemType={item.type}
                    initialStatus={item.status}
                    isOwner={true}
                    isLoggedIn={true}
                    userClaim={null}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* คำขอที่ได้รับ (แสดงเฉพาะเจ้าของประกาศ) */}
      {isOwner && (
        <section className="mt-10 sm:mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`${TYPE_SCALE.h2} text-slate-900 dark:text-white`}>
                คำขอที่ได้รับ ({claimsList.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                รายการคำขอยืนยันความเป็นเจ้าของหรือการส่งมอบจากผู้ใช้งานอื่น
              </p>
            </div>
          </div>

          {claimsList.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-xs sm:text-sm">
              ยังไม่มีผู้ใช้ส่งคำขอสำหรับประกาศนี้
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimsList.map((c) => (
                <ClaimCard
                  key={c.id}
                  claim={{
                    ...c,
                    createdAt: c.createdAt.toISOString(),
                  }}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ประกาศที่อาจตรงกัน (Match Suggestions) */}
      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <MatchSuggestions itemId={item.id} />
      </section>
    </div>
  );
}

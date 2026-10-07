import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { StatusBadge } from "@/components/feature/StatusBadge";
import { TypeBadge } from "@/components/feature/TypeBadge";
import { MatchSuggestions } from "@/components/feature/MatchSuggestions";
import { ItemActions } from "./ItemActions";
import { ClaimCard } from "@/components/feature/ClaimCard";
import { ShareButton } from "@/components/feature/ShareButton";
import { Avatar } from "@/components/ui/Avatar";
import { canViewItemContact } from "@/lib/contact-visibility";
import { formatRelativeTime, formatThaiDate } from "@/lib/date";
import {
  CATEGORY_LABEL_MAP,
  LOCATION_LABEL_MAP,
  CATEGORY_PLACEHOLDER_MAP,
} from "@/lib/constants";
import {
  ArrowLeft,
  Tag,
  MapPin,
  Calendar,
  Lock,
  Phone,
  ShieldAlert,
  Inbox,
  BookOpen,
  Smartphone,
  CreditCard,
  Backpack,
  Shirt,
  KeyRound,
  Package,
} from "lucide-react";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

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
      title: "ไม่พบประกาศ | Lost & Found Campus",
    };
  }

  const typeText = item.type === "LOST" ? "ของหาย" : "ของที่พบ";
  return {
    title: `${item.title} (${typeText}) | Lost & Found Campus`,
    description: item.description.slice(0, 160),
    openGraph: {
      title: `${item.title} (${typeText}) | Lost & Found Campus`,
      description: item.description.slice(0, 160),
      ...(item.imageUrl ? { images: [{ url: item.imageUrl }] } : {}),
    },
  };
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const session = await auth();
  const { id } = await params;

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

  if (!item) {
    notFound();
  }

  // @ts-expect-error - session user role
  const isAdmin = session?.user?.role === "ADMIN";
  const isOwner = session?.user?.id === item.ownerId;

  // กฎ 4.4: ถ้าถูกซ่อน ต้องเป็นเจ้าของหรือ ADMIN เท่านั้นที่ดูได้
  if (item.isHidden && !isOwner && !isAdmin) {
    notFound();
  }

  // กฎ 4.1: ตรวจสอบสิทธิ์การเปิดเผยข้อมูลติดต่อ
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

  const categoryName = CATEGORY_LABEL_MAP[item.category] || item.category;
  const locationName = LOCATION_LABEL_MAP[item.location] || item.location;
  const placeholderConfig =
    CATEGORY_PLACEHOLDER_MAP[item.category] ||
    CATEGORY_PLACEHOLDER_MAP.OTHER;

  const getCategoryVectorIcon = (category: string) => {
    switch (category) {
      case "BOOK":
        return <BookOpen className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
      case "ELECTRONICS":
        return <Smartphone className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
      case "CARD":
        return <CreditCard className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
      case "BAG":
        return <Backpack className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
      case "CLOTHES":
        return <Shirt className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
      case "KEYS":
        return <KeyRound className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
      default:
        return <Package className="w-16 h-16 sm:w-24 sm:h-24 opacity-80" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      {/* Back button */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/items"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="truncate">กลับหน้ารายการสิ่งของ</span>
        </Link>
      </div>

      {/* Hidden banner for owner/admin */}
      {item.isHidden && (
        <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-300">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
          <p className="text-xs sm:text-sm font-semibold">
            ประกาศนี้ถูกซ่อนโดยผู้ดูแลระบบ และจะไม่แสดงในรายการค้นหาสาธารณะ
          </p>
        </div>
      )}

      {/* Main 2-Column Detail Card (Section 7.4: 60% Left Image | 40% Right Info) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column (Images/Placeholder) 60% on desktop (col-span-7) */}
          <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[380px] lg:min-h-[520px] bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div
                className={`w-full h-full min-h-[240px] sm:min-h-[380px] lg:min-h-[520px] bg-gradient-to-br ${placeholderConfig.gradient} flex flex-col items-center justify-center text-white/90 p-6 sm:p-8`}
              >
                {getCategoryVectorIcon(item.category)}
                <span className="text-xs sm:text-sm font-bold mt-3 tracking-wide uppercase opacity-90">
                  {categoryName}
                </span>
                <span className="text-2xs sm:text-xs text-white/70 mt-0.5">
                  ไม่มีรูปภาพประกอบ
                </span>
              </div>
            )}
          </div>

          {/* Right Column (Info) 40% on desktop (col-span-5) */}
          <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Badges + Share */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TypeBadge type={item.type} />
                  <StatusBadge status={item.status} />
                </div>
                <ShareButton title={item.title} />
              </div>

              {/* Title (H1) */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {item.title}
              </h1>

              {/* Attributes List */}
              <div className="space-y-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400 w-16 sm:w-20 shrink-0">หมวดหมู่:</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {categoryName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400 w-16 sm:w-20 shrink-0">สถานที่:</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {locationName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400 w-16 sm:w-20 shrink-0">วันที่:</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {formatThaiDate(item.date)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  รายละเอียด
                </h2>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.description}
                </div>
              </div>

              {/* Poster Profile */}
              <div className="flex items-center gap-3 pt-2">
                <Avatar
                  src={item.owner.image}
                  name={item.owner.name || "ผู้ใช้งาน"}
                  size="md"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.owner.name || "ผู้ใช้มหาวิทยาลัย"}
                  </div>
                  <div className="text-xs text-slate-400">
                    โพสต์เมื่อ {formatRelativeTime(item.createdAt)}
                  </div>
                </div>
              </div>

              {/* Contact Information (ตามกฎการเปิดเผย Section 4.1) */}
              {canSeeContact ? (
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Phone className="w-4 h-4" />
                    <span>ข้อมูลติดต่อเจ้าของประกาศ</span>
                  </div>
                  <p className="text-base font-bold text-emerald-900 dark:text-emerald-200 select-all font-mono">
                    {item.contact}
                  </p>
                  <p className="text-2xs text-emerald-700 dark:text-emerald-400">
                    * คุณสามารถติดต่อเพื่อส่งมอบสิ่งของได้ทันที
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    ข้อมูลติดต่อจะแสดงเมื่อคุณส่งคำขอ (Claim) และได้รับการตอบรับจากเจ้าของ
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons (Claim/Report หรือ StatusChanger/Edit/Delete) */}
            <ItemActions
              itemId={item.id}
              itemTitle={item.title}
              itemType={item.type}
              initialStatus={item.status}
              isOwner={isOwner}
              isLoggedIn={Boolean(session?.user)}
              userClaim={userClaimSummary}
            />
          </div>
        </div>
      </div>

      {/* Owner Claims List Section (ถ้าเป็นเจ้าของประกาศ) */}
      {isOwner && (
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                คำขอที่ได้รับ ({claimsList.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                รายการคำขอยืนยันความเป็นเจ้าของหรือการพบของจากผู้ใช้งานอื่น
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

      {/* Matching Items Suggestions */}
      <MatchSuggestions itemId={item.id} />
    </div>
  );
}

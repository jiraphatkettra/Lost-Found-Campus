import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ItemCard } from "@/components/feature/ItemCard";
import { ClaimCard } from "@/components/feature/ClaimCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Plus, Package, Inbox, Send, ExternalLink } from "lucide-react";
import { ItemCardData } from "@/types";

interface MyItemsPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function MyItemsPage({ searchParams }: MyItemsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-items");
  }

  const { tab = "items" } = await searchParams;
  const userId = session.user.id;

  // โหลดข้อมูลทั้ง 3 แท็บ
  const [items, receivedClaims, sentClaims] = await Promise.all([
    // 1. ประกาศของฉัน
    prisma.item.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),

    // 2. คำขอที่ได้รับ (บนประกาศของฉัน)
    prisma.claim.findMany({
      where: {
        item: {
          ownerId: userId,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        claimant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),

    // 3. คำขอที่ฉันส่งไป (หาประกาศคนอื่น)
    prisma.claim.findMany({
      where: {
        claimantId: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            type: true,
            contact: true,
          },
        },
        claimant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            จัดการรายการของฉัน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ตรวจสอบประกาศ คำขอที่ได้รับ และสถานะคำขอที่คุณส่งไป
          </p>
        </div>

        <Link
          href="/items/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition active:scale-95 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างประกาศใหม่</span>
        </Link>
      </div>

      {/* 3 Tabs Header (Section 7.5) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 mb-8 overflow-x-auto pb-1">
        <Link
          href="/my-items?tab=items"
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            tab === "items"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>ประกาศของฉัน</span>
          <Badge variant={tab === "items" ? "primary" : "neutral"} size="sm">
            {items.length}
          </Badge>
        </Link>

        <Link
          href="/my-items?tab=received"
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            tab === "received"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>คำขอที่ได้รับ</span>
          <Badge variant={tab === "received" ? "primary" : "neutral"} size="sm">
            {receivedClaims.length}
          </Badge>
        </Link>

        <Link
          href="/my-items?tab=sent"
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            tab === "sent"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>คำขอที่ส่งไป</span>
          <Badge variant={tab === "sent" ? "primary" : "neutral"} size="sm">
            {sentClaims.length}
          </Badge>
        </Link>
      </div>

      {/* Tab 1: ประกาศของฉัน */}
      {tab === "items" && (
        <div>
          {items.length === 0 ? (
            <EmptyState
              title="คุณยังไม่มีประกาศในระบบ"
              description="หากคุณทำของสำคัญหาย หรือเก็บสิ่งของได้ในรั้วมหาวิทยาลัย สามารถเริ่มแจ้งประกาศได้ทันที"
              action={{
                label: "สร้างประกาศแรกของคุณ",
                href: "/items/new",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item as unknown as ItemCardData} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: คำขอที่ได้รับ */}
      {tab === "received" && (
        <div className="space-y-4">
          {receivedClaims.length === 0 ? (
            <EmptyState
              title="ยังไม่มีคำขอที่ส่งมาถึงคุณ"
              description="เมื่อมีเพื่อน ๆ หรือผู้พบเห็นส่งคำขอยืนยันความเป็นเจ้าของสำหรับประกาศของคุณ รายการจะแสดงที่นี่"
              action={{
                label: "ดูประกาศของฉัน",
                href: "/my-items?tab=items",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivedClaims.map((claim) => (
                <div key={claim.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
                    <span>คำขอสำหรับประกาศ:</span>
                    <Link
                      href={`/items/${claim.item.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{claim.item.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <ClaimCard
                    claim={{
                      ...claim,
                      createdAt: claim.createdAt.toISOString(),
                    }}
                    isOwner={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: คำขอที่ส่งไป */}
      {tab === "sent" && (
        <div className="space-y-4">
          {sentClaims.length === 0 ? (
            <EmptyState
              title="คุณยังไม่เคยส่งคำขอ"
              description="เมื่อคุณพบประกาศสิ่งของที่เป็นของคุณ หรือพบของที่ผู้อื่นกำลังตามหา คุณสามารถกดส่งคำขอยืนยันได้ที่หน้ารายละเอียดของสิ่งของนั้น"
              action={{
                label: "ค้นหาของในระบบ",
                href: "/items",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentClaims.map((claim) => (
                <div key={claim.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
                    <span>ประกาศที่ส่งคำขอไป:</span>
                    <Link
                      href={`/items/${claim.item.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{claim.item.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <ClaimCard
                    claim={{
                      ...claim,
                      createdAt: claim.createdAt.toISOString(),
                    }}
                    isClaimant={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

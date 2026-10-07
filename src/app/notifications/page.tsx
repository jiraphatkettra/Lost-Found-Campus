import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationList } from "@/components/feature/NotificationList";
import { Bell } from "lucide-react";

export const metadata = {
  title: "การแจ้งเตือน | Lost & Found Campus",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/notifications");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const serializedNotifications = notifications.map((n) => ({
    ...n,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <div className="mb-6 sm:mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 sm:pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2.5 sm:mb-3">
          <Bell className="w-3.5 h-3.5" />
          <span>การแจ้งเตือนในระบบ</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          การแจ้งเตือนของคุณ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          ติดตามความคืบหน้าของคำขอรับของ และประกาศใหม่ที่อาจตรงกับของที่คุณตามหา
        </p>
      </div>

      <NotificationList initialNotifications={serializedNotifications} />
    </div>
  );
}

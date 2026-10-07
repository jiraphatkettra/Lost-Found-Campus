"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/lib/date";
import {
  ShieldAlert,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface AdminReport {
  id: string;
  itemId: string;
  reason: string;
  detail?: string | null;
  status: string;
  createdAt: string;
  item: {
    id: string;
    title: string;
    type: string;
    category: string;
    location: string;
    status: string;
    isHidden: boolean;
    owner?: {
      id: string;
      name: string | null;
      email: string | null;
    } | null;
  };
  reporter: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // @ts-expect-error - session user role
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
      return;
    }

    if (status === "authenticated" && !isAdmin) {
      setLoading(false);
      return;
    }

    if (status === "authenticated" && isAdmin) {
      fetchReports();
    }
  }, [status, isAdmin, router]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("ไม่สามารถโหลดรายการรายงานได้");
      const data = await res.json();
      setReports(data);
    } catch {
      toast.error("เกิดข้อผิดพลาดในการโหลดรายงาน");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, action: "HIDE_ITEM" | "DISMISS") => {
    try {
      setActionLoadingId(reportId);
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการดำเนินการ");
      }

      if (action === "HIDE_ITEM") {
        toast.success("ซ่อนประกาศและแจ้งเตือนเจ้าของเรียบร้อยแล้ว");
      } else {
        toast.success("ยกเลิกและปิดรายงานแล้ว");
      }

      // Refresh list
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          กำลังโหลดข้อมูลระบบผู้ดูแล...
        </p>
      </div>
    );
  }

  // หากไม่ใช่ ADMIN (สิทธิ์ 403)
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-3xl text-rose-600 w-fit mx-auto mb-4">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          ไม่มีสิทธิ์เข้าถึง (403 Forbidden)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (ADMIN) เท่านั้น หากคุณเป็นผู้ดูแล กรุณาตรวจสอบอีเมลในระบบ
        </p>
        <Link
          href="/"
          className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const openReports = reports.filter((r) => r.status === "OPEN");

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <div className="mb-6 sm:mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 sm:pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-2.5 sm:mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ระบบจัดการสำหรับผู้ดูแลระบบ (ADMIN)</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          รายงานประกาศที่รอการตรวจสอบ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          ตรวจสอบและจัดการประกาศที่ถูกรายงานโดยผู้ใช้งาน ({openReports.length} รายการที่เปิดอยู่)
        </p>
      </div>

      {openReports.length === 0 ? (
        <EmptyState
          title="ไม่มีรายงานที่รอการตรวจสอบ"
          description="ขณะนี้ไม่มีประกาศที่ถูกรายงานในระบบ ชุมชนอยู่ในสถานะเรียบร้อย"
          action={{
            label: "กลับหน้าหลัก",
            href: "/",
          }}
        />
      ) : (
        <div className="space-y-4">
          {openReports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {report.reason}
                    </span>
                    <span className="text-xs text-slate-400">
                      รายงานเมื่อ {formatRelativeTime(report.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ประกาศ: &quot;{report.item.title}&quot;
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ผู้รายงาน: {report.reporter.name || "ผู้ใช้"} ({report.reporter.email})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start">
                  <Link
                    href={`/items/${report.item.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ดูประกาศ</span>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(report.id, "DISMISS")}
                    loading={actionLoadingId === report.id}
                    className="text-xs font-semibold"
                    leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                  >
                    ยกเลิกรายงาน
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleAction(report.id, "HIDE_ITEM")}
                    loading={actionLoadingId === report.id}
                    className="text-xs font-semibold"
                    leftIcon={<EyeOff className="w-3.5 h-3.5" />}
                  >
                    ซ่อนประกาศ
                  </Button>
                </div>
              </div>

              {report.detail && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-semibold">รายละเอียดจากผู้รายงาน:</span>{" "}
                    {report.detail}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

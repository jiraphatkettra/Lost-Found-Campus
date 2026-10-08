"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelativeTime } from "@/lib/date";
import {
  CATEGORIES,
  CATEGORY_LABEL_MAP,
  ITEM_TYPE_LABEL_MAP,
  ITEM_STATUS_LABEL_MAP,
  ITEM_STATUS_CLASS_MAP,
  ITEM_TYPE_CLASS_MAP,
} from "@/lib/constants";
import {
  ShieldAlert,
  LayoutDashboard,
  PackageSearch,
  AlertTriangle,
  Users,
  Search,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  Loader2,
  Lock,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface AdminStats {
  totalItems: number;
  lostItems: number;
  foundItems: number;
  returnedItems: number;
  hiddenItems: number;
  totalUsers: number;
  totalReports: number;
  openReports: number;
  totalClaims: number;
  pendingClaims: number;
  recentItems: Array<{
    id: string;
    title: string;
    type: string;
    category: string;
    status: string;
    isHidden: boolean;
    createdAt: string;
    owner?: {
      name: string | null;
      email: string | null;
    } | null;
  }>;
}

interface AdminItem {
  id: string;
  title: string;
  type: string;
  category: string;
  location: string;
  date: string;
  status: string;
  isHidden: boolean;
  imageUrl?: string | null;
  createdAt: string;
  owner?: {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
  } | null;
  _count?: {
    claims: number;
    reports: number;
  };
}

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
    imageUrl?: string | null;
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

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  _count: {
    items: number;
    claims: number;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "items" | "reports" | "users">("overview");

  // Overview Stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Items State
  const [items, setItems] = useState<AdminItem[]>([]);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsTotalPages, setItemsTotalPages] = useState(1);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemQuery, setItemQuery] = useState("");
  const [itemType, setItemType] = useState("ALL");
  const [itemCategory, setItemCategory] = useState("ALL");
  const [itemStatus, setItemStatus] = useState("ALL");
  const [itemVisibility, setItemVisibility] = useState("ALL");

  // Reports State
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportFilter, setReportFilter] = useState<"OPEN" | "ALL">("OPEN");

  // Users State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userQuery, setUserQuery] = useState("");

  // Action Loading & Modal State
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AdminItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // @ts-expect-error - session role property
  const isAdmin = session?.user?.role === "ADMIN";

  // Check auth
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    }
  }, [status, router]);

  const [refreshKey, setRefreshKey] = useState(0);

  // Unified Data Fetcher Effect
  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) return;

    let active = true;

    const loadData = async () => {
      if (activeTab === "overview") {
        try {
          const res = await fetch("/api/admin/stats");
          if (res.ok) {
            const data = await res.json();
            if (active) setStats(data);
          }
        } catch {
          toast.error("เกิดข้อผิดพลาดในการโหลดสถิติ");
        } finally {
          if (active) setLoadingStats(false);
        }
      } else if (activeTab === "items") {
        try {
          const params = new URLSearchParams();
          params.set("page", itemsPage.toString());
          params.set("limit", "12");
          if (itemQuery.trim()) params.set("q", itemQuery.trim());
          if (itemType !== "ALL") params.set("type", itemType);
          if (itemCategory !== "ALL") params.set("category", itemCategory);
          if (itemStatus !== "ALL") params.set("status", itemStatus);
          if (itemVisibility !== "ALL") params.set("visibility", itemVisibility);

          const res = await fetch(`/api/admin/items?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (active) {
              setItems(data.items || []);
              setItemsTotal(data.total || 0);
              setItemsTotalPages(data.totalPages || 1);
            }
          }
        } catch {
          toast.error("เกิดข้อผิดพลาดในการโหลดรายการประกาศ");
        } finally {
          if (active) setLoadingItems(false);
        }
      } else if (activeTab === "reports") {
        try {
          const res = await fetch("/api/admin/reports");
          if (res.ok) {
            const data = await res.json();
            if (active) setReports(data || []);
          }
        } catch {
          toast.error("เกิดข้อผิดพลาดในการโหลดรายงานปัญหา");
        } finally {
          if (active) setLoadingReports(false);
        }
      } else if (activeTab === "users") {
        try {
          const params = new URLSearchParams();
          if (userQuery.trim()) params.set("q", userQuery.trim());
          const res = await fetch(`/api/admin/users?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (active) setUsers(data.users || []);
          }
        } catch {
          toast.error("เกิดข้อผิดพลาดในการโหลดรายชื่อผู้ใช้");
        } finally {
          if (active) setLoadingUsers(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [
    status,
    isAdmin,
    activeTab,
    refreshKey,
    itemsPage,
    itemQuery,
    itemType,
    itemCategory,
    itemStatus,
    itemVisibility,
    userQuery,
  ]);

  // Toggle Item Hide / Unhide
  const handleToggleHideItem = async (item: AdminItem) => {
    try {
      setActionLoadingId(item.id);
      const nextHide = !item.isHidden;
      const res = await fetch(`/api/admin/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_HIDE", isHidden: nextHide }),
      });

      if (!res.ok) throw new Error("ไม่สามารถแก้ไขการแสดงผลได้");

      toast.success(nextHide ? `ซ่อนประกาศ "${item.title}" แล้ว` : `เปิดแสดงประกาศ "${item.title}" แล้ว`);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isHidden: nextHide } : it))
      );
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Change Item Status
  const handleChangeItemStatus = async (item: AdminItem, newStatus: string) => {
    try {
      setActionLoadingId(item.id);
      const res = await fetch(`/api/admin/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SET_STATUS", status: newStatus }),
      });

      if (!res.ok) throw new Error("ไม่สามารถเปลี่ยนสถานะได้");

      toast.success(`เปลี่ยนสถานะประกาศเป็น "${ITEM_STATUS_LABEL_MAP[newStatus] || newStatus}" แล้ว`);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: newStatus } : it))
      );
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Item
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setActionLoadingId(itemToDelete.id);
      const res = await fetch(`/api/admin/items/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("ไม่สามารถลบประกาศได้");

      toast.success(`ลบประกาศ "${itemToDelete.title}" เรียบร้อยแล้ว`);
      setItems((prev) => prev.filter((it) => it.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Report Action
  const handleReportAction = async (reportId: string, action: "HIDE_ITEM" | "DISMISS") => {
    try {
      setActionLoadingId(reportId);
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("ไม่สามารถดำเนินการกับรายงานได้");

      toast.success(action === "HIDE_ITEM" ? "ซ่อนประกาศและปิดรายงานแล้ว" : "ยกเลิกและปิดรายงานแล้ว");
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          กำลังโหลดระบบผู้ดูแลระบบ...
        </p>
      </div>
    );
  }

  // Not Admin (403)
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-3xl text-rose-600 w-fit mx-auto mb-4">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          ไม่มีสิทธิ์เข้าถึง (403 Forbidden)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (ADMIN) เท่านั้น หากคุณเป็นผู้ดูแล กรุณาติดต่อทีมเทคนิคหรือตรวจสอบอีเมลบัญชีของคุณ
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

  const openReportsCount = stats?.openReports ?? reports.filter((r) => r.status === "OPEN").length;
  const filteredReports =
    reportFilter === "OPEN" ? reports.filter((r) => r.status === "OPEN") : reports;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ศูนย์ควบคุมระบบ (ADMIN DASHBOARD)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            จัดการระบบ Lost &amp; Found Campus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ควบคุม ดูแลประกาศ ตรวจสอบรายงานผู้ใช้ และตรวจสอบสถิติแบบครบวงจร
          </p>
        </div>

        {/* Global Refresh Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey((k) => k + 1)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs font-semibold cursor-pointer"
          >
            รีเฟรชข้อมูล
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ภาพรวมระบบ</span>
        </button>

        <button
          onClick={() => setActiveTab("items")}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "items"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <PackageSearch className="w-4 h-4" />
          <span>จัดการประกาศทั้งหมด</span>
          {stats && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {stats.totalItems}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer relative ${
            activeTab === "reports"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>รายงานปัญหา</span>
          {openReportsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
              {openReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "users"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ผู้ใช้งาน</span>
          {stats && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {stats.totalUsers}
            </span>
          )}
        </button>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: ภาพรวมระบบ (OVERVIEW) */}
      {/* ================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* Total Items */}
            <div className="p-3.5 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-xs font-semibold">ประกาศทั้งหมด</span>
                <PackageSearch className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {loadingStats ? "..." : stats?.totalItems ?? 0}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="text-rose-500 font-semibold">{stats?.lostItems ?? 0} ของหาย</span>
                <span>•</span>
                <span className="text-indigo-500 font-semibold">{stats?.foundItems ?? 0} พบของ</span>
              </div>
            </div>

            {/* Resolved / Returned Items */}
            <div className="p-3.5 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-xs font-semibold">ส่งคืนสำเร็จแล้ว</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {loadingStats ? "..." : stats?.returnedItems ?? 0}
              </p>
              <p className="mt-1.5 text-[11px] text-slate-500">
                ส่งของคืนเจ้าของเรียบร้อย
              </p>
            </div>

            {/* Open Reports */}
            <div
              onClick={() => setActiveTab("reports")}
              className={`p-3.5 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-900 border transition cursor-pointer shadow-2xs ${
                (stats?.openReports ?? 0) > 0
                  ? "border-rose-300 dark:border-rose-800 hover:border-rose-400"
                  : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-xs font-semibold">รายงานรอตรวจ</span>
                <AlertTriangle
                  className={`w-4 h-4 ${
                    (stats?.openReports ?? 0) > 0 ? "text-rose-500" : "text-slate-400"
                  }`}
                />
              </div>
              <p
                className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${
                  (stats?.openReports ?? 0) > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {loadingStats ? "..." : stats?.openReports ?? 0}
              </p>
              <p className="mt-1.5 text-[11px] text-slate-500">
                {(stats?.openReports ?? 0) > 0 ? "คลิกเพื่อไปตรวจสอบด่วน" : "ไม่มีรายงานค้าง"}
              </p>
            </div>

            {/* Total Users */}
            <div
              onClick={() => setActiveTab("users")}
              className="p-3.5 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 transition cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-xs font-semibold">ผู้ใช้ในระบบ</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {loadingStats ? "..." : stats?.totalUsers ?? 0}
              </p>
              <p className="mt-1.5 text-[11px] text-slate-500">
                {stats?.totalClaims ?? 0} คำขอรับของ (Claims)
              </p>
            </div>
          </div>

          {/* Quick Actions & Recent Posts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Shortcuts */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                เมนูด่วนผู้ดูแลระบบ
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("items")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <PackageSearch className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        จัดการประกาศทั้งหมด
                      </p>
                      <p className="text-[11px] text-slate-500">ค้นหา, สลับซ่อน, ลบประกาศ</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab("reports")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        คิวรายงานปัญหา
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {openReportsCount} รายการรอตรวจสอบ
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        ตรวจสอบรายชื่อผู้ใช้งาน
                      </p>
                      <p className="text-[11px] text-slate-500">ดูรายชื่อและบทบาทสมาชิก</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                </button>

                <Link
                  href="/items"
                  target="_blank"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        เปิดหน้ารายการสาธารณะ
                      </p>
                      <p className="text-[11px] text-slate-500">ดูหน้าเว็บมุมมองผู้ใช้ทั่วไป</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Recent Items List */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ประกาศที่โพสต์ล่าสุดในระบบ
                </h3>
                <button
                  onClick={() => setActiveTab("items")}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  ดูทั้งหมด →
                </button>
              </div>

              {loadingStats ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : stats?.recentItems && stats.recentItems.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.type === "LOST"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                            }`}
                          >
                            {ITEM_TYPE_LABEL_MAP[item.type] || item.type}
                          </span>
                          {item.isHidden && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              ถูกซ่อน
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          โดย: {item.owner?.name || "ไม่ระบุชื่อ"} ({item.owner?.email || "-"})
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        <Link
                          href={`/items/${item.id}`}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">ดู</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">ยังไม่มีประกาศในระบบ</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: จัดการประกาศทั้งหมด (ITEMS MANAGEMENT) */}
      {/* ================================================================= */}
      {activeTab === "items" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search & Filters Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setItemsPage(1);
                setRefreshKey((k) => k + 1);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={itemQuery}
                  onChange={(e) => setItemQuery(e.target.value)}
                  placeholder="ค้นหาชื่อประกาศ, รายละเอียด, สถานที่ หรือชื่อ/อีเมลผู้โพสต์..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>
              <Button type="submit" size="md" className="cursor-pointer shrink-0 text-xs sm:text-sm font-semibold">
                ค้นหา
              </Button>
            </form>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Type */}
              <select
                value={itemType}
                onChange={(e) => {
                  setItemType(e.target.value);
                  setItemsPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">ประเภท: ทั้งหมด</option>
                <option value="LOST">ของหาย (LOST)</option>
                <option value="FOUND">ของที่เจอ (FOUND)</option>
              </select>

              {/* Status */}
              <select
                value={itemStatus}
                onChange={(e) => {
                  setItemStatus(e.target.value);
                  setItemsPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">สถานะ: ทั้งหมด</option>
                <option value="SEARCHING">กำลังตามหา</option>
                <option value="FOUND">พบของแล้ว</option>
                <option value="RETURNED">ส่งคืนแล้ว</option>
              </select>

              {/* Category */}
              <select
                value={itemCategory}
                onChange={(e) => {
                  setItemCategory(e.target.value);
                  setItemsPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">หมวดหมู่: ทั้งหมด</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Visibility */}
              <select
                value={itemVisibility}
                onChange={(e) => {
                  setItemVisibility(e.target.value);
                  setItemsPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">การมองเห็น: ทั้งหมด</option>
                <option value="VISIBLE">แสดงปกติ (Visible)</option>
                <option value="HIDDEN">ถูกซ่อน (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Items Content List / Table */}
          {loadingItems ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs text-slate-400">กำลังโหลดรายการประกาศ...</p>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="ไม่พบประกาศที่ตรงตามเงื่อนไข"
              description="ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อค้นหาประกาศใหม่อีกครั้ง"
              action={{
                label: "ล้างตัวกรอง",
                onClick: () => {
                  setItemQuery("");
                  setItemType("ALL");
                  setItemCategory("ALL");
                  setItemStatus("ALL");
                  setItemVisibility("ALL");
                  setItemsPage(1);
                },
              }}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>พบทั้งหมด {itemsTotal} ประกาศ</span>
                <span>หน้า {itemsPage} จาก {itemsTotalPages}</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-2xs ${
                      item.isHidden
                        ? "border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10"
                        : "border-slate-200/90 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        {item.imageUrl ? (
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                            {item.type === "LOST" ? (
                              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                            ) : (
                              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                            )}
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ITEM_TYPE_CLASS_MAP[item.type] || ""
                              }`}
                            >
                              {ITEM_TYPE_LABEL_MAP[item.type] || item.type}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {CATEGORY_LABEL_MAP[item.category] || item.category}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                ITEM_STATUS_CLASS_MAP[item.status] || ""
                              }`}
                            >
                              {ITEM_STATUS_LABEL_MAP[item.status] || item.status}
                            </span>
                            {item.isHidden && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                                ซ่อนอยู่ (HIDDEN)
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            สถานที่: {item.location} • โพสต์เมื่อ: {formatRelativeTime(item.createdAt)}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            เจ้าของ: {item.owner?.name || "ไม่ระบุ"} ({item.owner?.email || "-"})
                            {item._count && item._count.reports > 0 && (
                              <span className="ml-2 text-rose-500 font-bold">
                                🚩 มีรายงาน {item._count.reports} ครั้ง
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 w-full md:w-auto justify-end">
                        {/* Change Status Dropdown */}
                        <select
                          value={item.status}
                          disabled={actionLoadingId === item.id}
                          onChange={(e) => handleChangeItemStatus(item, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
                        >
                          <option value="SEARCHING">กำลังตามหา</option>
                          <option value="FOUND">พบของแล้ว</option>
                          <option value="RETURNED">ส่งคืนแล้ว</option>
                        </select>

                        {/* View Item */}
                        <Link
                          href={`/items/${item.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูประกาศ</span>
                        </Link>

                        {/* Toggle Hide/Unhide */}
                        <Button
                          variant={item.isHidden ? "primary" : "outline"}
                          size="sm"
                          disabled={actionLoadingId === item.id}
                          loading={actionLoadingId === item.id}
                          onClick={() => handleToggleHideItem(item)}
                          className="text-xs font-semibold"
                          leftIcon={
                            item.isHidden ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )
                          }
                        >
                          {item.isHidden ? "ยกเลิกซ่อน" : "ซ่อนประกาศ"}
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={actionLoadingId === item.id}
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="text-xs font-semibold px-2.5"
                          aria-label="ลบประกาศ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                total={itemsTotal}
                page={itemsPage}
                pageSize={12}
                totalPages={itemsTotalPages}
                onPageChange={(p) => setItemsPage(p)}
              />
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: รายงานปัญหา (REPORTS MANAGEMENT) */}
      {/* ================================================================= */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                รายการรายงานความไม่เหมาะสม
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ตรวจสอบและดำเนินการกับประกาศที่สมาชิกในระบบรายงาน
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReportFilter("OPEN")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  reportFilter === "OPEN"
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                รอการตรวจสอบ ({reports.filter((r) => r.status === "OPEN").length})
              </button>
              <button
                onClick={() => setReportFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  reportFilter === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                ทั้งหมด ({reports.length})
              </button>
            </div>
          </div>

          {loadingReports ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs text-slate-400">กำลังโหลดรายการรายงาน...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <EmptyState
              title={
                reportFilter === "OPEN"
                  ? "ไม่มีรายงานที่รอการตรวจสอบ"
                  : "ไม่พบข้อมูลรายงานในระบบ"
              }
              description={
                reportFilter === "OPEN"
                  ? "ขณะนี้ไม่มีประกาศที่ถูกรายงานค้างอยู่ในระบบ ชุมชนอยู่ในสถานะเรียบร้อย"
                  : "ยังไม่มีประวัติการรายงานจากผู้ใช้"
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
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
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            report.status === "OPEN"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : report.status === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          สถานะ: {report.status}
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
                      {report.item.owner && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          เจ้าของประกาศ: {report.item.owner.name || "ไม่ระบุ"} ({report.item.owner.email})
                        </p>
                      )}
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

                      {report.status === "OPEN" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReportAction(report.id, "DISMISS")}
                            loading={actionLoadingId === report.id}
                            className="text-xs font-semibold"
                            leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                          >
                            ยกเลิกรายงาน
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReportAction(report.id, "HIDE_ITEM")}
                            loading={actionLoadingId === report.id}
                            className="text-xs font-semibold"
                            leftIcon={<EyeOff className="w-3.5 h-3.5" />}
                          >
                            ซ่อนประกาศ
                          </Button>
                        </>
                      )}
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
      )}

      {/* ================================================================= */}
      {/* TAB 4: ผู้ใช้งานในระบบ (USERS DIRECTORY) */}
      {/* ================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  รายชื่อผู้ใช้งานในระบบ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ตรวจสอบข้อมูลสมาชิก บทบาท และจำนวนประกาศ
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRefreshKey((k) => k + 1);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="ค้นหาชื่อหรืออีเมลผู้ใช้..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>
              <Button type="submit" size="md" className="cursor-pointer shrink-0 text-xs sm:text-sm font-semibold">
                ค้นหา
              </Button>
            </form>
          </div>

          {loadingUsers ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs text-slate-400">กำลังโหลดรายชื่อผู้ใช้...</p>
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              title="ไม่พบผู้ใช้ที่ค้นหา"
              description="ลองค้นหาด้วยคำอื่น หรือตรวจสอบตัวสะกดใหม่อีกครั้ง"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {users.map((usr) => (
                <div
                  key={usr.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <Avatar src={usr.image} name={usr.name} size="lg" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {usr.name || "ไม่มีชื่อ"}
                      </p>
                      <Badge
                        variant={usr.role === "ADMIN" ? "danger" : "neutral"}
                        size="sm"
                      >
                        {usr.role}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {usr.email}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                      <span>ประกาศ: {usr._count.items} รายการ</span>
                      <span>คำขอ: {usr._count.claims} ครั้ง</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================================= */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        title="ยืนยันการลบประกาศอย่างถาวร"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-1">
              <p className="font-bold">การลบนี้ไม่สามารถย้อนกลับได้!</p>
              <p className="text-xs text-rose-600/90 dark:text-rose-400">
                ระบบจะลบข้อมูลประกาศ &quot;{itemToDelete?.title}&quot; รวมถึงข้อมูลคำขอรับของและประวัติรายงานทั้งหมดที่เกี่ยวข้อง
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
              }}
              disabled={Boolean(actionLoadingId)}
              className="cursor-pointer text-xs sm:text-sm"
            >
              ยกเลิก
            </Button>
            <Button
              variant="danger"
              size="md"
              loading={Boolean(actionLoadingId)}
              onClick={handleConfirmDelete}
              className="cursor-pointer text-xs sm:text-sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              ยืนยันการลบ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

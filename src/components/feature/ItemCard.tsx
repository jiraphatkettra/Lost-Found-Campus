import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ItemCardData } from "@/types";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import {
  CATEGORY_LABEL_MAP,
  formatLocationName,
  CATEGORIES,
} from "@/lib/constants";
import {
  MapPin,
  Clock,
  BookOpen,
  Smartphone,
  CreditCard,
  Backpack,
  Shirt,
  KeyRound,
  Package,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

export interface ItemCardProps {
  item: ItemCardData;
}

const CategoryIconMap: Record<string, React.ReactNode> = {
  BOOK: <BookOpen className="w-10 h-10" />,
  ELECTRONICS: <Smartphone className="w-10 h-10" />,
  CARD: <CreditCard className="w-10 h-10" />,
  BAG: <Backpack className="w-10 h-10" />,
  CLOTHES: <Shirt className="w-10 h-10" />,
  KEYS: <KeyRound className="w-10 h-10" />,
  OTHER: <Package className="w-10 h-10" />,
};

export function ItemCard({ item }: ItemCardProps) {
  const categoryConfig = CATEGORIES.find((c) => c.value === item.category);
  const categoryName = CATEGORY_LABEL_MAP[item.category] || item.category;
  const locationName = formatLocationName(item.location);

  // formatDistanceToNow in Thai: "2 ชั่วโมงที่แล้ว"
  let timeAgo = "";
  try {
    timeAgo = formatDistanceToNow(new Date(item.createdAt), {
      addSuffix: true,
      locale: th,
    });
  } catch {
    timeAgo = "ไม่นานมานี้";
  }

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-lg border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* 4:3 Image Area or Placeholder (Section 7.2) */}
      <div className="relative w-full aspect-4/3 bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Placeholder with category icon & gradient (Section 8.2) */
          <div
            className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${
              categoryConfig?.gradient ||
              "from-slate-500/10 to-slate-500/20 text-slate-500"
            } group-hover:scale-105 transition-transform duration-300`}
          >
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-xs mb-2">
              {CategoryIconMap[item.category] || <Package className="w-10 h-10" />}
            </div>
            <span className="text-xs font-semibold opacity-80">{categoryName}</span>
          </div>
        )}

        {/* Badges on image */}
        <div className="absolute top-2.5 left-2.5">
          <TypeBadge type={item.type} />
        </div>
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4.5 flex flex-col justify-between flex-1">
        <div>
          <span className="inline-block text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1">
            {categoryName}
          </span>
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1 leading-snug">
            {item.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2.5 sm:mb-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[55%] min-w-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{locationName}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

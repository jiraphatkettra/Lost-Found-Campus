import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export type EmptyStateAction =
  | React.ReactNode
  | {
      label: string;
      href?: string;
      onClick?: () => void;
    };

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const renderAction = () => {
    if (!action) return null;
    if (React.isValidElement(action)) return action;

    if (typeof action === "object" && "label" in action) {
      const { label, href, onClick } = action as {
        label: string;
        href?: string;
        onClick?: () => void;
      };

      if (href) {
        return (
          <Link
            href={href}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition"
          >
            {label}
          </Link>
        );
      }

      return (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition"
        >
          {label}
        </button>
      );
    }

    return null;
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-950/20">
        {icon || <Search className="w-6 h-6" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{renderAction()}</div>}
    </div>
  );
}

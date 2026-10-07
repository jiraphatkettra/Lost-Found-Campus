import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary" | "neutral";
  size?: "sm" | "md" | "lg" | string;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };
  const sizeClass = (sizeStyles as Record<string, string>)[size] || sizeStyles.md;
  const variantStyles = {
    default:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    primary:
      "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    warning:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    danger:
      "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    info:
      "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold select-none ${sizeClass} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

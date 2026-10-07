import React from "react";
import Image from "next/image";

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeMap = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300 font-semibold flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name || "Avatar"}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

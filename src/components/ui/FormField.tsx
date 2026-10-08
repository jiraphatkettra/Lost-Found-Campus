import React from "react";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  id?: string;
  required?: boolean;
  description?: string;
  helperText?: string;
}

export function FormField({
  label,
  error,
  children,
  id,
  required = false,
  description,
  helperText,
}: FormFieldProps) {
  const infoText = description || helperText;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
        <label
          htmlFor={id}
          className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
        {infoText && (
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {infoText}
          </span>
        )}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-0.5 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

"use client";

// 1. นำเข้าโมดูล ThemeProvider จาก next-themes
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// 2. กำหนดชนิดข้อมูล Props ตามสไตล์อาจารย์
export type ThemeProviderProps = {
  children: React.ReactNode;
};

// 3. คอมโพเนนต์จัดการธีมของเว็บไซต์ (กำหนดค่าเริ่มต้นเป็นธีมสว่าง / สีขาว)
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

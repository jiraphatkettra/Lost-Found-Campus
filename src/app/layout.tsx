import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Suspense } from "react";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lost & Found MJU - ศูนย์กลางแจ้งของหายและของที่เก็บได้ มหาวิทยาลัยแม่โจ้",
  description: "ระบบแจ้งของหายและของที่เก็บได้สำหรับนักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้ (Maejo University)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning className={notoSansThai.variable}>
      <body className={`${notoSansThai.className} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen flex flex-col antialiased transition-colors duration-150`}>
        <ThemeProvider>
          <SessionProvider>
            <Suspense fallback={<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />}>
              <Navbar />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

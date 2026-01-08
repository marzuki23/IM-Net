import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentikasi IMNet",
  description: "Masuk atau daftar untuk mengelola langganan internet Anda",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-900/10 flex items-center justify-center">
      {children}
    </div>
  );
}

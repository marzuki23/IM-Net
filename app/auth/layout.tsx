import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentikasi IMNet",
  description: "Masuk atau daftar untuk mengelola langganan internet Anda",
};

import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";
import { getCurrentUser } from "@/lib/sessions";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-900/10 flex flex-col">
      <HeroHeader user={user} simpleLayout={true} />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
        {children}
      </main>
      <FooterSection />
    </div>
  );
}

import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - IMNet",
  description: "Dashboard pengguna untuk manajemen langganan WiFi",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - IMNet",
  description: "Admin dashboard untuk manajemen akun dan keuangan",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, CreditCard, LogOut, Menu, FileText, Wifi, LifeBuoy, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { useTheme } from "next-themes";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Manage Accounts",
    href: "/admin/accounts",
    icon: Users,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: Wifi,
  },
  {
    title: "Financials",
    href: "/admin/financial",
    icon: CreditCard,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-indigo-600 text-white shadow-md"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-[260px] bg-white dark:bg-[#1A1C23] border-r border-slate-100 dark:border-slate-800 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full px-6 py-8">
          <div className="mb-12 flex items-center justify-start">
            <Link href="/admin">
              <Logo />
            </Link>
          </div>

          <nav className="flex-1 space-y-2.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.title}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 mt-auto pt-8">
            <button
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-full font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-300"
            >
              <LifeBuoy className="h-5 w-5" strokeWidth={2} />
              <span>Help</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-full font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" strokeWidth={2} />
              <span>Log out</span>
            </button>

            {/* Theme Toggle */}
            <div className="w-full mt-6 bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center shadow-inner">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-2 rounded-full flex items-center justify-center transition-all ${
                  mounted && theme === "light" 
                    ? "bg-white dark:bg-slate-700 shadow-sm text-amber-500" 
                    : "text-slate-400"
                }`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-2 rounded-full flex items-center justify-center transition-all ${
                  mounted && theme === "dark" 
                    ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-400" 
                    : "text-slate-400"
                }`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import { UserSidebar } from "@/components/user/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Wifi, AlertCircle, ArrowRight, CreditCard, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WIFI_PACKAGES } from "@/app/constants";

interface Subscription {
  id: string;
  packageName: string;
  speed: string;
  monthlyPrice: string;
  status: "active" | "suspended" | "expired" | "pending";
  startDate: string;
  endDate: string;
  nextBillingDate: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  accountStatus: string;
}

export function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userRes, subRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/user/subscription"),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.subscription);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  const handleSubscribe = async (pkg: typeof WIFI_PACKAGES[0]) => {
    try {
      setIsSubmitting(pkg.id);
      const res = await fetch("/api/user/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: pkg.name,
          speed: pkg.speed,
          price: pkg.price,
        }),
      });
      const data = await res.json();
      if (res.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || "Gagal membuat pembayaran");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleRenewal = async (subscriptionId: string) => {
    try {
      setIsSubmitting(subscriptionId);
      const res = await fetch("/api/user/subscriptions/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();
      if (res.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || "Gagal membuat pembayaran untuk perpanjangan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#12131A] font-inter">
      <UserSidebar />

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-[40px] font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">
                Welcome back, {user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
                It is the best time to manage your internet subscription
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1A1C23] px-4 py-2.5 flex-1 md:flex-none justify-center rounded-full border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">{user?.name}</span>
                  <span className="text-[10px] text-slate-500 leading-none">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Alert */}
          {user && user.accountStatus === "pending" && (
            <div className="rounded-[20px] bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900/50 p-5 flex items-start gap-4 shadow-sm">
              <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 mt-0.5">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                  Account Verification Pending
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  Akun Anda sedang dalam proses verifikasi oleh admin. Anda akan
                  menerima notifikasi ketika akun disetujui.
                </p>
              </div>
            </div>
          )}

          {subscription ? (
            <div className="space-y-8">
              {/* Subs pending alert */}
              {subscription.status === "pending" && (
                <div className="rounded-[20px] bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="mt-0.5">
                      <p className="font-semibold text-blue-900 dark:text-blue-200">Menunggu Pembayaran</p>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                        Selesaikan pembayaran agar layanan bisa diaktifkan.
                      </p>
                    </div>
                  </div>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                    <a href="/dashboard/payments">Lihat Tagihan</a>
                  </Button>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-indigo-500 transition-colors cursor-pointer">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Paket Saat Ini</h3>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{subscription.packageName}</span>
                    <span className="text-sm text-slate-500">{subscription.speed}</span>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      subscription.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                      subscription.status === "suspended" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" :
                      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {subscription.status === "active" && "Status: Aktif"}
                      {subscription.status === "pending" && "Menunggu Pembayaran"}
                      {subscription.status === "suspended" && "Dibekukan"}
                      {subscription.status === "expired" && "Kadaluarsa"}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-amber-500 transition-colors cursor-pointer">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tagihan Bulanan</h3>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Rp {Number.parseInt(subscription.monthlyPrice).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      Tagihan tetap
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tanggal Mulai</h3>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {new Date(subscription.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Member sejak awal
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-rose-500 transition-colors cursor-pointer">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Jatuh Tempo</h3>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {new Date(subscription.nextBillingDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={() => handleRenewal(subscription.id)}
                      disabled={isSubmitting === subscription.id}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      {isSubmitting === subscription.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Renew Now"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                    Pilih Paket Internet Baru
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Pilih langganan yang cocok untuk Anda
                  </p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md transition-shadow">
                  Lihat Semua
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {WIFI_PACKAGES.map((pkg) => (
                  <div key={pkg.id} className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                    <div className="mb-8">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                        <Wifi className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">{pkg.speed} Unlimited</p>
                    </div>
                    
                    <div className="mt-auto mb-6">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-slate-500 text-sm">per bulan</p>
                    </div>

                    <button
                      onClick={() => handleSubscribe(pkg)}
                      disabled={isSubmitting === pkg.id}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white py-3 rounded-full text-sm font-semibold transition-colors"
                    >
                      {isSubmitting === pkg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      Pilih Paket
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions / Helpers Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1A1C23] rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Akses Cepat</h3>
                <div className="flex gap-2">
                   <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-slate-900"><ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="/dashboard/subscriptions"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group"
                >
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-500">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Kelola Langganan</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Lihat rincian paket aktif</p>
                  </div>
                </a>
                
                <a
                  href="/dashboard/payments"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group"
                >
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-500">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Riwayat Pembayaran</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Struk & invoice bulanan</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-span-1 bg-white dark:bg-[#1A1C23] rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bantuan</h3>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-indigo-600 flex-shrink-0 cursor-pointer">
                  <ArrowRight className="h-4 w-4 -rotate-45" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6">Punya kendala dengan akun atau koneksi? Hubungi tim support 24/7 kami.</p>
              
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <a href="mailto:support@imnet.id" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 decoration-slate-300 underline-offset-4">support@imnet.id</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <a href="tel:+62816688467" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 decoration-slate-300 underline-offset-4">+62 8166 8846 7</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}


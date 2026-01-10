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
import { Wifi, AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  packageName: string;
  speed: string;
  monthlyPrice: string;
  status: "active" | "suspended" | "expired";
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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Selamat datang, {user?.name}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Kelola langganan dan pembayaran WiFi Anda
            </p>
          </div>

          {/* Account Status Alert */}
          {user && user.accountStatus === "pending" && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                  Akun Menunggu Persetujuan
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  Akun Anda sedang dalam proses verifikasi oleh admin. Anda akan
                  menerima notifikasi ketika akun Anda telah disetujui.
                </p>
              </div>
            </div>
          )}

          {/* Subscription Card */}
          {subscription ? (
            <Card className="border-2 border-orange-200 dark:border-orange-900">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-orange-600" />
                      {subscription.packageName}
                    </CardTitle>
                    <CardDescription>
                      Kecepatan: {subscription.speed}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${
                      subscription.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : subscription.status === "suspended"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {subscription.status === "active" && "Aktif"}
                    {subscription.status === "suspended" && "Dibekukan"}
                    {subscription.status === "expired" && "Kadaluarsa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Harga Bulanan
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      Rp{" "}
                      {Number.parseInt(
                        subscription.monthlyPrice
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Tanggal Mulai
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {new Date(subscription.startDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Perpanjangan Berikutnya
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {new Date(
                        subscription.nextBillingDate
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700">
                  <ArrowRight className="h-4 w-4" />
                  Perpanjang Langganan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Belum Ada Langganan</CardTitle>
                <CardDescription>
                  Anda belum memiliki langganan aktif
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Ajukan langganan baru untuk mulai menikmati layanan WiFi kami.
                </p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <a href="/dashboard/requests">Ajukan Langganan Baru</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/dashboard/subscriptions"
              className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Wifi className="h-6 w-6 text-orange-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Kelola Langganan
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Lihat detail dan kelola langganan Anda
              </p>
            </a>
            <a
              href="/dashboard/payments"
              className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <CreditCard className="h-6 w-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Riwayat Pembayaran
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Lihat semua transaksi pembayaran Anda
              </p>
            </a>
            <a
              href="/dashboard/requests"
              className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="h-6 w-6 text-purple-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Pengajuan Akun
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Ajukan perubahan atau upgrade langganan
              </p>
            </a>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Email
                  </p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Status Akun
                  </p>
                  <Badge
                    className={getAccountStatusColor(user?.accountStatus || "")}
                  >
                    {user?.accountStatus === "active" && "Aktif"}
                    {user?.accountStatus === "pending" &&
                      "Menunggu Persetujuan"}
                    {user?.accountStatus === "suspended" && "Dibekukan"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bantuan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Membutuhkan bantuan? Hubungi tim support kami melalui:
                </p>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <a href="mailto:support@imnet.id">
                      Email: support@imnet.id
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <a href="tel:+62XXXXXXXXXX">Telepon: +62 XXX XXXX XXXX</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { CreditCard, FileText } from "lucide-react";

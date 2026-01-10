"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, DollarSign, Users, TrendingUp } from "lucide-react";

interface FinancialStats {
  totalRevenue: number;
  activeSubscriptions: number;
  newSubscriptionsThisMonth: number;
}

export default function AdminFinancialPage() {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/financial/stats");
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Rekap Keuangan
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Overview performa bisnis dan pendapatan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pendapatan
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {stats?.totalRevenue.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Semua waktu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pelanggan Aktif
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.activeSubscriptions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Langganan aktif saat ini
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pertumbuhan Bulan Ini
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{stats?.newSubscriptionsThisMonth}
                </div>
                <p className="text-xs text-muted-foreground">
                  Langganan baru bulan ini
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for Chart */}
          <Card className="col-span-3">
             <CardHeader>
                <CardTitle>Grafik Pendapatan (Demo)</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <p className="text-slate-400">Chart implementation would go here (requires chart library)</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

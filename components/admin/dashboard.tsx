"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, CreditCard, TrendingUp, AlertCircle, Wifi } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/admin/financial/chart");
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#12131A] font-inter">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-[40px] font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">
                Dashboard Admin
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
                Platform management & financial overview
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1A1C23] px-4 py-2.5 flex-1 md:flex-none justify-center rounded-full border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">Administrator</span>
                  <span className="text-[10px] text-slate-500 leading-none">admin@imnet.id</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-indigo-500 transition-colors cursor-pointer">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Pengguna</h3>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalUsers}</span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  +12.1%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-amber-500 transition-colors cursor-pointer">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Langganan Aktif</h3>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {stats.activeSubscriptions}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  +6.3%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-blue-500 transition-colors cursor-pointer">
                <CreditCard className="h-4 w-4" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Pendapatan Bulan Ini</h3>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Rp {stats.monthlyRevenue.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                  +2.4%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-rose-500 transition-colors cursor-pointer">
                <AlertCircle className="h-4 w-4" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tertunda</h3>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {stats.pendingPayments}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Dalam proses tagihan
                </span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-[#1A1C23] p-6 lg:p-8 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tren Pendapatan</h3>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#818CF8" // indigo-400
                      name="Pendapatan"
                      strokeWidth={4}
                      dot={{r: 4, strokeWidth: 2}}
                      activeDot={{r: 6}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1C23] p-6 lg:p-8 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Status Pembayaran</h3>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      cursor={{fill: 'transparent'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    <Bar dataKey="completed" fill="#818CF8" name="Selesai" radius={[6, 6, 6, 6]} barSize={12} />
                    <Bar dataKey="pending" fill="#C7D2FE" name="Tertunda" radius={[6, 6, 6, 6]} barSize={12} />
                    <Bar dataKey="failed" fill="#FCA5A5" name="Gagal" radius={[6, 6, 6, 6]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions / Shortcuts mapped from the original logic */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <a
              href="/admin/accounts"
              className="group p-6 rounded-[24px] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-white dark:bg-slate-800 rounded-[16px] w-fit shadow-sm relative z-10 mb-12">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white z-10">Manajemen Akun</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 z-10 max-w-[80%]">
                Kelola pendaftaran dan atur status akses pelanggan aktif.
              </p>
            </a>
            
            <a
              href="/admin/financial"
              className="group p-6 rounded-[24px] bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-white dark:bg-slate-800 rounded-[16px] w-fit shadow-sm relative z-10 mb-12">
                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white z-10">Rekap Keuangan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 z-10 max-w-[80%]">
                Analisis laporan pemasukan bulanan untuk pantau pertumbuhan.
              </p>
            </a>

            <a
              href="/admin/subscriptions"
              className="group p-6 rounded-[24px] bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-white dark:bg-slate-800 rounded-[16px] w-fit shadow-sm relative z-10 mb-12">
                <Wifi className="h-6 w-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white z-10">Daftar Langganan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 z-10 max-w-[80%]">
                Pantau status perangkat keras dan internet yang berjalan.
              </p>
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}

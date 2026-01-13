"use client";

import { UserSidebar } from "@/components/user/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2, Download } from "lucide-react";

interface Payment {
  id: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: string;
  invoiceNumber: string;
  description: string;
  paidDate: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "cancelled":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "pending":
        return "Tertunda";
      case "failed":
        return "Gagal";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Riwayat Pembayaran
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Kelola dan lihat riwayat pembayaran Anda
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaksi Pembayaran</CardTitle>
              <CardDescription>
                Daftar semua pembayaran yang telah dibuat
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                </div>
              ) : payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4">Invoice</th>
                        <th className="text-left py-3 px-4">Deskripsi</th>
                        <th className="text-left py-3 px-4">Metode</th>
                        <th className="text-left py-3 px-4">Jumlah</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Tanggal</th>
                        <th className="text-right py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <td className="py-3 px-4 font-medium">
                            {payment.invoiceNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {payment.description}
                          </td>
                          <td className="py-3 px-4 capitalize">
                            {payment.paymentMethod}
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            Rp{" "}
                            {Number.parseInt(payment.amount).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={getStatusColor(payment.paymentStatus)}
                            >
                              {getStatusLabel(payment.paymentStatus)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(payment.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button size="sm" variant="ghost" className="gap-1">
                              <Download className="h-3 w-3" />
                              Unduh
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">
                    Belum ada pembayaran
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

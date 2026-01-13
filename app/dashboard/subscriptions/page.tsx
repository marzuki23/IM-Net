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
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Wifi, Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  packageName: string;
  speed: string;
  monthlyPrice: string;
  installationFee: string;
  status: string;
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  isAutoRenewal: boolean;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/subscriptions");
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewal = async (subscriptionId: string) => {
    try {
      const response = await fetch("/api/user/subscriptions/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      if (response.ok) {
        // Redirect to payment
        const data = await response.json();
        window.location.href = `/dashboard/payments/${data.paymentId}`;
      }
    } catch (error) {
      console.error("Error initiating renewal:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Langganan Saya
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Kelola dan lihat detail langganan aktif Anda
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="grid gap-6">
              {subscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="flex items-center gap-2">
                          <Wifi className="h-5 w-5" />
                          {sub.packageName}
                        </CardTitle>
                        <Badge
                          className={
                            sub.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900"
                              : sub.status === "suspended"
                              ? "bg-red-100 text-red-800 dark:bg-red-900"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-700"
                          }
                        >
                          {sub.status === "active" && "Aktif"}
                          {sub.status === "suspended" && "Dibekukan"}
                          {sub.status === "expired" && "Kadaluarsa"}
                        </Badge>
                      </div>
                      <CardDescription>Kecepatan: {sub.speed}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Harga Bulanan
                        </p>
                        <p className="font-semibold mt-1">
                          Rp{" "}
                          {Number.parseInt(sub.monthlyPrice).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Tanggal Mulai
                        </p>
                        <p className="font-semibold mt-1">
                          {new Date(sub.startDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Perpanjangan
                        </p>
                        <p className="font-semibold mt-1">
                          {new Date(sub.nextBillingDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Auto Renewal
                        </p>
                        <p className="font-semibold mt-1">
                          {sub.isAutoRenewal ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleRenewal(sub.id)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Perpanjang Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle>Belum Ada Langganan</CardTitle>
                <CardDescription>Anda belum memiliki langganan</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <a href="/dashboard/requests">Ajukan Langganan Baru</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

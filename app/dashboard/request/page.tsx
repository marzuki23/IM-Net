"use client";

import type React from "react";

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
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Request {
  id: string;
  requestType: string;
  status: string;
  desiredPackage: string;
  reason: string;
  rejectionReason: string;
  createdAt: string;
  approvedAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/user/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: formData.get("requestType"),
          desiredPackage: formData.get("desiredPackage"),
          reason: formData.get("reason"),
        }),
      });

      if (response.ok) {
        await fetchRequests();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Pengajuan Akun
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Kelola pengajuan langganan dan upgrade
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4" />
                  Pengajuan Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pengajuan Langganan Baru</DialogTitle>
                  <DialogDescription>
                    Ajukan langganan atau upgrade langganan Anda
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Tipe Pengajuan</Label>
                    <select
                      id="requestType"
                      name="requestType"
                      required
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950"
                    >
                      <option value="new_account">Langganan Baru</option>
                      <option value="plan_upgrade">Upgrade Paket</option>
                      <option value="plan_downgrade">Downgrade Paket</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desiredPackage">
                      Paket yang Diinginkan
                    </Label>
                    <Input
                      id="desiredPackage"
                      name="desiredPackage"
                      placeholder="Contoh: Paket 50Mbps"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Alasan</Label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows={4}
                      placeholder="Jelaskan alasan pengajuan Anda"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Kirim Pengajuan
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengajuan</CardTitle>
              <CardDescription>
                Pengajuan langganan dan upgrade Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                </div>
              ) : requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {request.requestType === "new_account" &&
                                "Langganan Baru"}
                              {request.requestType === "plan_upgrade" &&
                                "Upgrade Paket"}
                              {request.requestType === "plan_downgrade" &&
                                "Downgrade Paket"}
                            </h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusLabel(request.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Paket: {request.desiredPackage}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            Alasan: {request.reason}
                          </p>
                          {request.rejectionReason && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                              Alasan penolakan: {request.rejectionReason}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
                            Dibuat:{" "}
                            {new Date(request.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">
                    Belum ada pengajuan
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

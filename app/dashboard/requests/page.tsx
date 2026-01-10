"use client";

import { useState } from "react";
import { UserSidebar } from "@/components/user/sidebar";
import { WIFI_PACKAGES } from "@/app/config/packages";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function UserRequestsPage() {
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const handleRequest = async () => {
    if (!selectedPkg) return;

    try {
      setLoading(true);
      const res = await fetch("/api/user/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPkg.id,
          packageName: selectedPkg.name,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal mengirim pengajuan");
        return;
      }

      alert("Pengajuan berhasil dikirim! Admin akan segera memprosesnya.");
      setOpen(false);
      setReason("");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Pilih Paket Internet
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sesuaikan dengan kebutuhan aktivitas digital Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WIFI_PACKAGES.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`flex flex-col relative ${
                  pkg.recommended 
                    ? "border-orange-500 shadow-lg shadow-orange-500/10 scale-105 z-10" 
                    : ""
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      Rekomendasi
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-center">{pkg.speed}</CardTitle>
                  <CardDescription className="text-center font-medium text-slate-900 dark:text-white mt-2">
                    {pkg.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-muted-foreground">/bulan</span>
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-center text-green-600 dark:text-green-400">
                        {pkg.installationFee === 0 
                            ? "Gratis Instalasi" 
                            : `Instalasi Rp ${pkg.installationFee.toLocaleString("id-ID")}`}
                     </p>
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => setSelectedPkg(pkg)}
                      >
                        Pilih Paket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Konfirmasi Pengajuan</DialogTitle>
                        <DialogDescription>
                          Anda akan mengajukan pemasangan untuk paket <strong>{selectedPkg?.name} ({selectedPkg?.speed})</strong>.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Catatan Tambahan (Opsional)</label>
                            <Textarea 
                                placeholder="Contoh: Tolong pasang di hari minggu" 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                         </div>
                      </div>
                      <DialogFooter>
                        <Button 
                            onClick={handleRequest} 
                            disabled={loading}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Kirim Pengajuan
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

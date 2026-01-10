"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { WIFI_PACKAGES } from "@/app/config/packages";

export default function PricingWiFi() {
  return (
    <section
      id="paket"
      className="py-16 md:py-24 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/10 dark:to-slate-950"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Paket Internet Kami
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda dan nikmati internet
            tanpa batas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WIFI_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`flex flex-col transition-all border-2 ${
                pkg.recommended
                  ? "border-orange-600 dark:border-orange-400 transform lg:scale-105 shadow-xl bg-white dark:bg-slate-900"
                  : "border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-900/50 bg-slate-50 dark:bg-slate-900/50"
              }`}
            >
              {pkg.recommended && (
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 px-4 rounded-t-lg flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Rekomendasi Terbaik
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {(pkg.price / 1000).toFixed(0)}K
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      /bulan
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4">
                    {pkg.speed}
                  </p>
                </div>

                <div className="space-y-3">
                  {pkg.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  className={`w-full ${
                    pkg.recommended
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  }`}
                >
                  <Link href="/dashboard/requests">Pilih Paket</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl text-center">
          <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">
            Belum yakin? Hubungi tim kami untuk konsultasi gratis dan penawaran
            khusus
          </p>
          <Button
            asChild
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Link href="#">Hubungi Kami Sekarang</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

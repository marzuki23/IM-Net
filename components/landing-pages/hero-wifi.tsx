import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/header";
import { ChevronRight, Signal } from "lucide-react";
import Image from "next/image";

export default function HeroWiFi() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="relative bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/10 dark:to-slate-950 pt-13 pb-16 md:pt-29 md:pb-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left side - Text content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-900/70 border border-orange-200 dark:border-orange-900/50 mb-6">
                    <Signal className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      Koneksi Internet Terdepan
                    </span>
                  </div>

                  <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                    Internet Cepat &{" "}
                    <span className="text-orange-600 dark:text-orange-400">
                      Stabil
                    </span>{" "}
                    Untuk Rumah Anda
                  </h1>

                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-lg mb-8 leading-relaxed">
                    Nikmati kecepatan internet hingga 100 Mbps dengan koneksi
                    stabil sepanjang waktu. Paket berlangganan bulanan
                    terjangkau untuk seluruh keluarga Anda.
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Link href="/auth">
                        <span>Mulai Berlangganan</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                    >
                      <Link href="#paket">
                        <span>Lihat Paket Harga</span>
                      </Link>
                    </Button>
                  </div>

                  {/* Trust metrics */}
                  {/* <div className="pt-8 border-t border-orange-200 dark:border-orange-900/30">
                    <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                      Dipercaya oleh ribuan pelanggan di seluruh kota
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          5000+
                        </p>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                          Pelanggan Aktif
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          99.5%
                        </p>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                          Uptime Guarantee
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          24/7
                        </p>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                          Customer Support
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Right side - Hero image */}
                <div className="relative h-96 md:h-full md:min-h-[500px] flex items-center justify-center">
                  <div className="relative w-full h-full max-w-md">
                    <Image
                      src="/hero.png"
                      alt="WiFi service illustration"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

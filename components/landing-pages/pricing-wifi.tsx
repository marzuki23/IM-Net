"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WIFI_PACKAGES } from "@/app/config/packages";
import Image from "next/image";

const packageImages: Record<string, string> = {
  "pkg-10mbps": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop",
  "pkg-20mbps": "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1932&auto=format&fit=crop",
  "pkg-40mbps": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop",
  "pkg-60mbps": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
};

export default function PricingWiFi() {
  return (
    <section
      id="paket"
      className="py-16 md:py-24 bg-[#FAF8F5] dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2a2a2a] dark:text-white mb-6">
              Pilihan Paket Terbaik
            </h2>
            
            {/* Nav pills acting as filters in reference */}
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-sm font-medium text-stone-500 overflow-x-auto pb-2">
              <span className="text-[#2a2a2a] dark:text-white font-bold whitespace-nowrap border-b-2 border-[#2a2a2a] dark:border-white pb-1">Populer</span>
              <span className="cursor-pointer hover:text-[#2a2a2a] transition-colors whitespace-nowrap">Gaming</span>
              <span className="cursor-pointer hover:text-[#2a2a2a] transition-colors whitespace-nowrap">Keluarga</span>
              <span className="cursor-pointer hover:text-[#2a2a2a] transition-colors whitespace-nowrap">Sultan</span>
            </div>
          </div>
          
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 border-stone-300 text-[#2a2a2a] dark:text-white hover:bg-stone-200"
          >
            <Link href="#paket">Eksplor semua paket</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {WIFI_PACKAGES.map((pkg) => (
            <Link href="/dashboard" key={pkg.id} className="group flex flex-col cursor-pointer">
              <div className="relative w-full h-80 rounded-[2rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={packageImages[pkg.id] || packageImages["pkg-10mbps"]}
                  alt={pkg.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-[#2a2a2a]">
                  {pkg.speed}
                </div>
              </div>
              
              <div className="px-2">
                <h3 className="text-xl font-bold text-[#2a2a2a] dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-stone-500 text-sm mb-2">{pkg.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg text-[#2a2a2a] dark:text-white">Rp {(pkg.price / 1000).toFixed(0)}K<span className="font-normal text-sm text-stone-500">/bln</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

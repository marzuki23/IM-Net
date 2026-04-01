import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesWiFi() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#FAF8F5] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#2a2a2a] dark:text-white">
            Keunggulan Layanan Kami
          </h2>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 border-stone-300 text-[#2a2a2a] dark:text-white hover:bg-stone-200"
          >
            <Link href="#features">Pelajari selengkapnya</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feature */}
          <div className="lg:col-span-7 group cursor-pointer">
            <div className="w-full h-[400px] relative rounded-[2rem] overflow-hidden mb-6">
              <Image
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                alt="Kecepatan Ultra Cepat"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <span className="text-sm font-bold text-orange-500 mb-3 block">Infrastruktur Terkini</span>
              <h3 className="text-3xl font-extrabold text-[#2a2a2a] dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                Koneksi Stabil 100% Fiber Optic Tanpa Hambatan Cuaca
              </h3>
              <p className="text-stone-500 mb-4 max-w-2xl leading-relaxed">
                Nikmati kecepatan bandwidth yang konsisten dengan dedikasi fiber optic langsung ke rumah Anda. Streaming, gaming, dan produktivitas harian tidak akan terganggu meskipun kondisi cuaca buruk melanda.
              </p>
            </div>
          </div>

          {/* Secondary Features list */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-start">
            {/* Feature Item 1 */}
            <div className="flex gap-6 group cursor-pointer items-center">
              <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=2000&auto=format&fit=crop"
                  alt="Customer Support"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-500 mb-2 block">Dukungan Responsif</span>
                <h4 className="text-xl font-bold text-[#2a2a2a] dark:text-white leading-tight mb-2 group-hover:text-orange-500 transition-colors">
                  Customer Support Siap Siaga 24/7 Setiap Saat
                </h4>
                <p className="text-stone-500 text-sm">Tim teknis dan layanan pelanggan kami siap membantu instalasi dan kendala Anda 24 jam sehari.</p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="flex gap-6 group cursor-pointer items-center">
              <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1614064548016-0b5c13ca2c85?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Keamanan Data"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-green-500 mb-2 block">Keamanan Tinggi</span>
                <h4 className="text-xl font-bold text-[#2a2a2a] dark:text-white leading-tight mb-2 group-hover:text-orange-500 transition-colors">
                  Jaminan Privasi & Perlindungan Anti-Ancaman Cyber
                </h4>
                <p className="text-stone-500 text-sm">Jaringan difasilitasi dengan enkripsi terbaik untuk melindungi aktivitas digital keluarga Anda.</p>
              </div>
            </div>

            {/* Feature Item 3 */}
            <div className="flex gap-6 group cursor-pointer items-center">
              <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                  alt="Instalasi"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-500 mb-2 block">Cepat & Praktis</span>
                <h4 className="text-xl font-bold text-[#2a2a2a] dark:text-white leading-tight mb-2 group-hover:text-orange-500 transition-colors">
                  Instalasi Gratis oleh Tim Profesional Kami
                </h4>
                <p className="text-stone-500 text-sm">Proses pendaftaran cepat dan pemasangan perangkat dilakukan secara profesional dan gratis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

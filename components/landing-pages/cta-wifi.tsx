"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CTAWiFi() {
  return (
    <section className="pb-16 md:pb-32 px-6 md:px-12 bg-[#FAF8F5] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl relative rounded-[2rem] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1510442650500-93217e634e4c?q=80&w=2155&auto=format&fit=crop"
            alt="Beautiful vast landscape"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 py-24 px-6 flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-8 max-w-2xl leading-tight">
            Dapatkan Kecepatan TERBAIK dan Harga TERJANGKAU
          </h2>

          {/* <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 mb-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-6 py-4 rounded-full text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <Button
              type="submit"
              className="px-8 py-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-transform hover:scale-105"
            >
              Berlangganan
            </Button>
          </form>

          <p className="text-white/80 text-sm">
            Daftar untuk newsletter kami dan penawaran eksklusif. Baca <a href="#" className="underline">Kebijakan Privasi</a>.
          </p> */}
        </div>
      </div>
    </section>
  );
}

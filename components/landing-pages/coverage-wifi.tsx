import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function CoverageWiFi() {
  return (
    <section id="coverage" className="py-16 md:py-32 bg-[#FAF8F5] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2a2a2a] dark:text-white mb-12">
          Cerita Pelanggan Kami
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Testimonial Section */}
          <div className="md:col-span-4 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1607165446756-e594f746de79?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Customer"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-[#2a2a2a] dark:text-white">Ahmat Fauzi</h4>
                <p className="text-sm text-stone-500">Tegal, Jawa Tengah</p>
              </div>
            </div>

            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-orange-500 text-orange-500" />
              ))}
            </div>

            <h3 className="text-xl font-bold text-[#2a2a2a] dark:text-white mb-4">
              Pengalaman Internet Luar Biasa
            </h3>
            
            <p className="text-stone-500 leading-relaxed mb-6">
              "Semenjak beralih menggunakan IMNet, koneksi di rumah tidak pernah putus saat digunakan Zoom atau anak-anak bermain game online. Harganya sangat terjangkau dibanding provider sebelumnya. Sangat direkomendasikan untuk area Tegal!"
            </p>
            
            <p className="text-stone-500 font-bold mb-4">
              Tertarik dengan area jangkauan kami?
            </p>
          </div>

          {/* Center Image Component */}
          <div className="md:col-span-4">
            <div className="w-full h-[500px] relative rounded-[2rem] overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Family using internet"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Image & Button */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div className="w-full h-[350px] relative rounded-[2rem] overflow-hidden shadow-xl mb-8 group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1593022378943-47702f23cfbd?q=80&w=1969&auto=format&fit=crop"
                alt="Tech Setup"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                 {/* Play icon abstraction for visual fidelity */}
                 <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1" />
                 </div>
              </div>
            </div>

            <div className="flex justify-end mt-auto">
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 border-stone-300 text-[#2a2a2a] dark:text-white hover:bg-stone-200"
              >
                <Link href="#coverage">Lihat semua cerita</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

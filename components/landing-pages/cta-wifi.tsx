import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTAWiFi() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 dark:from-orange-700 dark:via-orange-600 dark:to-red-700 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Siap Untuk Koneksi Internet Terbaik?
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Bergabunglah dengan ribuan pelanggan yang telah merasakan kecepatan
          dan stabilitas internet kami. Daftar sekarang dan nikmati layanan
          terbaik dengan harga terjangkau.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 gap-2 font-semibold"
          >
            <Link href="/auth">
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/20 bg-transparent font-semibold"
          >
            <Link href="#paket">Lihat Paket</Link>
          </Button>
        </div>

        <p className="text-white/80 text-sm mt-8">
          Tidak perlu kartu kredit untuk memulai. Instalasi gratis di area kami.
        </p>
      </div>
    </section>
  );
}

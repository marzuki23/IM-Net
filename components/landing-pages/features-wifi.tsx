import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Headphones, MapPin, Lock, WifiIcon } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

const features: Feature[] = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Kecepatan Ultra Cepat",
    description:
      "Nikmati kecepatan internet hingga 100 Mbps dengan teknologi fiber optic terkini",
    colorClass:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Koneksi Stabil & Aman",
    description:
      "Jaminan stabilitas 99.5% uptime dengan enkripsi keamanan tingkat enterprise",
    colorClass:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "Support 24/7",
    description:
      "Tim dukungan pelanggan kami siap membantu Anda kapan saja melalui berbagai channel",
    colorClass:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Jangkauan Luas",
    description:
      "Tersedia di berbagai area dengan router yang ditempatkan strategis untuk sinyal optimal",
    colorClass:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Privasi Terjamin",
    description:
      "Teknologi keamanan terbaru melindungi data dan privasi Anda setiap saat",
    colorClass: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
  {
    icon: <WifiIcon className="w-6 h-6" />,
    title: "Instalasi Mudah",
    description:
      "Proses instalasi gratis dan cepat tanpa ribet dengan teknisi berpengalaman kami",
    colorClass:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
];

export default function FeaturesWiFi() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Kami menyediakan solusi internet terbaik dengan layanan pelanggan
            yang responsif dan harga yang kompetitif untuk setiap kebutuhan Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all border-0 bg-slate-50 dark:bg-slate-900/50"
            >
              <CardHeader className="pb-4">
                <div
                  className={`p-3 ${feature.colorClass} rounded-lg w-fit mb-2`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

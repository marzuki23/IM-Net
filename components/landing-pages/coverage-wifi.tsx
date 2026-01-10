import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Home, Building2, Landmark } from "lucide-react";

interface CoverageArea {
  icon: React.ReactNode;
  name: string;
  description: string;
  areas: string[];
}

const coverageAreas: CoverageArea[] = [
  {
    icon: <Home className="w-6 h-6" />,
    name: "Area Perumahan",
    description: "Jangkauan luas di kompleks perumahan modern dan tradisional",
    areas: [
      "Perumahan Griya Asri",
      "Kompleks Bukit Indah",
      "Cluster Damai Sentosa",
      "Perumahan Sejahtera Jaya",
    ],
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    name: "Area Komersial",
    description: "Koneksi reliable untuk kantor, toko, dan usaha kecil",
    areas: [
      "Pusat Bisnis Sentral",
      "Ruko Jalan Utama",
      "Mall & Pusat Perbelanjaan",
      "Area Industri Kecil",
    ],
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    name: "Area Publik",
    description: "Akses WiFi di tempat-tempat strategis untuk kemudahan Anda",
    areas: [
      "Kantor Pemerintah",
      "Sekolah & Kampus",
      "Pusat Kesehatan",
      "Tempat Ibadah",
    ],
  },
];

export default function CoverageWiFi() {
  return (
    <section id="coverage" className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-slate-950 dark:to-blue-950/10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-900/50 mb-6">
            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Jangkauan Luas
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Area Jangkauan Kami
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tersedia di berbagai area strategis untuk memastikan Anda
            mendapatkan koneksi terbaik
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {coverageAreas.map((area, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all border-0 bg-white dark:bg-slate-900/50"
            >
              <CardHeader className="pb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400 w-fit mb-2">
                  {area.icon}
                </div>
                <CardTitle>{area.name}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {area.areas.map((area, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <span className="text-orange-600 dark:text-orange-400 font-bold mt-1">
                        •
                      </span>
                      {area}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900/50 rounded-xl">
          <p className="text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              Tidak melihat area Anda?
            </span>{" "}
            Hubungi tim kami untuk informasi ketersediaan di wilayah lain atau
            untuk mengetahui rencana ekspansi kami.
          </p>
        </div>
      </div>
    </section>
  );
}

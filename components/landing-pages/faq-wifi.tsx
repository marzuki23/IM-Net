"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQWiFi() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "wifi",
      question: "Bagaimana cara berlangganan internet WiFi?",
      answer:
        "Sangat mudah! Kunjungi halaman pendaftaran kami, pilih paket yang sesuai dengan kebutuhan, isi data pribadi Anda, dan pilih metode pembayaran. Tim kami akan menghubungi Anda untuk menjadwalkan instalasi.",
    },
    {
      id: "item-2",
      icon: "zap",
      question: "Berapa kecepatan internet yang benar-benar saya dapatkan?",
      answer:
        "Kecepatan yang tertera adalah kecepatan maksimal yang bisa dicapai. Kecepatan aktual tergantung pada kondisi jaringan, jumlah perangkat yang terhubung, dan kualitas perangkat Anda. Kami menjamin minimal 80% dari kecepatan paket.",
    },
    {
      id: "item-3",
      icon: "credit-card",
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Kami menerima pembayaran melalui transfer bank, e-wallet (Go-Pay, OVO, DANA), dan kartu kredit. Pembayaran dilakukan setiap bulan secara otomatis sesuai dengan tanggal yang telah Anda pilih.",
    },
    {
      id: "item-4",
      icon: "wrench",
      question: "Berapa lama proses instalasi?",
      answer:
        "Instalasi gratis kami biasanya selesai dalam 2-3 hari kerja setelah pembayaran dikonfirmasi. Teknisi kami akan datang ke lokasi Anda dengan peralatan lengkap dan akan mengkonfigurasi semuanya hingga siap digunakan.",
    },
    {
      id: "item-5",
      icon: "headphones",
      question: "Bagaimana jika ada masalah dengan koneksi saya?",
      answer:
        "Tim dukungan kami siap membantu 24/7. Hubungi kami melalui chat, email, atau telepon. Untuk masalah teknis, kami akan melakukan troubleshooting langsung atau mengirim teknisi jika diperlukan tanpa biaya tambahan.",
    },
    {
      id: "item-6",
      icon: "lock",
      question: "Apakah koneksi saya aman dan pribadi?",
      answer:
        "Ya, sangat aman. Kami menggunakan enkripsi WPA3 dan firewall tingkat enterprise untuk melindungi data Anda. Setiap akun dilindungi dengan password yang kuat dan kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FAF8F5] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#2a2a2a] dark:text-white mb-6">
                Pertanyaan Umum
              </h2>
              <p className="text-stone-500 mb-4 max-w-sm">
                Tidak menemukan jawaban yang Anda cari? Hubungi{" "}
                <Link
                  href="/auth/login/login/login"
                  className="text-orange-500 font-bold hover:underline"
                >
                  tim dukungan kami
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-white dark:bg-slate-900/80 border-none shadow-sm rounded-[1rem] px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-6 hover:no-underline text-left">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 bg-orange-50 dark:bg-orange-900/30 rounded-full text-orange-500 items-center justify-center flex-shrink-0">
                        <DynamicIcon
                          name={item.icon}
                          className="size-5"
                        />
                      </div>
                      <span className="text-lg font-bold text-[#2a2a2a] dark:text-white">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="pl-14">
                      <p className="text-base text-stone-500 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

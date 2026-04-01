import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/header";
import { ChevronRight, Signal } from "lucide-react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/sessions";

export default async function HeroWiFi() {
  const user = await getCurrentUser();

  return (
    <>
      <HeroHeader user={user} />
      <main className="overflow-hidden bg-[#FAF8F5] dark:bg-slate-950">
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-32">
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-5">
             <div className="absolute top-10 right-10 leading-none text-[300px] text-stone-200 select-none">🌍</div>
          </div>

          <div className="relative z-10">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left side - Text content */}
                <div className="lg:col-span-5 pt-10">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2a2a2a] dark:text-white mb-6 leading-[1.1]">
                    Internet Cepat Tanpa{" "}
                    <span className="relative inline-block text-orange-500">
                      Batas
                      <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-300" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00035 6.64338C48.6669 1.95679 133.2 -1.4116 195.917 6.64338" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-stone-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md">
                    Temukan momen unik dan pengalaman tak terlupakan dengan koneksi stabil. Dari streaming hiburan tanpa batas hingga produktivitas harian Anda.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      asChild
                      className="px-8 py-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg transition-transform hover:scale-105"
                    >
                      <Link href="/auth/login">
                        Berlangganan Sekarang
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right side - Hero image collage */}
                <div className="lg:col-span-7 relative h-[600px] hidden md:block">
                  <div className="absolute top-[10%] left-[5%] w-[45%] h-[60%] rounded-[2rem] overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 z-20">
                    <Image
                      src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1932&auto=format&fit=crop"
                      alt="Family streaming"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-0 right-[5%] w-[40%] h-[45%] rounded-[2rem] overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 z-10">
                    <Image
                      src="https://images.unsplash.com/photo-1617035969033-a5c113b6f0d5?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Working from home"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-[10%] right-[15%] w-[45%] h-[40%] rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-xl rounded-br-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 z-30">
                    <Image
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                      alt="Gaming router"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-[50%] left-[45%] w-16 h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg z-40 transform -translate-x-1/2 -translate-y-1/2">
                     <Signal className="w-8 h-8 text-orange-500" />
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

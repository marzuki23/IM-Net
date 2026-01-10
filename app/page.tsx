import HeroWiFi from "@/components/landing-pages/hero-wifi";
import FeaturesWiFi from "@/components/landing-pages/features-wifi";
import PricingWiFi from "@/components/landing-pages/pricing-wifi";
import CoverageWiFi from "@/components/landing-pages/coverage-wifi";
import FAQWiFi from "@/components/landing-pages/faq-wifi";
import CTAWiFi from "@/components/landing-pages/cta-wifi";
import FooterSection from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IMNet - Internet Cepat & Stabil untuk Rumah Anda",
  description:
    "Dapatkan koneksi internet berkualitas tinggi hingga 100 Mbps dengan paket terjangkau. Instalasi gratis, support 24/7, dan jaminan uptime 99.5%.",
};

export default function LandingPage() {
  return (
    <>
      <HeroWiFi />
      <FeaturesWiFi />
      <PricingWiFi />
      <CoverageWiFi />
      <FAQWiFi />
      <CTAWiFi />
      <FooterSection />
    </>
  );
}
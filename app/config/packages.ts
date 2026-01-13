export interface WiFiPackage {
  id: string;
  name: string;
  speed: string;
  price: number;
  installationFee: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const WIFI_PACKAGES: WiFiPackage[] = [
  {
    id: "pkg-10mbps",
    name: "Paket Hemat",
    speed: "10 Mbps",
    price: 150000,
    installationFee: 50000,
    description: "Ideal untuk penggunaan ringan 1-3 perangkat",
    features: ["Unlimited Quota", "Support 24/7", "Stabil & Cepat"],
  },
  {
    id: "pkg-20mbps",
    name: "Paket Keluarga",
    speed: "20 Mbps",
    price: 168000,
    installationFee: 0,
    description: "Ideal untuk penggunaan 4-6 perangkat",
    features: ["Unlimited Quota", "Gratis Instalasi", "Support 24/7", "Stabil & Cepat"],
    recommended: true,
  },
  {
    id: "pkg-40mbps",
    name: "Paket Gamer",
    speed: "40 Mbps",
    price: 218000,
    installationFee: 0,
    description: "Ideal untuk penggunaan 5-8 perangkat & gaming",
    features: ["Unlimited Quota", "Gratis Instalasi", "Low Latency", "Support 24/7"],
  },
  {
    id: "pkg-60mbps",
    name: "Paket Sultan",
    speed: "60 Mbps",
    price: 260000,
    installationFee: 0,
    description: "Ideal untuk penggunaan 7-9 perangkat & streaming 4K",
    features: ["Unlimited Quota", "Gratis Instalasi", "Prioritas Support", "Super Cepat"],
  },
];

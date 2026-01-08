import type { Metadata } from "next";
import SignUpForm from "@/components/sign-up";

export const metadata: Metadata = {
  title: "Daftar - imNet",
  description: "Buat akun imNet baru dan mulai berlangganan layanan internet",
};

export default function SignUpPage() {
  return <SignUpForm />;
}

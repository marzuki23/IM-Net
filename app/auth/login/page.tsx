import type { Metadata } from "next";
import LoginForm from "@/components/login";

export const metadata: Metadata = {
  title: "Masuk - imNet",
  description: "Masuk ke akun imNet Anda untuk mengelola langganan",
};

export default function LoginPage() {
  return <LoginForm />;
}

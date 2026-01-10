"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

import { HeroHeader } from "@/components/header";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/google");
      if (!response.ok) throw new Error("Gagal menghubungkan ke server");
      
      const { authUrl } = await response.json();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Gagal mendapatkan URL login");
      }
    } catch (err) {
      setError("Gagal memulai login dengan Google");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("pwd");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login gagal");
      }

      router.push(data.redirectUrl || "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-xl border border-orange-200/50 dark:border-orange-900/50 shadow-lg shadow-orange-300/20 dark:shadow-orange-900/20 dark:[--color-muted:var(--color-slate-900)] relative z-10"
        >
        <div className="bg-card -m-px rounded-xl border border-orange-200/50 dark:border-orange-900/50 p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
              Masuk ke IMNet
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Selamat datang kembali! Masuk untuk melanjutkan
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="nama@email.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm font-medium">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="#"
                    className="text-orange-600 dark:text-orange-400 hover:underline text-sm"
                  >
                    Lupa Password?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                disabled={isLoading}
            >
              {isLoading ? (
                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Masuk
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed border-slate-300 dark:border-slate-700" />
            <span className="text-muted-foreground text-xs">
              Atau lanjutkan dengan
            </span>
            <hr className="border-dashed border-slate-300 dark:border-slate-700" />
          </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent py-5"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 256 262"
                  className="mr-2"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
              )}
              <span className="text-sm font-medium">Lanjutkan dengan Google</span>
            </Button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-700 dark:text-slate-300 text-center text-sm">
            Belum punya akun?
            <Button
              asChild
              variant="link"
              className="px-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold"
            >
              <Link href="/auth/signup">Daftar di sini</Link>
            </Button>
          </p>
        </div>
      </form>
      </div>
    </>
  );
}

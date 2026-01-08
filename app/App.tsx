"use client";

import React, { useState, useEffect } from "react";
import { User, Role, Payment } from "../lib/types";
import { MOCK_ADMIN, MOCK_USERS, WIFI_PACKAGES } from "./constants";
import Layout from "../components/Layout";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import { LogIn, Wifi, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate some mock payments for history
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: "pay-1",
        userId: "user-1",
        amount: 250000,
        month: "Mei 2024",
        status: "PAID",
        date: "2024-05-24 10:15",
      },
      {
        id: "pay-2",
        userId: "user-2",
        amount: 350000,
        month: "Mei 2024",
        status: "PAID",
        date: "2024-05-19 14:30",
      },
    ];
    setPayments(mockPayments);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (loginForm.isAdmin) {
        if (loginForm.username === "admin" && loginForm.password === "admin") {
          setCurrentUser(MOCK_ADMIN);
        } else {
          setError("Invalid Admin credentials");
        }
      } else {
        const user = users.find(
          (u) =>
            u.username === loginForm.username && loginForm.password === "user"
        );
        if (user) {
          setCurrentUser(user);
        } else {
          setError(
            'Invalid Customer credentials (hint: use "user" as password)'
          );
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      ...(userData as User),
      id: `user-${users.length + 1}`,
      role: Role.USER,
      customerId: `WIF-2024${(users.length + 1).toString().padStart(2, "0")}`,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const handleMakePayment = () => {
    if (!currentUser) return;

    const pkg = WIFI_PACKAGES.find((p) => p.id === currentUser.packageId);
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      userId: currentUser.id,
      amount: pkg?.price || 0,
      month: "Juni 2024",
      status: "PAID",
      date: new Date().toLocaleString("id-ID"),
    };

    setPayments([...payments, newPayment]);
    alert("Pembayaran Berhasil! Terimakasih telah menggunakan layanan IMNet.");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
              <Wifi size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">
            IMNet Gateway
          </h1>
          <p className="text-slate-400 text-center mb-10">
            Please sign in to access your portal
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setLoginForm({ ...loginForm, isAdmin: false })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  !loginForm.isAdmin
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Customer Portal
              </button>
              <button
                type="button"
                onClick={() => setLoginForm({ ...loginForm, isAdmin: true })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  loginForm.isAdmin
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Admin Access
              </button>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                  <ArrowRight size={18} className="ml-1 opacity-50" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <ShieldCheck size={16} />
            <span>Secure 256-bit encrypted gateway</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} onLogout={() => setCurrentUser(null)}>
      {currentUser.role === Role.ADMIN ? (
        <AdminDashboard
          users={users}
          payments={payments}
          onAddUser={handleAddUser}
        />
      ) : (
        <UserDashboard
          user={currentUser}
          payments={payments.filter((p) => p.userId === currentUser.id)}
          onMakePayment={handleMakePayment}
        />
      )}
    </Layout>
  );
};

export default App;

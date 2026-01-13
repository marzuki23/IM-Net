import React from "react";
import { User, Role } from "../lib/types";
import { LogOut, Home, Users, CreditCard, Bell, Wifi } from "lucide-react";

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const isAdmin = user.role === Role.ADMIN;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Wifi size={24} />
          </div>
          <span className="font-bold text-xl text-slate-800">WiFiNet</span>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
            <Home size={20} />
            <span>Dashboard</span>
          </div>
          {isAdmin ? (
            <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Users size={20} />
              <span>Manage Users</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell size={20} />
            <span>Notifications</span>
          </div>
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium border border-transparent hover:border-red-100"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome, {user.fullName}
            </h1>
            <p className="text-slate-500">ID Pelanggan: {user.customerId}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-slate-400 hover:text-indigo-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <img
                src={`https://picsum.photos/seed/${user.id}/100`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;

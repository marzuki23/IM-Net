import React, { useState, useEffect, useRef } from 'react';
import { User, WiFiPackage, Payment, ChatMessage } from '../lib/types';
import { WIFI_PACKAGES } from '../app/constants';
import { Wifi, ShieldCheck, Calendar, CreditCard, Send, Sparkles, History, Eye, EyeOff } from 'lucide-react';
import { getSmartSupportResponse } from '../services/geminiService';

interface UserDashboardProps {
    user: User;
    payments: Payment[];
    onMakePayment: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, payments, onMakePayment }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isDueSoon, setIsDueSoon] = useState(false);
    const [daysLeft, setDaysLeft] = useState(0);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const userPkg = WIFI_PACKAGES.find(p => p.id === user.packageId);

    useEffect(() => {
        const due = new Date(user.dueDate);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays);
        setIsDueSoon(diffDays <= 7 && diffDays >= 0);
    }, [user.dueDate]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isTyping]);

    const handleChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        const context = `User Name: ${user.fullName}, Package: ${userPkg?.name}, Due: ${user.dueDate}, WiFi Name: ${user.wifiName}`;
        const response = await getSmartSupportResponse(userMsg, context);

        setIsTyping(false);
        setChatHistory(prev => [...prev, { role: 'model', content: response || "Something went wrong." }]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Notification Banner */}
                {isDueSoon && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-amber-900">Tagihan akan segera berakhir!</p>
                            <p className="text-amber-700 text-sm">Anda memiliki {daysLeft} hari tersisa sebelum pemutusan layanan. Segera lakukan pembayaran.</p>
                        </div>
                        <button
                            onClick={onMakePayment}
                            className="ml-auto bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors"
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                )}

                {/* WiFi & Package Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                                <Wifi size={28} />
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                                Active
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Network Access</h3>
                        <p className="text-2xl font-bold text-slate-800 mb-4">{user.wifiName}</p>

                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Password</p>
                                    <p className="font-mono font-bold text-slate-700">
                                        {showPassword ? user.wifiPassword : '••••••••••••'}
                                    </p>
                                </div>
                                <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-indigo-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span>WPA3 Encrypted Network</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl relative overflow-hidden text-white">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

                        <h3 className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2 relative z-10">Current Plan</h3>
                        <p className="text-3xl font-bold mb-1 relative z-10">{userPkg?.name}</p>
                        <p className="text-indigo-200 opacity-80 mb-6 relative z-10">Unlimited Bandwidth • {userPkg?.speed}</p>

                        <div className="flex items-end justify-between relative z-10">
                            <div>
                                <p className="text-indigo-300 text-xs font-medium mb-1">Monthly Billing</p>
                                <p className="text-2xl font-bold">Rp {userPkg?.price.toLocaleString()}</p>
                            </div>
                            <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all border border-white/10">
                                <Calendar size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                <History size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800">Riwayat Pembayaran</h3>
                        </div>
                        <button className="text-indigo-600 text-sm font-semibold hover:underline">Lihat Semua</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {payments.length > 0 ? payments.map((p, i) => (
                            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${p.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Pembayaran Bulan {p.month}</p>
                                        <p className="text-xs text-slate-400">{p.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800 text-sm">Rp {p.amount.toLocaleString()}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${p.status === 'PAID' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                        {p.status}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-slate-400 italic">Belum ada riwayat pembayaran.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar: AI Support & Billing Summary */}
            <div className="space-y-8">
                {/* Billing Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Ringkasan Tagihan</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Jatuh Tempo</span>
                            <span className="font-bold text-slate-700">{new Date(user.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Status</span>
                            <span className="font-bold text-orange-500">Pending</span>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span className="text-slate-800">Total</span>
                                <span className="text-indigo-600">Rp {userPkg?.price.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={onMakePayment}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Support Chat */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-[500px] flex flex-col overflow-hidden">
                    <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Smart Support</p>
                                <p className="text-[10px] opacity-80">Online • AI Powered</p>
                            </div>
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 border border-slate-100">
                            Halo {user.fullName}! Saya asisten pintar WiFiNet. Ada yang bisa saya bantu terkait paket atau pembayaran Anda?
                        </div>

                        {chatHistory.map((chat, i) => (
                            <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${chat.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                                    }`}>
                                    {chat.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleChat} className="p-3 border-t bg-slate-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tanya asisten pintar..."
                                className="w-full pl-4 pr-12 py-3 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
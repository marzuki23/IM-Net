import React, { useState } from 'react';
import { User, WiFiPackage, Payment } from '../types';
import { WIFI_PACKAGES } from '../constants';
import { UserPlus, Search, Download, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  users: User[];
  payments: Payment[];
  onAddUser: (user: Partial<User>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, payments, onAddUser }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    wifiName: '',
    wifiPassword: '',
    packageId: WIFI_PACKAGES[0].id
  });

  const chartData = [
    { name: 'Jan', amount: 4500000 },
    { name: 'Feb', amount: 5200000 },
    { name: 'Mar', amount: 4800000 },
    { name: 'Apr', amount: 6100000 },
    { name: 'May', amount: 5900000 },
    { name: 'Jun', amount: 6500000 },
  ];

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(formData);
    setShowAddModal(false);
    setFormData({
      username: '',
      fullName: '',
      wifiName: '',
      wifiPassword: '',
      packageId: WIFI_PACKAGES[0].id
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Paid This Month', value: payments.filter(p => p.status === 'PAID').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Payment', value: users.length - payments.filter(p => p.status === 'PAID').length, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Revenue (Jun)', value: `Rp ${(payments.reduce((acc, curr) => acc + (curr.status === 'PAID' ? curr.amount : 0), 0) / 1000).toFixed(0)}k`, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-slate-100`}>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Monthly Revenue Growth</h3>
            <select className="text-sm border rounded-lg px-2 py-1 outline-none text-slate-500">
              <option>Year 2024</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Packages List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Package Distribution</h3>
          <div className="space-y-4">
            {WIFI_PACKAGES.map(pkg => (
              <div key={pkg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{pkg.name}</p>
                  <p className="text-xs text-slate-500">{pkg.speed}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600 text-sm">Rp {pkg.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h3 className="font-bold text-slate-800">User Management</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 border rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shrink-0"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">WiFi SSID</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Status Jun</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => {
                const isPaid = payments.some(p => p.userId === user.id && p.status === 'PAID');
                const pkg = WIFI_PACKAGES.find(p => p.id === user.packageId);
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{user.fullName}</p>
                          <p className="text-xs text-slate-400">{user.customerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 font-mono">{user.wifiName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {pkg?.name} ({pkg?.speed})
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {isPaid ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 p-1">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-100"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-100"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Package</label>
                  <select 
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-100"
                    value={formData.packageId}
                    onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                  >
                    {WIFI_PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WiFi SSID (Name)</label>
                <input 
                  required
                  type="text" 
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-100 font-mono"
                  value={formData.wifiName}
                  onChange={(e) => setFormData({...formData, wifiName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WiFi Password</label>
                <input 
                  required
                  type="password" 
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-100 font-mono"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({...formData, wifiPassword: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

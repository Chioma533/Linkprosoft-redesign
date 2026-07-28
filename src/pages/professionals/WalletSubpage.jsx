import React, { useState } from "react";
import { Eye, EyeOff, Download, Filter, Plus, ArrowUpRight, DollarSign, Wallet, ArrowDownLeft, Clock } from "lucide-react";
import StatsCard from "../../components/ui/StatsCard";

const WalletSubpage = () => {
  const [showBalance, setShowBalance] = useState(true);

  const transactions = [
    { id: "TRX-87W7", type: "Withdrawal", client: "------", date: "Jul 07, 2026", amount: 32000, status: "Successful" },
    { id: "TRX-87W7", type: "Job Payment", client: "John miguel", date: "Jul 07, 2026", amount: 32000, status: "Pending" },
    { id: "TRX-87W7", type: "Withdrawal", client: "------", date: "Jul 07, 2026", amount: 32000, status: "Successful" },
    { id: "TRX-87W7", type: "Job Payment", client: "John miguel", date: "Jul 07, 2026", amount: 32000, status: "Pending" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("NGN", "₦");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good Morning Samuel</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your earnings, withdrawals, and transaction history.</p>
      </div>

      {/* Blue Header Wallet Banner */}
      <div className="bg-gradient-to-r from-[#013554] via-[#01507B] to-[#016EA6] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col gap-6 md:flex-row md:items-center justify-between">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
        
        {/* Flex container wrapping layout */}
        <div className="flex flex-col gap-6 w-full md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 w-full">
            {/* Top row for mobile or standard logo row */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10">
                <span className="text-sm">🇳🇬</span>
                <span>NGN</span>
              </div>
              
              {/* Mobile-only Withdraw Button */}
              <button className="md:hidden bg-white text-[#013554] hover:bg-sky-50 px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer">
                <span>Withdraw funds</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <span className="text-xs text-sky-200 font-medium tracking-wide">Total Balance</span>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {showBalance ? "₦ 500,000" : "₦ ••••••••"}
                </h1>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {showBalance ? <EyeOff className="w-5 h-5 text-sky-200" /> : <Eye className="w-5 h-5 text-sky-200" />}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop-only Withdraw Button */}
          <button className="hidden md:flex bg-white text-[#013554] hover:bg-sky-50 px-6 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 items-center justify-center gap-2 relative z-10 cursor-pointer active:scale-95">
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw funds</span>
          </button>
        </div>
      </div>

      {/* Row of Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Available Balance" value="₦500,000" icon={Wallet} iconColor="text-blue-500" iconBg="bg-blue-50" />
        <StatsCard title="Pending Earnings" value="₦59,000" icon={Clock} iconColor="text-orange-500" iconBg="bg-orange-50" />
        <StatsCard title="Total Earnings" value="₦1.8M" icon={DollarSign} iconColor="text-green-500" iconBg="bg-green-50" />
        <StatsCard title="Total Withdrawn" value="₦1.8M" icon={ArrowUpRight} iconColor="text-[#016EA6]" iconBg="bg-sky-50" />
      </div>

      {/* Table & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Recent Transaction</h3>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export data</span>
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-semibold transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>List a service</span>
                </button>
                 {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                    <th className="pb-3 font-semibold">Transaction ID</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-3.5 font-semibold text-gray-500">{tx.id}</td>
                      <td className="py-3.5 font-bold text-gray-800 flex items-center gap-2">
                        {tx.type === "Withdrawal" ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-green-500" />
                        )}
                        <span>{tx.type}</span>
                      </td>
                      <td className="py-3.5 font-semibold text-gray-800">{tx.client}</td>
                      <td className="py-3.5 font-medium text-gray-400">{tx.date}</td>
                      <td className="py-3.5 font-bold text-gray-800">{formatCurrency(tx.amount)}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                          tx.status === "Successful" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-500"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-4">
              {transactions.map((tx, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Icon Container */}
                      <div className="w-12 h-12 bg-[#EBF3FA] text-[#016EA6] rounded-2xl flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5" />
                      </div>
                      
                      {/* Transaction Info */}
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">
                          {tx.type === "Withdrawal" ? "Funds Withdrawal" : "Job Payment"}
                        </h4>
                        <div className="text-[11px] text-gray-400 font-medium">
                          <span>{tx.client}</span>
                          <span className="mx-1.5">•</span>
                          <span>Carpentry</span>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span>9:00 am</span>
                        </div>
                        <div className="text-xs font-bold text-gray-800 pt-1">
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                        tx.status === "Successful" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-500"
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-6">
            <span className="text-[10px] text-gray-400 font-medium">Showing page 1 of 5 pages</span>
            <div className="flex gap-1">
              <button className="w-6 h-6 bg-[#016EA6] text-white rounded-md text-[10px] font-bold">1</button>
              <button className="w-6 h-6 border border-gray-100 hover:bg-gray-50 text-gray-500 rounded-md text-[10px] font-bold">2</button>
              <button className="w-6 h-6 border border-gray-100 hover:bg-gray-50 text-gray-500 rounded-md text-[10px] font-bold">3</button>
            </div>
          </div>
        </div>

        {/* Earning Chart Panel */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Earning chat</h3>
              <select className="text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>This year</option>
                <option>This month</option>
              </select>
            </div>

            {/* SVG Custom Premium Wave Chart */}
            <div className="relative h-44 w-full mt-4 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#016EA6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#016EA6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Wave Path */}
                <path
                  d="M0 25 C15 35, 30 15, 45 30 C60 45, 75 10, 100 20"
                  fill="none"
                  stroke="#016EA6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Area under wave */}
                <path
                  d="M0 25 C15 35, 30 15, 45 30 C60 45, 75 10, 100 20 L100 50 L0 50 Z"
                  fill="url(#chartGradient)"
                />
                {/* Active selection dot */}
                <circle cx="75" cy="10" r="3" fill="#016EA6" stroke="#fff" strokeWidth="1.5" className="animate-pulse" />
                <line x1="75" y1="10" x2="75" y2="50" stroke="#016EA6" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-4 px-1 uppercase">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span className="text-[#016EA6]">May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Payments feed */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm max-w-xl">
        <h3 className="text-base font-bold text-gray-900 mb-6">Upcoming payments</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/30 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 leading-snug">Job payment update</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Jhon has accepted your offer and your payment is processing</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default WalletSubpage;

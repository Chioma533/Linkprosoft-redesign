import React, { useState } from "react";
import { Eye, EyeOff, Download, Filter, Plus, ArrowUpRight, DollarSign, Wallet, ArrowDownLeft, Clock, X, Check } from "lucide-react";
import StatsCard from "../../components/ui/StatsCard";
import { useDashboardStore } from "../../store/dashboardStore";

const WalletSubpage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1); // 1: details, 2: PIN, 3: Success
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pinDigits, setPinDigits] = useState([]);
  
  const { setActiveTab } = useDashboardStore();

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
                {/* <span className="text-sm">🇳🇬</span> */}
                <span>NGN</span>
              </div>
              
              {/* Mobile-only Withdraw Button */}
              <button 
                onClick={() => setIsWithdrawOpen(true)}
                className="md:hidden bg-white text-[#013554] hover:bg-sky-50 px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
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
          <button 
            onClick={() => setIsWithdrawOpen(true)}
            className="hidden whitespace-nowrap md:flex bg-white text-[#013554] hover:bg-sky-50 px-6 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 items-center justify-center gap-2 relative z-10 cursor-pointer active:scale-95"
          >
            <span>Withdraw funds</span>
            <ArrowUpRight className="w-4 h-4" />
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
              </div>
            </div>

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

      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in text-gray-800">
          <div className="bg-white rounded-[32px] max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setIsWithdrawOpen(false); setWithdrawStep(1); setPinDigits([]); setWithdrawAmount(""); }}
              className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {withdrawStep === 1 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#EBF3FA] rounded-2xl flex items-center justify-center shrink-0 border border-gray-100/60">
                    <Wallet className="w-7 h-7 text-[#016EA6]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Withdraw Funds</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">Transfer your available earnings to your verified bank account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Withdrawal Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₦</span>
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-semibold transition-all text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Transfer to</label>
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">
                            GT
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 leading-tight">GT Bank</h4>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Samuel Owoniyi • *****37749</p>
                          </div>
                        </div>
                        <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center text-[#016EA6]">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#013554] to-[#01507B] p-5 rounded-2xl text-white relative overflow-hidden shadow-md flex items-center justify-between">
                      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
                      <div className="relative z-10 space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-[9px] font-semibold border border-white/5">
                          <span>🇳🇬 NGN</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-[10px] text-sky-200/80 font-bold block">Total Balance</span>
                          <h3 className="text-lg font-bold tracking-tight">₦ 500,000</h3>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 relative z-10">
                        <Eye className="w-5 h-5 text-sky-200" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 flex flex-col justify-between h-full min-h-[300px]">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">WITHDRAW SUMMARY</h4>
                      <div className="divide-y divide-gray-100/60 text-xs">
                        <div className="flex justify-between py-3">
                          <span className="text-gray-400 font-semibold">Amount</span>
                          <span className="font-bold text-gray-800">₦{withdrawAmount ? Number(withdrawAmount).toLocaleString() : "50,000"}</span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-400 font-semibold">Linkprosoft Fee</span>
                          <span className="font-bold text-gray-800">₦2,000</span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-505 font-bold">You will Receive</span>
                          <span className="font-black text-gray-900 text-sm">₦{withdrawAmount ? (Number(withdrawAmount) - 2000).toLocaleString() : "48,000"}</span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-400 font-semibold">Estimated Arrival</span>
                          <span className="font-bold text-green-500 uppercase">INSTANTLY</span>
                        </div>
                      </div>

                      <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100/30 flex items-start gap-2.5 mt-2">
                        <Clock className="w-4 h-4 text-[#016EA6] shrink-0 mt-0.5" />
                        <p className="text-[10px] text-sky-700 font-semibold leading-relaxed">
                          Funds will be credited to your verified bank account instantly via NIP Transfer.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-6">
                      <button 
                        onClick={() => setWithdrawStep(2)}
                        className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Continue
                      </button>
                      <button 
                        onClick={() => { setIsWithdrawOpen(false); setWithdrawAmount(""); }}
                        className="w-full border border-gray-100 hover:bg-gray-50 text-gray-400 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {withdrawStep === 2 && (
              <div className="max-w-md mx-auto py-4">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-[#EBF3FA] rounded-2xl flex items-center justify-center border border-gray-100/60">
                    <Wallet className="w-8 h-8 text-[#016EA6]" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Verify Identity</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">Transfer your available earnings to your verified bank account</p>
                  </div>

                  <div className="text-center mt-2">
                    <h4 className="text-sm font-bold text-gray-800">Enter your PIN</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Please enter your 4-digit security PIN to authorize this transaction</p>
                  </div>

                  <div className="flex gap-4 justify-center py-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div 
                        key={idx} 
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          pinDigits.length > idx 
                            ? "bg-[#016EA6] border-[#016EA6]" 
                            : "border-[#016EA6]/30 bg-white"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[280px] pt-4 justify-items-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button 
                        key={num} 
                        onClick={() => {
                          if (pinDigits.length < 4) {
                            const newPin = [...pinDigits, num];
                            setPinDigits(newPin);
                            if (newPin.length === 4) {
                              setTimeout(() => setWithdrawStep(3), 400);
                            }
                          }
                        }}
                        className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold text-base text-gray-700 cursor-pointer active:scale-95 transition-transform"
                      >
                        {num}
                      </button>
                    ))}
                    <div />
                    <button 
                      onClick={() => {
                        if (pinDigits.length < 4) {
                          const newPin = [...pinDigits, 0];
                          setPinDigits(newPin);
                          if (newPin.length === 4) {
                            setTimeout(() => setWithdrawStep(3), 400);
                          }
                        }
                      }}
                      className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold text-base text-gray-700 cursor-pointer active:scale-95 transition-transform"
                    >
                      0
                    </button>
                    <button 
                      onClick={() => setPinDigits(pinDigits.slice(0, -1))}
                      className="w-12 h-12 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer active:scale-95 transition-transform"
                    >
                      <X className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {withdrawStep === 3 && (
              <div className="max-w-md mx-auto text-center py-6 space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-10 h-10 stroke-[3px]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-900 leading-tight">
                    ₦{withdrawAmount ? Number(withdrawAmount).toLocaleString() : "50,000"} Has Been Deposited To Your Account
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Your transaction is successfully processed.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-4 w-full max-w-[240px] mx-auto">
                  <button 
                    onClick={() => { setIsWithdrawOpen(false); setWithdrawStep(1); setPinDigits([]); setWithdrawAmount(""); }}
                    className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Go to wallet
                  </button>
                  <button 
                    onClick={() => { setIsWithdrawOpen(false); setWithdrawStep(1); setPinDigits([]); setWithdrawAmount(""); setActiveTab("overview"); }}
                    className="w-full border border-gray-100 hover:bg-gray-50 text-gray-400 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Go back home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSubpage;

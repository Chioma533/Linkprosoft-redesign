import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import TopUpIcon from "../../../components/icons/TopUpIcon";
import StatsCard from "../../../components/ui/StatsCard";
import { greeting } from "../../../utils/greeting";
import { formatCurrency } from "../../../utils/walletFormatting";

const WalletOverview = ({
  userName,
  availableBalance,
  pendingEarnings,
  totalEarnings,
  totalWithdrawn,
  activeEscrows,
  recentTransactions,
  upcomingPayments,
  onOpenWithdraw,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const formattedWalletBalance = formatCurrency(availableBalance);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {greeting(new Date())} {userName}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage your earnings, withdrawals, and transaction history.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-3xl bg-[#E6F1F6]">
        <div className="p-6 bg-[#00273A] sm:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <img
            src="/white-flow-bgdesign.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-contain"
          />
          <div className="flex flex-col gap-6 w-full md:flex-row md:items-center md:justify-between relative z-10">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between w-full md:w-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs border border-white/10">
                  <span>NGN</span>
                </div>
                <button
                  onClick={onOpenWithdraw}
                  className="md:hidden bg-[#E8F3FF] text-[#104F84] hover:bg-[#D7E9FF] px-3.5 py-2 rounded-full text-[11px] font-semibold flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Top Up Wallet</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border border-[#D7E9FF]">
                    <TopUpIcon className="w-4 h-4 text-[#104F84]" />
                  </span>
                </button>
              </div>
              <div>
                <span className="text-xs text-sky-200 font-medium tracking-wide">
                  Total Balance
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    {showBalance ? formattedWalletBalance : "₦ ••••••••"}
                  </h1>
                  <button
                    onClick={() => setShowBalance((visible) => !visible)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    {showBalance ? (
                      <EyeOff className="w-5 h-5 text-sky-200" />
                    ) : (
                      <Eye className="w-5 h-5 text-sky-200" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={onOpenWithdraw}
              className="hidden whitespace-nowrap md:flex bg-[#E8F3FF] text-[#104F84] hover:bg-[#D7E9FF] px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 items-center justify-center gap-3 relative z-10 cursor-pointer active:scale-95"
            >
              <span>Top Up Wallet</span>
              <span className="flex h-6 w-10 items-center justify-center rounded-2xl bg-white border border-[#D7E9FF]">
                <TopUpIcon className="w-4 h-4 text-[#104F84]" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Available Balance" value={formattedWalletBalance} icon={Wallet} iconColor="text-blue-500" />
        <StatsCard title="Pending Earnings" value={formatCurrency(pendingEarnings)} icon={Clock} iconColor="text-orange-500" />
        <StatsCard title="Total Earnings" value={formatCurrency(totalEarnings)} icon={DollarSign} iconColor="text-green-500" />
        <StatsCard title="Total Withdrawn" value={formatCurrency(totalWithdrawn)} icon={ArrowUpRight} iconColor="text-[#016EA6]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E7EB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Active Escrow Payments</h3>
            </div>
            {activeEscrows.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-[0.15em]">
                      <th className="px-4 py-3 font-semibold">Job Title</th>
                      <th className="px-4 py-3 font-semibold">Counterparty</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeEscrows.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">{item.jobTitle}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{item.professional}</td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-800">{formatCurrency(item.amount)}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-600">{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-6">No active escrow payments yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100/50">
          <h3 className="text-base font-bold text-gray-900 mb-6">Recent Transaction</h3>
          {recentTransactions.length ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-gray-50/80 p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-[#016EA6] flex items-center justify-center shrink-0"><Wallet className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{transaction.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#016EA6]">{formatCurrency(transaction.amount, true)}</p>
                    <p className="text-sm font-semibold text-emerald-600 mt-1">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No wallet activity yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 max-w-xl">
        <h3 className="text-base font-bold text-gray-900 mb-6">Upcoming payments</h3>
        {upcomingPayments.length ? (
          <div className="space-y-4">
            {upcomingPayments.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/30 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="text-[#016EA6] flex items-center justify-center shrink-0"><Wallet className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-800 leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.body}</p>
                </div>
                <div className="text-xs font-bold text-gray-700">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming payouts at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default WalletOverview;

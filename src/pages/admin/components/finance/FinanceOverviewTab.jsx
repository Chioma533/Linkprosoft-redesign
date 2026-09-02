import React, { useState, useEffect } from "react";
import { Users, ArrowUpRight, Lock, Wallet } from "lucide-react";
import { adminService } from "../../../../api/services/adminService";
import RevenueEscrowWaveChart from "../overview/RevenueEscrowWaveChart";

const FinanceOverviewTab = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await adminService.getFinanceOverviewMetrics();
        if (isMounted && res?.data) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.warn("[FinanceOverviewTab] Error fetching finance metrics:", err);
      }
    };
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return null;
    return typeof val === "number" ? `₦${val.toLocaleString()}` : val;
  };

  const formatTrend = (trend) => {
    if (trend === undefined || trend === null) return /* "+20% this week" */ "";
    if (typeof trend === "number") {
      const sign = trend >= 0 ? "+" : "";
      return `${sign}${trend}% this week`;
    }
    return trend;
  };

  const statCards = [
    { id: "volume", title: "Total Transaction Volume", value: formatCurrency(metrics?.totalVolume?.value ?? metrics?.totalVolume ?? metrics?.volume) || /* "₦48.6M" */ "₦0", trend: formatTrend(metrics?.totalVolume?.growthPercentage ?? metrics?.totalVolumeTrend) },
    { id: "revenue", title: "Platform Revenue", value: formatCurrency(metrics?.platformRevenue?.value ?? metrics?.platformRevenue ?? metrics?.revenue) || /* "₦4.8M" */ "₦0", trend: formatTrend(metrics?.platformRevenue?.growthPercentage ?? metrics?.platformRevenueTrend) },
    { id: "escrow", title: "Escrow Balance", value: formatCurrency(metrics?.escrowBalance?.value ?? metrics?.escrowBalance ?? metrics?.escrow) || /* "₦12.4M" */ "₦0", trend: formatTrend(metrics?.escrowBalance?.growthPercentage ?? metrics?.escrowBalanceTrend) },
    { id: "payouts", title: "Pending Payouts", value: formatCurrency(metrics?.pendingPayouts?.value ?? metrics?.pendingPayouts ?? metrics?.payouts) || /* "₦3.2M" */ "₦0", trend: formatTrend(metrics?.pendingPayouts?.growthPercentage ?? metrics?.pendingPayoutsTrend) },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight">
                {card.title}
              </span>
              <div className="p-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#016EA6] stroke-[1.8]" />
              </div>
            </div>
            <div className="mt-3 mb-2">
              <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block leading-none">
                {card.value}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Revenue Analytics vs Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Revenue Analytics Wave Chart (Left) */}
        <div className="lg:col-span-8">
          <RevenueEscrowWaveChart />
        </div>

        {/* Earnings Breakdown Donut Chart (Right) */}
        <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs">
          <h3 className="font-extrabold text-gray-900 text-base tracking-tight mb-2">
            Earnings Breakdown
          </h3>

          {/* Donut Graphic */}
          <div className="flex flex-col items-center justify-center my-4 relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                {/* Escrow (Blue) ~55% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#0284C7" strokeWidth="10" strokeDasharray="138 251" strokeDashoffset="0" />
                {/* Payouts (Green) ~30% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray="75 251" strokeDashoffset="-138" />
                {/* Refunds (Red) ~5% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="10" strokeDasharray="15 251" strokeDashoffset="-213" />
                {/* Commission (Amber) ~10% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="10" strokeDasharray="25 251" strokeDashoffset="-228" />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-[#1E1B4B]">₦48.6M</span>
                <span className="text-[10px] font-semibold text-gray-400">Total assets</span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 text-xs font-semibold pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                <span className="text-gray-600">Escrow</span>
              </div>
              <span className="font-extrabold text-gray-800">₦28.2M</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-gray-600">Payouts</span>
              </div>
              <span className="font-extrabold text-gray-800">₦15.4M</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="text-gray-600">Refunds</span>
              </div>
              <span className="font-extrabold text-gray-800">₦0.86M</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-600">Commissions</span>
              <span className="font-extrabold text-gray-800">₦4.14M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Escrow Summary vs Payout Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Escrow Summary Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Lock className="w-4 h-4 text-[#016EA6]" />
            <h3 className="font-extrabold text-base tracking-tight">Escrow Summary</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 block">Total Held</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 block mt-1">₦12.4M</span>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 block">Awaiting Completion</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 block mt-1">₦7.8M</span>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 block">Ready for Release</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 block mt-1">₦3.2M</span>
            </div>
            <div className="bg-[#FFF1F2] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-rose-700 block">Under Dispute</span>
              <span className="text-lg sm:text-xl font-extrabold text-rose-600 block mt-1">₦12.4M</span>
            </div>
          </div>
        </div>

        {/* Payout Summary Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Wallet className="w-4 h-4 text-[#016EA6]" />
            <h3 className="font-extrabold text-base tracking-tight">Payout Summary</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#FFF9F4] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-amber-700 block">Pending</span>
              <span className="text-lg sm:text-xl font-extrabold text-amber-900 block mt-1">₦3.2M</span>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 block">Processing</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 block mt-1">₦1.8M</span>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 block">Completed</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 block mt-1">₦22.4M</span>
            </div>
            <div className="bg-[#FFF1F2] rounded-2xl p-4 border-none relative overflow-hidden">
              <span className="text-xs font-semibold text-rose-700 block">Failed</span>
              <span className="text-lg sm:text-xl font-extrabold text-rose-600 block mt-1">₦12.4M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverviewTab;

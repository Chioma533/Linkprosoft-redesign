import React, { useState } from "react";
import { Users, Search, ChevronDown, Eye, ArrowUpRight } from "lucide-react";
import ApprovePayoutModal from "./ApprovePayoutModal";
import PayoutSuccessModal from "./PayoutSuccessModal";

const FinancePayoutsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activePayoutData, setActivePayoutData] = useState(null);

  const statCards = [
    { id: "pending", title: "Pending", value: "₦42.8M", trend: "+20% this week", icon: Users, iconColor: "text-[#016EA6]" },
    { id: "processing", title: "Processing", value: "₦33.8M", trend: "+20% this week", icon: Users, iconColor: "text-[#016EA6]" },
    { id: "completed", title: "Completed", value: "₦12.4M", trend: "+20% this week", icon: Users, iconColor: "text-[#016EA6]" },
    { id: "failed", title: "Failed", value: "₦3.2M", trend: "+20% this week", icon: Users, iconColor: "text-rose-500", bgColor: "bg-[#FFF1F2]" },
  ];

  const payouts = [
    { id: "#PAY-9921", job: "Kitchen Plumbing", professional: "Samuel Owoniyi", amount: "₦690,000", bank: "GT Bank", status: "Successful", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Pending", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Successful", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Pending", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Pending", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Pending", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Pending", date: "24 jul 2026" },
    { id: "#PAY-9921", job: "Wardrobe Installation", professional: "Samuel Owoniyi", amount: "₦85,000", bank: "GT Bank", status: "Pending", date: "24 jul 2026" },
  ];

  const handleOpenApproval = (payoutItem) => {
    setSelectedPayout(payoutItem);
  };

  const handleConfirmPayout = () => {
    setActivePayoutData(selectedPayout);
    setSelectedPayout(null);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`${card.bgColor || "bg-white"} rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs sm:text-[13px] font-medium tracking-tight ${card.bgColor ? "text-rose-700" : "text-gray-500"}`}>
                  {card.title}
                </span>
                <div className="p-1">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor} stroke-[1.8]`} />
                </div>
              </div>
              <div className="mt-3 mb-2">
                <span className={`text-2xl sm:text-[28px] font-bold tracking-tight block leading-none ${card.bgColor ? "text-rose-950" : "text-gray-900"}`}>
                  {card.value}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
        {/* Table Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
            Payouts Requests
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, User Job"
                className="pl-9 pr-4 py-2 bg-gray-50/90 focus:bg-gray-100/80 rounded-full text-xs font-medium text-gray-700 outline-none border-none w-full sm:w-56 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Type Dropdown */}
            <div className="relative">
              <select className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all">
                <option>Type : All</option>
                <option>Bank Transfer</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Range Dropdown */}
            <div className="relative">
              <select className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all">
                <option>Date Range</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Apply Filter Button */}
            <button className="bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs px-4.5 py-2 rounded-full cursor-pointer transition-all border-none">
              Apply filter
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-none">
            <thead>
              <tr className="border-none text-xs font-semibold text-gray-400">
                <th className="py-3.5 px-3">Payout ID</th>
                <th className="py-3.5 px-3">Job</th>
                <th className="py-3.5 px-3">Professional</th>
                <th className="py-3.5 px-3">Amount</th>
                <th className="py-3.5 px-3">Bank</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="border-none">
              {payouts.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleOpenApproval(item)}
                  className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-gray-800">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                    {item.job}
                  </td>
                  <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                    {item.professional}
                  </td>
                  <td className="py-3.5 px-3 text-xs sm:text-sm font-extrabold text-gray-900">
                    {item.amount}
                  </td>
                  <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold">G</span>
                      <span>{item.bank}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${
                        item.status === "Successful"
                          ? "bg-[#E6F9F0] text-[#00CC66]"
                          : "bg-[#FFF4E5] text-[#FF9800]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenApproval(item);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {payouts.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenApproval(item)}
              className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800 text-sm">{item.id} - {item.job}</h4>
                <button className="p-1 text-gray-500 hover:text-[#016EA6]">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>Pro: {item.professional}</span>
                <span>Bank: {item.bank}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-gray-900 text-sm">{item.amount}</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === "Successful"
                      ? "bg-[#E6F9F0] text-[#00CC66]"
                      : "bg-[#FFF4E5] text-[#FF9800]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
          <span className="text-xs font-medium text-gray-500">
            Showing page 1 of 5 pages
          </span>

          <div className="flex items-center gap-1.5">
            <button className="w-6 h-6 rounded bg-[#1E1B4B] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs border-none">
              1
            </button>
            <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
              2
            </button>
            <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
              3
            </button>
            <span className="text-xs text-gray-400 px-1">...</span>
            <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
              5
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: Approve Payout Modal Overlay */}
      {selectedPayout && (
        <ApprovePayoutModal
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
          onConfirm={handleConfirmPayout}
        />
      )}

      {/* Modal 2: Payout Successful Confirmation Overlay */}
      {showSuccessModal && (
        <PayoutSuccessModal
          payout={activePayoutData}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default FinancePayoutsTab;

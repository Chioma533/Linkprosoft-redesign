import React, { useState } from "react";
import { 
  Users, 
  Search, 
  ChevronDown, 
  Eye, 
  ArrowUpRight 
} from "lucide-react";

// Sub-tab Components for Finance
import FinanceOverviewTab from "./components/finance/FinanceOverviewTab";
import FinancePayoutsTab from "./components/finance/FinancePayoutsTab";
import FinanceRefundsTab from "./components/finance/FinanceRefundsTab";
import FinanceCommissionTab from "./components/finance/FinanceCommissionTab";

const AdminPaymentsSubpage = ({ onNavigate }) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState("overview"); // overview, transactions, escrow, payouts, refunds, commission
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const financeTabs = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
    { id: "escrow", label: "Escrow" },
    { id: "payouts", label: "Payouts" },
    { id: "refunds", label: "Refunds" },
    { id: "commission", label: "Commission" },
  ];

  // Seed data for Transactions view matching screenshot
  const transactions = [
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
    { id: "#TX-92841", user: "Jane Doe", job: "Wardrobe Installation", type: "Escrow Deposit", amount: "₦85,000", status: "Succesful", date: "24 jul 2026" },
  ];

  // Seed data for Escrow view matching screenshot
  const escrowRecords = [
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
    { id: "#ESC- 687", job: "Wardrobe Installation", client: "Jane Doe", professional: "Samuel Owoniyi", amount: "₦85,000", date: "24 jul 2026", status: "Held" },
  ];

  const escrowStats = [
    { id: "total-held", title: "Total Held", value: "₦498.6M", trend: "+20% this week", icon: Users, iconColor: "text-[#016EA6]" },
    { id: "awaiting-completion", title: "Awaiting Completion", value: "₦33.8M", trend: "+20% this week", icon: Users, iconColor: "text-[#016EA6]" },
    { id: "ready-release", title: "Ready for Release", value: "₦12.4M", trend: "+20% this week", icon: Users, iconColor: "text-[#016EA6]" },
    { id: "under-dispute", title: "Under Dispute", value: "₦3.2M", trend: "+20% this week", icon: Users, iconColor: "text-rose-500", bgColor: "bg-[#FFF1F2]" },
  ];

  const renderActiveFinanceContent = () => {
    switch (activeFinanceTab) {
      case "overview":
        return <FinanceOverviewTab />;
      case "payouts":
        return <FinancePayoutsTab />;
      case "refunds":
        return <FinanceRefundsTab />;
      case "commission":
        return <FinanceCommissionTab />;
      case "escrow":
        return (
          <div className="space-y-6">
            {/* Escrow Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {escrowStats.map((card) => {
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

            {/* Escrow Table */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                  Escrow Transactions
                </h3>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
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
                  <div className="relative">
                    <select className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer">
                      <option>All Status</option>
                      <option>Held</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button className="bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs px-4.5 py-2 rounded-full cursor-pointer transition-all border-none">
                    Apply filter
                  </button>
                </div>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-none">
                  <thead>
                    <tr className="border-none text-xs font-semibold text-gray-400">
                      <th className="py-3.5 px-3">ESC ID</th>
                      <th className="py-3.5 px-3">Job</th>
                      <th className="py-3.5 px-3">Client</th>
                      <th className="py-3.5 px-3">Professional</th>
                      <th className="py-3.5 px-3">Amount</th>
                      <th className="py-3.5 px-3">Date funded</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-3 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="border-none">
                    {escrowRecords.map((item, idx) => (
                      <tr key={idx} className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer">
                        <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-gray-800">{item.id}</td>
                        <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{item.job}</td>
                        <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{item.client}</td>
                        <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{item.professional}</td>
                        <td className="py-3.5 px-3 text-xs sm:text-sm font-extrabold text-gray-900">{item.amount}</td>
                        <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">{item.date}</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFF4E5] text-[#FF9800]">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
                <span className="text-xs font-medium text-gray-500">Showing page 1 of 5 pages</span>
                <div className="flex items-center gap-1.5">
                  <button className="w-6 h-6 rounded bg-[#1E1B4B] text-white font-bold text-xs flex items-center justify-center border-none">1</button>
                  <button className="w-6 h-6 rounded text-gray-500 font-semibold text-xs flex items-center justify-center border-none">2</button>
                  <button className="w-6 h-6 rounded text-gray-500 font-semibold text-xs flex items-center justify-center border-none">3</button>
                  <span className="text-xs text-gray-400 px-1">...</span>
                  <button className="w-6 h-6 rounded text-gray-500 font-semibold text-xs flex items-center justify-center border-none">5</button>
                </div>
              </div>
            </div>
          </div>
        );
      case "transactions":
      default:
        return (
          <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
            {/* Transactions Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                Transactions
              </h3>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
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

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="successful">Succesful</option>
                    <option value="held">Held</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">Type : All</option>
                    <option value="deposit">Escrow Deposit</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer">
                    <option>Date Range</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

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
                    <th className="py-3.5 px-3">TRX ID</th>
                    <th className="py-3.5 px-3">User</th>
                    <th className="py-3.5 px-3">Job</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3">Amount</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Date posted</th>
                    <th className="py-3.5 px-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="border-none">
                  {transactions.map((item, idx) => (
                    <tr key={idx} className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer">
                      <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-gray-800">{item.id}</td>
                      <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{item.user}</td>
                      <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{item.job}</td>
                      <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{item.type}</td>
                      <td className="py-3.5 px-3 text-xs sm:text-sm font-extrabold text-gray-900">{item.amount}</td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#E6F9F0] text-[#00CC66]">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">{item.date}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none">
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
              {transactions.map((item, idx) => (
                <div key={idx} className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 text-sm">{item.id} - {item.job}</h4>
                    <button className="p-1 text-gray-500 hover:text-[#016EA6]">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                    <span>User: {item.user}</span>
                    <span>Type: {item.type}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-gray-900 text-sm">{item.amount}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F9F0] text-[#00CC66]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
              <span className="text-xs font-medium text-gray-500">Showing page 1 of 5 pages</span>
              <div className="flex items-center gap-1.5">
                <button className="w-6 h-6 rounded bg-[#1E1B4B] text-white font-bold text-xs flex items-center justify-center border-none">1</button>
                <button className="w-6 h-6 rounded text-gray-500 font-semibold text-xs flex items-center justify-center border-none">2</button>
                <button className="w-6 h-6 rounded text-gray-500 font-semibold text-xs flex items-center justify-center border-none">3</button>
                <span className="text-xs text-gray-400 px-1">...</span>
                <button className="w-6 h-6 rounded text-gray-500 font-semibold text-xs flex items-center justify-center border-none">5</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
          Good Morning Admin
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
          Review identity documents, certifications, and portfolios before approving professionals to join the marketplace.
        </p>
      </div>

      {/* Finance Sub-tabs Row */}
      <div className="flex items-center gap-6 border-none overflow-x-auto pb-1 pt-2 select-none">
        {financeTabs.map((tab) => {
          const isActive = activeFinanceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFinanceTab(tab.id)}
              className={`text-xs sm:text-sm font-semibold transition-all relative cursor-pointer border-none whitespace-nowrap pb-2.5 ${
                isActive ? "text-[#016EA6] font-bold" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#016EA6] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab Active Content */}
      {renderActiveFinanceContent()}
    </div>
  );
};

export default AdminPaymentsSubpage;

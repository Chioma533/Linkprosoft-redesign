import React, { useState } from "react";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  PauseCircle, 
  Search, 
  ChevronDown, 
  Eye, 
  ArrowUpRight 
} from "lucide-react";
import AdminDisputeDetails from "./components/AdminDisputeDetails";

const AdminDisputesSubpage = ({ onNavigate }) => {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [raisedByFilter, setRaisedByFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Seed disputes data matching exact UI mockup
  const [disputes, setDisputes] = useState([
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
    {
      id: "#DSP-1024",
      jobId: "JOB-703",
      jobTitle: "Kitchen Plumbing",
      raisedBy: "Samuel O",
      against: "Elvis C",
      employer: "Samuel O",
      professional: "Elvis C",
      amount: "₦85,000",
      numericAmount: 85000,
      reason: "Poor Workmanship",
      status: "open",
      statusText: "Open",
      date: "24 jul 2026",
    },
  ]);

  const statCards = [
    {
      id: "open-disputes",
      title: "Open Disputes",
      value: "24",
      trend: "+20% this week",
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "under-review",
      title: "Under Review",
      value: "12",
      trend: "+20% this week",
      icon: Clock,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "resolved-disputes",
      title: "Resolved",
      value: "186",
      trend: "+20% this week",
      icon: CheckCircle2,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "escrow-held",
      title: "Escrow Held",
      value: "₦860K",
      trend: "+20% this week",
      icon: PauseCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
  ];

  const handleResolveAction = (disputeId, resolutionData) => {
    setDisputes(
      disputes.map((d) => {
        if (d.id === disputeId) {
          return { ...d, status: "resolved", statusText: "Resolved" };
        }
        return d;
      })
    );
  };

  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.raisedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.against.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRaisedBy =
      raisedByFilter === "all"
        ? true
        : raisedByFilter === "client"
        ? d.raisedBy.includes("Samuel")
        : d.raisedBy.includes("Elvis");

    const matchesStatus =
      statusFilter === "all" ? true : d.status === statusFilter;

    return matchesSearch && matchesRaisedBy && matchesStatus;
  });

  if (selectedDispute) {
    return (
      <AdminDisputeDetails
        dispute={{
          ...selectedDispute,
          amount: selectedDispute.numericAmount || 85000,
        }}
        onBack={() => setSelectedDispute(null)}
        onResolve={handleResolveAction}
      />
    );
  }

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

      {/* Top 4 Stat Cards (Border-less) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-full ${card.iconBg || ""}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor} stroke-[1.8]`} />
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
          );
        })}
      </div>

      {/* Main Disputes Table Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
        {/* Table Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
            Disputes
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or ID...."
                className="pl-9 pr-4 py-2 bg-gray-50/90 focus:bg-gray-100/80 rounded-full text-xs font-medium text-gray-700 outline-none border-none w-full sm:w-64 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Raised by Dropdown */}
            <div className="relative">
              <select
                value={raisedByFilter}
                onChange={(e) => setRaisedByFilter(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">Raised by : All</option>
                <option value="client">Raised by : Client</option>
                <option value="professional">Raised by : Professional</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="review">Under Review</option>
                <option value="resolved">Resolved</option>
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
                <th className="py-3.5 px-3">Dispute</th>
                <th className="py-3.5 px-3">Job</th>
                <th className="py-3.5 px-3">Raised by</th>
                <th className="py-3.5 px-3">Against</th>
                <th className="py-3.5 px-3">Amount</th>
                <th className="py-3.5 px-3">Reason</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Date posted</th>
                <th className="py-3.5 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="border-none">
              {filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400 text-xs font-medium">
                    No disputes match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredDisputes.map((disp, idx) => (
                  <tr
                    key={idx}
                    className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-gray-800">
                      {disp.id}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {disp.jobTitle}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {disp.raisedBy}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {disp.against}
                    </td>
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-extrabold text-gray-900">
                      {disp.amount}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {disp.reason}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${
                          disp.status === "open"
                            ? "bg-[#FFF4E5] text-[#FF9800]"
                            : disp.status === "resolved"
                            ? "bg-[#E6F9F0] text-[#00CC66]"
                            : "bg-[#E6F4FA] text-[#016EA6]"
                        }`}
                      >
                        {disp.statusText}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">
                      {disp.date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedDispute(disp)}
                        className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none"
                        title="View dispute details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {filteredDisputes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs font-medium">
              No disputes found.
            </div>
          ) : (
            filteredDisputes.map((disp, idx) => (
              <div
                key={idx}
                className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-sm">{disp.id} - {disp.jobTitle}</h4>
                  <button
                    onClick={() => setSelectedDispute(disp)}
                    className="p-1 text-gray-500 hover:text-[#016EA6]"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Raised: {disp.raisedBy}</span>
                  <span>Against: {disp.against}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-extrabold text-gray-900 text-sm">{disp.amount}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      disp.status === "open"
                        ? "bg-[#FFF4E5] text-[#FF9800]"
                        : disp.status === "resolved"
                        ? "bg-[#E6F9F0] text-[#00CC66]"
                        : "bg-[#E6F4FA] text-[#016EA6]"
                    }`}
                  >
                    {disp.statusText}
                  </span>
                </div>
              </div>
            ))
          )}
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
    </div>
  );
};

export default AdminDisputesSubpage;

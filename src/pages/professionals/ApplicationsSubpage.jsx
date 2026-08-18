import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiChevronRight,
  FiChevronDown,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
  FiX,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import MobileJobCard from "../../components/ui/MobileJobCard";
import WelcomeHeader from "../../components/common/WelcomeHeader";
import DashboardStats from "../../components/common/DashboardStats";
import SearchInput from "../../components/filters/SearchInput";
import FilterSelect from "../../components/filters/FilterSelect";
import { categoryOptions, statusOptions } from "../../constants/filterOptions";
import Pagination from "../../components/common/Pagination";
import { PAGINATION } from "../../constants/pagination";
import { usePagination } from "../../hooks/usePagination";
import { formatCurrency } from "../../utils/formatCurrency";

const ApplicationsSubpage = () => {
  const { applications = [], setActiveTab } = useDashboardStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAppModal, setSelectedAppModal] = useState(null);

  // Normalize application items
  const normalizedApplications = useMemo(() => {
    return (applications || []).map((app, idx) => ({
      ...app,
      id: app.id || app._id || idx + 1,
      jobId: app.jobId || app.job_id || app.job?.id || `JOB-${idx + 1}`,
      title: app.job?.title || app.title || app.jobTitle || "Submitted Application",
      client:
        app.job?.client?.fullName ||
        app.client?.fullName ||
        app.client?.name ||
        app.client ||
        app.employerName ||
        "Direct Buyer",
      category: app.job?.category?.name || app.category || "General Service",
      appliedOn:
        app.appliedOn ||
        (app.createdAt
          ? new Date(app.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
          : "Recently"),
      status: app.status || "Under review",
      lastUpdate:
        app.lastUpdate ||
        (app.updatedAt
          ? new Date(app.updatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
          : "Recently"),
      budget: Number(app.bidAmount || app.proposedBudget || app.budget || 0),
      coverLetter: app.coverLetter || app.proposal || "No cover letter provided.",
    }));
  }, [applications]);

  // Live Application Stats
  const stats = useMemo(() => {
    const totalSent = normalizedApplications.length;
    const underReview = normalizedApplications.filter((a) =>
      ["under review", "pending", "submitted"].includes((a.status || "").toLowerCase())
    ).length;
    const accepted = normalizedApplications.filter((a) =>
      ["accepted", "hired", "approved"].includes((a.status || "").toLowerCase())
    ).length;
    const rejected = normalizedApplications.filter((a) =>
      ["rejected", "declined"].includes((a.status || "").toLowerCase())
    ).length;

    return [
      {
        id: "application-sent",
        title: "Applications Sent",
        value: String(totalSent),
        icon: FiBriefcase,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
      },
      {
        id: "under-review",
        title: "Under Review",
        value: String(underReview),
        icon: FiClock,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-50",
      },
      {
        id: "accepted",
        title: "Accepted / Hired",
        value: String(accepted),
        icon: FiCheckCircle,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
      },
      {
        id: "rejected",
        title: "Declined",
        value: String(rejected),
        icon: FiXCircle,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
      },
    ];
  }, [normalizedApplications]);

  // Filter logic
  const filteredApps = useMemo(() => {
    return normalizedApplications.filter((app) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        (app.title || "").toLowerCase().includes(q) ||
        (app.client || "").toLowerCase().includes(q) ||
        (app.category || "").toLowerCase().includes(q);

      const matchesCategory =
        !categoryFilter ||
        (app.category || "").toLowerCase() === categoryFilter.toLowerCase();

      const matchesStatus =
        !statusFilter ||
        (app.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [normalizedApplications, search, categoryFilter, statusFilter]);

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "under review":
      case "pending":
      case "submitted":
        return "bg-orange-50 text-orange-500";
      case "accepted":
      case "hired":
      case "approved":
        return "bg-emerald-50 text-emerald-600";
      case "rejected":
      case "declined":
        return "bg-red-50 text-red-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const { pagination, currentItems, handlePageChange } = usePagination(
    filteredApps,
    PAGINATION.BROWSE_JOBS
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeHeader />
      <DashboardStats stats={stats} />

      {/* Applications list card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="md:text-base text-sm whitespace-nowrap font-bold text-gray-900">
                Submitted Proposals
              </h3>
              {normalizedApplications.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6]">
                  {normalizedApplications.length}
                </span>
              )}
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <SearchInput
                placeholder="Search proposals..."
                value={search}
                onChange={setSearch}
                debounce={300}
                className="w-37.5 sm:w-80 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
              />

              <FilterSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryOptions}
                className="w-full sm:w-auto pr-4 py-2.5 rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
                icon={FiChevronDown}
              />

              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-full sm:w-auto pr-4 py-2.5 rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
                icon={FiChevronDown}
              />
            </div>

            {/* Mobile Search Input */}
            <div className="relative lg:hidden max-w-32.5 sm:max-w-xs">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
              />
            </div>
          </div>

          {/* Desktop Table View / Empty State */}
          {currentItems.length > 0 ? (
            <>
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 font-semibold">Client</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Proposed Bid</th>
                      <th className="pb-3 font-semibold">Applied On</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentItems.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        <td className="py-4 font-bold text-gray-800">
                          {app.title}
                        </td>
                        <td className="py-4 font-semibold text-gray-800">
                          {app.client}
                        </td>
                        <td className="py-4 font-medium text-gray-400">
                          {app.category}
                        </td>
                        <td className="py-4 font-bold text-gray-800">
                          {app.budget ? formatCurrency(app.budget) : "—"}
                        </td>
                        <td className="py-4 font-semibold text-gray-500">
                          {app.appliedOn}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${getStatusStyle(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => setSelectedAppModal(app)}
                            className="text-[#016EA6] hover:text-[#061EA6] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>View</span>
                            <FiChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden space-y-4">
                {currentItems.map((app) => (
                  <MobileJobCard
                    key={app.id}
                    job={{
                      ...app,
                      datePosted: app.appliedOn,
                      status:
                        app.status === "Under review"
                          ? "Pending"
                          : app.status === "Accepted"
                          ? "Active"
                          : "Cancelled",
                    }}
                    onViewDetails={() => setSelectedAppModal(app)}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Modern Empty State */
            <div className="py-14 px-4 rounded-2xl bg-gradient-to-b from-gray-50/60 to-white border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="text-[#016EA6] mb-3 flex items-center justify-center">
                <FiFileText className="w-8 h-8 stroke-[2]" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">No Applications Found</h4>
              <p className="text-xs text-gray-400 font-medium max-w-sm mb-5 leading-relaxed">
                {search || categoryFilter || statusFilter
                  ? "No proposals match your current filter parameters. Try clearing some filters."
                  : "You haven't submitted proposals for any jobs yet. Browse open contracts in your area and submit your competitive bid."}
              </p>
              <div className="flex items-center gap-3">
                {search || categoryFilter || statusFilter ? (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("");
                      setStatusFilter("");
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("browse-jobs")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <span>Browse Open Jobs</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {currentItems.length > 0 && (
        <div>
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Application / Proposal Details Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in text-gray-800">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAppModal(null)}
              className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#016EA6] flex items-center justify-center shrink-0">
                <FiBriefcase className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#016EA6]">
                  Proposal Details
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {selectedAppModal.title}
                </h3>
                <p className="text-xs text-gray-400 font-semibold">
                  Client: {selectedAppModal.client} • Category: {selectedAppModal.category}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50/60 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">
                    Your Proposed Bid
                  </span>
                  <span className="text-sm font-extrabold text-[#016EA6] block mt-0.5">
                    {formatCurrency(selectedAppModal.budget)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">
                    Current Status
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] mt-1 ${getStatusStyle(
                      selectedAppModal.status
                    )}`}
                  >
                    {selectedAppModal.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">
                    Date Submitted
                  </span>
                  <span className="text-xs font-semibold text-gray-700 block mt-0.5">
                    {selectedAppModal.appliedOn}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">
                    Last Activity
                  </span>
                  <span className="text-xs font-semibold text-gray-700 block mt-0.5">
                    {selectedAppModal.lastUpdate}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-1.5">Submitted Cover Letter</h4>
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed font-normal">
                  {selectedAppModal.coverLetter}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppModal(null)}
                  className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsSubpage;


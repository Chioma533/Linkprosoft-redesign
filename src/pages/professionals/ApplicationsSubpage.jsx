import { FiSearch, FiChevronRight, FiMapPin, FiCalendar, FiChevronDown, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import MobileJobCard from "../../components/ui/MobileJobCard";
import { useState } from "react";
import WelcomeHeader from "../../components/common/WelcomeHeader";
import DashboardStats from "../../components/common/DashboardStats";
import SearchInput from "../../components/filters/SearchInput";
import { Filter } from "lucide-react";
import { useJobFilter } from "../../hooks/useJobFilter";
import { PAGINATION } from "../../constants/pagination";
import { usePagination } from "../../hooks/usePagination";
import FilterSelect from "../../components/filters/FilterSelect";
import { categoryOptions, dateOptions, locationOptions, statusOptions } from "../../constants/filterOptions";
import Pagination from "../../components/common/Pagination";

const ApplicationsSubpage = () => {
  const { jobs, metrics } = useDashboardStore();
  // const [searchTerm, setSearchTerm] = useState("");
  // const [categoryFilter, setCategoryFilter] = useState("");
  // const [statusFilter, setStatusFilter] = useState("");

    const stats = [
    {
      id: "application-sent",
      title: "Application Sent",
      value: String(metrics?.activeJobsCount ?? 0),
      icon: FiBriefcase,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      id: " under-review",
      title: "Under Review",
      value: String(metrics?.upcomingJobsCount ?? 0),
      icon: FiBriefcase,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      id: "accepted",
      title: "Accepted",
      value: String(metrics?.completedJobsCount ?? 0),
      icon: FiCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
    {
      id: "rejected",
      title: "Rejected",
      value: `${metrics?.performancePercentage ?? 0}%`,
      icon: FiCheckCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
    },
  ];

  // Filter Applications
  // const filteredApps = applications.filter((app) => {
  //   const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //                         app.client.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = categoryFilter ? app.category === categoryFilter : true;
  //   const matchesStatus = statusFilter ? app.status === statusFilter : true;
  //   return matchesSearch && matchesCategory && matchesStatus;
  // });

    const {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    locationFilter,
    setLocationFilter,

    statusFilter,
    setStatusFilter,

    filteredJobs,
  } = useJobFilter(jobs);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Under review":
        return "bg-orange-50 text-orange-500";
      case "Accepted":
        return "bg-sky-50 text-[#016EA6]";
      case "Rejected":
        return "bg-red-50 text-red-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

   const { pagination, currentItems, handlePageChange } = usePagination(
     filteredJobs,
     PAGINATION.BROWSE_JOBS,
   );

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeHeader />
      <DashboardStats stats={stats} />

      {/* Applications list */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="md:text-base text-sm whitespace-nowrap font-bold text-gray-900 mr-15 md:mr-0 ">
              All jobs
            </h3>

            {/* Desktop Filters */}
            <div className="flex flex-wrap items-center gap-1 w-full lg:w-auto">
              <SearchInput
                placeholder="Search Jobs"
                value={search}
                onChange={setSearch}
                debounce={500}
                className="md:w-80! w-50.5! pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
              />

              <FilterSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryOptions}
                className=" hidden lg:flex w-full sm:w-auto pr-4 py-2.5 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
                icon={FiChevronDown}
              />

              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="hidden lg:flex w-full sm:w-auto pr-4 py-2.5 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
                icon={FiChevronDown}
              />
            </div>

            {/* Mobile Filters */}
            {/* <div className="flex lg:hidden items-center justify-between gap-4 w-full max-w-70"> */}
            {/* Dropdown status text */}

            {/* <div className="relative flex items-center">
              <FilterSelect
                options={statusOptions}
                icon={FiChevronDown}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full sm:w-auto pr-4 py-2 pl-0 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
              />
            </div> */}

            {/* Search input */}
            {/* <div className="relative max-w-32.5 sm:max-w-xs">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search Jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
              />
            </div> */}
            {/* </div> */}
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                  <th className="pb-3 font-semibold">Job Title</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Applied on</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Last update</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.length > 0 ? (
                  currentItems.map((app) => (
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
                      <td className="py-4 font-semibold text-gray-500">
                        {app.appliedOn}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${getStatusStyle(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-gray-400">
                        {app.lastUpdate}
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-blue-500 hover:text-blue-700 font-bold transition-colors inline-flex items-center gap-1 cursor-pointer">
                          <span>View</span>
                          <FiChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-gray-400 font-semibold"
                    >
                      No applications found matching the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {currentItems.length > 0 ? (
              currentItems.map((app) => (
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
                  onViewDetails={() => {}}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 font-semibold text-xs bg-gray-50 rounded-2xl">
                No applications found matching the filter criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div>
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />{" "}
      </div>
    </div>
  );
};

export default ApplicationsSubpage;

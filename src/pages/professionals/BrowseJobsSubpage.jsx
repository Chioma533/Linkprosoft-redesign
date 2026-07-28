import {
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiBriefcase,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import JobCard from "../../components/ui/JobCard";
import { toast } from "react-hot-toast";
import WelcomeHeader from "../../components/common/WelcomeHeader";
import DashboardStats from "../../components/common/DashboardStats";
import { formatCurrency } from "../../utils/formatCurrency";
import SearchInput from "../../components/filters/SearchInput";
import FilterSelect from "../../components/filters/FilterSelect";
import {
  budgetOptions,
  dateOptions,
  locationOptions,
} from "../../constants/filterOptions";
import Pagination from "../../components/common/Pagination";
import { useJobFilter } from "../../hooks/useJobFilter";
import { usePagination } from "../../hooks/usePagination";
import EmptyState from "../../components/ui/EmptyState";
import { PAGINATION } from "../../constants/pagination";

const BrowseJobsSubpage = () => {
  const { jobs, metrics } = useDashboardStore();
  const stats = [
    {
      id: " active-jobs",
      title: "Active Jobs",
      value: String(metrics?.activeJobsCount ?? 0),
      icon: FiBriefcase,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      id: " upcoming-jobs",
      title: "Upcoming Jobs",
      value: String(metrics?.upcomingJobsCount ?? 0),
      icon: FiBriefcase,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      id: "completed-jobs",
      title: "Completed Jobs",
      value: String(metrics?.completedJobsCount ?? 0),
      icon: FiCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
    {
      id: "performance",
      title: "Performance",
      value: `${metrics?.performancePercentage ?? 0}%`,
      icon: FiStar,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ];
  const {
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    locationFilter,
    setLocationFilter,
    budgetFilter,
    setBudgetFilter,
    filteredJobs,
  } = useJobFilter(jobs);

  const { pagination, currentItems, handlePageChange } = usePagination(
    filteredJobs,
    PAGINATION.BROWSE_JOBS,
  );

  const handleApplyClick = (job) => {
    toast.success(`You have successfully applied for the job: ${job.title}`);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <WelcomeHeader />
      {/* Stats Cards */}
      <DashboardStats stats={stats} />
      {/* Filter Row */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100/50 shadow-sm flex flex-row gap-2 items-center overflow-x-auto scrollbar-none w-full">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search Jobs"
          debounce={500}
          className="w-[130px] xs:w-[150px] sm:w-auto shrink-0"
        />

        {/* Location Dropdown */}
        <FilterSelect
          icon={FiMapPin}
          value={locationFilter}
          onChange={setLocationFilter}
          options={locationOptions}
          className="w-[110px] xs:w-[125px] sm:w-auto shrink-0"
        />

        {/* Date Posted */}
        <FilterSelect
          icon={FiCalendar}
          value={dateFilter}
          onChange={setDateFilter}
          options={dateOptions}
          className="w-[115px] xs:w-[130px] sm:w-auto shrink-0"
        />

        {/* Budget */}
        <FilterSelect
          icon={FiCreditCard}
          value={budgetFilter}
          onChange={setBudgetFilter}
          options={budgetOptions}
          className="hidden md:block shrink-0"
        />
      </div>
      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApplyClick} />
          ))
        ) : (
          <EmptyState title="No jobs matching your filter parameters were found." />
        )}
      </div>
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />{" "}
    </div>
  );
};

export default BrowseJobsSubpage;

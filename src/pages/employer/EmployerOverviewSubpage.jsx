import React from "react";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";
import ToggleOffIcon from "../../components/icons/ToggleOffIcon";
import InformationCircleIcon from "../../components/icons/InformationCircleIcon";
import DatabaseLockedIcon from "../../components/icons/DatabaseLockedIcon";
import BorderFullIcon from "../../components/icons/BorderFullIcon";
import { useExport } from "../../hooks/useExport";
import { useEmployerOverview } from "../../hooks/useEmployerOverview";
import { formatCurrency } from "../../utils/formatCurrency";
import EmployerActiveJobs from "../../components/employer/EmployerActiveJobs";
import EmployerEscrowPerformance from "../../components/employer/EmployerEscrowPerformance";
import EmployerUpcomingSchedule from "../../components/employer/EmployerUpcomingSchedule";

const EmployerOverviewSubpage = ({ onViewProject }) => {
  const { user } = useAuthStore();
  const { setActiveTab } = useDashboardStore();
  const { exportData } = useExport();
  const overview = useEmployerOverview();
  const userName = user?.fullName || user?.full_name || "Employer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const postJob = () => setActiveTab("manage-jobs");

  return <div className="space-y-8 animate-fade-in pb-8">
    <div><h2 className="text-2xl font-medium text-gray-900">{greeting} {userName},</h2><p className="text-sm text-gray-400 mt-1 font-light">Manage your jobs and payments effortlessly.</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"><StatsCard title="Active jobs" value={String(overview.activeJobs.length)} icon={ToggleOffIcon} iconColor="text-blue-500" /><StatsCard title="Awaiting action" value={String(overview.awaitingAction.length)} icon={InformationCircleIcon} iconColor="text-orange-500" BgColor="bg-[#fff4ea]" /><StatsCard title="Funds in Escrow" value={overview.escrowTotal > 0 ? formatCurrency(overview.escrowTotal) : "₦0"} subtitle={overview.awaitingAction.length > 0 ? `Across ${overview.awaitingAction.length} jobs` : undefined} icon={DatabaseLockedIcon} iconColor="text-sky-500" /><StatsCard title="Completed jobs" value={String(overview.completedJobs.length)} icon={BorderFullIcon} iconColor="text-emerald-500" /></div>
    <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2"><EmployerActiveJobs jobs={overview.filteredActiveJobs} search={overview.jobSearch} setSearch={overview.setJobSearch} statusFilter={overview.statusFilter} setStatusFilter={overview.setStatusFilter} showFilterMenu={overview.showFilterMenu} setShowFilterMenu={overview.setShowFilterMenu} onViewProject={onViewProject} onPost={postJob} isLoading={overview.isLoadingJobs} onExport={(type) => exportData({ type, data: overview.filteredActiveJobs, formatter: overview.jobFormatter, filename: "employer-active-jobs", sheetName: "Active Jobs", pdfTitle: "Employer Active Jobs Report" })} /></div><EmployerEscrowPerformance escrowTotal={overview.escrowTotal} awaitingAction={overview.awaitingAction} onViewDetails={postJob} /></div>
    <div className="md:hidden"><EmployerActiveJobs jobs={overview.filteredActiveJobs} search={overview.jobSearch} setSearch={overview.setJobSearch} statusFilter={overview.statusFilter} setStatusFilter={overview.setStatusFilter} showFilterMenu={overview.showFilterMenu} setShowFilterMenu={overview.setShowFilterMenu} onViewProject={onViewProject} onPost={postJob} isLoading={overview.isLoadingJobs} onExport={() => {}} /></div>
    <EmployerUpcomingSchedule jobs={overview.scheduleJobs} filter={overview.scheduleFilter} setFilter={overview.setScheduleFilter} onViewProject={onViewProject} />
  </div>;
};

export default EmployerOverviewSubpage;
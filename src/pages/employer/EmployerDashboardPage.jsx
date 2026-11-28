import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import EmployerOverviewSubpage from "./EmployerOverviewSubpage";
import EmployerManageJobsSubpage from "./EmployerManageJobsSubpage";
import EmployerJobDetailsSubpage from "./EmployerJobDetailsSubpage";
import EmployerOpenDisputeSubpage from "./EmployerOpenDisputeSubpage";
import EmployerBrowseProfessionalsSubpage from "./EmployerBrowseProfessionalsSubpage";
import EmployerMessagesSubpage from "./EmployerMessagesSubpage";
import WalletSubpage from "../professionals/WalletSubpage";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuthStore } from "../../store/authStore";
import EmployerProfileSubpage from "./EmployerProfileSubpage";
import SettingsSubpage from "../SettingsSubpage";

const EmployerDashboardPage = () => {
  const location = useLocation();
  const { activeTab, setActiveTab } = useDashboardStore();
  const { user } = useAuthStore();
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Handle incoming navigation state (e.g. redirected from PaymentScreen with job-details)
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    if (location.state?.jobId) {
      setSelectedJobId(location.state.jobId);
    }
  }, [location.state, setActiveTab]);

  const handleViewProject = (jobId) => {
    if (jobId) {
      setSelectedJobId(String(jobId));
      setActiveTab("job-details");
    }
  };

  const renderMissingJobSelection = (title) => (
    <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">Select a real project from your jobs before continuing.</p>
      <button
        type="button"
        onClick={() => setActiveTab("manage-jobs")}
        className="mt-5 rounded-full bg-[#016EA6] px-6 py-2.5 text-xs font-bold text-white"
      >
        Go to My Jobs
      </button>
    </div>
  );

  const renderActiveSubpage = () => {
    switch (activeTab) {
      case "overview":
        return <EmployerOverviewSubpage onViewProject={handleViewProject} />;
      case "manage-jobs":
        return <EmployerManageJobsSubpage onViewProject={handleViewProject} />;
      case "job-details":
        if (!selectedJobId) return renderMissingJobSelection("No project selected");
        return (
          <EmployerJobDetailsSubpage
            jobId={selectedJobId}
            onBack={() => setActiveTab("manage-jobs")}
            onOpenDispute={() => setActiveTab("open-dispute")}
          />
        );
      case "open-dispute":
        if (!selectedJobId) return renderMissingJobSelection("No project selected");
        return (
          <EmployerOpenDisputeSubpage
            jobId={selectedJobId}
            onBack={() => setActiveTab("job-details")}
          />
        );

      case "messages":
        return <EmployerMessagesSubpage />;

      case "profile":
        return <EmployerProfileSubpage employerId={user?.id || user?.userId} />;
      case "settings":
        return <SettingsSubpage />;

      case "browse-professionals":
        return <EmployerBrowseProfessionalsSubpage />;
      case "wallet":
        return <WalletSubpage />;
      default:
        return <EmployerOverviewSubpage onViewProject={handleViewProject} />;
    }
  };

  return (
    <div className="employer-dashboard">
      <DashboardLayout>
        {renderActiveSubpage()}
      </DashboardLayout>
    </div>
  );
};

export default EmployerDashboardPage;
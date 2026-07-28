import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import EmployerOverviewSubpage from "./EmployerOverviewSubpage";
import EmployerManageJobsSubpage from "./EmployerManageJobsSubpage";
import EmployerJobDetailsSubpage from "./EmployerJobDetailsSubpage";
import EmployerOpenDisputeSubpage from "./EmployerOpenDisputeSubpage";
import EmployerBrowseProfessionalsSubpage from "./EmployerBrowseProfessionalsSubpage";
import WalletSubpage from "../professionals/WalletSubpage";
import { useDashboardStore } from "../../store/dashboardStore";

const EmployerDashboardPage = () => {
  const { activeTab, setActiveTab } = useDashboardStore();
  const [selectedJobId, setSelectedJobId] = useState("ORD657783");

  const handleViewProject = (jobId) => {
    setSelectedJobId(jobId);
    setActiveTab("job-details");
  };

  const renderActiveSubpage = () => {
    switch (activeTab) {
      case "overview":
        return <EmployerOverviewSubpage onViewProject={handleViewProject} />;
      case "manage-jobs":
        return <EmployerManageJobsSubpage onViewProject={handleViewProject} />;
      case "job-details":
        return (
          <EmployerJobDetailsSubpage
            jobId={selectedJobId}
            onBack={() => setActiveTab("manage-jobs")}
            onOpenDispute={() => setActiveTab("open-dispute")}
          />
        );
      case "open-dispute":
        return (
          <EmployerOpenDisputeSubpage
            jobId={selectedJobId}
            onBack={() => setActiveTab("job-details")}
          />
        );
      case "browse-professionals":
        return <EmployerBrowseProfessionalsSubpage />;
      case "wallet":
        return <WalletSubpage />;
      default:
        return <EmployerOverviewSubpage onViewProject={handleViewProject} />;
    }
  };

  return (
    <DashboardLayout>
      {renderActiveSubpage()}
    </DashboardLayout>
  );
};

export default EmployerDashboardPage;
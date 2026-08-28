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

const EmployerDashboardPage = () => {
  const location = useLocation();
  const { activeTab, setActiveTab } = useDashboardStore();
  const [selectedJobId, setSelectedJobId] = useState("ORD657783");

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

      case "messages":
        return <EmployerMessagesSubpage />;
        
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
import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import OverviewSubpage from "./OverviewSubpage";
import BrowseJobsSubpage from "./BrowseJobsSubpage";
import MyJobsSubpage from "./MyJobsSubpage";
import ApplicationsSubpage from "./ApplicationsSubpage";
import ScheduleSubpage from "./ScheduleSubpage";
import WalletSubpage from "./WalletSubpage";
import ChatSubpage from "./ChatSubpage";
import ProfileSubpage from "./ProfileSubpage";
import PremiumSubpage from "./PremiumSubpage";
import { useDashboardStore } from "../../store/dashboardStore";

// Dynamic subpage router mapper
const DashboardPage = () => {
  const { activeTab } = useDashboardStore();

  const renderActiveSubpage = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSubpage />;
      case "browse-jobs":
        return <BrowseJobsSubpage />;
      case "my-jobs":
        return <MyJobsSubpage />;
      case "applications":
        return <ApplicationsSubpage />;
      case "schedule":
        return <ScheduleSubpage />;
      case "wallet":
        return <WalletSubpage />;
      case "chat":
        return <ChatSubpage />;
      case "profile":
        return <ProfileSubpage />;
      case "premium":
        return <PremiumSubpage />;
      default:
        return <OverviewSubpage />;
    }
  };

  return (
    <DashboardLayout>
      {renderActiveSubpage()}
    </DashboardLayout>
  );
};

export default DashboardPage;

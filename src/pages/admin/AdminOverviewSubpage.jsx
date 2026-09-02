import React, { useState, useEffect } from "react";
import { 
  Users, 
  BadgeCheck, 
  Briefcase, 
  Wallet, 
  Receipt, 
  Scale, 
  Info, 
  CreditCard,
  Loader2
} from "lucide-react";
import { adminService } from "../../api/services/adminService";

// Componentized Sections
import OverviewStatCard from "./components/overview/OverviewStatCard";
import RevenueEscrowWaveChart from "./components/overview/RevenueEscrowWaveChart";
import NeedsAttentionCard from "./components/overview/NeedsAttentionCard";
import RecentActivityFeed from "./components/overview/RecentActivityFeed";
import QuickActionsGrid from "./components/overview/QuickActionsGrid";

// Interactive Modals
import SendAnnouncementModal from "./components/overview/SendAnnouncementModal";
import CriticalAlertsModal from "./components/overview/CriticalAlertsModal";
import AllActivitiesModal from "./components/overview/AllActivitiesModal";

const AdminOverviewSubpage = ({ onNavigate }) => {
  // Modal states
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isCriticalAlertsOpen, setIsCriticalAlertsOpen] = useState(false);
  const [isAllActivitiesOpen, setIsAllActivitiesOpen] = useState(false);

  // Live Data states
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, alertsRes, activityRes] = await Promise.allSettled([
          adminService.getOverviewMetrics(),
          adminService.getCriticalAlerts(),
          adminService.getRecentActivity({ page: 1, limit: 5 }),
        ]);

        if (isMounted) {
          if (metricsRes.status === "fulfilled" && metricsRes.value?.data) {
            setMetrics(metricsRes.value.data);
          }
          if (alertsRes.status === "fulfilled" && alertsRes.value?.data) {
            setAlerts(alertsRes.value.data);
          }
          if (activityRes.status === "fulfilled" && activityRes.value?.data) {
            const items = activityRes.value.data.items || activityRes.value.data;
            if (Array.isArray(items)) {
              setActivities(items);
            }
          }
        }
      } catch (err) {
        console.warn("[AdminOverviewSubpage] Dashboard fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatNumber = (val) => {
    if (val === undefined || val === null) return null;
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return null;
    return typeof val === "number" ? `₦${val.toLocaleString()}` : val;
  };

  const formatTrend = (trend) => {
    if (trend === undefined || trend === null) return /* "+20% this week" */ "";
    if (typeof trend === "number") {
      const sign = trend >= 0 ? "+" : "";
      return `${sign}${trend}% this week`;
    }
    return trend;
  };

  // Top 8 Stat Cards Configuration with live data integration
  const statCards = [
    {
      id: "total-users",
      title: "Total Users",
      value: formatNumber(metrics?.totalUsers?.value ?? metrics?.totalUsers) || (isLoading ? "..." : /* "18,524" */ "0"),
      trend: formatTrend(metrics?.totalUsers?.growthPercentage ?? metrics?.totalUsersTrend),
      icon: Users,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("users"),
    },
    {
      id: "verified-users",
      title: "Verified users",
      value: formatNumber(metrics?.verifiedUsers?.value ?? metrics?.verifiedUsers) || (isLoading ? "..." : /* "1,930" */ "0"),
      trend: formatTrend(metrics?.verifiedUsers?.growthPercentage ?? metrics?.verifiedUsersTrend),
      icon: BadgeCheck,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("verifications"),
    },
    {
      id: "active-jobs",
      title: "Active Jobs",
      value: formatNumber(metrics?.activeJobs?.value ?? metrics?.activeJobs) || (isLoading ? "..." : /* "1,086" */ "0"),
      subtitle: metrics?.activeJobsSubtitle || /* "Across 4 jobs" */ "",
      icon: Briefcase,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("jobs"),
    },
    {
      id: "escrow-balance",
      title: "Escrow Balance",
      value: formatCurrency(metrics?.escrowBalance?.value ?? metrics?.escrowBalance) || (isLoading ? "..." : /* "₦248,500" */ "₦0"),
      trend: formatTrend(metrics?.escrowBalance?.growthPercentage ?? metrics?.escrowBalanceTrend),
      icon: Receipt,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("payments"),
    },
    {
      id: "monthly-revenue",
      title: "Monthly Revenue",
      value: formatCurrency(metrics?.monthlyRevenue?.value ?? metrics?.monthlyRevenue) || (isLoading ? "..." : /* "₦31,240" */ "₦0"),
      trend: formatTrend(metrics?.monthlyRevenue?.growthPercentage ?? metrics?.monthlyRevenueTrend),
      icon: CreditCard,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("payments"),
    },
    {
      id: "open-disputes",
      title: "Open Disputes",
      value: formatNumber(metrics?.openDisputes?.value ?? metrics?.openDisputes) || (isLoading ? "..." : /* "18" */ "0"),
      trend: formatTrend(metrics?.openDisputes?.growthPercentage ?? metrics?.openDisputesTrend),
      icon: Scale,
      iconColor: "text-amber-500",
      bgColor: "bg-[#FFF9F4]",
      trendColor: "text-amber-500",
      onClick: () => onNavigate && onNavigate("disputes"),
    },
    {
      id: "pending-verification",
      title: "Pending Verification",
      value: formatNumber(metrics?.pendingVerification?.value ?? metrics?.pendingVerification) || (isLoading ? "..." : /* "54" */ "0"),
      trend: formatTrend(metrics?.pendingVerification?.growthPercentage ?? metrics?.pendingVerificationTrend),
      icon: Info,
      iconColor: "text-amber-500",
      onClick: () => onNavigate && onNavigate("verifications"),
    },
    {
      id: "pending-payouts",
      title: "Pending Payouts",
      value: formatNumber(metrics?.pendingPayouts?.value ?? metrics?.pendingPayouts) || (isLoading ? "..." : /* "27" */ "0"),
      trend: formatTrend(metrics?.pendingPayouts?.growthPercentage ?? metrics?.pendingPayoutsTrend),
      icon: Wallet,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("payments"),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Greeting Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
          Good Morning Admin
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
          Manage your jobs and payments effortlessly.
        </p>
      </div>

      {/* Top Stats 8-Card Grid (Responsive: 1 col mobile, 2 col tablet, 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => (
          <OverviewStatCard
            key={card.id}
            title={card.title}
            value={card.value}
            trend={card.trend}
            subtitle={card.subtitle}
            icon={card.icon}
            iconColor={card.iconColor}
            bgColor={card.bgColor}
            borderColor={card.borderColor}
            trendColor={card.trendColor}
            onClick={card.onClick}
          />
        ))}
      </div>

      {/* Middle Section: Platform Revenue & Escrow Activity (Left) vs Needs Attention (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RevenueEscrowWaveChart />
        </div>
        <div className="lg:col-span-4">
          <NeedsAttentionCard
            onNavigate={onNavigate}
            alertsData={alerts}
            onViewAllAlerts={() => setIsCriticalAlertsOpen(true)}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Platform Activity (Left) vs Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7">
          <RecentActivityFeed
            onNavigate={onNavigate}
            activitiesData={activities}
            isLoading={isLoading}
            onViewAllActivities={() => setIsAllActivitiesOpen(true)}
          />
        </div>
        <div className="lg:col-span-5">
          <QuickActionsGrid
            onNavigate={onNavigate}
            onOpenAnnouncement={() => setIsAnnouncementOpen(true)}
          />
        </div>
      </div>

      {/* Interactive Modals */}
      <SendAnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
      />

      <CriticalAlertsModal
        isOpen={isCriticalAlertsOpen}
        onClose={() => setIsCriticalAlertsOpen(false)}
        onNavigate={onNavigate}
      />

      <AllActivitiesModal
        isOpen={isAllActivitiesOpen}
        onClose={() => setIsAllActivitiesOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default AdminOverviewSubpage;

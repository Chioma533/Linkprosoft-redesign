import React, { useState } from "react";
import { 
  Users, 
  BadgeCheck, 
  Briefcase, 
  Wallet, 
  Receipt, 
  Scale, 
  Info, 
  CreditCard 
} from "lucide-react";

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

  // Top 8 Stat Cards Configuration matching exact UI specs
  const statCards = [
    {
      id: "total-users",
      title: "Total Users",
      value: "18,524",
      trend: "+20% this week",
      icon: Users,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("users"),
    },
    {
      id: "verified-users",
      title: "Verified users",
      value: "1,930",
      trend: "+20% this week",
      icon: BadgeCheck,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("verifications"),
    },
    {
      id: "active-jobs",
      title: "Active Jobs",
      value: "1,086",
      subtitle: "Across 4 jobs",
      icon: Briefcase,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("jobs"),
    },
    {
      id: "escrow-balance",
      title: "Escrow Balance",
      value: "$248,500",
      trend: "+20% this week",
      icon: Receipt,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("payments"),
    },
    {
      id: "monthly-revenue",
      title: "Monthly Revenue",
      value: "$31,240",
      trend: "+20% this week",
      icon: CreditCard,
      iconColor: "text-[#016EA6]",
      onClick: () => onNavigate && onNavigate("payments"),
    },
    {
      id: "open-disputes",
      title: "Open Disputes",
      value: "18",
      trend: "+20% this week",
      icon: Scale,
      iconColor: "text-amber-500",
      bgColor: "bg-[#FFF9F4]",
      trendColor: "text-amber-500",
      onClick: () => onNavigate && onNavigate("disputes"),
    },
    {
      id: "pending-verification",
      title: "Pending Verification",
      value: "54",
      trend: "+20% this week",
      icon: Info,
      iconColor: "text-amber-500",
      onClick: () => onNavigate && onNavigate("verifications"),
    },
    {
      id: "pending-payouts",
      title: "Pending Payouts",
      value: "27",
      trend: "+20% this week",
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
            onViewAllAlerts={() => setIsCriticalAlertsOpen(true)}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Platform Activity (Left) vs Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7">
          <RecentActivityFeed
            onNavigate={onNavigate}
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

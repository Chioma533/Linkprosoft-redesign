import React from "react";
import { UserCheck, Scale, Wallet } from "lucide-react";

const NeedsAttentionCard = ({ onNavigate, onViewAllAlerts, alertsData }) => {
  const pendingVerificationsCount = alertsData?.pendingVerifications?.count ?? alertsData?.pendingVerificationsCount ?? alertsData?.pendingVerification ?? /* 156 */ 0;
  const openDisputesCount = alertsData?.openDisputes?.count ?? alertsData?.openDisputesCount ?? alertsData?.openDisputes ?? /* 55 */ 0;
  const pendingPayoutsCount = alertsData?.pendingPayouts?.count ?? alertsData?.pendingPayoutsCount ?? alertsData?.pendingPayouts ?? /* 29 */ 0;

  const alerts = [
    {
      id: "verifications",
      title: "Pending Verifications",
      count: pendingVerificationsCount,
      icon: UserCheck,
      bgColor: "bg-[#FFF6ED]",
      borderColor: "border-[#FED7AA]/80",
      hoverBorder: "hover:border-[#FDBA74]",
      textColor: "text-[#EA580C]",
      targetTab: "verifications",
    },
    {
      id: "disputes",
      title: "Open Dispute",
      count: openDisputesCount,
      icon: Scale,
      bgColor: "bg-[#FFF1F2]",
      borderColor: "border-[#FECDD3]/80",
      hoverBorder: "hover:border-[#FDA4AF]",
      textColor: "text-[#E11D48]",
      targetTab: "disputes",
    },
    {
      id: "payouts",
      title: "Pending payouts",
      count: pendingPayoutsCount,
      icon: Wallet,
      bgColor: "bg-[#F0F9FF]",
      borderColor: "border-[#BAE6FD]/80",
      hoverBorder: "hover:border-[#7DD3FC]",
      textColor: "text-[#0284C7]",
      targetTab: "payments",
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-tight mb-4">
        Needs Attention
      </h3>

      {/* Alert List */}
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {alerts.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.targetTab)}
              className={`${item.bgColor} border ${item.borderColor} ${item.hoverBorder} rounded-2xl p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-all duration-200 group select-none`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${item.textColor} stroke-[1.8] shrink-0 group-hover:scale-105 transition-transform`} />
                <span className={`text-xs sm:text-[13px] font-semibold ${item.textColor}`}>
                  {item.title}
                </span>
              </div>
              <span className={`text-sm sm:text-base font-bold ${item.textColor}`}>
                {item.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* View All Critical Alerts Footer Button */}
      <button
        onClick={onViewAllAlerts}
        className="text-[#016EA6] hover:text-[#015582] text-xs sm:text-[13px] font-bold text-center mt-4 pt-1 cursor-pointer transition-colors block w-full hover:underline"
      >
        View All Critical Alerts
      </button>
    </div>
  );
};

export default NeedsAttentionCard;

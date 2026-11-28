import { ArrowUpRight, CheckCircle2, Clock, PauseCircle, Users } from "lucide-react";
import {
  formatDisputeNumber,
  formatDisputeCurrency,
  formatDisputeTrend,
} from "../../../../utils/adminDisputes";

const DisputeStatCards = ({ metrics, isLoading }) => {
  const cards = [
    {
      id: "open-disputes",
      title: "Open Disputes",
      value:
        formatDisputeNumber(
          metrics?.openDisputes?.value ??
            metrics?.openDisputes ??
            metrics?.open,
        ) || (isLoading ? "..." : "0"),
      trend: formatDisputeTrend(
        metrics?.openDisputes?.growthPercentage ??
          metrics?.openDisputesTrend,
      ),
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "under-review",
      title: "Under Review",
      value:
        formatDisputeNumber(
          metrics?.underReview?.value ?? metrics?.underReview,
        ) || (isLoading ? "..." : "0"),
      trend: formatDisputeTrend(
        metrics?.underReview?.growthPercentage ??
          metrics?.underReviewTrend,
      ),
      icon: Clock,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "resolved-disputes",
      title: "Resolved",
      value:
        formatDisputeNumber(
          metrics?.resolvedDisputes?.value ??
            metrics?.resolvedDisputes ??
            metrics?.resolved,
        ) || (isLoading ? "..." : "0"),
      trend: formatDisputeTrend(
        metrics?.resolvedDisputes?.growthPercentage ??
          metrics?.resolvedDisputesTrend,
      ),
      icon: CheckCircle2,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "escrow-held",
      title: "Escrow Held",
      value:
        formatDisputeCurrency(
          metrics?.escrowHeld?.value ?? metrics?.escrowHeld,
        ) || (isLoading ? "..." : "₦0"),
      trend: formatDisputeTrend(
        metrics?.escrowHeld?.growthPercentage ?? metrics?.escrowHeldTrend,
      ),
      icon: PauseCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-full ${card.iconBg || ""}`}>
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor} stroke-[1.8]`}
                />
              </div>
            </div>
            <div className="mt-3 mb-2">
              <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block leading-none">
                {card.value}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisputeStatCards;

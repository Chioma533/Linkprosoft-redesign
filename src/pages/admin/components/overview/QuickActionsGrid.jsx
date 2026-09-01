import React from "react";
import { UserCheck, Wallet, Scale, Megaphone } from "lucide-react";

const QuickActionsGrid = ({ onNavigate, onOpenAnnouncement }) => {
  const actions = [
    {
      id: "approve",
      label: "Approve Professionals",
      icon: UserCheck,
      onClick: () => onNavigate && onNavigate("verifications"),
    },
    {
      id: "escrow",
      label: "Release Escrow",
      icon: Wallet,
      onClick: () => onNavigate && onNavigate("payments"),
    },
    {
      id: "dispute",
      label: "Resolve Dispute",
      icon: Scale,
      onClick: () => onNavigate && onNavigate("disputes"),
    },
    {
      id: "announcement",
      label: "Send Announcement",
      icon: Megaphone,
      onClick: onOpenAnnouncement,
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-tight mb-4">
        Quick actions
      </h3>

      {/* 2x2 Action Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="bg-[#EAF6FB] hover:bg-[#DCF1FA] active:bg-[#CEEAFA] border border-[#D0E7F3] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-200 group cursor-pointer relative overflow-hidden select-none"
            >
              {/* Corner accent tag line matching design details */}
              <div className="w-6 h-6 absolute top-1 left-1 border-t-2 border-l-2 border-[#A3D5EC] rounded-tl-lg opacity-70" />

              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#016EA6] stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs sm:text-[13px] font-bold text-[#016EA6] leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;

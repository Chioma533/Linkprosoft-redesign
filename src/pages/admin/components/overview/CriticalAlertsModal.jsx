import React from "react";
import { X, ShieldAlert, UserCheck, Scale, Wallet, ArrowRight } from "lucide-react";

const CriticalAlertsModal = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      title: "156 Pending Verifications",
      desc: "New professional identity documents awaiting manual compliance check.",
      tab: "verifications",
      badge: "Verification",
      badgeColor: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      id: 2,
      title: "55 Open Escrow Disputes",
      desc: "Active disputes requiring milestone arbitration split or refund resolution.",
      tab: "disputes",
      badge: "Disputes",
      badgeColor: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      id: 3,
      title: "29 Pending Payout Approvals",
      desc: "Escrow funds queued for wallet payout release.",
      tab: "payments",
      badge: "Payouts",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-150 max-h-[90vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-lg md:rounded-2xl md:border border-gray-150 md:max-h-[85vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-150 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <ShieldAlert className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Critical Action Alerts</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">High-priority items requiring admin intervention</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-3 flex-1 overflow-y-auto">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gray-150 rounded-2xl bg-gray-50/40 hover:bg-gray-50 flex items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate && onNavigate(item.tab);
                }}
                className="shrink-0 p-2.5 bg-[#016EA6] hover:bg-[#015582] text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <span>Resolve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-150 px-6 py-4 flex z-10">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </>
  );
};

export default CriticalAlertsModal;

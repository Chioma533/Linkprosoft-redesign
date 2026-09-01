import React from "react";
import { X, User, Activity, Clock } from "lucide-react";

const AllActivitiesModal = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const activities = [
    { id: 1, user: "Marco Rossi", action: "registered as a Professional (UI/UX Designer)", time: "8 days ago", status: "Awaiting verification" },
    { id: 2, user: "David Kim", action: "submitted Engineering Diploma verification document", time: "10 mins ago", status: "Awaiting verification" },
    { id: 3, user: "Apex Tech Labs", action: "deposited escrow payment of $3,400 for contract JOB-703", time: "25 mins ago", status: "Completed" },
    { id: 4, user: "Devon Lane", action: "raised dispute DISP-801 on contract JOB-703", time: "1 hour ago", status: "Disputed" },
    { id: 5, user: "Bessie Cooper", action: "completed profession check (UI Designer)", time: "3 hours ago", status: "Verified" },
    { id: 6, user: "Robert Fox", action: "withdrew wallet balance of $1,850", time: "5 hours ago", status: "Completed" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-150 max-h-[90vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-xl md:rounded-2xl md:border border-gray-150 md:max-h-[85vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-150 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl border border-blue-100">
              <Activity className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Platform Activity Audit Log</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Real-time platform events ledger</p>
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
          {activities.map((item) => (
            <div
              key={item.id}
              className="p-3.5 border border-gray-150 rounded-2xl bg-gray-50/30 flex items-center justify-between gap-3 text-xs font-semibold"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#016EA6] flex items-center justify-center shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    <span>{item.user} </span>
                    <span className="font-medium text-gray-600">{item.action}</span>
                  </p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                    {item.time}
                  </span>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-150 px-6 py-4 flex z-10">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Close Activity Log
          </button>
        </div>
      </div>
    </>
  );
};

export default AllActivitiesModal;

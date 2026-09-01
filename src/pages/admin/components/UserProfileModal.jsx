import React from "react";
import { X, User, Star, Briefcase, Mail, CheckCircle, Info, Calendar } from "lucide-react";

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (Drawer on mobile, Modal on desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-150 max-h-[90vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md md:rounded-2xl md:border border-gray-150 md:max-h-[80vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-150 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-sm font-bold text-gray-900 capitalize">{user.role} Profile Details</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-bold">Platform Auditor Check</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer border border-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto text-xs font-semibold text-gray-700">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-gray-150">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center font-extrabold text-3xl shrink-0 select-none border border-blue-150">
              {user.name.charAt(0)}
            </div>
            <h4 className="text-base font-extrabold text-gray-800 mt-3">{user.name}</h4>
            <p className="text-[10px] text-gray-400 font-bold mt-1">{user.email}</p>
            <span className={`inline-block px-2.5 py-0.5 mt-2 rounded-full text-[9px] uppercase font-bold border ${
              user.role === "employer" 
                ? "bg-purple-50 text-purple-600 border-purple-100" 
                : "bg-blue-50 text-blue-600 border-blue-100"
            }`}>
              {user.role}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-gray-150 rounded-xl bg-gray-50/20">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Rating Score</span>
              <div className="flex items-center gap-1.5 mt-1 text-gray-800 text-sm font-extrabold">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                {user.rating || "4.8"} <span className="text-[10px] text-gray-400 font-bold">/ 5.0</span>
              </div>
            </div>
            <div className="p-3 border border-gray-150 rounded-xl bg-gray-50/20">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {user.role === "employer" ? "Active Job Postings" : "Completed Jobs"}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-gray-800 text-sm font-extrabold">
                <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                {user.jobsCount || "28"}
              </div>
            </div>
          </div>

          {/* Warning check */}
          <div className="bg-emerald-50/50 border border-emerald-150 p-3.5 rounded-xl flex gap-2.5 leading-relaxed text-emerald-800 text-[11px] font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">System Status: Active</p>
              <p className="mt-0.5 font-medium">Verification status is active. User has no record of platform violations or security holds.</p>
            </div>
          </div>

          {/* Member since info */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-150 pt-4">
            <span className="flex items-center gap-1.5 font-bold">
              <Calendar className="w-4 h-4 text-gray-300" />
              Member since May 2025
            </span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">Verified</span>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-150 px-6 py-4 flex z-10">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer border border-[#016EA6]"
          >
            Close Details
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfileModal;

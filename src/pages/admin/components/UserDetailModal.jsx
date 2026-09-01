import React from "react";
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  UserX,
  CreditCard,
  Building
} from "lucide-react";

const UserDetailModal = ({ user, onClose, onToggleStatus }) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal/Drawer Container */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-100 max-h-[90vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-xl md:rounded-2xl md:border border-gray-100 md:max-h-[80vh]
        transition-all duration-300 ease-out"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-gray-900">User Profile Details</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Internal System ID: {user.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Avatar and basic info */}
          <div className="flex items-center gap-4 border-b border-gray-50 pb-5">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center font-extrabold text-2xl shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] uppercase font-bold ${
                user.role === "employer" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
              }`}>
                {user.role}
              </span>
            </div>
            <div className="ml-auto text-right">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                user.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}>
                {user.status}
              </span>
            </div>
          </div>

          {/* Quick contact list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 rounded-xl">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Email Address</p>
                <p className="text-gray-700 truncate mt-0.5">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Phone Number</p>
                <p className="text-gray-700 mt-0.5">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 rounded-xl">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Location Country</p>
                <p className="text-gray-700 mt-0.5">{user.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Registered Date</p>
                <p className="text-gray-700 mt-0.5">{user.joined}</p>
              </div>
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">User Bio & Summary</h4>
            <p className="text-xs text-gray-600 bg-gray-50/40 p-4 rounded-xl border border-gray-50 leading-relaxed">
              {user.bio || "No summary provided by the user."}
            </p>
          </div>

          {/* Verification documents information */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Verification Details</h4>
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  user.verified === "verified" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {user.verified === "verified" ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-800">
                    {user.verified === "verified" ? "Verified Profile" : "Pending Verification Review"}
                  </h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {user.verified === "verified" ? "Identity & qualifications verified by platform." : "Needs document reviews."}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                user.verified === "verified" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
              }`}>
                {user.verified}
              </span>
            </div>
          </div>

          {/* Financials / Bank Details */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Connected Bank Account</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-gray-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                <Building className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Bank Name</p>
                  <p className="text-gray-800 mt-0.5">Standard Chartered Bank</p>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Account Number</p>
                  <p className="text-gray-800 mt-0.5">**********2490</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 z-10">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Close Details
          </button>
          <button 
            onClick={onToggleStatus}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
              user.status === "active" 
                ? "bg-rose-600 hover:bg-rose-700 text-white" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {user.status === "active" ? (
              <>
                <UserX className="w-4 h-4" /> Suspend Access
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Restrict Active State
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDetailModal;

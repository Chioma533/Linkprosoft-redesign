import React from "react";
import { 
  X, 
  Briefcase, 
  User, 
  DollarSign, 
  Clock, 
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle
} from "lucide-react";

const JobDetailModal = ({ job, onClose }) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (Drawer on mobile, Modal on desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-100 max-h-[90vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-xl md:rounded-2xl md:border border-gray-100 md:max-h-[80vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-gray-900">Job Contract Details</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Contract ID: {job.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Job Overview */}
          <div className="border-b border-gray-50 pb-5">
            <h2 className="text-base font-extrabold text-gray-900 leading-tight">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="bg-blue-50 text-[#016EA6] border border-blue-100 px-2.5 py-0.5 rounded text-[10px] font-bold">
                {job.category}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                job.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                job.status === "disputed" ? "bg-rose-50 text-rose-600" :
                job.status === "in_progress" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
              }`}>
                {job.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-5 text-xs text-gray-700 font-semibold">
            <div className="p-3 bg-gray-50/50 rounded-xl">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Employer (Client)</p>
              <div className="flex items-center gap-2 mt-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-800">{job.employer}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50/50 rounded-xl">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Professional Assigned</p>
              <div className="flex items-center gap-2 mt-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className={`font-bold ${job.professional === "Unassigned" ? "text-gray-400 italic font-medium" : "text-gray-800"}`}>
                  {job.professional}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Job Description Summary</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/20 p-4 border border-gray-50 rounded-xl">
              {job.description}
            </p>
          </div>

          {/* Escrow Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Contract Budget</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">${job.budget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date Posted</p>
              <p className="text-xs font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {job.date}
              </p>
            </div>
          </div>

          {/* Milestones list */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3.5">Escrow Milestones Ledger</h4>
            <div className="space-y-3">
              {job.milestones.map((milestone, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 border border-gray-50 rounded-xl bg-gray-50/20 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-extrabold text-gray-500">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{milestone.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Budget: ${milestone.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    milestone.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                    milestone.status === "disputed" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {milestone.status === "completed" && <CheckCircle className="w-3.5 h-3.5" />}
                    {milestone.status === "disputed" && <AlertCircle className="w-3.5 h-3.5" />}
                    {milestone.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                    {milestone.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 z-10 flex">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Close Contract Record
          </button>
        </div>
      </div>
    </>
  );
};

export default JobDetailModal;

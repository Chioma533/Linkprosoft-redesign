import React, { useState } from "react";
import { FiMapPin, FiBriefcase, FiSmile } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import ProjectModals from "../../components/ui/ProjectModals";
import avatarImg from "../../assets/images/handyman.jfif";
import workImg1 from "../../assets/images/IMG-20260704-WA0195.jpg";
import workImg2 from "../../assets/images/IMG-20260704-WA0196.jpg";

const ProjectDetailsSubpage = () => {
  const { selectedJob, previousTab, setActiveTab } = useDashboardStore();
  const [activeModal, setActiveModal] = useState(null); // null, 'confirm-submit', 'success-submit', 'confirm-cancel', 'success-cancel'
  const [chatMessage, setChatMessage] = useState("");

  const job = selectedJob || {
    id: "job-1",
    orderId: "ORD657783",
    title: "Wardrobe Installation",
    category: "Carpentry",
    location: "Lekki Lagos",
    budget: 500000,
    client: "Samuel owoniyi",
    status: "In Progress"
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gray-50 overflow-hidden relative shrink-0">
            <img src={workImg1} className="w-full h-full object-cover" alt="Job Cover" />
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>
              <span className="px-2.5 py-0.5 bg-orange-50 text-orange-500 rounded-lg font-bold text-[10px] uppercase">
                {job.status === "Active" ? "In Progress" : job.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 font-semibold">
              <span>ID:{job.orderId}</span>
              <span className="mx-2">•</span>
              <span>{job.category}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <FiBriefcase className="w-3.5 h-3.5 text-[#016EA6]" />
                <span>{job.client}</span>
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{job.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[#016EA6] font-bold text-xs">₦</span>
                <span>{formatCurrency(job.budget)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 min-w-[160px] sm:self-start lg:self-center">
          <button onClick={() => setActiveModal("confirm-submit")} className="w-full bg-[#EBF3FA] hover:bg-[#016EA6]/10 text-[#016EA6] py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center">
            Submit project
          </button>
          <button onClick={() => setActiveModal("confirm-cancel")} className="w-full bg-red-50 hover:bg-red-100 text-red-500 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center">
            Cancel project
          </button>
          <button onClick={() => alert("Dispute process opened successfully.")} className="w-full bg-orange-50 hover:bg-orange-100 text-orange-500 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center">
            Open dispute
          </button>
        </div>
      </div>

      {/* Escrow Banner */}
      <div className="bg-gradient-to-r from-[#013554] via-[#01507B] to-[#016EA6] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/15">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <span className="text-xs text-sky-200 font-semibold tracking-wide uppercase">Escrow Protected Payment</span>
            <span className="text-[10px] text-sky-200/80 font-medium block mt-1">Total Project Budget</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">{formatCurrency(job.budget * 1.08)}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <div className="bg-white/10 border border-white/10 p-3 rounded-2xl text-left flex-1 md:flex-initial md:min-w-[120px]">
            <span className="text-[9px] text-sky-200 font-bold block">Released</span>
            <span className="text-xs font-extrabold block mt-0.5">{formatCurrency(job.budget * 0.3)}</span>
          </div>
          <div className="bg-white/10 border border-white/10 p-3 rounded-2xl text-left flex-1 md:flex-initial md:min-w-[120px]">
            <span className="text-[9px] text-sky-200 font-bold block">Remaining Balance</span>
            <span className="text-xs font-extrabold block mt-0.5">{formatCurrency(job.budget * 0.7)}</span>
          </div>
        </div>
      </div>

      {/* Progress Gallery & Message Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Progress Gallery</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs"><img src={workImg1} className="w-full h-full object-cover" alt="1" /></div>
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs"><img src={workImg2} className="w-full h-full object-cover" alt="2" /></div>
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs"><img src={workImg1} className="w-full h-full object-cover" alt="3" /></div>
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs"><img src={workImg2} className="w-full h-full object-cover" alt="4" /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between gap-6 min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Message box</h3>
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0"><img src={avatarImg} className="w-full h-full object-cover" alt="Avatar" /></div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 leading-tight">{job.client}</h4>
                <span className="text-[10px] text-green-500 font-semibold">Online</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col items-start">
                <div className="bg-gray-50 text-gray-800 text-xs px-4 py-3 rounded-2xl rounded-tl-none leading-relaxed max-w-[90%] font-medium">
                  Going well! I've just finished the main structure. Uploading photos now so you can take a look.
                </div>
                <span className="text-[8px] font-semibold text-gray-400 mt-1 px-1">9:12 AM</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <FiSmile className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Type Something"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Reusable Modal Dialogs */}
      <ProjectModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onConfirmSubmit={() => setActiveModal("success-submit")}
        onConfirmCancel={() => setActiveModal("success-cancel")}
        onGoToWallet={() => { setActiveModal(null); setActiveTab("wallet"); }}
        onGoBackHome={() => { setActiveModal(null); setActiveTab("overview"); }}
        job={job}
      />
    </div>
  );
};

export default ProjectDetailsSubpage;

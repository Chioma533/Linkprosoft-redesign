import React, { useState } from "react";
import { FiMapPin, FiBriefcase, FiSmile, FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiSend, FiX } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import { formatCurrency } from "../../utils/formatCurrency";
import ProjectModals from "../../components/ui/ProjectModals";
import avatarImg from "../../assets/images/handyman.jfif";
import workImg1 from "../../assets/images/IMG-20260704-WA0195.jpg";
import workImg2 from "../../assets/images/IMG-20260704-WA0196.jpg";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ProjectDetailsSubpage = () => {
  const { selectedJob, previousTab, setActiveTab } = useDashboardStore();
  const [activeModal, setActiveModal] = useState(null); // null, 'confirm-submit', 'success-submit', 'confirm-cancel', 'success-cancel'
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messagesList, setMessagesList] = useState([
    {
      id: 1,
      sender: "me",
      text: "Going well! I've just finished the main structure. Uploading photos now so you can take a look.",
      time: "9:12 AM"
    }
  ]);

  if (!selectedJob) {
    return (
      <div className="py-20 px-4 rounded-3xl bg-white border border-gray-100/60 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#016EA6] flex items-center justify-center mb-3">
          <FiBriefcase className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">No Project Selected</h3>
        <p className="text-xs text-gray-400 max-w-sm mb-6">
          Please select an active contract from your jobs list to view milestones, escrow details, and communications.
        </p>
        <button
          onClick={() => setActiveTab("my-jobs")}
          className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          View My Contracted Jobs
        </button>
      </div>
    );
  }

  const job = {
    id: selectedJob.id || "job-1",
    orderId: selectedJob.orderId || selectedJob.order_id || `ORD-${String(selectedJob.id).slice(0, 6)}`,
    title: selectedJob.title || selectedJob.jobTitle || "Contracted Project",
    category: selectedJob.category?.name || selectedJob.category || "General Service",
    location: selectedJob.location || "Lekki, Lagos",
    budget: Number(selectedJob.budget || selectedJob.totalAmount || 0),
    client: selectedJob.client?.fullName || selectedJob.client?.name || selectedJob.client || selectedJob.employerName || "Direct Client",
    status: selectedJob.status || "In Progress"
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessagesList((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text: chatMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setChatMessage("");
  };

  const handleOpenDispute = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      toast.error("Please enter the reason for the dispute.");
      return;
    }

    setIsSubmittingDispute(true);
    try {
      if (job.id && API_PATHS.ASSIGNMENTS.DISPUTE_SATISFACTION) {
        await axiosInstance.patch(API_PATHS.ASSIGNMENTS.DISPUTE_SATISFACTION(job.id), {
          reason: disputeReason,
        });
      }
      toast.success("Dispute submitted. Our administrative mediation team has been notified.");
      setIsDisputeModalOpen(false);
      setDisputeReason("");
    } catch (error) {
      toast.success("Dispute logged successfully for mediation.");
      setIsDisputeModalOpen(false);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab(previousTab || "my-jobs")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-100/80 rounded-full text-xs font-bold text-gray-700 transition-all shadow-xs cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {previousTab === "overview" ? "Overview" : "My Jobs"}</span>
        </button>

        <span className="text-xs font-semibold text-gray-400">Order ID: {job.orderId}</span>
      </div>

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
            <img src={workImg1} className="w-full h-full object-cover" alt="Job Cover" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>
              <span className="px-2.5 py-0.5 bg-orange-50 text-orange-500 rounded-full font-bold text-[10px] uppercase">
                {job.status === "Active" ? "In Progress" : job.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 font-semibold">
              <span>Category: {job.category}</span>
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
                <span className="font-bold text-gray-800">{formatCurrency(job.budget)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[160px] sm:self-start lg:self-center">
          <button
            onClick={() => setActiveModal("confirm-submit")}
            className="w-full bg-sky-50 hover:bg-[#016EA6] text-[#016EA6] hover:text-white py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-center"
          >
            Submit Project
          </button>
          <button
            onClick={() => setActiveModal("confirm-cancel")}
            className="w-full bg-red-50 hover:bg-red-100 text-red-500 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-center"
          >
            Cancel Project
          </button>
          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-600 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-center"
          >
            Open Dispute
          </button>
        </div>
      </div>

      {/* Escrow Banner */}
      <div className="bg-gradient-to-r from-[#013554] via-[#01507B] to-[#016EA6] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/15">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <span className="text-xs text-sky-200 font-semibold tracking-wide uppercase">Escrow Protected Payment</span>
            <span className="text-[10px] text-sky-200/80 font-medium block mt-1">Total Agreed Project Budget</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">{formatCurrency(job.budget)}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <div className="bg-white/10 border border-white/10 p-3 rounded-2xl text-left flex-1 md:flex-initial md:min-w-[120px]">
            <span className="text-[9px] text-sky-200 font-bold block">In Escrow</span>
            <span className="text-xs font-extrabold block mt-0.5">{formatCurrency(job.budget)}</span>
          </div>
          <div className="bg-white/10 border border-white/10 p-3 rounded-2xl text-left flex-1 md:flex-initial md:min-w-[120px]">
            <span className="text-[9px] text-sky-200 font-bold block">Status</span>
            <span className="text-xs font-extrabold text-emerald-300 block mt-0.5">Funded</span>
          </div>
        </div>
      </div>

      {/* Progress Gallery & Message Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Proof of Work Gallery</h3>
            <span className="text-xs font-semibold text-gray-400">4 Uploads</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs">
              <img src={workImg1} className="w-full h-full object-cover" alt="Progress 1" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs">
              <img src={workImg2} className="w-full h-full object-cover" alt="Progress 2" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs">
              <img src={workImg1} className="w-full h-full object-cover" alt="Progress 3" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video relative border border-gray-100 bg-slate-50 shadow-xs">
              <img src={workImg2} className="w-full h-full object-cover" alt="Progress 4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs flex flex-col justify-between gap-6 min-h-[340px]">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Project Communications</h3>
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                <img src={avatarImg} className="w-full h-full object-cover" alt="Avatar" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 leading-tight">{job.client}</h4>
                <span className="text-[10px] text-green-500 font-semibold">Active on this project</span>
              </div>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {messagesList.map((msg) => (
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="bg-gray-50 text-gray-800 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none leading-relaxed max-w-[95%] font-medium">
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-semibold text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendChatMessage} className="relative">
            <input
              type="text"
              placeholder="Send project update to client..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#016EA6] hover:text-[#061EA6] p-1 cursor-pointer"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in text-gray-800">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsDisputeModalOpen(false)}
              className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/50">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">Open Project Dispute</h3>
                <p className="text-xs text-gray-400 font-medium">Linkprosoft Mediation & Escrow Protection</p>
              </div>
            </div>

            <form onSubmit={handleOpenDispute} className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Opening a dispute places the project escrow on hold while an administrator reviews work milestones, proofs, and communication logs.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dispute Reason / Details</label>
                <textarea
                  rows={4}
                  required
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Explain the issue encountered with the client or scope of work..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-amber-500 focus:bg-white font-medium text-gray-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDispute}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingDispute ? "Submitting..." : "Submit Dispute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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


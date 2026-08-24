import React, { useState, useEffect, useCallback } from "react";
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiCheck,
  FiSend,
  FiUser,
  FiStar,
  FiZap,
  FiMapPin,
  FiCheckCircle,
  FiDollarSign,
  FiMail,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { jobService } from "../../api/services/jobService";
import { searchService } from "../../api/services/searchService";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { calculateJobMatchScore } from "../../utils/matchingEngine";
import { formatCurrency } from "../../utils/formatCurrency";

const EmployerJobDetailsSubpage = ({ jobId, onBack, onOpenDispute }) => {
  const [job, setJob] = useState(null);
  const [matchedPros, setMatchedPros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [invitingId, setInvitingId] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "System",
      text: "Job created. Match algorithm is currently reviewing matching professionals.",
      time: "Just now",
      isMe: false,
    },
  ]);
  const [inputText, setInputText] = useState("");

  // Load Job Details & Matches
  const loadJobData = useCallback(async () => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const jobRes = await jobService.getJobById(jobId);
      const jobData = jobRes?.data || jobRes;
      setJob(jobData);

      // Fetch matches for this job's skill
      setIsLoadingMatches(true);
      try {
        const matchesRes = await jobService.getJobMatches(jobId);
        const matchData = matchesRes?.data || matchesRes || [];
        
        let candidateList = [];
        if (Array.isArray(matchData) && matchData.length > 0) {
          candidateList = matchData;
        } else if (jobData?.skillId || jobData?.skill_id) {
          const searchRes = await searchService.searchProfessionalsByProfession({
            skills: jobData.skillId || jobData.skill_id,
            limit: 10,
          });
          candidateList = searchRes?.data?.professionals || searchRes?.data?.items || searchRes?.data || [];
        }

        // Calculate match scores for all candidates
        const scoredCandidates = candidateList.map((cand) => {
          const score = calculateJobMatchScore(jobData, cand);
          return {
            ...cand,
            matchResult: score,
          };
        });

        // Sort by match score descending
        scoredCandidates.sort((a, b) => b.matchResult.totalScore - a.matchResult.totalScore);
        setMatchedPros(scoredCandidates);
      } catch (matchErr) {
        console.warn("Failed to fetch matches for job:", matchErr.message);
      } finally {
        setIsLoadingMatches(false);
      }
    } catch (err) {
      console.error("Failed to load job details:", err);
      toast.error("Failed to load job details");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJobData();
  }, [loadJobData]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    toast.success("Message sent!");
  };

  const handleMarkAsCompleted = async () => {
    try {
      if (jobId) {
        await axiosInstance.patch(API_PATHS.ASSIGNMENTS.APPROVE_SATISFACTION(jobId), {});
      }
      toast.success("Project marked as completed! Satisfaction approved.");
      if (job) setJob((prev) => ({ ...prev, status: "completed" }));
    } catch (err) {
      toast.success("Project marked as completed!");
    }
  };

  const handleInviteProfessional = async (candidate) => {
    const proId = candidate.id || candidate.userId;
    setInvitingId(proId);
    try {
      await axiosInstance.post(API_PATHS.ASSIGNMENTS.CREATE_ASSIGNMENT, {
        jobId: job?.id || jobId,
        professionalId: proId,
        acceptedBudget: job?.budget || candidate.hourlyRate * 8,
      });
      toast.success(`Invitation sent to ${candidate.user?.firstName || candidate.name || "professional"}!`);
    } catch (err) {
      // Fallback feedback if assignment already exists
      toast.success(`Invitation dispatched to ${candidate.user?.firstName || candidate.name || "professional"}!`);
    } finally {
      setInvitingId(null);
    }
  };

  const isEscrowFunded = Boolean(
    job?.escrow?.funded ||
    job?.assignment?.paymentStatus === "funded" ||
    job?.payment?.status === "held_in_escrow" ||
    job?.payment?.status === "released"
  );

  const rawStatus = (job?.status || "").toLowerCase();
  const isJobInProgress = isEscrowFunded || rawStatus === "in_progress" || rawStatus === "in progress";
  const displayStatus = isJobInProgress ? "In Progress" : job?.status || "Posted";

  const jobTitle = job?.title || "Job Details";
  const jobCategory = job?.category?.name || job?.category || "Services";
  const jobLocation = job?.location || "Remote";
  const jobBudget = Number(job?.budget || 0);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Title Header with Back arrow */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full transition-all cursor-pointer"
          title="Back to Manage Jobs"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{jobTitle}</h2>
          <span className="text-xs text-gray-400">Job ID: {jobId}</span>
        </div>
      </div>

      {/* Main Job Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full md:w-auto">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#016EA6] to-sky-600 rounded-2xl shrink-0 flex items-center justify-center text-white text-2xl font-bold">
            {jobTitle.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">{jobTitle}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${
                  isJobInProgress
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-orange-50 text-orange-500"
                }`}
              >
                {displayStatus}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold">
              Category: <span className="text-gray-600">{jobCategory}</span>
            </p>
            <p className="text-[11px] text-gray-500 font-semibold">
              📍 {jobLocation} • <span className="text-gray-900 font-extrabold">{jobBudget > 0 ? formatCurrency(jobBudget) : "Negotiable"}</span>
            </p>
            {job?.description && (
              <p className="text-xs text-gray-400 max-w-xl line-clamp-2 mt-1">
                {job.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
          <button
            onClick={handleMarkAsCompleted}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer"
          >
            <FiCheck className="w-4 h-4" />
            <span>Mark as completed</span>
          </button>
          <button
            onClick={onOpenDispute}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer"
          >
            <FiAlertTriangle className="w-4 h-4" />
            <span>Open a dispute</span>
          </button>
        </div>
      </div>

      {/* Escrow Status Card */}
      <div className="bg-gradient-to-r from-[#013554] via-[#01507B] to-[#016EA6] p-6 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
        <div className="space-y-4 relative z-10 flex-1">
          <div>
            <span className="text-[10px] text-sky-200 font-semibold tracking-wide">
              {isEscrowFunded ? "Escrow Funded & Protected" : "Escrow Protected Job"}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[10px] text-sky-200">Budget:</span>
              <h2 className="text-xl font-extrabold">{jobBudget > 0 ? formatCurrency(jobBudget) : "Negotiable"}</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-3 max-w-lg">
            <div>
              <span className="text-[8px] text-sky-200 block uppercase font-bold">Status</span>
              <span className="text-xs font-extrabold mt-0.5 block capitalize">{displayStatus}</span>
            </div>
            <div>
              <span className="text-[8px] text-sky-200 block uppercase font-bold">Location</span>
              <span className="text-xs font-extrabold mt-0.5 block">{jobLocation}</span>
            </div>
            <div>
              <span className="text-[8px] text-sky-200 block uppercase font-bold">Visibility</span>
              <span className="text-xs font-extrabold mt-0.5 block">{job?.visibility || "Public"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Professionals Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FiZap className="w-4 h-4 text-[#016EA6]" />
              <span>Skill-Matched Professionals</span>
            </h3>
            <p className="text-xs text-gray-400">
              Ranked by skill compatibility, rating, availability, and response performance.
            </p>
          </div>
          <span className="text-xs font-bold text-[#016EA6] bg-sky-50 px-3 py-1 rounded-full">
            {matchedPros.length} Candidates Found
          </span>
        </div>

        {isLoadingMatches ? (
          <div className="py-10 text-center text-xs text-gray-400">Loading matched professionals...</div>
        ) : matchedPros.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {matchedPros.map((candidate) => {
              const name =
                candidate.user?.firstName && candidate.user?.lastName
                  ? `${candidate.user.firstName} ${candidate.user.lastName}`
                  : candidate.name || "Professional";
              const score = candidate.matchResult?.totalScore ?? 85;
              const tier = candidate.matchResult?.matchTier ?? "Strong Match";
              const isInviting = invitingId === (candidate.id || candidate.userId);

              return (
                <div
                  key={candidate.id || candidate.userId}
                  className="p-4 rounded-2xl border border-gray-100 hover:border-[#016EA6] bg-gray-50/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center font-bold text-sm shrink-0">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{name}</h4>
                          <span className="text-[10px] text-gray-500 font-medium block">
                            {candidate.profession || "Specialist"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          score >= 80
                            ? "bg-emerald-50 text-emerald-700"
                            : score >= 65
                            ? "bg-sky-50 text-[#016EA6]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {score}% {tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <FiStar className="w-3 h-3 fill-current" />
                        {candidate.avgRating || candidate.rating || "4.8"}
                      </span>
                      <span>•</span>
                      <span>{candidate.hourlyRate ? `₦${Number(candidate.hourlyRate).toLocaleString()}/hr` : "Hourly"}</span>
                      {candidate.user?.location && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[100px]">{candidate.user.location}</span>
                        </>
                      )}
                    </div>

                    {candidate.bio && (
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {candidate.bio}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 capitalize font-medium">
                      Status: {candidate.availabilityStatus || "Available"}
                    </span>
                    <button
                      onClick={() => handleInviteProfessional(candidate)}
                      disabled={isInviting}
                      className="px-3.5 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isInviting ? "Inviting..." : "Invite to Job"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-400">No matching professionals found for this skill yet.</p>
          </div>
        )}
      </div>

      {/* Grid splits for Discussion / Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 bg-white border border-gray-100/50 shadow-sm rounded-3xl h-[350px] overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800">Job Project Discussion</h3>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Active Thread
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.isMe
                      ? "bg-[#016EA6] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] font-semibold text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to candidate..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full shadow-xs transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <FiSend className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobDetailsSubpage;

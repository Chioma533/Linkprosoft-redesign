import React, { useState, useEffect, useCallback } from "react";
import {
  FiArrowLeft,
  FiBell,
  FiCalendar,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiStar,
  FiX,
  FiBriefcase,
  FiPlus,
  FiZap,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import OfferCard from "../../components/buyer/OfferCard";
import JobCard from "../../components/professional/JobCard";
import PostJobWizard from "../employer/PostJobWizard";
import { useAuthStore } from "../../store/authStore";
import { jobService } from "../../api/services/jobService";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const DEFAULT_LATEST_JOB = {
  id: "JOB-1001",
  title: "Wardrobe Installation",
  status: "Posted",
  description:
    "Hi, I’m looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
  budget: 10000,
  createdAt: "2026-08-22T12:00:00.000Z",
};

const ManageJobsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [latestJob, setLatestJob] = useState(DEFAULT_LATEST_JOB);
  const [allEmployerJobs, setAllEmployerJobs] = useState([DEFAULT_LATEST_JOB]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("offers"); // "offers" | "posted"

  const userName = user?.fullName || user?.full_name || "Employer";
  const userInitials = (userName || "Employer")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Load employer's latest job and matching candidate offers
  const fetchEmployerData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await jobService.getMyEmployerJobs();
      const rawJobs = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items || response?.items || [];

      setAllEmployerJobs(rawJobs);

      if (rawJobs.length > 0) {
        // Find latest pending/posted job that has not been assigned or completed
        const pendingJob =
          rawJobs.find(
            (j) => {
              const s = (j.status || "").toLowerCase();
              return (
                s === "posted" ||
                s === "draft" ||
                s === "awaiting offers" ||
                s === "active" ||
                s === "open"
              );
            }
          ) ||
          rawJobs.find(
            (j) => {
              const s = (j.status || "").toLowerCase();
              return s !== "completed" && s !== "in_progress" && s !== "in progress";
            }
          ) ||
          null;

        setLatestJob(pendingJob);

        if (!pendingJob) {
          setOffers([]);
          setIsLoadingOffers(false);
          return;
        }

        // Fetch only professionals who submitted applications for this job.
        setIsLoadingOffers(true);

        try {
          const applicationsRes = await jobService.getJobApplications(pendingJob.id, {
            status: "pending",
            page: 1,
            limit: 20,
          });
          const applicationPayload =
            applicationsRes?.data?.applications ||
            applicationsRes?.data?.items ||
            applicationsRes?.data?.data?.applications ||
            applicationsRes?.data?.data?.items ||
            applicationsRes?.data ||
            applicationsRes?.applications ||
            applicationsRes?.items ||
            applicationsRes ||
            [];
          const candidateList = Array.isArray(applicationPayload) ? applicationPayload : [];

          // Transform only this job's applications into offer cards.
          const formattedOffers = candidateList.map((cand, idx) => {
            const applicant = cand.professional || cand.applicant || cand.user || cand;
            const proName =
              applicant.firstName && applicant.lastName
                ? `${applicant.firstName} ${applicant.lastName}`
                : applicant.fullName || applicant.full_name || applicant.name || "Specialist Professional";
            const proRole = applicant.profession || applicant.role || "Craftsman";
            const rating = Number(applicant.avgRating || applicant.rating || 5);
            const reviewCount = Number(applicant.totalReviews || applicant.reviewCount || 12);
            const priceNum =
              cand.bidAmount ||
              cand.bid_amount ||
              cand.amount ||
              (applicant.hourlyRate ? applicant.hourlyRate * 8 : pendingJob.budget || 22000);

            return {
              // The accept-and-fund endpoint requires the application ID,
              // which is different from the professional profile ID.
              id: applicant.id || cand.professionalId || cand.professional_id || cand.userId || `applicant-${idx + 1}`,
              applicationId: cand.id || cand.applicationId || cand.application_id,
              professionalId: applicant.id || cand.professionalId || cand.professional_id || cand.userId,
              candidateData: applicant,
              name: proName,
              role: proRole,
              verified: true,
              rating: Math.min(Math.max(Math.round(rating), 1), 5),
              reviewCount,
              summary:
                cand.coverLetter || cand.cover_letter || applicant.bio ||
                `Experienced ${proRole} specializing in custom requirements and quality delivery.`,
              location: applicant.location || "Available to Start",
              delivery: cand.estimatedDeliveryDays
                ? `${cand.estimatedDeliveryDays} days delivery`
                : "2-3 days delivery",
              price: priceNum.toLocaleString(),
            };
          });

          setOffers(formattedOffers);
        } catch (offerErr) {
          console.warn("Failed to load offers for job:", offerErr.message);
          setOffers([]);
        } finally {
          setIsLoadingOffers(false);
        }
      } else {
        setLatestJob(null);
        setOffers([]);
      }
    } catch (err) {
      console.error("Failed to load employer jobs:", err);
      toast.error("Failed to load employer jobs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployerData();
  }, [fetchEmployerData]);

  // Accept offer handler - redirects to PaymentScreen for simulated escrow funding
  const handleConfirmAcceptOffer = () => {
    if (!activeOffer || !latestJob) return;
    const selectedOffer = activeOffer;
    const selectedJob = latestJob;
    setActiveOffer(null);
    navigate("/payment-screen", {
      state: {
        job: selectedJob,
        offer: selectedOffer,
      },
    });
  };

  const handleJobCreatedSuccess = () => {
    setShowWizard(false);
    fetchEmployerData();
  };

  const activeLatestJob = latestJob || DEFAULT_LATEST_JOB;
  const activeOffers = offers;

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#1a1a1a]">
      {/* Confirmation Modal */}
      {activeOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-[340px] rounded-[24px] bg-white p-6 shadow-2xl animate-scale-up">
            <div className="flex justify-center pb-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#dff4ff] text-[#016EA6]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7d67d] text-[#fff] shadow-xs">
                  <FiBell className="h-4 w-4 text-[#fff]" />
                </div>
              </div>
            </div>

            <h2 className="text-center text-[1.15rem] font-bold text-[#1d1d1d] mt-2">
              Accept {activeOffer.name}&apos;s Offer?
            </h2>
            <p className="mt-1 text-center text-[0.75rem] leading-5 text-[#5a5a5a]">
              Are you sure you want to proceed with hiring {activeOffer.name} for this project?
            </p>

            <div className="mt-4 rounded-[16px] border border-[#edf0f2] bg-[#f8f9fa] p-4">
              <div className="flex items-center gap-2 text-[0.75rem] text-[#444]">
                <FiCalendar className="h-4 w-4 text-[#4d4d4d]" />
                <span>{activeOffer.location}</span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-[0.75rem] text-[#444]">
                <FiClock className="h-4 w-4 text-[#4d4d4d]" />
                <span>{activeOffer.delivery}</span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1">
                {Array.from({ length: activeOffer.rating || 5 }, (_, idx) => (
                  <FiStar
                    key={idx}
                    className="h-3.5 w-3.5 fill-[#f4b942] text-[#f4b942]"
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[1.3rem] font-extrabold text-[#141414]">
                <span className="font-serif">₦</span>
                <span>{activeOffer.price}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmAcceptOffer}
                className="rounded-full bg-[#016EA6] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#015b8e] cursor-pointer"
              >
                Confirm & Proceed
              </button>
              <button
                type="button"
                onClick={() => setActiveOffer(null)}
                className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#5d5d5d] transition hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#ececec] bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#1f2228] transition hover:bg-gray-100 cursor-pointer"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[1.05rem] font-bold text-[#1f1f1f] leading-tight">
                Manage Jobs
              </h1>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                Review skill-matched offers for your posted requests
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => setActiveTab("offers")}
              className={`text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "offers" ? "text-[#016EA6] border-b-2 border-[#016EA6] pb-0.5" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Job offers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("posted")}
              className={`text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "posted" ? "text-[#016EA6] border-b-2 border-[#016EA6] pb-0.5" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Jobs posted
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowWizard(true)}
              className="rounded-full bg-[#016EA6] hover:bg-[#015b8e] px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Post a Job</span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#016EA6] to-[#013554] text-xs font-bold text-white shadow-xs">
              {userInitials || "EM"}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading your latest posted jobs...</div>
        ) : latestJob ? (
          <>
            {/* Latest Pending Job Summary Card */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Latest Posted Job
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6] border border-sky-100">
                  Status: {activeLatestJob.status || "Posted"}
                </span>
              </div>
              <div className="w-full max-w-[420px]">
                <JobCard
                  id={`latest-job-${activeLatestJob.id}`}
                  title={activeLatestJob.title || "Wardrobe Installation"}
                  employerName={userName}
                  employerAvatarUrl="/professional_avatar.png"
                  postedAgo="Posted 2 min ago"
                  description={
                    activeLatestJob.description ||
                    "Hi, I’m looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers."
                  }
                  budget={Number(activeLatestJob.budget || 10000)}
                  isSaved={false}
                  isSelected={false}
                  showBorder={false}
                  onApply={() => {}}
                  onSave={() => {}}
                />
              </div>
            </div>

            {/* Offers Header */}
            <div className="mt-4 flex items-end justify-between gap-4 border-b border-[#e7e7e7] pb-5">
              <div>
                <h3 className="text-[1.05rem] font-bold text-[#1e1e1e] flex items-center gap-2">
                  <span>Offers Received ({activeOffers.length})</span>
                </h3>
                <p className="mt-1 text-[0.75rem] text-[#6a6a6a]">
                  Professionals interested in your job have submitted their offers and pricing, and they are ready for your choice.
                </p>
              </div>
            </div>

            {/* Offers Grid */}
            {isLoadingOffers ? (
              <div className="py-14 text-center text-xs text-gray-400">
                Finding professionals matching skill requirements...
              </div>
            ) : activeOffers.length > 0 ? (
              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {activeOffers.map((offer, index) => (
                  <OfferCard
                    key={`${offer.name}-${index}`}
                    id={`${offer.name}-${index}`}
                    {...offer}
                    onViewProfile={() => {
                      toast(`Viewing ${offer.name}'s profile.`);
                    }}
                    onAcceptOffer={() => setActiveOffer(offer)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 py-12 px-4 rounded-3xl bg-white border border-gray-100 text-center">
                <p className="text-xs font-bold text-gray-800">No matching offers received yet</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Professionals matching this skill will appear here as soon as they discover your request.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Empty State when employer has no jobs posted */
          <div className="py-16 px-4 rounded-3xl bg-white border border-gray-100 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-[#016EA6] flex items-center justify-center mb-3">
              <FiBriefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No Jobs Posted Yet</h3>
            <p className="text-xs text-gray-400 mb-6 max-w-sm">
              Post a job to automatically match with verified professionals in your required skillset and receive direct offers.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Post a Job Now
            </button>
          </div>
        )}
      </main>

      {/* Post Job Modal */}
      {showWizard && (
        <PostJobWizard
          onClose={() => setShowWizard(false)}
          onSuccess={handleJobCreatedSuccess}
        />
      )}
    </div>
  );
};

export default ManageJobsPage;

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiBriefcase,
  FiRefreshCw,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import ProfessionalNavbar from "../../layouts/professional/ProfessionalNavbar";
import JobSearchBar from "../../components/professional/JobSearchBar";
import JobCard from "../../components/professional/JobCard";
import ProfessionalBottomNav from "../../components/professional/ProfessionalBottomNav";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import JobApplicationPage from "./JobApplicationPage";
import { useAuthStore } from "../../store/authStore";
import { profileService } from "../../api/services/profileService";
import { projectService } from "../../api/services/projectService";
import { calculateJobMatchScore, isSkillMatched } from "../../utils/matchingEngine";

const ITEMS_PER_PAGE = 9;

/* ─────────────────────────────────────────────────────────────
   Pagination sub-component
   ───────────────────────────────────────────────────────────── */
const ProfessionalPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
      <span className="text-xs text-gray-500 font-medium">
        <span className="sm:hidden text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <span className="hidden sm:inline">
          Showing page {currentPage} of {totalPages} pages
        </span>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          id="job-pagination-prev-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <FiChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPages().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-xs text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              id={`job-pagination-page-${page}-btn`}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#016EA6] text-white shadow-sm"
                  : "border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          id="job-pagination-next-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Page: DefaultProfessionalScreen
   ───────────────────────────────────────────────────────────── */
const DefaultProfessionalScreen = () => {
  const { user } = useAuthStore();
  const userId = user?.id || user?.userId || user?.data?.id;

  const [proProfile, setProProfile] = useState(null);
  const [proSkills, setProSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedSkillName, setSelectedSkillName] = useState("");

  const [rawJobs, setRawJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [verificationDismissed, setVerificationDismissed] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);

  // ── Fetch jobs strictly filtered by skillId from the backend route ─────
  const fetchMatchedJobs = useCallback(async (skillId) => {
    if (!skillId) {
      setRawJobs([]);
      setIsLoadingJobs(false);
      return;
    }

    setIsLoadingJobs(true);
    try {
      const jobs = await projectService.getJobs({ skillId, limit: 50 });
      setRawJobs(Array.isArray(jobs) ? jobs : []);
    } catch (err) {
      console.error("Failed to fetch matched jobs:", err);
      setRawJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  // ── Load profile, skills, and initial matched jobs ────────────────────
  const loadProfileAndSkills = useCallback(async () => {
    try {
      const [profile, skills] = await Promise.all([
        profileService.getMyProfile(),
        userId ? profileService.getUserSkills(userId) : Promise.resolve([]),
      ]);

      if (profile) setProProfile(profile);

      // Resolve skills from API response, profile object, or auth user
      const skillList =
        Array.isArray(skills) && skills.length > 0
          ? skills
          : Array.isArray(profile?.skills) && profile.skills.length > 0
            ? profile.skills
            : Array.isArray(user?.skills) && user.skills.length > 0
              ? user.skills
              : [];

      setProSkills(skillList);

      // Determine the primary or first registered skill
      const primarySkill = skillList.find((s) => s.isPrimary) || skillList[0];
      const skillId =
        primarySkill?.skillId ||
        primarySkill?.id ||
        profile?.skillId ||
        user?.skillId ||
        "";
      const skillName =
        primarySkill?.name ||
        primarySkill?.skill?.name ||
        profile?.profession ||
        "";

      setSelectedSkillId(skillId);
      setSelectedSkillName(skillName);

      if (skillId) {
        await fetchMatchedJobs(skillId);
      } else {
        setRawJobs([]);
        setIsLoadingJobs(false);
      }
    } catch (err) {
      console.warn("Failed to load professional profile/skills:", err);
      setRawJobs([]);
      setIsLoadingJobs(false);
    } finally {
      setIsInitialLoading(false);
    }
  }, [userId, user, fetchMatchedJobs]);

  useEffect(() => {
    loadProfileAndSkills();
  }, [loadProfileAndSkills]);

  // ── Skill selection change ───────────────────────────────────────────
  const handleSkillChange = (skillId, skillName) => {
    setSelectedSkillId(skillId);
    setSelectedSkillName(skillName);
    setCurrentPage(1);
    fetchMatchedJobs(skillId);
  };

  // ── Annotate jobs with match scores and normalize fields ─────────────
  const normalizedJobs = useMemo(() => {
    const proDataForMatching = {
      ...(proProfile || {}),
      user: proProfile?.user || user || {},
      skills: proSkills.length > 0 ? proSkills : proProfile?.skills || [],
    };

    return rawJobs
      .filter((job) => {
        if (!selectedSkillId) return false;
        const jobSkillId =
          job.skillId ||
          job.skill_id ||
          (job.skill && (job.skill.id || job.skill.skillId));
        if (jobSkillId) {
          return (
            String(jobSkillId).toLowerCase() ===
            String(selectedSkillId).toLowerCase()
          );
        }
        return isSkillMatched(job, proSkills);
      })
      .map((job, idx) => {
        const matchResult = calculateJobMatchScore(job, proDataForMatching);
        const isDirectSkill = isSkillMatched(job, proSkills);

        const createdDate = job.createdAt ? new Date(job.createdAt) : null;
        const daysAgo =
          createdDate && !isNaN(createdDate.getTime())
            ? Math.max(
                0,
                Math.floor(
                  (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
                )
              )
            : 0;

        return {
          ...job,
          id: job.id || idx + 1,
          title: job.title || "Job Posting",
          employerName:
            job.client?.fullName ||
            job.client ||
            job.employerName ||
            job.employer?.fullName ||
            job.employer?.name ||
            "Verified Buyer",
          employerAvatarUrl:
            job.employerAvatarUrl ||
            job.avatarUrl ||
            job.employer?.avatarUrl ||
            job.client?.avatarUrl ||
            "/professional_avatar.png",
          description: job.description || "No job description provided.",
          budget: Number(job.budget || job.budgetMax || 0),
          location: job.location || "Remote",
          category:
            job.category?.name ||
            job.category ||
            (job.skill && job.skill.name) ||
            selectedSkillName ||
            "General",
          datePostedDays: daysAgo,
          createdAt: job.createdAt,
          postedAt: job.postedAt,
          matchScore: matchResult.totalScore,
          matchTier: matchResult.matchTier,
          isDirectSkillMatch: isDirectSkill || matchResult.isDirectSkillMatch,
          rating: job.rating || "5.0",
          spent: job.spent || "$5K",
          delivery: job.durationDays
            ? `${job.durationDays} days delivery`
            : "3 days delivery",
        };
      });
  }, [rawJobs, selectedSkillId, selectedSkillName, proProfile, proSkills, user]);

  // ── Client-side filtering ────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    return normalizedJobs.filter((job) => {
      const search = filters.searchQuery?.toLowerCase().trim() || "";
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.category.toLowerCase().includes(search) ||
        job.employerName.toLowerCase().includes(search);

      const matchesLocation =
        !filters.location ||
        filters.location === "All Locations" ||
        job.location.toLowerCase().includes(filters.location.toLowerCase());

      const normalizedBudget = filters.budget?.replace(/–/g, "-") || "";
      const matchesBudget =
        !normalizedBudget ||
        normalizedBudget === "Any Budget" ||
        (() => {
          if (normalizedBudget === "Under ₦5,000") return job.budget < 5000;
          if (normalizedBudget === "₦5,000 - ₦20,000")
            return job.budget >= 5000 && job.budget <= 20000;
          if (normalizedBudget === "₦20,000 - ₦50,000")
            return job.budget >= 20000 && job.budget <= 50000;
          if (normalizedBudget === "₦50,000+") return job.budget > 50000;
          return true;
        })();

      const matchesDate =
        !filters.datePosted ||
        filters.datePosted === "Any time" ||
        (() => {
          if (filters.datePosted === "Today") return job.datePostedDays === 0;
          if (filters.datePosted === "This week") return job.datePostedDays <= 7;
          if (filters.datePosted === "This month")
            return job.datePostedDays <= 30;
          if (filters.datePosted === "Last 3 months")
            return job.datePostedDays <= 90;
          return true;
        })();

      return matchesSearch && matchesLocation && matchesBudget && matchesDate;
    });
  }, [normalizedJobs, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDismissVerification = () => {
    setVerificationDismissed(true);
  };

  if (isInitialLoading) {
    return <LoadingScreen variant="professional" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-12">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <ProfessionalNavbar activePage="browse-jobs" />

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section id="professional-hero-section" className="bg-[#EEF5F9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {/* Left: headline + verification banner */}
            <div className="flex-1 max-w-full sm:max-w-xl">
              <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
                Find Your Next Opportunity
              </h1>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
                Looking for jobs? Browse openings curated specifically for your skillset
              </p>

              {/* Mobile verification banner + illustration */}
              {!verificationDismissed && (
                <div className="mt-0 flex items-end justify-between gap-2 sm:hidden z-10">
                  <div
                    id="verification-banner"
                    className="w-[248px] shrink-0 rounded-[6px] border border-[#ff8d28]/30 bg-[#fff4ea] py-2.5 px-1.5"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <FiAlertCircle className="h-3 w-3 shrink-0 translate-y-[0.5px] text-orange-500" />
                        <p className="text-[7.14px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#59310e]">
                          Verification Required
                        </p>
                      </div>
                    </div>

                    <div className="mt-0 ml-1.5 flex items-center justify-between gap-1.5">
                      <p className="flex-1 min-w-0 ml-[12px] self-center text-[5.5px] leading-[1.1] tracking-[-0.01em] text-[#ff8d28]">
                        Complete your verification to apply for jobs and receive
                        payments securely.
                      </p>

                      <Link
                        id="complete-verification-btn"
                        to="/verification"
                        className="inline-flex -translate-y-1 h-[15px] min-w-[64px] shrink-0 items-center justify-center rounded-full bg-orange-500 px-1 text-[4.71px] font-bold leading-none text-white transition-all duration-200 hover:bg-orange-600"
                      >
                        Complete Verification
                      </Link>
                    </div>
                  </div>

                  <div
                    className="w-[43%] z-0"
                    style={{ mixBlendMode: "multiply" }}
                  >
                    <img
                      src="/tools_bucket_illustration.png"
                      alt="Construction Tools"
                      className="w-full object-contain translate-y-[8px] translate-x-[25px]"
                    />
                  </div>
                </div>
              )}

              {/* Desktop verification banner */}
              {!verificationDismissed && (
                <div className="hidden sm:block">
                  <div
                    id="verification-banner"
                    className="mt-6 flex max-w-md items-center gap-3 rounded-xl border border-[#ff8d28]/30 bg-[#fff4ea] p-3 px-5 py-4"
                  >
                    <FiAlertCircle className="h-5 w-5 shrink-0 text-orange-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#59310e]">
                        Verification Required
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#ff8d28]">
                        Complete your verification to apply for jobs and receive
                        payments securely.
                      </p>
                    </div>
                    <Link
                      id="complete-verification-btn"
                      to="/verification"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-orange-500 px-3.5 py-2 text-[10px] font-bold text-white transition-all duration-200 hover:bg-orange-600"
                    >
                      Complete Verification
                    </Link>
                    <button
                      id="dismiss-verification-btn"
                      onClick={handleDismissVerification}
                      className="rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
                      aria-label="Dismiss verification banner"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Tools bucket illustration (desktop only) */}
            <div
              className="hidden sm:flex sm:shrink-0 sm:w-64 sm:max-w-xs sm:items-end sm:justify-center"
              style={{ mixBlendMode: "multiply" }}
            >
              <img
                src="/tools_bucket_illustration.png"
                alt="Construction Tools"
                className="w-full object-contain sm:translate-y-[100px] lg:w-72"
              />
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#016EA6]/20 to-transparent" />
      </section>

      {selectedJob ? (
        <JobApplicationPage job={selectedJob} onBack={() => setSelectedJob(null)} />
      ) : (
        <>
          {/* ── Search & Filter Bar ─────────────────────────────────── */}
          <section
            id="job-search-filter-section"
            className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
          >
            <JobSearchBar onApply={handleApplyFilters} />
          </section>

          {/* ── Job Results Grid ─────────────────────────────────────── */}
          <section
            id="jobs-results-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
              {/* Section header with dynamic skill matching and multi-skill selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Related to{" "}
                    <span className="text-[#016EA6]">
                      &ldquo;
                      {selectedSkillName ||
                        (proSkills[0]?.name || proSkills[0]?.skill?.name) ||
                        "Your Skills"}
                      &rdquo;
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                    {isLoadingJobs
                      ? "Loading jobs..."
                      : `${filteredJobs.length} ${
                          filteredJobs.length === 1 ? "job" : "jobs"
                        } available`}
                  </p>
                </div>

                {/* Multiple skills switch tabs */}
                {proSkills.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-gray-400 mr-1">
                      Filter by skill:
                    </span>
                    {proSkills.map((skill) => {
                      const sId = skill.skillId || skill.id;
                      const sName =
                        skill.name || skill.skill?.name || "Skill";
                      const isActive = selectedSkillId === sId;
                      return (
                        <button
                          key={sId}
                          type="button"
                          onClick={() => handleSkillChange(sId, sName)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            isActive
                              ? "bg-[#016EA6] text-white border-[#016EA6] shadow-xs"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#016EA6]"
                          }`}
                        >
                          <FiZap
                            className={`w-3 h-3 ${
                              isActive ? "text-amber-300 fill-current" : "text-gray-400"
                            }`}
                          />
                          <span>{sName}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3-column job grid or loading/empty state */}
              {isLoadingJobs ? (
                <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#016EA6] mb-3" />
                  <p className="text-sm font-medium text-gray-500">
                    Loading jobs matching your skillset...
                  </p>
                </div>
              ) : proSkills.length === 0 ? (
                <div className="col-span-full py-16 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center mb-3">
                    <FiBriefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    No Skills Registered Yet
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mb-4">
                    Add your professional skills to your profile to view matching job openings and opportunities tailored to your trade.
                  </p>
                  <Link
                    to="/professional/dashboard"
                    className="px-5 py-2 bg-[#016EA6] hover:bg-[#015885] text-white rounded-full text-xs font-semibold transition-colors"
                  >
                    Add Skills to Profile
                  </Link>
                </div>
              ) : (
                <div
                  id="jobs-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                >
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onApply={(appliedJob) => setSelectedJob(appliedJob || job)}
                        onSave={(val) =>
                          console.log(`Saved job ${job.title}: ${val}`)
                        }
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-16 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                        <FiBriefcase className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        No Matching Jobs Found
                      </h3>
                      <p className="text-xs text-gray-500 max-w-md mb-4">
                        {filters.searchQuery ||
                        filters.location ||
                        filters.budget ||
                        filters.datePosted
                          ? "No jobs match your active filter criteria. Try expanding your search or resetting filters."
                          : `There are currently no open jobs posted for “${
                              selectedSkillName || "your skill"
                            }”. New requests from employers will appear here automatically.`}
                      </p>
                      {filters.searchQuery ||
                      filters.location ||
                      filters.budget ||
                      filters.datePosted ? (
                        <button
                          onClick={() => setFilters({})}
                          className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      ) : (
                        <button
                          onClick={() => fetchMatchedJobs(selectedSkillId)}
                          className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#016EA6] hover:bg-[#015885] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <FiRefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh Openings</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!isLoadingJobs && filteredJobs.length > ITEMS_PER_PAGE && (
                <div className="mt-8">
                  <ProfessionalPagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── Mobile Bottom Navigation ─────────────────────────────── */}
      <ProfessionalBottomNav activeTab="browse-jobs" />
    </div>
  );
};

export default DefaultProfessionalScreen;

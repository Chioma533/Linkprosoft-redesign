import React, { useMemo, useState } from "react";
import ProfessionalNavbar from "../../layouts/professional/ProfessionalNavbar";
import JobSearchBar from "../../components/professional/JobSearchBar";
import ProfessionalBottomNav from "../../components/professional/ProfessionalBottomNav";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import JobApplicationPage from "./JobApplicationPage";
import ProfessionalPagination from "../../components/professional/ProfessionalPagination";
import ProfessionalHero from "../../components/professional/ProfessionalHero";
import JobResultsHeader from "../../components/professional/JobResultsHeader";
import ProfessionalJobResults from "../../components/professional/ProfessionalJobResults";
import useProfessionalJobs from "../../hooks/professional/useProfessionalJobs";
import normalizeProfessionalJobs from "../../utils/professional/normalizeProfessionalJobs";
import useProfessionalJobFilter from "../../hooks/professional/useProfessionalJobFilter";

const DefaultProfessionalScreen = () => {
  const {
    user,
    proProfile,
    proSkills,
    selectedSkillId,
    selectedSkillName,
    rawJobs,
    isLoadingJobs,
    isInitialLoading,
    fetchMatchedJobs,
    handleSkillChange,
  } = useProfessionalJobs();

  const [verificationDismissed, setVerificationDismissed] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const normalizedJobs = useMemo(
    () =>
      normalizeProfessionalJobs({
        jobs: rawJobs,
        selectedSkillId,
        selectedSkillName,
        proSkills,
        proProfile,
        user,
      }),
    [rawJobs, selectedSkillId, selectedSkillName, proSkills, proProfile, user],
  );

  const {
    filters,
    filteredJobs,
    paginatedJobs,
    currentPage,
    totalPages,
    applyFilters,
    resetFilters,
    changePage,
  } = useProfessionalJobFilter(normalizedJobs);

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

      <ProfessionalHero
        verificationDismissed={verificationDismissed}
        onDismissVerification={handleDismissVerification}
      />

      {selectedJob ? (
        <JobApplicationPage
          job={selectedJob}
          onBack={() => setSelectedJob(null)}
        />
      ) : (
        <>
          {/* ── Search & Filter Bar ─────────────────────────────────── */}
          <section
            id="job-search-filter-section"
            className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
          >
            <JobSearchBar onApply={applyFilters} />
          </section>

          {/* ── Job Results Grid ─────────────────────────────────────── */}
          <section
            id="jobs-results-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
          >
            <div className="bg-transparent border-0 p-0 md:bg-white md:rounded-2xl md:border md:border-gray-100 md:p-8">
              <JobResultsHeader
                selectedSkillName={selectedSkillName}
                filteredJobsCount={filteredJobs.length}
                isLoadingJobs={isLoadingJobs}
                skills={proSkills}
                selectedSkillId={selectedSkillId}
                onSkillChange={handleSkillChange}
              />

              <ProfessionalJobResults
                isLoadingJobs={isLoadingJobs}
                proSkills={proSkills}
                paginatedJobs={paginatedJobs}
                filters={filters}
                selectedSkillName={selectedSkillName}
                selectedSkillId={selectedSkillId}
                onApply={(appliedJob) => setSelectedJob(appliedJob)}
                onSave={(job, value) =>
                  console.log(`Saved job ${job.title}: ${value}`)
                }
                onResetFilters={resetFilters}
                onRefresh={fetchMatchedJobs}
              />

              {/* Pagination */}
              {!isLoadingJobs && filteredJobs.length > 0 && totalPages > 1 && (
                <div className="mt-8">
                  <ProfessionalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={changePage}
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

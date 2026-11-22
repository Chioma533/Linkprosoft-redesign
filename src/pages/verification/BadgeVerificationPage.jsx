import React, { useState } from "react";
import { ArrowRight, Award, Building2, Landmark, RefreshCw, ShieldCheck, Star } from "lucide-react";

import VerificationBadge from "../../components/common/VerificationBadge";
import CertificationPathwayModal from "../../components/verification/CertificationPathwayModal";
import RatingPathwayModal from "../../components/verification/RatingPathwayModal";
import CompanyVerificationModal from "../../components/verification/CompanyVerificationModal";
import GovernmentVerificationModal from "../../components/verification/GovernmentVerificationModal";
import BadgeMaintenanceModal from "../../components/verification/BadgeMaintenanceModal";
import { useAuthStore } from "../../store/authStore";
import { getVerificationBadge, isSubscriptionLapsed } from "../../utils/verificationBadge";

const BadgeVerificationPage = () => {
  const { user } = useAuthStore();
  const [localUserOverrides, setLocalUserOverrides] = useState({});
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isGovernmentModalOpen, setIsGovernmentModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  const activeUser = { ...user, ...localUserOverrides };
  const currentBadge = getVerificationBadge(activeUser);
  const isLapsed = isSubscriptionLapsed(activeUser);

  return (
    <main className="verification-page min-h-screen bg-[#f7f7f7] px-4 py-6 text-[#171a1c] sm:px-8 sm:py-12">
      <section className="verification-shell mx-auto max-w-[960px] space-y-8 rounded-[28px] bg-white px-4 py-7 sm:px-12 sm:py-12">
        <div>
          <h1 className="text-[clamp(1.75rem,4vw,2.35rem)] font-extrabold leading-tight text-gray-900">
            LinkProSoft Verification &amp; Trust Badges
          </h1>
          <p className="mt-2 max-w-[570px] text-sm leading-relaxed text-[#777b7d]">
            Distinguish your professional credibility, corporate identity, or government recognition with our three-tier verification system.
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-150 bg-gradient-to-br from-gray-50/80 to-white p-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-xs">
              {currentBadge ? <VerificationBadge user={activeUser} size="lg" /> : <ShieldCheck className="h-6 w-6 text-gray-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">
                  {currentBadge ? `Active Badge: ${currentBadge.category.toUpperCase()}` : "Account Unverified"}
                </h3>
                <VerificationBadge user={activeUser} size="sm" />
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {currentBadge
                  ? `Public display active • Maintained via ${activeUser.role === "government_agency" ? "Institutional Accreditation" : "Subscription"}`
                  : isLapsed
                    ? "Verification approved, but badge is temporarily hidden because subscription maintenance has lapsed."
                    : "No verification badge is currently displayed. Choose an eligible pathway below to apply."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-400" />
            <span>Subscription Status</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Available Verification Pathways &amp; Categories</h2>
            <p className="mt-0.5 text-xs text-gray-500">LinkProSoft enforces three separate verification tiers with strict administrative review.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="flex flex-col justify-between rounded-2xl border border-sky-150 bg-sky-50/30 p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f1f6] px-2.5 py-1 text-[10px] font-extrabold text-[#016EA6]">
                    <Award className="h-3 w-3" /> Blue Badge (#016EA6)
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Pathway 1</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Certified Professional</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">For professionals with government-issued or recognised trade licenses.</p>
              </div>
              <button type="button" onClick={() => setIsCertModalOpen(true)} className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#016EA6] py-2.5 text-xs font-bold text-white transition hover:bg-[#061EA6]">
                <span>Submit Certification</span><ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-sky-150 bg-sky-50/30 p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f1f6] px-2.5 py-1 text-[10px] font-extrabold text-[#016EA6]">
                    <Star className="h-3 w-3 fill-current" /> Blue Badge (#016EA6)
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Pathway 2</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Rating-Based Professional</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">For professionals without formal certifications. Qualify through ratings and completed jobs.</p>
              </div>
              <button type="button" onClick={() => setIsRatingModalOpen(true)} className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#016EA6] bg-white py-2.5 text-xs font-bold text-[#016EA6] transition hover:bg-sky-50">
                <span>Check Rating Eligibility</span><ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-amber-150 bg-amber-50/20 p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf6e7] px-2.5 py-1 text-[10px] font-extrabold text-[#D69A16]">
                    <Building2 className="h-3 w-3" /> Gold Badge (#D69A16)
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Corporate</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Company &amp; Employer</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">For registered companies and employers. Verified via corporate identity evidence.</p>
              </div>
              <button type="button" onClick={() => setIsCompanyModalOpen(true)} className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#D69A16] py-2.5 text-xs font-bold text-white transition hover:bg-amber-600">
                <span>Apply for Company Badge</span><ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#73777D] text-white">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Government Institutional Accreditation</h3>
                <p className="mt-0.5 text-xs text-gray-500">Official accreditation for ministries, departments, and government bodies.</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsGovernmentModalOpen(true)} className="shrink-0 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100">
              Institutional Verification
            </button>
          </div>
        </div>
      </section>

      <CertificationPathwayModal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} onSubmitSuccess={(certData) => setLocalUserOverrides((prev) => ({ ...prev, certification_status: "pending", certification: certData }))} />
      <RatingPathwayModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} metrics={{ rating: activeUser.rating || 4.9, completedJobs: activeUser.completedJobs || 12, totalReviews: activeUser.totalReviews || 8 }} onSubmitSuccess={(ratingData) => setLocalUserOverrides((prev) => ({ ...prev, rating_application: ratingData }))} />
      <CompanyVerificationModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} onSubmitSuccess={(companyData) => setLocalUserOverrides((prev) => ({ ...prev, company_verification: companyData }))} />
      <GovernmentVerificationModal isOpen={isGovernmentModalOpen} onClose={() => setIsGovernmentModalOpen(false)} onSubmitSuccess={(govData) => setLocalUserOverrides((prev) => ({ ...prev, government_verification: govData }))} />
      <BadgeMaintenanceModal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} user={activeUser} onRenewSuccess={(renewedUser) => setLocalUserOverrides((prev) => ({ ...prev, ...renewedUser }))} />
    </main>
  );
};

export default BadgeVerificationPage;

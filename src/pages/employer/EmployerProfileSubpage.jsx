import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleUserRound,
  LockKeyhole,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { profileService } from "../../api/services/profileService";

const formatDate = (value, options = { month: "short", year: "numeric" }) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  return date.toLocaleDateString("en-NG", options);
};

const Surface = ({ title, className = "", children }) => (
  <section className={`rounded-[22px] bg-[#F7F7F7] p-5 sm:p-6 ${className}`}>
    <h2 className="mb-4 text-sm font-medium text-[#222]">{title}</h2>
    {children}
  </section>
);

const VerificationRow = ({ title, subtitle, verified }) => (
  <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5">
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
        verified ? "bg-[#FFF6D8] text-[#D99A00]" : "bg-[#EBEBEB] text-[#969696]"
      }`}
    >
      {verified ? <Award className="h-5 w-5" /> : <LockKeyhole className="h-4 w-4" />}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-xs font-medium text-[#222]">{title}</span>
      <span className="mt-0.5 block truncate text-[11px] text-[#818895]">
        {verified ? subtitle : "Not verified yet"}
      </span>
    </span>
    {verified && <Check aria-label="Verified" className="h-4 w-4 shrink-0 text-[#14814B]" />}
  </div>
);

const JobRow = ({ job }) => (
  <article className="min-h-[76px] rounded-2xl bg-white px-4 py-3">
    <h3 className="text-sm font-medium text-[#202020]">{job.title}</h3>
    <p className="mt-1 text-xs text-[#838894]">
      {[job.category, job.location, formatDate(job.created_at, { day: "numeric", month: "short" })]
        .filter(Boolean)
        .join(" · ")}
    </p>
    {job.description && (
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#737985]">{job.description}</p>
    )}
  </article>
);

const EmployerProfileSubpage = ({ employerId }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await profileService.getPublicEmployerProfile(employerId);
      if (!result?.employer) {
        throw new Error("The employer profile could not be found.");
      }
      setProfile(result);
    } catch (loadError) {
      setError(loadError.response?.data?.message || loadError.message || "We couldn’t load this employer profile.");
    } finally {
      setIsLoading(false);
    }
  }, [employerId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const employer = profile?.employer || {};
  const stats = profile?.stats || {};
  const jobs = profile?.jobs || [];
  const categories = useMemo(
    () => [...new Set(jobs.map((job) => job.category).filter(Boolean))].slice(0, 6),
    [jobs],
  );
  const displayName = employer.fullName || "Employer";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const memberYear = formatDate(employer.createdAt, { year: "numeric" });
  const identityVerified = ["verified", "approved"].includes(
    String(employer.verificationStatus || "").toLowerCase(),
  );

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-8" aria-live="polite">
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-[#737985]">Loading employer profile…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-8">
        <div className="rounded-2xl bg-white p-8 text-center">
          <h1 className="text-lg font-semibold text-[#202020]">Employer profile unavailable</h1>
          <p className="mt-2 text-sm text-[#737985]">{error}</p>
          <button
            type="button"
            onClick={loadProfile}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0879A8] px-4 py-2 text-xs font-medium text-white hover:bg-[#05658F]"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-0 pb-8 sm:px-5 lg:px-8">
      <article className="overflow-hidden rounded-b-[24px] bg-white sm:rounded-[24px]">
        <div className="relative h-[150px] overflow-hidden bg-[#10181A] sm:h-[190px] lg:h-[220px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_24%_110%,#3b4544_0%,#1b2425_42%,#0b1112_76%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(180deg,transparent_45%,#080d0e_100%),repeating-linear-gradient(175deg,transparent_0px,transparent_13px,#78807c_14px,#171e1e_18px)]" />
          <div className="absolute -bottom-9 left-[22%] h-24 w-[55%] rounded-[50%] bg-[#343c3b]/75 blur-sm" />
        </div>

        <div className="px-5 pb-8 sm:px-10 lg:px-[7%]">
          <div className="relative flex min-h-[112px] items-end justify-between gap-5 sm:min-h-[120px]">
            <div className="absolute -top-[52px] left-0 flex h-[82px] w-[82px] items-center justify-center rounded-full border-[4px] border-white bg-[#1384A0] text-2xl font-medium text-white sm:-top-[58px] sm:h-[94px] sm:w-[94px] sm:text-3xl">
              {employer.avatarUrl ? (
                <img src={employer.avatarUrl} alt={displayName} className="h-full w-full rounded-full object-cover" />
              ) : (
                initials || <CircleUserRound className="h-9 w-9" />
              )}
              {identityVerified && (
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#087BA8] text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="min-w-0 pb-1 pt-3">
              <h1 className="truncate text-lg font-medium text-[#202020] sm:text-xl">{displayName}</h1>
              <p className="mt-1 max-w-[780px] text-xs leading-relaxed text-[#696969] sm:text-[13px]">
                Employer on Linkprosoft, hiring skilled professionals for residential and business projects.
              </p>
            </div>
            <span className="mb-1 hidden shrink-0 rounded-full bg-[#E4F1F6] px-3 py-1 text-[11px] font-medium text-[#14749A] sm:inline-flex">
              Employer
            </span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pb-6 text-xs text-[#7D8490]">
            {employer.location && (
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{employer.location}</span>
            )}
            {memberYear && (
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Member since {memberYear}</span>
            )}
            <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-4 w-4" />Contact unlocks after escrow</span>
          </div>

          <Surface title="About me" className="mb-5">
            <p className="text-[13px] leading-[1.65] text-[#777D86]">
              This employer hasn’t added an introduction yet. View their recent public job posts below to learn more about their hiring needs.
            </p>
          </Surface>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Surface title="Hiring Activity" className="min-h-[216px]">
              <div className="grid grid-cols-2 gap-5 pt-1">
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#18B66B] text-xs font-medium text-[#159454]">
                    {stats.totalAssignments ? `${stats.jobSuccessPercent}%` : "—"}
                  </span>
                  <span className="mt-2 text-[11px] text-[#7D8490]">Job success</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <BriefcaseBusiness className="mt-1 h-10 w-10 text-[#A66F45]" />
                  <span className="mt-2.5 text-[11px] text-[#7D8490]">{stats.jobCount || 0} jobs posted</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-10 w-4 items-end rounded-sm bg-gradient-to-t from-[#7164EF] to-[#C7C2FF]" />
                  <span className="mt-2 text-[11px] text-[#7D8490]">{stats.activeJobs || 0} hiring now</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#087FB5] text-xs font-medium text-[#087FB5]">—</span>
                  <span className="mt-2 text-[11px] text-[#7D8490]">Avg response</span>
                </div>
              </div>
            </Surface>

            <Surface title="Hiring Needs" className="min-h-[216px]">
              {categories.length ? (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {categories.map((category) => (
                    <span key={category} className="rounded-full bg-white px-3 py-2 text-center text-[11px] text-[#747B87]">{category}</span>
                  ))}
                </div>
              ) : (
                <p className="pt-1 text-xs text-[#858B95]">Categories will appear as this employer posts jobs.</p>
              )}
            </Surface>

            <Surface title="Verifications" className="min-h-[216px]">
              <div className="space-y-2">
                <VerificationRow title="Identity Verified" subtitle="Account identity confirmed" verified={identityVerified} />
                <VerificationRow title="Email Confirmed" subtitle="Email address kept private" verified={employer.isEmailVerified} />
                <VerificationRow title="Completed Projects" subtitle="Has completed work on Linkprosoft" verified={Boolean(stats.completedJobs)} />
              </div>
            </Surface>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Surface title="Recent Job Posts" className="min-h-[300px]">
              {jobs.length ? (
                <div className="space-y-3">
                  {jobs.map((job) => <JobRow key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-white px-5 text-center text-xs text-[#818894]">
                  No public job posts yet.
                </div>
              )}
            </Surface>

            <Surface title="What Professionals Say" className="min-h-[300px]">
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-white px-6 text-center">
                <p className="max-w-xs text-xs leading-relaxed text-[#7A818C]">
                  Feedback from professionals will appear here after completed projects.
                </p>
              </div>
            </Surface>
          </div>
        </div>
      </article>
    </main>
  );
};

export default EmployerProfileSubpage;

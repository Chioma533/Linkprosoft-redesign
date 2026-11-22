import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleUserRound,
  Edit3,
  LockKeyhole,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { jobService } from "../../api/services/jobService";
import { profileService } from "../../api/services/profileService";
import mediaService from "../../api/services/mediaService";
import { useAuthStore } from "../../store/authStore";
import { getVerificationBadge } from "../../utils/verificationBadge";

const getJobList = (response) => {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const getJobStatus = (job) => String(job.status || "Open").toLowerCase();

const formatBudget = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Budget not set";
  return `₦${amount.toLocaleString("en-NG")}`;
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  return date.toLocaleDateString("en-NG", { month: "short", year: "numeric" });
};

const Surface = ({ title, className = "", children }) => (
  <section className={`rounded-2xl bg-[#F4F4F4] p-4 ${className}`}>
    <h2 className="mb-3 text-[13px] font-medium text-[#222]">{title}</h2>
    {children}
  </section>
);

const VerificationRow = ({ title, subtitle, verified }) => (
  <div className="flex items-center gap-2.5 rounded-lg bg-white px-2.5 py-2">
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
        verified ? "bg-[#FFF6D8] text-[#D99A00]" : "bg-[#EAEAEA] text-[#8A8A8A]"
      }`}
    >
      {verified ? <Award className="h-4 w-4" /> : <LockKeyhole className="h-3.5 w-3.5" />}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-[11px] font-medium text-[#222]">{title}</span>
      <span className="block truncate text-[10px] text-[#818895]">
        {verified ? subtitle : "Not verified yet"}
      </span>
    </span>
    {verified && <Check aria-label="Verified" className="h-3.5 w-3.5 shrink-0 text-[#14814B]" />}
  </div>
);

const JobRow = ({ job }) => {
  const status = getJobStatus(job);
  const statusClass = status.includes("complete")
    ? "bg-[#DDF3E4] text-[#167645]"
    : status.includes("progress") || status.includes("escrow")
      ? "bg-[#FFF0D7] text-[#A96300]"
      : "bg-[#E6F3FA] text-[#17658A]";
  const category = job.category?.name || job.category || job.skill?.name || "Services";
  const location = job.location || job.address;

  return (
    <article className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-white px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <h3 className="text-[11px] font-medium leading-tight text-[#202020]">{job.title || job.jobTitle || "Untitled job"}</h3>
        <p className="mt-1 truncate text-[10px] leading-tight text-[#838894]">
          {[category, location, formatDate(job.createdAt || job.created_at)].filter(Boolean).join(" · ")}
        </p>
      </div>
      <span className="text-[10px] font-medium text-[#222]">{formatBudget(job.budget || job.budget_amount)}</span>
      <span className={`rounded-full px-2 py-1 text-[9px] font-medium capitalize ${statusClass}`}>
        {job.status || "Open"}
      </span>
    </article>
  );
};

const EmployerProfileSubpage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    const [profileResult, jobsResult] = await Promise.allSettled([
      profileService.getMyProfile(),
      jobService.getMyEmployerJobs(),
    ]);

    if (profileResult.status === "fulfilled") {
      let nextProfile = profileResult.value;
      if (nextProfile && (nextProfile.avatarMediaId || nextProfile.coverMediaId)) {
        try {
          const [avatarUrl, coverImageUrl] = await Promise.all([
            nextProfile.avatarMediaId ? mediaService.getUrl(nextProfile.avatarMediaId) : null,
            nextProfile.coverMediaId ? mediaService.getUrl(nextProfile.coverMediaId) : null,
          ]);
          nextProfile = {
            ...nextProfile,
            avatarUrl: avatarUrl || nextProfile.avatarUrl,
            coverImageUrl: coverImageUrl || nextProfile.coverImageUrl,
          };
        } catch {
          // Profile text and initials remain available if stored images cannot be resolved.
        }
      }
      setProfile(nextProfile);
      setBioDraft(nextProfile?.bio || user?.bio || "");
    }

    if (jobsResult.status === "fulfilled") {
      setJobs(getJobList(jobsResult.value));
    } else {
      setJobs([]);
      setLoadError("We couldn’t load your recent job posts.");
    }
    setIsLoading(false);
  }, [user?.bio]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const fullName = user?.fullName || user?.full_name || user?.name || user?.email || "Employer";
  const displayName = profile?.businessName || profile?.business_name || user?.businessName || user?.business_name || fullName;
  const location = profile?.location || user?.location || user?.address || "";
  const bio = profile?.bio || user?.bio || "";
  const memberDate = formatDate(user?.createdAt || user?.created_at || profile?.createdAt || profile?.created_at);
  const avatarUrl = profile?.avatarUrl || profile?.avatar_url || user?.avatarUrl || user?.avatar_url;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const stats = useMemo(() => {
    const fundedCount = jobs.filter((job) => {
      const status = getJobStatus(job);
      return status.includes("escrow") || status.includes("progress") || status.includes("complete");
    }).length;
    return {
      jobCount: jobs.length,
      fundedPercent: jobs.length ? Math.round((fundedCount / jobs.length) * 100) : 0,
      activeCount: jobs.filter((job) => !["completed", "cancelled"].includes(getJobStatus(job))).length,
    };
  }, [jobs]);

  const categories = [...new Set(jobs.map((job) => job.category?.name || job.category || job.skill?.name).filter(Boolean))].slice(0, 6);
  const companyVerified = Boolean(getVerificationBadge({ ...user, ...profile, role: user?.role || "employer" }));
  const emailVerified = Boolean(user?.is_email_verified || user?.email_verified || user?.isEmailVerified);
  const trustedPayer = jobs.some((job) => {
    const status = getJobStatus(job);
    return status.includes("escrow") || status.includes("complete");
  });

  const handleSaveBio = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const savedProfile = profile
        ? await profileService.updateMyProfile({ bio: bioDraft })
        : await profileService.createMyProfile({ bio: bioDraft });
      setProfile((current) => ({ ...(current || {}), ...(savedProfile || {}), bio: bioDraft }));
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not update your profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[920px] pb-5">
      <article className="overflow-hidden rounded-[18px] bg-white">
        <div className="relative h-[105px] overflow-hidden bg-[#12394A]">
          {profile?.coverImageUrl && (
            <img src={profile.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {!profile?.coverImageUrl && (
            <>
              <div className="absolute -right-4 -top-9 h-24 w-24 rounded-full bg-[#2E6577]/40" />
              <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-1 opacity-40">
                {[42, 63, 48, 86, 54, 76, 49, 61, 43, 74, 56, 68, 46, 80, 52].map((height, index) => (
                  <span key={index} className="flex-1 bg-[#6091A1]" style={{ height: `${height}%` }} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-5 pb-5 sm:px-10">
          <div className="relative flex min-h-[86px] items-end justify-between gap-4">
            <div className="absolute -top-10 left-0 flex h-[62px] w-[62px] items-center justify-center rounded-full border-[3px] border-white bg-[#1384A0] text-xl font-medium text-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                initials || <CircleUserRound className="h-7 w-7" />
              )}
              {companyVerified && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#0A7AA6] text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>
            <div className="min-w-0 pb-1 pl-[72px]">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[15px] font-semibold text-[#202020]">{displayName}</h1>
                <span className="rounded-full bg-[#E4F1F6] px-2 py-0.5 text-[9px] font-medium text-[#14749A]">Employer</span>
              </div>
              <p className="mt-1 max-w-[650px] text-[10px] leading-relaxed text-[#737985]">
                {profile?.headline || profile?.profession || user?.company_description || "Employer on Linkprosoft"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBioDraft(bio);
                setIsEditing(true);
              }}
              className="mb-1 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#E5F0F5] px-3.5 py-2 text-[10px] font-medium text-[#176C90] transition-colors hover:bg-[#D8E9F0]"
            >
              <Edit3 className="h-3 w-3" />
              Edit Profile
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pb-4 text-[10px] text-[#7D8490]">
            {location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span>}
            {memberDate && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />Member since {memberDate}</span>}
            <span className="inline-flex items-center gap-1"><LockKeyhole className="h-3 w-3" />Contact unlocks after escrow</span>
          </div>

          <Surface title="About me" className="mb-3">
            <p className="text-[10px] leading-[1.55] text-[#747B87]">
              {bio || "Add a short introduction to tell professionals what you’re hiring for and how you work."}
            </p>
          </Surface>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Surface title="Hiring Activity" className="min-h-[164px]">
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#18B66B] text-[10px] font-medium text-[#159454]">{stats.fundedPercent}%</span>
                  <span className="mt-1.5 text-[9px] text-[#7D8490]">Escrow funded</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <BriefcaseBusiness className="mt-1 h-8 w-8 text-[#A66F45]" />
                  <span className="mt-2 text-[9px] text-[#7D8490]">{stats.jobCount} jobs posted</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-9 w-3 items-end rounded-sm bg-gradient-to-t from-[#7164EF] to-[#C7C2FF]" />
                  <span className="mt-1.5 text-[9px] text-[#7D8490]">{stats.activeCount} hiring now</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#087FB5] text-[10px] font-medium text-[#087FB5]">—</span>
                  <span className="mt-1.5 text-[9px] text-[#7D8490]">Avg response</span>
                </div>
              </div>
            </Surface>

            <Surface title="Hiring Needs" className="min-h-[164px]">
              {categories.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.map((category) => (
                    <span key={category} className="rounded-full bg-white px-3 py-1.5 text-[9px] text-[#747B87]">{category}</span>
                  ))}
                </div>
              ) : (
                <p className="pt-1 text-[10px] text-[#858B95]">Your job categories will show here.</p>
              )}
            </Surface>

            <Surface title="Verifications" className="min-h-[164px]">
              <div className="space-y-1.5">
                <VerificationRow title="Company Verified" subtitle="Identity & Payment Vetted" verified={companyVerified} />
                <VerificationRow title="Phone & Email Confirmed" subtitle="Details kept private" verified={emailVerified} />
                <VerificationRow title="Trusted Payer" subtitle="Escrow funded on every job" verified={trustedPayer} />
              </div>
            </Surface>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-[1.05fr_0.95fr]">
            <Surface title="Recent Job Posts" className="min-h-[216px]">
              {isLoading ? (
                <p className="rounded-xl bg-white p-3 text-[10px] text-[#818894]">Loading job posts…</p>
              ) : jobs.length ? (
                <div className="space-y-1.5">
                  {jobs.slice(0, 3).map((job, index) => (
                    <JobRow key={job.id || job._id || `${job.title}-${index}`} job={job} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-white p-3 text-[10px] text-[#818894]">
                  {loadError || "Your job posts will appear here once you start hiring."}
                  {loadError && (
                    <button type="button" onClick={loadProfile} className="ml-2 inline-flex items-center gap-1 text-[#14749A]">
                      <RefreshCw className="h-3 w-3" /> Try again
                    </button>
                  )}
                </div>
              )}
            </Surface>

            <Surface title="What Professionals Say" className="min-h-[216px]">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl bg-white px-5 text-center">
                <div>
                  <p className="text-[10px] leading-relaxed text-[#7A818C]">
                    Professional feedback will appear here after completed jobs.
                  </p>
                </div>
              </div>
            </Surface>
          </div>

          <div className="flex items-center gap-2 py-2">
            <span className="h-px flex-1 bg-[#E9E9E9]" />
            <button
              type="button"
              aria-expanded={showDetails}
              onClick={() => setShowDetails((current) => !current)}
              className="inline-flex items-center gap-1 rounded-full border border-[#E8E8E8] px-4 py-1.5 text-[9px] text-[#68717D] transition-colors hover:bg-[#F7F7F7]"
            >
              {showDetails ? "Hide Details" : "View All Details"}
              <ChevronDown className={`h-3 w-3 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
            <span className="h-px flex-1 bg-[#E9E9E9]" />
          </div>
          {showDetails && (
            <div className="mt-2 grid gap-2 rounded-xl bg-[#F4F4F4] p-4 text-[10px] text-[#737985] sm:grid-cols-2">
              {user?.email && <p><span className="font-medium text-[#353535]">Email:</span> {user.email}</p>}
              {(user?.phone || user?.phoneNumber) && <p><span className="font-medium text-[#353535]">Phone:</span> {user.phone || user.phoneNumber}</p>}
              {(profile?.businessRegistration || user?.business_registration) && <p><span className="font-medium text-[#353535]">Business registration:</span> {profile?.businessRegistration || user.business_registration}</p>}
              {!user?.email && !user?.phone && !user?.phoneNumber && (
                <p className="sm:col-span-2">Add your contact details to complete your employer profile.</p>
              )}
            </div>
          )}
        </div>
      </article>

      {isEditing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsEditing(false);
        }}>
          <form onSubmit={handleSaveBio} className="w-full max-w-lg rounded-2xl bg-white p-5">
            <h2 className="text-base font-semibold text-[#202020]">Edit profile</h2>
            <label htmlFor="employer-profile-bio" className="mt-4 block text-xs font-medium text-[#414141]">About me</label>
            <textarea
              id="employer-profile-bio"
              value={bioDraft}
              onChange={(event) => setBioDraft(event.target.value)}
              rows={5}
              className="mt-2 w-full resize-y rounded-xl border border-[#E3E5E8] p-3 text-sm text-[#333] outline-none focus:border-[#14749A]"
              placeholder="Tell professionals a little about your hiring needs."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsEditing(false)} className="rounded-lg px-4 py-2 text-xs text-[#68717D] hover:bg-[#F4F4F4]">Cancel</button>
              <button type="submit" disabled={isSaving} className="rounded-lg bg-[#14749A] px-4 py-2 text-xs font-medium text-white disabled:opacity-60">
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployerProfileSubpage;

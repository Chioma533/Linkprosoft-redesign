import { CalendarDays, Check, MapPin, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { profileService } from "../../api/services/profileService";
import PublicProfileOverview from "../../components/professional/PublicProfileOverview";
import PublicProfileTopbar from "../../components/professional/PublicProfileTopbar";
import VerificationBadge from "../../components/common/VerificationBadge";

const getStatus = (error) => error?.response?.status;
const publicUrl = (profile) => profile?.canonicalUrl || profile?.publicUrl || (profile?.slug ? `${window.location.origin}/${profile.slug}` : window.location.href);
const setMeta = (selector, attribute, value) => {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const [name, content] = selector.match(/\[([^=]+)="([^"]+)"\]/)?.slice(1) || [];
    if (name && content) element.setAttribute(name, content);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

const setRobots = (value) => setMeta('meta[name="robots"]', "content", value);

const ProfileState = ({ title, children, retry }) => <div className="min-h-screen bg-[#fafafa]"><PublicProfileTopbar /><main className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="text-2xl font-semibold text-[#171717]">{title}</h1><p className="mt-3 text-[#77716d]">{children}</p>{retry && <button type="button" onClick={retry} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#016EA6] px-5 py-3 text-sm font-medium text-white"><RefreshCw className="h-4 w-4" />Try again</button>}</main></div>;

const PublicProfessionalProfile = () => {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", profile: null });
  const [showDetails, setShowDetails] = useState(false);
  const canonicalSlug = state.profile?.canonicalSlug || state.profile?.slug;

  const loadProfile = useCallback(async () => {
    setState({ status: "loading", profile: null });
    try {
      const profile = await profileService.getPublicProfileBySlug(slug);
      if (!profile) throw new Error("Profile response was empty");
      setState({ status: "ready", profile });
      const canonical = publicUrl(profile);
      document.title = `${profile.fullName || "Professional"} | Linkprosoft`;
      const description = profile.bio || profile.profession || "Professional profile on Linkprosoft";
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:title"]', "content", document.title);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:title"]', "content", document.title);
      setMeta('meta[name="twitter:description"]', "content", description);
      setRobots("index,follow");
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = canonical;
    } catch (error) {
      const status = getStatus(error);
      setState({ status: status === 404 ? "not-found" : "error", profile: null });
      document.title = "Profile unavailable | Linkprosoft";
      setRobots("noindex,nofollow");
    }
  }, [slug]);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => () => { document.title = "Linkprosoft"; setRobots("noindex,nofollow"); }, []);

  if (state.status === "loading") return <ProfileState title="Loading profile">Please wait while this profile loads.</ProfileState>;
  if (state.status === "not-found") return <ProfileState title="Profile not found">This profile is unavailable or is not publicly published.</ProfileState>;
  if (state.status === "error") return <ProfileState title="Profile unavailable" retry={loadProfile}>We could not load this profile right now.</ProfileState>;
  if (canonicalSlug && canonicalSlug !== slug) return <Navigate to={`/${encodeURIComponent(canonicalSlug)}`} replace />;

  const profile = state.profile;
  const memberDate = profile.createdAt && new Date(profile.createdAt);
  return <div className="min-h-screen bg-[#fafafa] font-sans text-[#171717]"><PublicProfileTopbar /><main className="mx-auto max-w-[1240px] px-0 pb-12 pt-[18px] sm:px-5 lg:px-0"><article className="overflow-hidden bg-white pb-16 sm:rounded-[28px]"><div className="relative h-[190px] bg-[#1d2930] sm:h-[220px]">{profile.coverImageUrl && <img src={profile.coverImageUrl} alt="" className="h-full w-full object-cover" />}</div><section className="relative px-5 pb-8 pt-[60px] sm:px-12"><div className="absolute -top-[64px] left-5 sm:left-[7.5%]"><div className="relative flex h-[124px] w-[124px] items-center justify-center overflow-hidden rounded-full bg-[#e6f3f8] ring-4 ring-white">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.fullName || "Professional"} className="h-full w-full object-cover" /> : <span className="text-4xl font-semibold text-[#016EA6]">{profile.fullName?.charAt(0)?.toUpperCase() || "P"}</span>}<VerificationBadge user={{ ...profile, verification_status: profile.verificationStatus, role: profile.role || "professional" }} variant="avatar" size="lg" className="absolute bottom-1 right-1" /></div></div><div className="sm:pl-[2.5%]"><div className="flex items-center gap-2.5"><h1 className="text-2xl font-medium tracking-tight">{profile.fullName || "Professional"}</h1><VerificationBadge user={{ ...profile, verification_status: profile.verificationStatus, role: profile.role || "professional" }} size="md" /></div>{profile.profession && <p className="mt-2 text-base text-[#312b27]">{profile.profession}</p>}<div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#85817e]">{profile.location && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{profile.location}</span>}{memberDate && !Number.isNaN(memberDate.valueOf()) && <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Member since {memberDate.getFullYear()}</span>}{profile.availabilityStatus && <span className="capitalize">{profile.availabilityStatus}</span>}</div></div></section><div className="px-0 sm:px-[7%]"><PublicProfileOverview profile={profile} showDetails={showDetails} onToggleDetails={() => setShowDetails((current) => !current)} /></div></article></main></div>;
};

export default PublicProfessionalProfile;

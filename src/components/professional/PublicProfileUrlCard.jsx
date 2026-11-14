import { Check, Copy, ExternalLink, Link2, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { profileService } from "../../api/services/profileService";
import { getSlugValidationMessage, normalizeProfileSlug } from "../../utils/profileSlug";

const getPublicUrl = (profile) => {
  const value = profile?.publicUrl || profile?.public_url || (profile?.slug ? `/${profile.slug}` : "");
  return value ? new URL(value, window.location.origin).toString() : "";
};

const PublicProfileUrlCard = ({ profile, onSaved }) => {
  const currentSlug = profile?.slug || "";
  const [slugInput, setSlugInput] = useState(currentSlug);
  const [visibility, setVisibility] = useState(profile?.visibility || "draft");
  const [availability, setAvailability] = useState({ state: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSlugInput(currentSlug);
    setVisibility(profile?.visibility || "draft");
  }, [currentSlug, profile?.visibility]);

  const normalizedSlug = useMemo(() => normalizeProfileSlug(slugInput), [slugInput]);
  const validationMessage = getSlugValidationMessage(normalizedSlug);
  const publicUrl = getPublicUrl(profile);

  useEffect(() => {
    if (!normalizedSlug || normalizedSlug === currentSlug || validationMessage) {
      setAvailability({ state: "idle", message: validationMessage });
      return undefined;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      setAvailability({ state: "loading", message: "Checking availability…" });
      try {
        const result = await profileService.checkSlugAvailability(normalizedSlug);
        if (!active) return;
        setAvailability(result?.available
          ? { state: "available", message: "This URL is available." }
          : { state: "unavailable", message: "This URL is unavailable or reserved." });
      } catch (error) {
        if (active) setAvailability({ state: "error", message: "Could not check availability. You can still try saving." });
      }
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [currentSlug, normalizedSlug, validationMessage]);

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Public URL copied");
    } catch {
      toast.error("Unable to copy the URL");
    }
  };

  const handleSave = async () => {
    if (validationMessage || availability.state === "unavailable") return;
    setIsSaving(true);
    try {
      const saved = await profileService.updateMyProfile({
        slug: normalizedSlug || undefined,
        visibility,
      });
      onSaved?.(saved);
      toast.success("Public profile settings saved");
    } catch (error) {
      const status = error.response?.status;
      toast.error(status === 409 ? "That URL is no longer available." : error.response?.data?.message || "Could not save public profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs" aria-labelledby="public-profile-url">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[#016EA6]" />
            <h3 id="public-profile-url" className="text-sm font-bold text-gray-900">Public profile URL</h3>
          </div>
          <p className="mt-1 text-xs leading-5 text-gray-500">Share this link when your profile is published. Previous URLs remain reserved and redirect here.</p>
        </div>
        {publicUrl && (
          <div className="flex gap-2">
            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"><Copy className="h-3.5 w-3.5" /> Copy</button>
            <a href={`/${encodeURIComponent(currentSlug)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-2 text-xs font-bold text-[#016EA6] hover:bg-sky-100"><ExternalLink className="h-3.5 w-3.5" /> Preview</a>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_auto] md:items-end">
        <label className="block">
          <span className="text-xs font-bold text-gray-700">linkprosoft.com/</span>
          <input value={slugInput} onChange={(event) => setSlugInput(event.target.value)} placeholder="your-name" className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#016EA6] focus:bg-white" />
          <span className={`mt-1 block text-[11px] ${availability.state === "available" ? "text-emerald-600" : availability.state === "unavailable" || availability.state === "error" ? "text-red-600" : "text-gray-400"}`}>{availability.state === "loading" && <LoaderCircle className="mr-1 inline h-3 w-3 animate-spin" />}{availability.message || (normalizedSlug ? `Will use: /${normalizedSlug}` : "Use letters, numbers, and hyphens.")}</span>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-gray-700">Visibility</span>
          <select value={visibility} onChange={(event) => setVisibility(event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#016EA6] focus:bg-white">
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </label>
        <button type="button" onClick={handleSave} disabled={isSaving || Boolean(validationMessage) || availability.state === "unavailable"} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#016EA6] px-5 text-xs font-bold text-white hover:bg-[#015b8a] disabled:cursor-not-allowed disabled:opacity-50">{isSaving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{isSaving ? "Saving" : "Save URL"}</button>
      </div>
      {visibility === "public" && !profile?.isComplete && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-700"><Check className="h-3.5 w-3.5" /> Publishing is confirmed by the server after profile readiness checks.</p>}
    </section>
  );
};

export default PublicProfileUrlCard;

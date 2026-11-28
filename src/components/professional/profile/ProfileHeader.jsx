import React from "react";
import { Calendar, Edit3, MapPin } from "lucide-react";
import Avatar from "../../common/Avatar";
import MediaUploader from "../../common/MediaUploader";
import VerificationBadge from "../../common/VerificationBadge";

const getMemberYear = (profile, user) => {
  const createdAt = profile?.createdAt || profile?.created_at || user?.createdAt || user?.created_at;
  if (!createdAt) return null;
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
};

const ProfileHeader = ({
  user,
  profile,
  name,
  profession,
  location,
  avatarUrl,
  coverUrl,
  isAvatarActionsOpen,
  onToggleAvatarActions,
  onAvatarUploaded,
  onCoverUploaded,
  onEdit,
  highlightSection,
}) => {
  const memberYear = getMemberYear(profile, user);
  return (
  <section className="overflow-hidden rounded-3xl border border-gray-100/50 bg-white shadow-xs">
    <div className="relative h-48 overflow-hidden bg-slate-100">
      {coverUrl ? <img src={coverUrl} className="h-full w-full object-cover" alt="Profile cover" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute right-4 top-4">
        <MediaUploader compact purpose="cover" label="Change cover" onUploaded={onCoverUploaded} />
      </div>
    </div>

    <div className="relative px-4 pb-6 md:px-8 md:pb-8">
      <div className="absolute -top-16 left-4 flex items-end gap-5 md:left-8">
        <div className="relative">
          <button
            id="profile-avatar-section"
            type="button"
            aria-label="Profile photo actions"
            aria-expanded={isAvatarActionsOpen}
            onClick={onToggleAvatarActions}
            className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#016EA6] shadow-md transition-all duration-300 ${
              highlightSection === "avatar" ? "animate-pulse border-[#016EA6] ring-4 ring-[#016EA6] ring-offset-2 shadow-xl" : ""
            }`}
          >
            <Avatar
              name={name}
              avatar={avatarUrl}
              imageClassName="h-full w-full object-cover"
              fallbackClassName="flex h-full w-full items-center justify-center bg-blue-50 text-lg font-bold text-gray-700"
            />
          </button>
          <VerificationBadge
            user={user}
            variant="avatar"
            size="lg"
            className="absolute bottom-4 right-0 z-10 translate-x-1/4"
          />
          {isAvatarActionsOpen ? (
            <div className="absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              <MediaUploader compact purpose="avatar" label="Photo" onUploaded={onAvatarUploaded} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 pt-16 md:flex-row md:items-start">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-bold text-gray-900">{name || "Name unavailable"}</h2>
            <VerificationBadge user={user} />
          </div>
          {profession ? <p className="mt-1 text-xs font-semibold text-gray-500">{profession}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-gray-400">
            <span
              id="profile-location-section"
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 transition-all duration-300 ${
                highlightSection === "location" ? "animate-pulse bg-sky-50 font-bold text-[#016EA6] ring-2 ring-[#016EA6]" : ""
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-[#016EA6]" />
              <span>{location || "Location not provided"}</span>
            </span>
            {memberYear !== null ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>Member since {memberYear}</span>
              </span>
            ) : null}
            {profile?.hourlyRate !== null && profile?.hourlyRate !== undefined && profile?.hourlyRate !== "" ? (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600">
                ₦{Number(profile.hourlyRate).toLocaleString()} / hr
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-1.5 self-start rounded-full bg-sky-50/70 px-5 py-2.5 text-xs font-bold text-[#016EA6] shadow-xs transition-all hover:bg-[#016EA6] hover:text-white"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  </section>
  );
};

export default ProfileHeader;

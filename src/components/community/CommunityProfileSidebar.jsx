import React from "react";
import { FiBookmark, FiExternalLink, FiMapPin, FiUsers, FiMessageSquare } from "react-icons/fi";

const CommunityProfileSidebar = ({
  name,
  profession,
  bio,
  location,
  avatarUrl,
  coverUrl,
  loading,
  error,
  onOpenProfile,
}) => (
  <aside className="min-w-0 rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
    <div className="relative overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-[#f5f5f5] p-2">
      {coverUrl ? (
        <img src={coverUrl} alt="" className="h-20 w-full rounded-[14px] object-cover lg:h-28" />
      ) : null}
      <div className="relative -mt-7 flex justify-center lg:-mt-8">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name || "Profile"} className="h-14 w-14 rounded-full border-4 border-[#f8f8f8] object-cover lg:h-16 lg:w-16" />
        ) : null}
      </div>
      <div className="pt-2 text-center">
        {loading ? (
          <p className="text-sm text-[#6b6b6b]">Loading profile…</p>
        ) : (
          <>
            <h2 className="truncate text-base font-semibold text-[#141414] lg:text-[1.1rem]">{name || "Profile unavailable"}</h2>
            {profession ? <p className="mt-1 text-xs text-[#5a5a5a] lg:text-sm">{profession}</p> : null}
            {bio ? <p className="mt-1 line-clamp-3 text-xs leading-5 text-[#5a5a5a]">{bio}</p> : null}
            {location ? (
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[#6b6b6b]">
                <FiMapPin className="h-3.5 w-3.5" /> {location}
              </p>
            ) : null}
          </>
        )}
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      </div>
    </div>

    <button
      type="button"
      onClick={onOpenProfile}
      className="mt-3 flex w-full items-center justify-between rounded-2xl border border-transparent bg-[#f2f2f2] px-3 py-3 text-left text-sm text-[#242424]"
    >
      <span className="flex items-center gap-3">
        <FiExternalLink className="h-4 w-4" />
        View profile
      </span>
    </button>

    <div className="mt-3 grid grid-cols-3 gap-2" aria-label="Profile shortcuts">
      <div className="flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#e1e5e9] bg-[#f4f4f4] px-1 text-center text-[10px] text-[#777]">
        <FiBookmark className="h-4 w-4" />
        <span>Saved items</span>
      </div>
      <div className="flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#e1e5e9] bg-[#f4f4f4] px-1 text-center text-[10px] text-[#777]">
        <FiUsers className="h-4 w-4" />
        <span>Groups</span>
      </div>
      <div className="flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#e1e5e9] bg-[#f4f4f4] px-1 text-center text-[10px] text-[#777]">
        <FiMessageSquare className="h-4 w-4" />
        <span>Newsletter</span>
      </div>
    </div>
  </aside>
);

export default CommunityProfileSidebar;

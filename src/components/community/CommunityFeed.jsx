import React from "react";
import { FiEdit3, FiImage, FiUser, FiVideo } from "react-icons/fi";

const CommunityFeed = () => (
  <section className="min-w-0 space-y-4">
    <div className="rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-3 sm:p-4">
      <div className="flex items-center gap-3 rounded-full bg-[#f2f2f2] px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4d75] via-[#7aa6bd] to-[#dfeaf0] text-white">
          <FiUser className="h-4 w-4" />
        </div>
        <div className="flex-1 text-sm text-[#7a7a7a]">Post creation unavailable</div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-1 border-t border-[#e1e5e9] pt-3 text-[10px] text-[#777] sm:gap-2 sm:text-[11px]">
        <div className="flex flex-1 items-center justify-center gap-1.5 px-1 py-1.5"><FiVideo className="h-3.5 w-3.5" /><span>Video</span></div>
        <div className="flex flex-1 items-center justify-center gap-1.5 px-1 py-1.5"><FiImage className="h-3.5 w-3.5" /><span>Photos</span></div>
        <div className="flex flex-1 items-center justify-center gap-1.5 px-1 py-1.5"><FiEdit3 className="h-3.5 w-3.5" /><span>Article</span></div>
      </div>
    </div>

    <article className="rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-5 text-center">
      <h2 className="text-sm font-semibold text-[#1d1d1d]">Community feed unavailable</h2>
      <p className="mt-2 text-xs leading-5 text-[#777]">
        The community posts API and feed actions are not available in the current application.
      </p>
    </article>
  </section>
);

export default CommunityFeed;

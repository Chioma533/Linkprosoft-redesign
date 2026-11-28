import React from "react";

const ProfileAbout = ({ bio, onEdit, highlightSection }) => (
  <section
    id="profile-bio-section"
    className={`space-y-3 rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs transition-all duration-300 ${
      highlightSection === "bio" ? "border-2 border-[#016EA6] shadow-md ring-4 ring-[#016EA6]/30" : ""
    }`}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-gray-900">About me</h3>
      <button type="button" onClick={onEdit} className="cursor-pointer text-xs font-semibold text-[#016EA6] hover:underline">
        Edit
      </button>
    </div>
    <p className="text-xs font-normal leading-relaxed text-gray-500">{bio || "No biography added yet."}</p>
  </section>
);

export default ProfileAbout;

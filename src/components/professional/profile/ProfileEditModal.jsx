import React, { useState } from "react";
import { Edit3, X } from "lucide-react";

const createForm = (profile, user) => ({
  bio: profile?.bio ?? user?.bio ?? "",
  profession: profile?.profession ?? user?.profession ?? "",
  hourlyRate: profile?.hourlyRate ?? profile?.hourly_rate ?? "",
  availabilityStatus: profile?.availabilityStatus ?? "",
  location: profile?.user?.location ?? user?.location ?? "",
});

const ProfileEditModal = ({ isOpen, profile, user, isSaving, onClose, onSave }) => {
  const [form, setForm] = useState(() => createForm(profile, user));

  if (!isOpen) return null;

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      bio: form.bio,
      profession: form.profession,
      location: form.location,
      ...(form.hourlyRate === "" ? {} : { hourlyRate: Number(form.hourlyRate) }),
      ...(form.availabilityStatus ? { availabilityStatus: form.availabilityStatus } : {}),
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-xs">
      <div role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="relative my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close edit profile" className="absolute right-6 top-6 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-6 flex items-center gap-3">
          <Edit3 className="h-6 w-6 text-[#016EA6]" />
          <div>
            <h3 id="edit-profile-title" className="text-lg font-bold text-gray-900">Edit Professional Profile</h3>
            <p className="text-xs font-medium text-gray-400">Update your public details and specialties</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-gray-700">Profession / Headline</span>
            <input value={form.profession} onChange={updateField("profession")} placeholder="e.g. Master Carpenter & Cabinet Maker" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white" />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-gray-700">Location</span>
            <input value={form.location} onChange={updateField("location")} placeholder="City, region" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white" />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-gray-700">Hourly Rate (₦ NGN)</span>
            <input type="number" min="0" value={form.hourlyRate} onChange={updateField("hourlyRate")} placeholder="e.g. 5000" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white" />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-gray-700">About Me (Biography)</span>
            <textarea rows={4} value={form.bio} onChange={updateField("bio")} placeholder="Describe your professional background, experience, and specialties..." className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white" />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-gray-700">Availability Status</span>
            <select value={form.availabilityStatus} onChange={updateField("availabilityStatus")} className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white">
              <option value="">Select availability</option>
              <option value="available">Available for Work</option>
              <option value="away">Currently Away</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="cursor-pointer rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="cursor-pointer rounded-full bg-[#016EA6] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#061EA6] disabled:opacity-50">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

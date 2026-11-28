import React, { useEffect, useState } from "react";
import { Edit3, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const createForm = (profile, user) => ({
  bio: profile?.bio ?? user?.bio ?? "",
  profession: profile?.profession ?? user?.profession ?? "",
  hourlyRate: profile?.hourlyRate ?? profile?.hourly_rate ?? "",
  availabilityStatus: profile?.availabilityStatus ?? "",
  location: profile?.user?.location ?? user?.location ?? "",
});

const ProfileEditModal = ({ isOpen, profile, user, isSaving, onClose, onSave }) => {
  const [form, setForm] = useState(() => createForm(profile, user));

  useEffect(() => {
    if (isOpen) {
      setForm(createForm(profile, user));
    }
  }, [isOpen, profile, user]);

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event?.preventDefault();
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Full Viewport Height Sliding Drawer Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ transformOrigin: "right center" }}
            className="fixed inset-y-0 right-0 z-50 h-full w-full sm:max-w-xl md:max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 md:px-8 md:py-6 border-b border-gray-100 flex items-center justify-between gap-3 sm:gap-4 bg-white shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                  <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#016EA6]" />
                </div>
                <div className="min-w-0">
                  <h3
                    id="edit-profile-title"
                    className="text-base sm:text-xl font-bold text-gray-900 leading-tight truncate sm:whitespace-normal"
                  >
                    Edit Professional Profile
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-normal mt-0.5 leading-snug truncate sm:whitespace-normal">
                    Update your public details, pricing, and availability
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close edit profile"
                className="p-1 sm:p-1.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6"
            >
              <div className="space-y-4">
                <h4 className="text-base sm:text-xl font-bold text-[#1E1B4B] tracking-tight">
                  Profile Details
                </h4>

                <label className="block space-y-1.5">
                  <span className="block text-xs font-semibold text-gray-700">
                    Profession / Headline
                  </span>
                  <div className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 border border-transparent focus-within:border-gray-200 transition-all">
                    <input
                      value={form.profession}
                      onChange={updateField("profession")}
                      placeholder="e.g. Master Carpenter & Cabinet Maker"
                      className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none font-normal"
                    />
                  </div>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1.5">
                    <span className="block text-xs font-semibold text-gray-700">
                      Location
                    </span>
                    <div className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 border border-transparent focus-within:border-gray-200 transition-all">
                      <input
                        value={form.location}
                        onChange={updateField("location")}
                        placeholder="City, region"
                        className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none font-normal"
                      />
                    </div>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="block text-xs font-semibold text-gray-700">
                      Hourly Rate (₦ NGN)
                    </span>
                    <div className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 border border-transparent focus-within:border-gray-200 transition-all">
                      <input
                        type="number"
                        min="0"
                        value={form.hourlyRate}
                        onChange={updateField("hourlyRate")}
                        placeholder="e.g. 5000"
                        className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none font-normal"
                      />
                    </div>
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="block text-xs font-semibold text-gray-700">
                    Availability Status
                  </span>
                  <div className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 border border-transparent focus-within:border-gray-200 transition-all">
                    <select
                      value={form.availabilityStatus}
                      onChange={updateField("availabilityStatus")}
                      className="w-full cursor-pointer bg-transparent text-xs sm:text-sm text-gray-800 outline-none font-normal"
                    >
                      <option value="">Select availability</option>
                      <option value="available">Available for Work</option>
                      <option value="away">Currently Away</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </label>

                <label className="block space-y-1.5">
                  <span className="block text-xs font-semibold text-gray-700">
                    About Me (Biography)
                  </span>
                  <div className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 border border-transparent focus-within:border-gray-200 transition-all">
                    <textarea
                      rows={5}
                      value={form.bio}
                      onChange={updateField("bio")}
                      placeholder="Describe your professional background, experience, and specialties..."
                      className="w-full resize-none bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none font-normal"
                    />
                  </div>
                </label>
              </div>
            </form>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 md:px-8 md:py-5 border-t border-gray-100 bg-white flex items-center gap-2.5 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-full bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 font-semibold text-xs sm:text-sm transition-all text-center cursor-pointer border border-transparent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-full bg-[#016EA6] hover:bg-[#061EA6] text-white font-semibold text-xs sm:text-sm transition-all text-center cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileEditModal;

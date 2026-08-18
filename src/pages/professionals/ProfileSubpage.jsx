import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Edit3, Briefcase, Award, Star, ShieldCheck, Check, Plus, X, Upload, ExternalLink } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { profileService } from "../../api/services/profileService";
import coverImg from "../../assets/images/IMG-20260704-WA0194.jpg";
import avatarImg from "../../assets/images/handyman.jfif";
import { toast } from "react-hot-toast";

const ProfileSubpage = () => {
  const { user } = useAuthStore();
  const userId = user?.id || user?.userId || user?.data?.id || user?.data?.userId;

  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: user?.bio || "",
    profession: user?.profession || "",
    hourlyRate: "",
    location: user?.location || "",
    availabilityStatus: "available",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfileInfo = async () => {
      try {
        const [profileRes, skillsRes, certsRes, portfolioRes, reviewsRes] = await Promise.allSettled([
          profileService.getMyProfile(),
          userId ? profileService.getUserSkills(userId) : Promise.resolve([]),
          userId ? profileService.getCertifications(userId) : Promise.resolve([]),
          userId ? profileService.getPortfolio(userId) : Promise.resolve([]),
          userId ? profileService.getReviews(userId) : Promise.resolve([]),
        ]);

        if (isMounted) {
          const profile = profileRes.status === "fulfilled" ? profileRes.value : null;
          if (profile) {
            setProfileData(profile);
            setEditForm({
              bio: profile.bio || user?.bio || "",
              profession: profile.profession || user?.profession || "",
              hourlyRate: profile.hourlyRate || profile.hourly_rate || "",
              location: user?.location || profile.location || "",
              availabilityStatus: profile.availabilityStatus || "available",
            });
          }

          if (skillsRes.status === "fulfilled" && Array.isArray(skillsRes.value)) {
            setSkills(skillsRes.value);
          }
          if (certsRes.status === "fulfilled" && Array.isArray(certsRes.value)) {
            setCertifications(certsRes.value);
          }
          if (portfolioRes.status === "fulfilled" && Array.isArray(portfolioRes.value)) {
            setPortfolio(portfolioRes.value);
          }
          if (reviewsRes.status === "fulfilled" && Array.isArray(reviewsRes.value)) {
            setReviews(reviewsRes.value);
          }
        }
      } catch (err) {
        console.warn("Failed to load profile details", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProfileInfo();
    return () => {
      isMounted = false;
    };
  }, [userId, user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateMyProfile({
        bio: editForm.bio,
        profession: editForm.profession,
        hourlyRate: editForm.hourlyRate ? Number(editForm.hourlyRate) : undefined,
        availabilityStatus: editForm.availabilityStatus,
      });
      setProfileData((prev) => ({
        ...prev,
        bio: editForm.bio,
        profession: editForm.profession,
        hourlyRate: editForm.hourlyRate,
        availabilityStatus: editForm.availabilityStatus,
      }));
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.fullName || user?.full_name || profileData?.user?.fullName || "Professional";
  const displayProfession = profileData?.profession || user?.profession || "Skilled Craftsman & Service Professional";
  const displayBio = profileData?.bio || user?.bio || "No biography provided yet. Click 'Edit Profile' to add your professional background, experience, and specialties.";
  const displayLocation = user?.location || profileData?.location || "Nigeria";
  const displayAvatar = user?.avatarUrl || profileData?.avatarUrl || avatarImg;
  const displayCover = user?.coverImageUrl || profileData?.coverImageUrl || coverImg;
  const displayRating = profileData?.avgRating || profileData?.avg_rating || 5.0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Cover Banner & Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100/50 shadow-xs overflow-hidden">
        <div className="h-48 relative overflow-hidden bg-slate-800">
          <img src={displayCover} className="w-full h-full object-cover opacity-90" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Profile Info Container */}
        <div className="px-4 md:px-8 pb-6 md:pb-8 relative">
          {/* Avatar floating */}
          <div className="absolute -top-16 left-4 md:left-8 flex items-end gap-5">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-[#016EA6] relative overflow-hidden shrink-0 shadow-md">
              <img src={displayAvatar} className="w-full h-full object-cover" alt="Avatar" />
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-[#016EA6] rounded-full border-2 border-white flex items-center justify-center" title="Verified Professional">
                <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
              </span>
            </div>
          </div>

          <div className="pt-16 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
                <span className="px-2 py-0.5 bg-blue-50 text-[#016EA6] text-[10px] font-bold rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Pro</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-semibold">
                {displayProfession}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-semibold mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#016EA6]" />
                  <span>{displayLocation}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}</span>
                </span>
                {profileData?.hourlyRate && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">
                    ₦{Number(profileData.hourlyRate).toLocaleString()} / hr
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 bg-sky-50/70 hover:bg-[#016EA6] text-[#016EA6] hover:text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* About Me card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">About me</h3>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-semibold text-[#016EA6] hover:underline cursor-pointer"
          >
            Edit
          </button>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {displayBio}
        </p>
      </div>

      {/* Layout Columns: Metrics, Skills, Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance indicators */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-500">
                100%
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-2">Job success</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 bg-sky-50 text-[#016EA6] rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-sm">
                {profileData?.totalHoursWorked ?? 0}
              </div>
              <span className="text-[10px] text-gray-800 font-bold mt-2">Hours Worked</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-sm gap-0.5">
                <Star className="w-4 h-4 fill-current" />
                <span>{displayRating}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-2">Avg Rating</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-400 flex items-center justify-center font-bold text-xs text-[#016EA6]">
                {profileData?.responseTimeHours ? `${profileData.responseTimeHours}h` : "< 2h"}
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-2">Avg Response</span>
            </div>
          </div>
        </div>

        {/* Skills and Services */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Skills and Services</h3>
          </div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={skill.id || idx}
                  className="px-3.5 py-1.5 border border-gray-100 bg-gray-50/60 hover:bg-gray-100 rounded-full text-xs font-semibold text-gray-600 transition-colors"
                >
                  {skill.name || skill.title || skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
              <p className="text-xs text-gray-400 font-medium">No skills declared yet.</p>
            </div>
          )}
        </div>

        {/* Certifications list */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Certifications</h3>
          </div>
          {certifications.length > 0 ? (
            <div className="space-y-3">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex gap-3 items-start hover:bg-gray-50/50 p-2 rounded-2xl transition-all">
                  <div className="text-[#016EA6] mt-0.5 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-snug">{cert.title}</h4>
                    <p className="text-[10px] text-gray-400 leading-tight">{cert.issuer || cert.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
              <p className="text-xs text-gray-400 font-medium">No certifications uploaded yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Gallery grid & Reviews section columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">Portfolio & Case Studies</h3>
          </div>

          {portfolio.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolio.map((port) => (
                <div
                  key={port.id}
                  className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-gray-100 flex flex-col justify-end p-4 shadow-xs"
                >
                  {port.imageUrl && (
                    <img
                      src={port.imageUrl}
                      alt={port.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
                  <div className="relative z-20 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200">
                      {port.category || "Project"}
                    </span>
                    <h4 className="text-xs font-bold mt-0.5 leading-snug">{port.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 flex flex-col items-center justify-center">
              <div className="text-[#016EA6] flex items-center justify-center mb-2">
                <Briefcase className="w-7 h-7" />
              </div>
              <h5 className="text-xs font-bold text-gray-800">Your Portfolio is Empty</h5>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Showcase your past work to attract clients and win more project bids.
              </p>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Client Reviews</h3>
          {reviews.length > 0 ? (
            <div className="space-y-4 divide-y divide-gray-50">
              {reviews.map((rev, idx) => (
                <div key={rev.id || idx} className={`${idx > 0 ? "pt-4" : ""} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-[#016EA6] text-[10px]">
                        {rev.author ? rev.author.slice(0, 2).toUpperCase() : "CL"}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-800 leading-tight">{rev.author || "Client"}</h4>
                        <span className="text-[8px] text-gray-400 leading-none">{rev.date || "Verified Client"}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(rev.stars || rev.rating || 5)].map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-normal italic">
                    "{rev.text || rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
              <Star className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-gray-800">No Reviews Yet</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Reviews from completed jobs will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#016EA6] flex items-center justify-center">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Professional Profile</h3>
                <p className="text-xs text-gray-400 font-medium">Update your public details and specialties</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Profession / Headline</label>
                <input
                  type="text"
                  value={editForm.profession}
                  onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                  placeholder="e.g. Master Carpenter & Cabinet Maker"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-medium text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hourly Rate (₦ NGN)</label>
                <input
                  type="number"
                  value={editForm.hourlyRate}
                  onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-medium text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">About Me (Biography)</label>
                <textarea
                  rows={4}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Describe your professional background, experience, and specialties..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-medium text-gray-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Availability Status</label>
                <select
                  value={editForm.availabilityStatus}
                  onChange={(e) => setEditForm({ ...editForm, availabilityStatus: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-medium text-gray-800 cursor-pointer"
                >
                  <option value="available">Available for Work</option>
                  <option value="busy">Currently Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSubpage;


import React, { useState } from "react";
import PublicProfileUrlCard from "../../components/professional/PublicProfileUrlCard";
import AddSkillModal from "../../components/professional/AddSkillModal";
import SectionSpotlightTooltip from "../../components/common/SectionSpotlightTooltip";
import ProfileHeader from "../../components/professional/profile/ProfileHeader";
import ProfileAbout from "../../components/professional/profile/ProfileAbout";
import ProfilePerformance from "../../components/professional/profile/ProfilePerformance";
import ProfileSkills from "../../components/professional/profile/ProfileSkills";
import ProfileCertifications from "../../components/professional/profile/ProfileCertifications";
import ProfilePortfolio from "../../components/professional/profile/ProfilePortfolio";
import ProfileReviews from "../../components/professional/profile/ProfileReviews";
import ProfileEditModal from "../../components/professional/profile/ProfileEditModal";
import ProfilePortfolioModal from "../../components/professional/profile/ProfilePortfolioModal";
import ProfileCertificationModal from "../../components/professional/profile/ProfileCertificationModal";
import { useProfessionalProfile } from "../../hooks/useProfessionalProfile";
import { useDashboardStore } from "../../store/dashboardStore";

const ProfileSubpage = () => {
  const profile = useProfessionalProfile();
  const highlightSection = useDashboardStore((state) => state.highlightSection);
  const setHighlightSection = useDashboardStore((state) => state.setHighlightSection);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [isAvatarActionsOpen, setIsAvatarActionsOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const name =
    profile.profileData?.user?.fullName ||
    profile.profileData?.fullName ||
    profile.user?.fullName ||
    profile.user?.full_name ||
    "";
  const profession = profile.profileData?.profession || profile.user?.profession || "";
  const bio = profile.profileData?.bio ?? profile.user?.bio ?? "";
  const location =
    profile.user?.location ||
    profile.profileData?.user?.location ||
    profile.profileData?.location ||
    "";
  const avatarUrl =
    profile.user?.avatar ||
    profile.user?.avatarUrl ||
    profile.profileData?.avatarUrl ||
    "";
  const coverUrl = profile.profileData?.coverImageUrl || profile.user?.coverImageUrl || "";

  const openEditModal = () => setIsEditModalOpen(true);
  const handleSaveProfile = async (payload) => {
    setIsSavingProfile(true);
    try {
      if (await profile.saveProfile(payload)) setIsEditModalOpen(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSpotlightAction = () => {
    if (highlightSection === "avatar") setIsAvatarActionsOpen(true);
    else if (highlightSection === "bio" || highlightSection === "location") openEditModal();
    else if (highlightSection === "skills") setIsAddSkillModalOpen(true);
    else if (highlightSection === "portfolio") setIsPortfolioModalOpen(true);
  };

  if (profile.isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-gray-100/50 bg-white text-sm text-gray-500">
        Loading your profile…
      </div>
    );
  }

  const loadErrors = Object.values(profile.loadErrors);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {loadErrors.length ? (
        <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Some profile information could not be loaded: {loadErrors.join("; ")}
        </div>
      ) : null}

      <ProfileHeader
        user={profile.user}
        profile={profile.profileData}
        name={name}
        profession={profession}
        location={location}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        isAvatarActionsOpen={isAvatarActionsOpen}
        onToggleAvatarActions={() => setIsAvatarActionsOpen((open) => !open)}
        onAvatarUploaded={profile.updateAvatar}
        onCoverUploaded={profile.updateCover}
        onEdit={openEditModal}
        highlightSection={highlightSection}
      />

      <PublicProfileUrlCard
        profile={profile.profileData}
        onSaved={(savedProfile) => profile.setProfileData((current) => ({ ...(current || {}), ...savedProfile }))}
      />

      <ProfileAbout bio={bio} onEdit={openEditModal} highlightSection={highlightSection} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ProfilePerformance profile={profile.profileData} />
        <ProfileSkills
          skills={profile.skills}
          isDeletingSkillId={profile.isDeletingSkillId}
          onAdd={() => setIsAddSkillModalOpen(true)}
          onDelete={profile.deleteSkill}
          highlightSection={highlightSection}
        />
        <ProfileCertifications
          certifications={profile.certifications}
          onAdd={() => setIsCertificationModalOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ProfilePortfolio
          portfolio={profile.portfolio}
          onAdd={() => setIsPortfolioModalOpen(true)}
          onDelete={profile.deletePortfolioItem}
          highlightSection={highlightSection}
        />
        <ProfileReviews reviews={profile.reviews} />
      </div>

      {isEditModalOpen ? (
        <ProfileEditModal
          isOpen
          profile={profile.profileData}
          user={profile.user}
          isSaving={isSavingProfile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      ) : null}
      <AddSkillModal
        isOpen={isAddSkillModalOpen}
        onClose={() => setIsAddSkillModalOpen(false)}
        existingSkills={profile.skills}
        onSkillAdded={profile.addSkill}
      />
      <ProfilePortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onCreate={profile.addPortfolioItem}
      />
      <ProfileCertificationModal
        isOpen={isCertificationModalOpen}
        onClose={() => setIsCertificationModalOpen(false)}
        onCreate={profile.addCertification}
      />

      {highlightSection ? (
        <SectionSpotlightTooltip
          sectionKey={highlightSection}
          targetSelector={`#profile-${highlightSection}-section`}
          onAction={handleSpotlightAction}
          onDismiss={() => setHighlightSection(null)}
        />
      ) : null}
    </div>
  );
};

export default ProfileSubpage;

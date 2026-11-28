import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { authService } from "../api/services/authService";
import { profileService } from "../api/services/profileService";
import mediaService from "../api/services/mediaService";
import { useAuthStore } from "../store/authStore";

const getItemId = (item) => item?.skillId || item?.id || item?.skill?.id;

const hydrateProfile = async (profile) => {
  if (!profile) return profile;

  const hydrated = { ...profile };
  if (profile.avatarMediaId) {
    try {
      hydrated.avatarUrl = await mediaService.getUrl(profile.avatarMediaId);
    } catch {
      hydrated.avatarUrl = profile.avatarUrl || null;
    }
  }
  if (profile.coverMediaId) {
    try {
      hydrated.coverImageUrl = await mediaService.getUrl(profile.coverMediaId);
    } catch {
      hydrated.coverImageUrl = profile.coverImageUrl || null;
    }
  }
  return hydrated;
};

const hydratePortfolio = async (items) =>
  Promise.all(
    items.map(async (item) => {
      if (!item.coverMediaId) return item;
      try {
        return { ...item, imageUrl: await mediaService.getUrl(item.coverMediaId) };
      } catch {
        return item;
      }
    }),
  );

const errorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const useProfessionalProfile = () => {
  const { user, updateUser, setUserAvatar } = useAuthStore();
  const userId = user?.id || user?.userId || user?.data?.id || user?.data?.userId;
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState({});
  const [isDeletingSkillId, setIsDeletingSkillId] = useState(null);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsLoading(false);
      setProfileData(null);
      setSkills([]);
      setCertifications([]);
      setPortfolio([]);
      setReviews([]);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    setLoadErrors({});

    const loadProfile = async () => {
      const results = await Promise.allSettled([
        profileService.getMyProfile(),
        profileService.getUserSkills(userId),
        profileService.getCertifications(userId),
        profileService.getPortfolio(userId),
      ]);
      if (!active) return;

      const errors = {};
      const [profileResult, skillsResult, certificationsResult, portfolioResult] = results;
      if (profileResult.status === "rejected") errors.profile = errorMessage(profileResult.reason, "Unable to load profile");
      if (skillsResult.status === "rejected") errors.skills = errorMessage(skillsResult.reason, "Unable to load skills");
      if (certificationsResult.status === "rejected") errors.certifications = errorMessage(certificationsResult.reason, "Unable to load certifications");
      if (portfolioResult.status === "rejected") errors.portfolio = errorMessage(portfolioResult.reason, "Unable to load portfolio");

      const resolvedProfile = profileResult.status === "fulfilled" ? profileResult.value : null;
      let reviews = [];
      if (resolvedProfile?.id !== null && resolvedProfile?.id !== undefined) {
        const [reviewsResult] = await Promise.allSettled([profileService.getReviews(resolvedProfile.id)]);
        if (reviewsResult.status === "fulfilled" && Array.isArray(reviewsResult.value)) {
          reviews = reviewsResult.value;
        } else if (reviewsResult.status === "rejected") {
          errors.reviews = errorMessage(reviewsResult.reason, "Unable to load reviews");
        }
      } else if (profileResult.status === "rejected") {
        errors.reviews = "Reviews could not be loaded without the professional profile.";
      }

      const portfolioItems =
        portfolioResult.status === "fulfilled" && Array.isArray(portfolioResult.value)
          ? portfolioResult.value
          : [];
      const [hydratedProfile, hydratedItems] = await Promise.all([
        hydrateProfile(resolvedProfile),
        hydratePortfolio(portfolioItems),
      ]);
      if (!active) return;

      setProfileData(hydratedProfile);
      setSkills(skillsResult.status === "fulfilled" && Array.isArray(skillsResult.value) ? skillsResult.value : []);
      setCertifications(
        certificationsResult.status === "fulfilled" && Array.isArray(certificationsResult.value)
          ? certificationsResult.value
          : [],
      );
      setPortfolio(hydratedItems);
      setReviews(reviews);
      setLoadErrors(errors);
      setIsLoading(false);
    };

    loadProfile().catch((error) => {
      if (!active) return;
      setLoadErrors((current) => ({ ...current, profile: errorMessage(error, "Unable to load profile") }));
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  const saveProfile = useCallback(async (payload) => {
    const { location, ...profilePayload } = payload;
    try {
      const saved = profileData
        ? await profileService.updateMyProfile(profilePayload)
        : await profileService.createMyProfile(profilePayload);
      setProfileData((current) => ({ ...(current || {}), ...(saved || {}), ...profilePayload }));

      if (location !== undefined && location !== (user?.location || "")) {
        try {
          const updatedUser = await authService.updateMe({ location });
          updateUser({ ...(updatedUser || {}), location: updatedUser?.location ?? location });
        } catch (error) {
          toast.error(`Profile saved, but location could not be updated: ${errorMessage(error, "Please try again")}`);
          return false;
        }
      }

      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Failed to update profile"));
      return false;
    }
  }, [profileData, updateUser, user]);

  const updateAvatar = useCallback(async ({ mediaId }) => {
    try {
      await profileService.setAvatar(mediaId);
      const avatarUrl = await mediaService.getUrl(mediaId);
      setUserAvatar({ avatar: avatarUrl, avatarMediaId: mediaId });
      setProfileData((current) => ({ ...(current || {}), avatarMediaId: mediaId, avatarUrl }));
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update profile photo"));
      throw error;
    }
  }, [setUserAvatar]);

  const updateCover = useCallback(async ({ mediaId }) => {
    try {
      await profileService.setCover(mediaId);
      const coverImageUrl = await mediaService.getUrl(mediaId);
      setProfileData((current) => ({ ...(current || {}), coverMediaId: mediaId, coverImageUrl }));
      toast.success("Cover image updated");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update cover image"));
      throw error;
    }
  }, []);

  const addSkill = useCallback((newSkill) => {
    setSkills((current) => {
      const newId = getItemId(newSkill);
      const newName = (newSkill?.name || newSkill?.skill?.name || newSkill?.title || "").trim().toLowerCase();
      const match = current.findIndex((skill) => {
        const sameId = newId && getItemId(skill) === newId;
        const skillName = (skill?.name || skill?.skill?.name || skill?.title || "").trim().toLowerCase();
        return sameId || (newName && skillName === newName);
      });
      if (match < 0) return [...current, newSkill];
      return current.map((skill, index) => (index === match ? { ...skill, ...newSkill } : skill));
    });
  }, []);

  const deleteSkill = useCallback(async (skillItem) => {
    const skillId = getItemId(skillItem);
    if (!skillId || isDeletingSkillId) return;
    const skillName = skillItem.name || skillItem.skill?.name || "Skill";
    setIsDeletingSkillId(skillId);
    try {
      await profileService.deleteMySkill(skillId);
      setSkills((current) => current.filter((skill) => getItemId(skill) !== skillId));
      toast.success(`${skillName} removed`);
    } catch (error) {
      toast.error(errorMessage(error, `Failed to remove ${skillName}`));
    } finally {
      setIsDeletingSkillId(null);
    }
  }, [isDeletingSkillId]);

  const addCertification = useCallback(async (payload) => {
    try {
      const item = await profileService.addCertification(payload);
      setCertifications((current) => [item, ...current]);
      toast.success("Certification added");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Could not add certification"));
      return false;
    }
  }, []);

  const addPortfolioItem = useCallback(async (payload) => {
    try {
      const item = await profileService.addPortfolioItem(payload);
      let hydratedItem = item;
      if (payload.coverMediaId) {
        try {
          hydratedItem = { ...item, imageUrl: await mediaService.getUrl(payload.coverMediaId) };
        } catch {
          hydratedItem = item;
        }
      }
      setPortfolio((current) => [hydratedItem, ...current]);
      toast.success("Portfolio item added");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Could not add portfolio item"));
      return false;
    }
  }, []);

  const deletePortfolioItem = useCallback(async (portfolioItemId) => {
    if (!window.confirm("Are you sure you want to delete this portfolio project?")) return;
    try {
      await profileService.deletePortfolioItem(portfolioItemId);
      setPortfolio((current) => current.filter((item) => item.id !== portfolioItemId));
      toast.success("Portfolio project removed");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete portfolio project"));
    }
  }, []);

  return {
    user,
    userId,
    profileData,
    setProfileData,
    skills,
    certifications,
    portfolio,
    reviews,
    isLoading,
    loadErrors,
    isDeletingSkillId,
    saveProfile,
    updateAvatar,
    updateCover,
    addSkill,
    deleteSkill,
    addCertification,
    addPortfolioItem,
    deletePortfolioItem,
  };
};

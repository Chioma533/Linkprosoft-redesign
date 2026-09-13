import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { profileService } from "../../api/services/profileService";
import { projectService } from "../../api/services/projectService";

const useProfessionalJobs = () => {
  const { user } = useAuthStore();

  const userId = user?.id || user?.userId || user?.data?.id;

  const [proProfile, setProProfile] = useState(null);
  const [proSkills, setProSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedSkillName, setSelectedSkillName] = useState("");

  const [rawJobs, setRawJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchMatchedJobs = useCallback(async (skillId) => {
    if (!skillId) {
      setRawJobs([]);
      setIsLoadingJobs(false);
      return;
    }

    setIsLoadingJobs(true);

    try {
      const jobs = await projectService.getJobs({
        skillId,
        limit: 50,
      });

      setRawJobs(Array.isArray(jobs) ? jobs : []);
    } catch (err) {
      console.error("Failed to fetch matched jobs:", err);
      setRawJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  const loadProfileAndSkills = useCallback(async () => {
    try {
      const [profile, skills] = await Promise.all([
        profileService.getMyProfile(),
        userId
          ? profileService.getUserSkills(userId)
          : Promise.resolve([]),
      ]);

      if (profile) {
        setProProfile(profile);
      }

      const skillList =
        Array.isArray(skills) && skills.length > 0
          ? skills
          : Array.isArray(profile?.skills) && profile.skills.length > 0
            ? profile.skills
            : Array.isArray(user?.skills) && user.skills.length > 0
              ? user.skills
              : [];

      setProSkills(skillList);

      const primarySkill =
        skillList.find((skill) => skill.isPrimary) || skillList[0];

      const skillId =
        primarySkill?.skillId ||
        primarySkill?.id ||
        profile?.skillId ||
        user?.skillId ||
        "";

      const skillName =
        primarySkill?.name ||
        primarySkill?.skill?.name ||
        profile?.profession ||
        "";

      setSelectedSkillId(skillId);
      setSelectedSkillName(skillName);

      if (skillId) {
        await fetchMatchedJobs(skillId);
      } else {
        setRawJobs([]);
        setIsLoadingJobs(false);
      }
    } catch (err) {
      console.warn(
        "Failed to load professional profile/skills:",
        err
      );

      setRawJobs([]);
      setIsLoadingJobs(false);
    } finally {
      setIsInitialLoading(false);
    }
  }, [userId, user, fetchMatchedJobs]);

  useEffect(() => {
    loadProfileAndSkills();
  }, [loadProfileAndSkills]);

  const handleSkillChange = useCallback(
    (skillId, skillName) => {
      setSelectedSkillId(skillId);
      setSelectedSkillName(skillName);
      fetchMatchedJobs(skillId);
    },
    [fetchMatchedJobs]
  );

  return {
    user,
    proProfile,
    proSkills,
    selectedSkillId,
    selectedSkillName,
    rawJobs,
    isLoadingJobs,
    isInitialLoading,
    fetchMatchedJobs,
    handleSkillChange,
  };
};

export default useProfessionalJobs;
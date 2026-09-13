import { calculateJobMatchScore, isSkillMatched } from "../matchingEngine";

const getJobSkillId = (job) => {
  return job.skillId || job.skill_id || job.skill?.id || job.skill?.skillId;
};

const getDaysAgo = (createdAt) => {
  if (!createdAt) return 0;

  const createdDate = new Date(createdAt);

  if (isNaN(createdDate.getTime())) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
};

export const normalizeProfessionalJobs = ({
  jobs = [],
  selectedSkillId,
  selectedSkillName,
  proSkills = [],
  proProfile,
  user,
}) => {
  if (!selectedSkillId) {
    return [];
  }

  const proDataForMatching = {
    ...(proProfile || {}),
    user: proProfile?.user || user || {},
    skills: proSkills.length > 0 ? proSkills : proProfile?.skills || [],
  };

  return jobs
    .filter((job) => {
      const jobSkillId = getJobSkillId(job);

      if (jobSkillId) {
        return (
          String(jobSkillId).toLowerCase() ===
          String(selectedSkillId).toLowerCase()
        );
      }

      return isSkillMatched(job, proSkills);
    })
    .map((job, index) => {
      const matchResult = calculateJobMatchScore(job, proDataForMatching);

      const isDirectSkill = isSkillMatched(job, proSkills);

      return {
        ...job,

        id: job.id || index + 1,

        title: job.title || "Job Posting",

        employerName:
          job.client?.fullName ||
          job.client ||
          job.employerName ||
          job.employer?.fullName ||
          job.employer?.name ||
          "Verified Buyer",

        employerAvatarUrl:
          job.employerAvatarUrl ||
          job.avatarUrl ||
          job.employer?.avatarUrl ||
          job.client?.avatarUrl ||
          "/professional_avatar.png",

        description: job.description || "No job description provided.",

        budget: Number(job.budget || job.budgetMax || 0),

        location: job.location || "Remote",

        category:
          job.category?.name ||
          job.category ||
          job.skill?.name ||
          selectedSkillName ||
          "General",

        datePostedDays: getDaysAgo(job.createdAt),

        createdAt: job.createdAt,
        postedAt: job.postedAt,

        matchScore: matchResult.totalScore,
        matchTier: matchResult.matchTier,

        isDirectSkillMatch: isDirectSkill || matchResult.isDirectSkillMatch,

        rating: job.rating || "5.0",
        spent: job.spent || "$5K",

        delivery: job.durationDays
          ? `${job.durationDays} days delivery`
          : "3 days delivery",
      };
    });
};

export default normalizeProfessionalJobs;

/**
 * Professional-Job Matching Engine
 * Compares job posting requirements with professional profile attributes.
 *
 * Scoring Priorities:
 * 1. Required skill compatibility: 40%
 * 2. Skill proficiency or experience: 20%
 * 3. Professional rating & review count: 15%
 * 4. Availability status: 10%
 * 5. Location compatibility: 5%
 * 6. Response time performance: 5%
 * 7. Budget / hourly rate fit: 5%
 */

/**
 * Check if a professional has a matching skill for a job.
 * @param {Object} job
 * @param {Array} professionalSkills
 * @returns {boolean}
 */
export function isSkillMatched(job, professionalSkills = []) {
  if (!job) return false;
  const jobSkillId = job.skillId || job.skill_id || (job.skill && (job.skill.id || job.skill.skillId));
  if (!jobSkillId) return false;

  return professionalSkills.some((skill) => {
    const sId = skill.id || skill.skillId || skill.skill_id || (skill.skill && (skill.skill.id || skill.skill.skillId));
    return String(sId).toLowerCase() === String(jobSkillId).toLowerCase();
  });
}

/**
 * Calculate the comprehensive match score (0 - 100) between a job and a professional.
 * @param {Object} job - Job posting data
 * @param {Object} pro - Professional profile data
 * @returns {Object} Match breakdown and total score
 */
export function calculateJobMatchScore(job, pro) {
  if (!job || !pro) {
    return {
      skillScore: 0,
      proficiencyScore: 0,
      ratingScore: 0,
      availabilityScore: 0,
      locationScore: 0,
      performanceScore: 0,
      budgetFitScore: 0,
      totalScore: 0,
      matchTier: "Low Compatibility",
      isDirectSkillMatch: false,
    };
  }

  const proSkills = Array.isArray(pro.skills) ? pro.skills : [];
  const jobSkillId = job.skillId || job.skill_id || (job.skill && (job.skill.id || job.skill.skillId));

  // --- 1. Skill Compatibility (40%) ---
  let skillCompatRatio = 0.0;
  const isDirectSkillMatch = jobSkillId
    ? proSkills.some((s) => {
        const sId = s.id || s.skillId || s.skill_id || (s.skill && (s.skill.id || s.skill.skillId));
        return String(sId).toLowerCase() === String(jobSkillId).toLowerCase();
      })
    : false;

  if (isDirectSkillMatch) {
    skillCompatRatio = 1.0;
  } else if (!jobSkillId) {
    // Fallback only when job has no explicit skillId
    const jobText = `${job.title || ""} ${job.description || ""} ${job.category || ""}`.toLowerCase();
    const matchesSkillName = proSkills.some((s) => {
      const name = (s.name || s.title || s.skill?.name || "").toLowerCase();
      return name.length > 2 && jobText.includes(name);
    });
    const proProfession = (pro.profession || "").toLowerCase();
    const matchesProfession = proProfession.length > 2 && jobText.includes(proProfession);

    if (matchesSkillName && matchesProfession) {
      skillCompatRatio = 0.85;
    } else if (matchesSkillName || matchesProfession) {
      skillCompatRatio = 0.65;
    } else {
      skillCompatRatio = 0.0;
    }
  } else {
    // Explicit skillId on job, but professional does NOT have this skill
    skillCompatRatio = 0.0;
  }
  const skillScore = Math.round(skillCompatRatio * 40 * 10) / 10;

  // --- 2. Skill Proficiency & Experience (20%) ---
  let profRatio = 0.0;
  if (isDirectSkillMatch) {
    const matchedSkill = proSkills.find((s) => {
      const sId = s.id || s.skillId || s.skill_id || (s.skill && (s.skill.id || s.skill.skillId));
      return String(sId).toLowerCase() === String(jobSkillId).toLowerCase();
    });

    let levelScore = 0.75;
    const lvl = (matchedSkill?.proficiencyLevel || "").toLowerCase();
    if (lvl === "expert") levelScore = 1.0;
    else if (lvl === "intermediate") levelScore = 0.75;
    else if (lvl === "beginner") levelScore = 0.5;

    const expScore = Math.min((matchedSkill?.yearsOfExperience ?? 3) / 5, 1.0);
    profRatio = levelScore * 0.6 + expScore * 0.4;
    if (matchedSkill?.isPrimary) profRatio = Math.min(profRatio * 1.1, 1.0);
  } else if (!jobSkillId && (pro.totalHoursWorked ?? 0) > 0) {
    profRatio = Math.min(0.3 + (pro.totalHoursWorked / 200) * 0.4, 0.7);
  }
  const proficiencyScore = Math.round(profRatio * 20 * 10) / 10;

  // --- 3. Professional Rating & Review Count (15%) ---
  const R = Number(pro.avgRating ?? pro.avg_rating ?? pro.rating ?? 4.0);
  const v = Number(pro.totalReviews ?? pro.total_reviews ?? pro.reviewCount ?? 0);
  const m = 3; // prior review weight
  const C = 4.0; // prior neutral rating
  const bayesianRating = (v * R + m * C) / (v + m);
  const ratingRatio = Math.min(Math.max(bayesianRating / 5.0, 0), 1.0);
  const ratingScore = Math.round(ratingRatio * 15 * 10) / 10;

  // --- 4. Availability Status (10%) ---
  let availRatio = 1.0;
  const status = (pro.availabilityStatus || pro.availability_status || "available").toLowerCase();
  if (status === "available") availRatio = 1.0;
  else if (status === "away") availRatio = 0.5;
  else if (status === "unavailable") availRatio = 0.1;
  const availabilityScore = Math.round(availRatio * 10 * 10) / 10;

  // --- 5. Location Compatibility (5%) ---
  let locRatio = 0.5;
  const jobLoc = (job.location || "").toLowerCase().trim();
  const proLoc = (pro.user?.location || pro.location || "").toLowerCase().trim();

  if (!jobLoc || jobLoc.includes("remote")) {
    locRatio = 1.0;
  } else if (proLoc && jobLoc) {
    if (jobLoc === proLoc) {
      locRatio = 1.0;
    } else {
      const jobTokens = jobLoc.split(/[\s,]+/);
      const proTokens = proLoc.split(/[\s,]+/);
      const hasOverlap = jobTokens.some((t) => t.length > 2 && proTokens.includes(t));
      locRatio = hasOverlap ? 0.8 : 0.2;
    }
  }
  const locationScore = Math.round(locRatio * 5 * 10) / 10;

  // --- 6. Response Performance (5%) ---
  const responseHours = Number(pro.responseTimeHours ?? pro.response_time_hours ?? 12);
  const perfRatio = Math.max(0, 1 - responseHours / 48);
  const performanceScore = Math.round(perfRatio * 5 * 10) / 10;

  // --- 7. Budget / Hourly Rate Fit (5%) ---
  let budgetRatio = 1.0;
  const jobBudget = Number(job.budget || 0);
  const proHourlyRate = Number(pro.hourlyRate || pro.hourly_rate || pro.rate || 0);

  if (jobBudget > 0 && proHourlyRate > 0) {
    const estimatedHours = Math.min(Math.max((job.durationDays || 3) * 4, 8), 40);
    const estimatedCost = proHourlyRate * estimatedHours;
    if (estimatedCost <= jobBudget * 1.15) {
      budgetRatio = 1.0;
    } else {
      budgetRatio = Math.max(0.2, 1.0 - (estimatedCost - jobBudget) / jobBudget);
    }
  }
  const budgetFitScore = Math.round(budgetRatio * 5 * 10) / 10;

  // Total Score (0 - 100)
  const totalScore = Math.round(
    skillScore +
      proficiencyScore +
      ratingScore +
      availabilityScore +
      locationScore +
      performanceScore +
      budgetFitScore
  );

  let matchTier = "Low Compatibility";
  if (totalScore >= 80) matchTier = "Strong Match";
  else if (totalScore >= 60) matchTier = "Good Match";
  else if (totalScore >= 40) matchTier = "Fair Match";

  return {
    skillScore,
    proficiencyScore,
    ratingScore,
    availabilityScore,
    locationScore,
    performanceScore,
    budgetFitScore,
    totalScore,
    matchTier,
    isDirectSkillMatch,
  };
}

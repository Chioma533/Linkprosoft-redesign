/**
 * Verification configuration and configurable thresholds.
 * Avoids hardcoding arbitrary values and allows admin-configurable verification rules.
 */

export const DEFAULT_VERIFICATION_CONFIG = {
  // Rating-based verification pathway thresholds
  ratingPathway: {
    minAverageRating: 4.5,
    minCompletedJobs: 10,
    minGenuineReviews: 5,
    requireAdminApproval: true,
    fraudProtectionEnabled: true,
  },
  // Subscription maintenance settings
  subscriptionMaintenance: {
    enforceSubscriptionForProfessionals: true,
    enforceSubscriptionForCompanies: true,
    enforceSubscriptionForGovernment: false, // Government validation is institutional only
    gracePeriodDays: 7,
  },
};

/**
 * Evaluates whether a professional meets the rating-based verification criteria.
 * @param {Object} metrics - User rating and job metrics
 * @param {Object} config - Configurable threshold overrides
 * @returns {Object} { isEligible, unmetCriteria, score }
 */
export const evaluateRatingEligibility = (metrics = {}, config = DEFAULT_VERIFICATION_CONFIG.ratingPathway) => {
  const {
    averageRating = 0,
    rating = 0,
    completedJobsCount = 0,
    completed_jobs = 0,
    completedJobs = 0,
    totalReviews = 0,
    reviewCount = 0,
    hasFraudFlag = false,
  } = metrics;

  const currentRating = Number(averageRating || rating || 0);
  const currentJobs = Number(completedJobsCount || completed_jobs || completedJobs || 0);
  const currentReviews = Number(totalReviews || reviewCount || 0);

  const unmetCriteria = [];

  if (currentRating < config.minAverageRating) {
    unmetCriteria.push(`Minimum rating of ${config.minAverageRating} required (current: ${currentRating.toFixed(1)})`);
  }

  if (currentJobs < config.minCompletedJobs) {
    unmetCriteria.push(`Minimum ${config.minCompletedJobs} completed jobs required (current: ${currentJobs})`);
  }

  if (currentReviews < config.minGenuineReviews) {
    unmetCriteria.push(`Minimum ${config.minGenuineReviews} genuine client reviews required (current: ${currentReviews})`);
  }

  if (config.fraudProtectionEnabled && hasFraudFlag) {
    unmetCriteria.push("Account has unresolved fraud or review-tampering flags");
  }

  return {
    isEligible: unmetCriteria.length === 0,
    unmetCriteria,
    metrics: {
      rating: currentRating,
      completedJobs: currentJobs,
      reviews: currentReviews,
    },
    thresholds: config,
  };
};

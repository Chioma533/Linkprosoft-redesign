/**
 * Calculate user profile completion percentage and determine missing fields.
 *
 * @param {Object} params
 * @param {Object} [params.user] - User object from authStore
 * @param {Object} [params.profileData] - Profile object from profileService
 * @param {Array} [params.skills] - Skills list
 * @param {Array} [params.portfolio] - Portfolio items list
 * @returns {{ percentage: number, missingItems: Array<{ id: string, label: string }>, isComplete: boolean }}
 */
export const calculateProfileCompletion = ({
  user = {},
  profileData = {},
  skills = [],
  portfolio = [],
} = {}) => {
  const criteria = [
    {
      id: "avatar",
      label: "Upload a profile photo",
      weight: 20,
      completed: Boolean(
        user?.avatarUrl ||
        user?.avatar ||
        profileData?.avatarUrl ||
        profileData?.avatar
      ),
    },
    {
      id: "bio",
      label: "Add a professional bio",
      weight: 20,
      completed: Boolean(
        (user?.bio && user.bio.trim().length >= 15) ||
        (profileData?.bio && profileData.bio.trim().length >= 15)
      ),
    },
    {
      id: "skills",
      label: "Register at least one skill",
      weight: 20,
      completed: Array.isArray(skills) && skills.length > 0,
    },
    {
      id: "location",
      label: "Specify your service location",
      weight: 20,
      completed: Boolean(
        user?.location ||
        profileData?.location ||
        profileData?.city ||
        profileData?.state
      ),
    },
    {
      id: "portfolio",
      label: "Add a project to your portfolio",
      weight: 20,
      completed: Array.isArray(portfolio) && portfolio.length > 0,
    },
  ];

  let percentage = 0;
  const missingItems = [];

  for (const item of criteria) {
    if (item.completed) {
      percentage += item.weight;
    } else {
      missingItems.push({ id: item.id, label: item.label });
    }
  }

  return {
    percentage: Math.min(100, Math.max(0, percentage)),
    missingItems,
    isComplete: percentage >= 100,
  };
};

export default calculateProfileCompletion;

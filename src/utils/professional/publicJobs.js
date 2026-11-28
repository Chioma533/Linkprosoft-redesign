const budgetRanges = {
  "Under ₦5,000": { minBudget: 0, maxBudget: 4999.99 },
  "₦5,000 – ₦20,000": { minBudget: 5000, maxBudget: 20000 },
  "₦20,000 – ₦50,000": { minBudget: 20000, maxBudget: 50000 },
  "₦50,000+": { minBudget: 50000 },
};

const postedWithinDays = {
  Today: 1,
  "This week": 7,
  "This month": 30,
  "Last 3 months": 90,
};

export const buildPublicJobsParams = (filters, page, limit) => {
  const params = {
    page,
    limit,
    sortBy: "newest",
  };
  const search = filters.searchQuery?.trim();
  const location =
    filters.location && filters.location !== "All Locations"
      ? filters.location
      : "";
  const budget = filters.budget;

  if (search) params.search = search;
  if (location) params.location = location;
  if (budgetRanges[budget]) Object.assign(params, budgetRanges[budget]);
  if (postedWithinDays[filters.datePosted]) {
    params.postedWithinDays = postedWithinDays[filters.datePosted];
  }

  return params;
};

const normalizeJob = (job) => {
  if (!job || typeof job !== "object" || !job.id) {
    throw new Error("The jobs response contains an invalid job.");
  }

  const budget = Number(job.budget ?? job.budgetMax ?? 0);

  return {
    ...job,
    id: job.id,
    title: job.title || "Job Posting",
    employerName:
      job.employerName ||
      job.client?.fullName ||
      job.client ||
      job.employer?.fullName ||
      job.employer?.name ||
      "Client",
    employerAvatarUrl:
      job.employerAvatarUrl ||
      job.avatarUrl ||
      job.employer?.avatarUrl ||
      job.client?.avatarUrl ||
      "/professional_avatar.png",
    description: job.description || "No job description provided.",
    budget: Number.isFinite(budget) ? budget : 0,
    location: job.location || "Remote",
    category: job.category?.name || job.category || job.skill?.name || "General",
    createdAt: job.createdAt || job.created_at,
  };
};

export const normalizePublicJobsResponse = (response, requestedPage, limit) => {
  const payload = response?.data ?? response;
  const data = payload?.data ?? payload;
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.jobs)
        ? data.jobs
        : null;

  if (!items) {
    throw new Error("The jobs service returned an unexpected response.");
  }

  const pagination = data?.pagination || payload?.pagination || {};
  const total = Number(pagination.total ?? pagination.totalItems ?? items.length);
  const pages = Number(
    pagination.pages ??
      pagination.totalPages ??
      Math.ceil((Number.isFinite(total) ? total : items.length) / limit),
  );

  return {
    jobs: items.map(normalizeJob),
    total: Number.isFinite(total) ? total : items.length,
    page: Number(pagination.page) || requestedPage,
    pages: Number.isFinite(pages) ? pages : requestedPage,
  };
};

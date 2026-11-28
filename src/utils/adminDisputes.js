export const formatDisputeNumber = (value) => {
  if (value === undefined || value === null) return null;
  return typeof value === "number" ? value.toLocaleString() : value;
};

export const formatDisputeCurrency = (value) => {
  if (value === undefined || value === null) return null;
  return typeof value === "number" ? `₦${value.toLocaleString()}` : value;
};

export const formatDisputeTrend = (trend) => {
  if (trend === undefined || trend === null) return "";
  if (typeof trend === "number") {
    return `${trend >= 0 ? "+" : ""}${trend}% this week`;
  }
  return trend;
};

export const normalizeDispute = (dispute) => {
  const rawStatus = String(dispute.status || "open").toLowerCase();
  const rawAmount = dispute.amount || dispute.disputedAmount || 0;
  const disputeId = dispute.id || dispute._id;
  const statusText =
    rawStatus === "resolved"
      ? "Resolved"
      : rawStatus === "review" || rawStatus === "under_review"
        ? "Under Review"
        : "Open";

  return {
    id: disputeId
      ? String(disputeId).startsWith("#")
        ? String(disputeId)
        : `#${disputeId}`
      : `#DSP-${Math.floor(Math.random() * 10000)}`,
    rawId: disputeId || "DSP-1024",
    jobId: dispute.jobId || dispute.job?.id || "JOB-703",
    jobTitle: dispute.jobTitle || dispute.job?.title || "Kitchen Plumbing",
    raisedBy:
      dispute.raisedBy?.name ||
      (typeof dispute.raisedBy === "string" ? dispute.raisedBy : "Samuel O"),
    against:
      dispute.against?.name ||
      (typeof dispute.against === "string" ? dispute.against : "Elvis C"),
    employer:
      dispute.employer?.name ||
      (typeof dispute.employer === "string" ? dispute.employer : "Samuel O"),
    professional:
      dispute.professional?.name ||
      (typeof dispute.professional === "string"
        ? dispute.professional
        : "Elvis C"),
    amount:
      typeof rawAmount === "number"
        ? `₦${rawAmount.toLocaleString()}`
        : rawAmount,
    numericAmount: typeof rawAmount === "number" ? rawAmount : 0,
    reason: dispute.reason || "Poor Workmanship",
    status: rawStatus === "under_review" ? "review" : rawStatus,
    statusText,
    date: dispute.createdAt
      ? new Date(dispute.createdAt)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toLowerCase()
      : "",
  };
};

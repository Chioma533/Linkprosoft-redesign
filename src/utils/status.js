const JOB_STATUS_STYLES = {
  Active: "bg-sky-50 text-sky-500",
  Pending: "bg-orange-50 text-orange-500",
  Completed: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-500",
};

const PAYMENT_STATUS_STYLES = {
  Successful: "bg-emerald-50 text-emerald-600",
  Pending: "bg-orange-50 text-orange-500",
  Failed: "bg-red-50 text-red-500",
  Refunded: "bg-indigo-50 text-indigo-600",
};

const DEFAULT_STYLE = "bg-gray-50 text-gray-500";

export const getStatusStyle = (type, status) => {
  const styles = {
    job: JOB_STATUS_STYLES,
    payment: PAYMENT_STATUS_STYLES,
  };

  return styles[type]?.[status] || DEFAULT_STYLE;
};

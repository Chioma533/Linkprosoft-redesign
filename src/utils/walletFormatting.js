export const formatCurrency = (amount, showSign = false) => {
  const numericAmount = Number(amount || 0);
  const absoluteValue = Math.abs(numericAmount);
  const formattedValue = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(absoluteValue)
    .replace("NGN", "₦");

  if (showSign && numericAmount > 0) return `+${formattedValue}`;
  if (showSign && numericAmount < 0) return `-${formattedValue}`;
  return formattedValue;
};

export const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const normalizeStatus = (status) => {
  const value = String(status || "").replace(/_/g, " ");
  const lookup = {
    "pending payment": "Pending Payment",
    "pending admin approval": "Pending Approval",
    "held in escrow": "In Escrow",
    "held pending review": "Pending Review",
    released: "Released",
    refunded: "Refunded",
    completed: "Completed",
    "in progress": "In Progress",
    accepted: "Accepted",
  };
  return lookup[value.toLowerCase()] || value;
};

export const formatCurrency = (amount, locale = "en-NG", currency = "NGN") => {
  if (typeof amount !== "number") return "₦0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("NGN", "₦");
};

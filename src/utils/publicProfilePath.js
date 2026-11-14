export const getPublicProfilePath = (slug) => {
  if (typeof slug !== "string" || !slug.trim()) return null;
  return `/${encodeURIComponent(slug)}`;
};

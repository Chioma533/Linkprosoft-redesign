export const JOB_CATEGORIES = [
  "Home Services",
  "Design",
  "Tech",
  "Events",
  "Other",
];

export const DEFAULT_SKILLS_BY_CATEGORY = {
  "Home Services": [
    { id: "33f2e7d6-6b29-4267-9222-b78aa2913432", name: "Plumbing" },
    { id: "614c5981-6c4c-4027-949a-8590d2e02c36", name: "Electrical & Wiring" },
    { id: "25bf49c9-83d6-4869-ad83-a72753b1ecdc", name: "Carpentry & Furniture" },
    { id: "42ec6987-83d7-4138-ba13-37a20af7d33d", name: "Painting & Wall Treatment" },
    { id: "mason-skill-id", name: "Masonry & Bricklaying" },
    { id: "welder-skill-id", name: "Welding & Metal Fabrication" },
    { id: "hvac-skill-id", name: "AC & Refrigeration" },
    { id: "gen-skill-id", name: "Generator Servicing & Repair" },
    { id: "tile-skill-id", name: "Tiling & Flooring" },
    { id: "pop-skill-id", name: "POP Ceiling Design" },
    { id: "roof-skill-id", name: "Roofing & Leak Repair" },
    { id: "clean-skill-id", name: "Deep Cleaning & Fumigation" },
    { id: "solar-skill-id", name: "Solar & Inverter Installation" },
  ],
  "Design": [
    { id: "uiux-skill-id", name: "UI/UX & Product Design" },
    { id: "graphic-skill-id", name: "Graphic Design & Branding" },
    { id: "arch-skill-id", name: "Architectural Drawing & 3D Modeling" },
    { id: "interior-skill-id", name: "Interior Decoration" },
    { id: "fashion-skill-id", name: "Fashion Design & Tailoring" },
  ],
  "Tech": [
    { id: "7a67cb09-5a72-4b3f-a64c-fbee17aa9cc6", name: "Web Development" },
    { id: "mobile-skill-id", name: "Mobile App Development" },
    { id: "it-skill-id", name: "IT & Computer Hardware Repair" },
    { id: "cctv-skill-id", name: "CCTV Installation & Networking" },
    { id: "qa-skill-id", name: "Software QA & Testing" },
  ],
  "Events": [
    { id: "event-plan-skill-id", name: "Event Planning & Decoration" },
    { id: "photo-skill-id", name: "Photography & Videography" },
    { id: "cater-skill-id", name: "Catering & Pastry" },
    { id: "mua-skill-id", name: "Makeup Artistry & Hair Styling" },
    { id: "sound-skill-id", name: "Sound Engineering & DJ Services" },
  ],
  "Other": [
    { id: "other-skill-general", name: "General / Custom Task" },
  ],
};

// Flattened list of all default skills
export const ALL_DEFAULT_SKILLS = Object.values(DEFAULT_SKILLS_BY_CATEGORY).flat();

export const BUDGET_TYPES = [
  {
    id: "workmanship",
    label: "Workmanship (Labor Only)",
    badge: "Workmanship",
    description: "You provide all materials, replacement parts, and tools. The professional is paid strictly for their skilled labor and expertise.",
  },
  {
    id: "materials_and_labor",
    label: "Materials + Labor",
    badge: "Materials + Labor",
    description: "The professional sources, purchases, and transports all required materials, delivering complete turnkey installation.",
  },
  {
    id: "daily_rate",
    label: "Daily Rate",
    badge: "Daily Rate",
    description: "Pay the professional on a daily basis for ongoing maintenance, inspection, or supervision.",
  },
];

/**
 * Filter skills catalog for a given category.
 * If backend catalog has matching skills, it filters those;
 * otherwise it uses the default categorized dictionary.
 */
export const getSkillsForCategory = (category, catalog = []) => {
  if (!category) return [];

  if (category === "Other") {
    return DEFAULT_SKILLS_BY_CATEGORY["Other"];
  }

  // If a live backend catalog exists and has items
  if (Array.isArray(catalog) && catalog.length > 0) {
    const matched = catalog.filter((skill) => {
      const skillCat = skill.category || skill.categoryName || "";
      return skillCat.toLowerCase() === category.toLowerCase();
    });

    if (matched.length > 0) {
      return matched;
    }
  }

  // Fallback to categorized dictionary
  return DEFAULT_SKILLS_BY_CATEGORY[category] || ALL_DEFAULT_SKILLS;
};

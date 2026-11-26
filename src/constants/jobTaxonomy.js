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
    { id: "c07a3c90-2a55-4a02-8c5d-afb3ec4c8f68", name: "Masonry & Bricklaying" },
    { id: "31719622-9770-4299-af31-c528397618d9", name: "Welding & Metal Fabrication" },
    { id: "29efeef9-ff4f-4d0c-8da6-84ecd3289696", name: "AC & Refrigeration" },
    { id: "e72648ae-7f78-488e-83c4-f3ffcb88632c", name: "Generator Servicing & Repair" },
    { id: "ec372113-5a1e-4ab3-88f7-dfaf0359007f", name: "Tiling & Flooring" },
    { id: "e13b20d6-a7eb-4a17-b14c-a4fc76dd758d", name: "POP Ceiling Design" },
    { id: "7fa73666-07e8-4a62-bdef-49cee2bc77b8", name: "Roofing & Leak Repair" },
    { id: "f13eea79-d6b8-482b-aa2f-5eda1aec4599", name: "Deep Cleaning & Fumigation" },
    { id: "e8b6ea98-df82-4208-993e-9bb8b3e99dbe", name: "Solar & Inverter Installation" },
  ],
  "Design": [
    { id: "83cd9253-d66e-4e65-b119-ca7da2965d26", name: "UI/UX & Product Design" },
    { id: "24da9fd7-ee2b-4a89-995c-5a697aa68c82", name: "Graphic Design & Branding" },
    { id: "664781c6-a8a5-41d4-b983-c43687eb5e0c", name: "Architectural Drawing & 3D Modeling" },
    { id: "ead346c5-f905-427f-8f98-c926e8101ec4", name: "Interior Decoration" },
    { id: "535167a3-7367-44bf-beea-ccba4be99f37", name: "Fashion Design & Tailoring" },
  ],
  "Tech": [
    { id: "7a67cb09-5a72-4b3f-a64c-fbee17aa9cc6", name: "Web Development" },
    { id: "f5a1c04a-2740-418e-86ab-7c28922faaea", name: "Mobile App Development" },
    { id: "b7c7d3b2-42ab-4f2a-9054-3e5e02416802", name: "IT & Computer Hardware Repair" },
    { id: "b8873d8c-b0b8-4d02-b0aa-b61e0f0ec210", name: "CCTV Installation & Networking" },
    { id: "f42a3347-ac5a-497a-a33b-42b3dc103e4d", name: "Software QA & Testing" },
  ],
  "Events": [
    { id: "b7e85674-a7ab-414e-90e4-20c844e9183a", name: "Event Planning & Decoration" },
    { id: "8c5d7042-a2db-4d53-bf2d-266615d3ab27", name: "Photography & Videography" },
    { id: "dffa0e24-2bde-4715-a1a1-bd0c873a8878", name: "Catering & Pastry" },
    { id: "5643adb5-d079-4f30-a15e-949a6c8df2cd", name: "Makeup Artistry & Hair Styling" },
    { id: "f35423cf-cd22-499f-a291-c122e7f3d753", name: "Sound Engineering & DJ Services" },
  ],
  "Other": [
    { id: "ce12d342-e40b-4f3d-bc23-e0a8ea9de990", name: "General / Custom Task" },
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

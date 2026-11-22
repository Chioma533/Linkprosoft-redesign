/**
 * Step definitions for the Employer / Buyer onboarding tour.
 * Highlights:
 * 1. Search Bar: Discover professionals by skill/trade/location
 * 2. Professional Card: Review vetted talent, rates, and contact directly
 * 3. Post a Job: Broadcast your project and receive competitive proposals
 */
export const EMPLOYER_TOUR_STEPS = [
  {
    id: "search-bar",
    target: "#tour-search-bar",
    title: "Find Skilled Professionals",
    description:
      "Search for verified artisans and specialists by trade (e.g. Carpenter, Plumber), location, rating, or budget.",
    placement: "bottom",
  },
  {
    id: "professional-card",
    target: "[data-tour='professional-card']",
    title: "Review & Hire Talent",
    description:
      "Explore verified profiles, star ratings, daily rates, and portfolios. Click 'Contact' to chat in real-time.",
    placement: "bottom",
  },
  {
    id: "post-a-job",
    target: "#nav-post-job-btn",
    title: "Post a Job in Minutes",
    description:
      "Have a specific project in mind? Post your job requirements, specify your budget type, and get proposals from top pros.",
    placement: "bottom",
  },
];

export const TOUR_STORAGE_KEY = "lps_tour_employer_v1";

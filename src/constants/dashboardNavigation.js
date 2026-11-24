import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiCompass,
  FiCreditCard,
  FiFileText,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const employerNavigationItems = [
  { id: "overview", label: "Overview", icon: FiCompass, keywords: ["home", "dashboard", "overview", "stats"] },
  { id: "browse-professionals", label: "Browse Professionals", icon: FiSearch, keywords: ["browse", "find", "professionals", "talent", "hire"] },
  { id: "manage-jobs", label: "My Jobs", icon: FiBriefcase, keywords: ["my jobs", "manage", "contracts", "orders", "active"] },
  { id: "messages", label: "Messages & Chats", icon: FiMessageSquare, keywords: ["messages", "chat", "inbox", "conversations"] },
  { id: "wallet", label: "Wallet & Escrow", icon: FiCreditCard, keywords: ["wallet", "escrow", "funds", "balance", "payments", "money"] },
  { id: "open-dispute", label: "Dispute Center", icon: FiFileText, keywords: ["dispute", "resolution", "help", "claim"] },
  { id: "profile", label: "Profile", icon: FiUser, keywords: ["profile", "bio", "skills", "account"] },
  { id: "settings", label: "Settings", icon: FiSettings, keywords: ["settings", "preferences"] },
];

const professionalNavigationItems = [
  { id: "overview", label: "Overview", icon: FiCompass, keywords: ["home", "dashboard", "overview", "stats", "performance"] },
  { id: "browse-jobs", label: "Browse Jobs", icon: FiSearch, keywords: ["browse", "find jobs", "explore", "open jobs", "market"] },
  { id: "my-jobs", label: "My Jobs", icon: FiBriefcase, keywords: ["my jobs", "contracts", "orders", "active", "in progress"] },
  { id: "applications", label: "Applications", icon: FiFileText, keywords: ["applications", "proposals", "applied", "bids"] },
  { id: "schedule", label: "Schedule", icon: FiCalendar, keywords: ["schedule", "calendar", "calendar view", "upcoming"] },
  { id: "wallet", label: "Wallet & Payouts", icon: FiCreditCard, keywords: ["wallet", "earnings", "withdraw", "balance", "bank"] },
  { id: "chat", label: "Messages & Chat", icon: FiMessageSquare, keywords: ["messages", "chat", "inbox", "clients"] },
  { id: "profile", label: "Profile", icon: FiUser, keywords: ["profile", "bio", "skills", "account"] },
  { id: "settings", label: "Settings", icon: FiSettings, keywords: ["settings", "preferences"] },
  { id: "premium", label: "Premium Membership", icon: FiAward, keywords: ["premium", "subscription", "upgrade", "pro"] },
];

export const getDashboardNavigationItems = (role) =>
  role === "employer" ? employerNavigationItems : professionalNavigationItems;

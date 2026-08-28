import {
  CreditCard,
  Layers3,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export const VERIFICATION_STEPS = [
  "Identity",
  "Face",
  "Payment",
];

export const VERIFICATION_VIEWS = {
  OVERVIEW: "overview",
  IDENTITY: "identity",
  FACE: "face",
  PAYMENT: "payment",
  REVIEW: "review",
};

export const VERIFICATION_CARDS = [
  {
    id: "identity",
    icon: UserRound,
    title: "Verify Your Information",
    description:
      "Get your details verified to create a trusted profile and start reaching to clients.",
    duration: "1 min",
  },
  {
    id: "professional",
    icon: Layers3,
    title: "Professional Verification",
    description:
      "Confirm your skills and credentials to strengthen your profile and connect with clients.",
    duration: "1 min",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment Verification",
    description:
      "Add and confirm your payment information so we can process your earnings safely and securely.",
    duration: "1 min",
  },
];

export const INITIAL_PROFILE = {
  firstName: "",
  lastName: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  nationality: "",
};

export const VERIFICATION_PAGE_CONTENT = {
  overview: {
    title: "Holla! Let's Get You Verified",
    description:
      "Complete your verification to unlock more opportunities, build trust with clients, and start receiving verified job requests on Linkprosoft.",
  },

  identity: {
    title: "Identity Verification.",
    description:
      "Get your details verified to create a trusted profile and start reaching to clients.",
  },

  face: {
    title: "Face Verification.",
    description:
      "Kindly take a quick selfie to let us confirm you are not a bot",
  },

  payment: {
    title: "Payment Verification",
    description:
      "Add and confirm your payment information so we can process your earnings safely and securely.",
  },

  review: {
    title: "Preview",
    description:
      "Kindly review the information that you have provided. Meanwhile you can always edit on the profile section.",
  },
};

export const VERIFICATION_ICONS = {
  overview: ShieldCheck,
  identity: UserRound,
  face: UserRound,
  payment: CreditCard,
};
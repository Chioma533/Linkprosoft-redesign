import React, { useState } from "react";
import { FiArrowLeft, FiBell, FiCheck, FiMessageSquare, FiStar, FiLoader } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import escrowIllustration from "../../assets/images/escrow_illustration.png";

const DEFAULT_JOB = {
  id: "JOB-1001",
  title: "Wardrobe Installation",
  description:
    "Hi, I’m looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
  budget: 10000,
};

const DEFAULT_OFFER = {
  id: "pro-1",
  name: "Jonathan David",
  role: "Carpenter",
  price: 22000,
  reviews: 32,
  rating: 5,
  summary:
    "Hello, I can handle this project successfully. I have vast years of experience in creating a professional and beautiful custom wardrobe.",
};

// Simulated wallet funding currently debits the quoted application amount only.
const PLATFORM_FEE = 0;

const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

// ─── Progress Stepper ─────────────────────────────────────────────────────────
const ProgressSteps = ({ isFunded = false }) => {
  const steps = [
    { label: "Job posted", done: true },
    { label: "Offers received", done: true },
    { label: "Fund escrow", done: isFunded },
    { label: "Work in progress", done: isFunded },
  ];

  return (
    <div className="flex items-start rounded-2xl bg-white px-6 py-6">
      {steps.map(({ label, done }, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                done ? "bg-[#016EA6] text-white" : "bg-[#e2eef3] text-[#b0c9d4]"
              }`}
            >
              {done && <FiCheck className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="whitespace-nowrap text-[0.68rem] text-[#404040]">{label}</span>
          </div>
          {i < steps.length - 1 && (
            <span
              className={`mt-2.5 h-px flex-1 ${
                i < steps.filter((s) => s.done).length - 1 ? "bg-[#016EA6]" : "bg-[#d9e8ee]"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Escrow Banner ────────────────────────────────────────────────────────────
const EscrowBanner = () => (
  <div className="flex items-center gap-5 rounded-2xl bg-[#e8f4fb] px-6 py-4">
    <img
      src="/secure_wallet_illustration.png"
      alt="Escrow wallet illustration"
      className="h-[60px] w-[60px] shrink-0 object-contain"
    />
    <div className="min-w-0 flex-1">
      <p className="text-[0.9rem] font-medium text-[#1c1c1c]">What is Escrow Wallet?</p>
      <p className="mt-0.5 max-w-[440px] text-[0.72rem] leading-[1.5] text-[#404040]">
        An escrow wallet is a secure account where money is temporarily held by the platform until
        both parties fulfill the agreed terms of a transaction.
      </p>
    </div>
    <button
      type="button"
      className="hidden shrink-0 rounded-full bg-white px-5 py-2 text-[0.72rem] font-medium text-[#016EA6] transition hover:bg-[#f0f8fd] sm:block"
    >
      Learn more
    </button>
  </div>
);

// ─── Job Card ─────────────────────────────────────────────────────────────────
const JobSummaryCard = ({ job }) => (
  <article className="overflow-hidden rounded-2xl border border-[#e9ebec] bg-white">
    <div className="p-4">
      <div className="flex items-center gap-3">
        <img
          src="/professional_avatar.png"
          alt="Employer"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-[0.93rem] font-semibold text-[#1a1a1a]">{job.title || "Job Request"}</h3>
          <p className="text-[0.68rem] text-[#016EA6]">
            {job.createdAt ? "Active request" : "Posted recently"}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-4 text-[0.71rem] leading-[1.5] text-[#666]">
        {job.description || "Custom job requirements."}
      </p>
    </div>
    <div className="flex items-center justify-between border-t border-[#f0f2f3] px-4 py-2.5">
      <span className="text-[0.93rem] font-medium text-[#1e1e1e]">{formatCurrency(job.budget || 0)}</span>
      <span className="text-[0.68rem] text-[#6b6b6b]">Job Posted</span>
    </div>
  </article>
);

// ─── Offer Card ───────────────────────────────────────────────────────────────
const AcceptedOfferCard = ({ offer }) => {
  const ratingCount = Math.min(Math.max(Number(offer.rating || 5), 1), 5);
  const reviewCount = offer.reviews || offer.reviewCount || 12;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e9ebec] bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              src="/professional_avatar.png"
              alt={offer.name || "Specialist"}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-[0.93rem] font-semibold text-[#1a1a1a]">{offer.name || "Specialist"}</h3>
              <p className="text-[0.68rem] text-[#016EA6]">{offer.role || "Professional"}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#eaf5fb] px-2.5 py-1 text-[0.62rem] font-medium text-[#016EA6]">
            Verified <span className="text-[#f4b942]">★</span>
          </span>
        </div>
        <div className="mt-3 flex items-center gap-0.5 text-[#f4b942]">
          {Array.from({ length: ratingCount }, (_, i) => (
            <FiStar key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
          <span className="ml-1.5 text-[0.68rem] text-[#555]">({reviewCount} reviews)</span>
        </div>
        <p className="mt-2.5 line-clamp-3 text-[0.71rem] leading-[1.5] text-[#666]">
          {offer.summary ||
            offer.coverLetter ||
            "Hello, I can handle this project successfully and deliver top quality workmanship."}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-[#f0f2f3] px-4 py-2.5">
        <span className="text-[0.93rem] font-medium text-[#1e1e1e]">
          {formatCurrency(offer.numericPrice || offer.price)}
        </span>
        <span className="text-[0.68rem] text-[#6b6b6b]">Offer Accepted</span>
      </div>
    </article>
  );
};

// ─── Success Modal ────────────────────────────────────────────────────────────
const EscrowSuccessModal = ({ professionalName, onClose, onDashboard }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-label="Escrow funded successfully"
  >
    <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white px-9 pb-8 pt-11 text-center shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="absolute h-2 w-1.5 rounded-sm"
            style={{
              left: `${(i * 17) % 105}%`,
              top: `${(i * 13) % 65}px`,
              backgroundColor: ["#016EA6", "#f2c500", "#e11d48", "#10a86b"][i % 4],
              transform: `rotate(${i * 31}deg)`,
            }}
          />
        ))}
      </div>
      <img src={escrowIllustration} alt="" className="relative mx-auto h-[72px] w-[72px] object-contain" />
      <h2 className="mt-4 text-[1.1rem] font-semibold text-[#171717]">Escrow Funded Successfully</h2>
      <p className="mx-auto mt-1.5 max-w-[280px] text-[0.75rem] leading-5 text-[#7b7b7b]">
        <strong className="text-gray-900">{professionalName || "The professional"}</strong> has been notified and can now begin work.
      </p>
      <button
        type="button"
        onClick={onDashboard}
        className="mt-6 w-full rounded-full bg-[#016EA6] py-2.5 text-[0.78rem] font-medium text-white transition hover:bg-[#015a8a] cursor-pointer"
      >
        Go to Dashboard
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-2.5 w-full rounded-full bg-[#f5f5f5] py-2.5 text-[0.78rem] font-medium text-[#333] transition hover:bg-[#ebebeb] cursor-pointer"
      >
        Close
      </button>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFunded, setIsFunded] = useState(false);

  // Read job and offer from navigation state, with robust fallback to default mock
  const activeJob = location.state?.job || DEFAULT_JOB;
  const rawOffer = location.state?.offer || DEFAULT_OFFER;

  const parsedPrice =
    typeof rawOffer.price === "number"
      ? rawOffer.price
      : Number(String(rawOffer.price || "").replace(/,/g, "")) || 22000;

  const activeOffer = {
    ...rawOffer,
    numericPrice: parsedPrice,
  };

  const userName = user?.fullName || user?.full_name || "Employer";
  const serviceCost = activeOffer.numericPrice;
  const platformFee = PLATFORM_FEE;
  const totalFee = serviceCost + platformFee;

  const handlePayToEscrow = async () => {
    setIsProcessing(true);
    try {
      if (!activeJob?.id || !activeOffer?.applicationId) {
        throw new Error("This offer is missing its application ID. Please return to Manage Jobs and try again.");
      }

      // The backend performs the full atomic acceptance/funding transaction.
      await axiosInstance.post(
        API_PATHS.JOBS.ACCEPT_AND_FUND_APPLICATION(activeJob.id, activeOffer.applicationId),
        { paymentMethod: "simulated_wallet" },
      );

      setIsFunded(true);
      toast.success("Escrow funded! Professional notified to begin work.");
      setShowSuccess(true);
    } catch (err) {
      console.error("Escrow funding error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to fund escrow. Please check your wallet balance and try again.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccess(false);
    navigate("/employer/dashboard", {
      state: {
        tab: "job-details",
        jobId: activeJob.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] font-sans text-[#202020]">
      {/* Header */}
      <header className="border-b border-[#e8e8e8] bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#eaf2f6] text-[#2a4c5a] transition hover:bg-[#dae8f0] cursor-pointer"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[1.1rem] font-semibold text-[#1a1a1a]">Manage Jobs</h1>
            <nav className="flex items-center gap-5 text-[0.82rem]" aria-label="Job tabs">
              <button
                type="button"
                onClick={() => navigate("/manage-jobs")}
                className="font-medium text-[#016EA6] cursor-pointer"
              >
                Job offers
              </button>
              <button
                type="button"
                onClick={() => navigate("/manage-jobs")}
                className="text-[#666] transition hover:text-[#1a1a1a] cursor-pointer"
              >
                Jobs posted
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Messages" className="text-[#555] transition hover:text-[#1a1a1a] cursor-pointer">
              <FiMessageSquare className="h-[22px] w-[22px]" />
            </button>
            <button type="button" aria-label="Notifications" className="text-[#555] transition hover:text-[#1a1a1a] cursor-pointer">
              <FiBell className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/manage-jobs")}
              className="rounded-full bg-[#016EA6] px-5 py-2 text-[0.8rem] font-medium text-white transition hover:bg-[#015a8a] cursor-pointer"
            >
              Post a Job
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#b9e4ed] text-[0.65rem] font-bold text-[#016EA6]">
              {(userName || "Em").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[1fr_320px]">
        {/* Left */}
        <section className="space-y-4">
          <ProgressSteps isFunded={isFunded} />
          <EscrowBanner />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <JobSummaryCard job={activeJob} />
            <AcceptedOfferCard offer={activeOffer} />
          </div>
        </section>

        {/* Right — Payment Summary */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-xs">
          <h2 className="text-[1rem] font-semibold text-[#1a1a1a]">Payment Summary</h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem] text-[#888]">Service Cost</span>
              <span className="text-[0.88rem] font-medium text-[#1a1a1a]">{formatCurrency(serviceCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem] text-[#888]">Platform Fee</span>
              <span className="text-[0.88rem] font-medium text-[#1a1a1a]">{formatCurrency(platformFee)}</span>
            </div>
            <div className="border-t border-[#ebebeb]" />
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem] text-[#888]">Total Fee</span>
              <span className="text-[1.5rem] font-bold leading-none text-[#111]">
                ₦ {totalFee.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            id="pay-to-escrow-btn"
            type="button"
            disabled={isProcessing}
            onClick={handlePayToEscrow}
            className="mt-6 w-full rounded-full bg-[#016EA6] py-3 text-[0.82rem] font-medium text-white transition hover:bg-[#015a8a] active:scale-[0.98] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Processing Escrow...</span>
              </>
            ) : (
              <span>Pay to escrow</span>
            )}
          </button>
        </aside>
      </main>

      {showSuccess && (
        <EscrowSuccessModal
          professionalName={activeOffer.name}
          onClose={() => setShowSuccess(false)}
          onDashboard={handleGoToDashboard}
        />
      )}
    </div>
  );
};

export default PaymentScreen;


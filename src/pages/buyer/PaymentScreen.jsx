import React, { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiBell, FiCheck, FiMessageSquare, FiStar, FiLoader } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { paymentService } from "../../api/services/paymentService";

const CHECKOUT_STORAGE_KEY = "linkprosoft:pending-escrow-checkout";
const BUYER_FEE_RATE = 0.01;

const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

const readStoredCheckout = () => {
  try {
    const checkout = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    return checkout ? JSON.parse(checkout) : null;
  } catch {
    return null;
  }
};

const createCheckoutContext = (job, offer, assignmentId) => ({
  job: {
    id: job.id,
    title: job.title,
    description: job.description,
    budget: job.budget,
    createdAt: job.createdAt,
  },
  offer: {
    applicationId: offer.applicationId,
    name: offer.name,
    role: offer.role,
    price: offer.price,
    summary: offer.summary,
    rating: offer.rating,
    reviews: offer.reviews,
  },
  assignmentId,
});

// ─── Progress Stepper ─────────────────────────────────────────────────────────
const ProgressSteps = ({ paymentStarted = false, escrowFunded = false }) => {
  const steps = [
    { label: "Job posted", done: true },
    { label: "Offers received", done: true },
    { label: "Payment submitted", done: paymentStarted },
    { label: "Work in progress", done: escrowFunded },
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

// ─── Page ─────────────────────────────────────────────────────────────────────
const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verifiedPayment, setVerifiedPayment] = useState(null);
  const [checkoutContext, setCheckoutContext] = useState(
    () => location.state?.job && location.state?.offer
      ? { job: location.state.job, offer: location.state.offer }
      : readStoredCheckout(),
  );
  const searchParams = new URLSearchParams(location.search);
  const paymentReference = searchParams.get("reference") || searchParams.get("trxref");
  const activeJob = checkoutContext?.job || location.state?.job;
  const rawOffer = checkoutContext?.offer || location.state?.offer;
  const parsedPrice = typeof rawOffer?.price === "number"
    ? rawOffer.price
    : Number(String(rawOffer?.price || "").replace(/,/g, ""));

  const activeOffer = {
    ...(rawOffer || {}),
    numericPrice: parsedPrice,
  };

  const userName = user?.fullName || user?.full_name || "Employer";
  const serviceCost = activeOffer.numericPrice;
  const platformFee = Math.round(serviceCost * 100 * BUYER_FEE_RATE) / 100;
  const totalFee = serviceCost + platformFee;

  const verifyPayment = useCallback(async (reference) => {
    setIsVerifying(true);
    setVerificationError("");
    try {
      const payment = await paymentService.verify(reference);
      setVerifiedPayment(payment);
      if (["pending_admin_approval", "held_in_escrow", "released"].includes(payment.status)) {
        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
      }
    } catch (err) {
      setVerificationError(
        err.response?.data?.message || err.message || "Unable to verify this payment yet.",
      );
    } finally {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (paymentReference) verifyPayment(paymentReference);
  }, [paymentReference, verifyPayment]);

  const handlePayToEscrow = async () => {
    setIsProcessing(true);
    try {
      if (!activeJob?.id || !activeOffer?.applicationId || !Number.isFinite(serviceCost) || serviceCost <= 0) {
        throw new Error("This offer is missing valid job, application, or price details. Return to Manage Jobs and select the offer again.");
      }

      let assignmentId = checkoutContext?.assignmentId;
      if (!assignmentId) {
        const acceptResponse = await axiosInstance.post(
          API_PATHS.JOBS.ACCEPT_APPLICATION(activeJob.id, activeOffer.applicationId),
        );
        const acceptData = acceptResponse.data?.data ?? acceptResponse.data;
        assignmentId = acceptData?.assignment?.id;
        if (!assignmentId) {
          throw new Error("The accepted offer did not return an assignment. Please try again or contact support.");
        }
      }

      const nextContext = createCheckoutContext(activeJob, activeOffer, assignmentId);
      setCheckoutContext(nextContext);
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(nextContext));

      const checkout = await paymentService.initiate(assignmentId);
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      console.error("Payment checkout error:", err);
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
    if (!activeJob?.id) {
      navigate("/manage-jobs");
      return;
    }
    navigate("/employer/dashboard", {
      state: {
        tab: "job-details",
        jobId: activeJob.id,
      },
    });
  };

  if (paymentReference) {
    const statusMessages = {
      pending_payment: "The provider has not confirmed this payment yet. Check again in a moment before starting another payment.",
      pending_admin_approval: "Payment received. Escrow will be funded after the platform review is complete.",
      held_in_escrow: "Payment verified and held in escrow. The professional can begin work.",
      released: "This payment has already been released.",
      payment_rejected: "The payment was not completed. You can try checkout again.",
    };
    const canRetry = Boolean(
      checkoutContext?.assignmentId &&
      checkoutContext?.job?.id &&
      checkoutContext?.offer?.applicationId &&
      verifiedPayment?.status === "payment_rejected",
    );

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f7] px-4 py-10">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm" aria-live="polite">
          <h1 className="text-xl font-semibold text-gray-900">Payment status</h1>
          {isVerifying ? (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
              <FiLoader className="h-4 w-4 animate-spin" /> Verifying payment with the provider…
            </p>
          ) : null}
          {verificationError ? (
            <p role="alert" className="mt-4 text-sm text-rose-700">{verificationError}</p>
          ) : null}
          {verifiedPayment ? (
            <p role="status" className="mt-4 text-sm leading-6 text-gray-600">
              {statusMessages[verifiedPayment.status] || "Payment status returned by the provider: " + verifiedPayment.status}
            </p>
          ) : null}
          {!isVerifying && !verifiedPayment && !verificationError ? (
            <p className="mt-4 text-sm text-gray-600">Checking the payment provider…</p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3">
            {verifiedPayment?.status === "pending_payment" || verificationError ? (
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => verifyPayment(paymentReference)}
                className="rounded-full border border-[#016EA6] px-5 py-2.5 text-sm font-medium text-[#016EA6] disabled:opacity-60"
              >
                Check payment again
              </button>
            ) : null}
            {canRetry ? (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayToEscrow}
                className="rounded-full bg-[#016EA6] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {isProcessing ? "Starting checkout…" : "Try payment again"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700"
            >
              Go to Dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!activeJob?.id || !rawOffer?.applicationId || !Number.isFinite(serviceCost) || serviceCost <= 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f7] px-4 py-10">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Offer details unavailable</h1>
          <p className="mt-3 text-sm text-gray-600">
            Return to Manage Jobs and select an offer before starting checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate("/manage-jobs")}
            className="mt-6 rounded-full bg-[#016EA6] px-5 py-2.5 text-sm font-medium text-white"
          >
            Return to Manage Jobs
          </button>
        </section>
      </main>
    );
  }

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
          <ProgressSteps />
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
              <span className="text-[0.8rem] text-[#888]">Platform Fee (1%)</span>
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
                <span>Opening secure checkout...</span>
              </>
            ) : (
              <span>Pay to escrow</span>
            )}
          </button>
        </aside>
      </main>

    </div>
  );
};

export default PaymentScreen;


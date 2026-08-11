import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";

/* ─── Design Tokens ────────────────────────────────────────── */
const BG_IMAGE = "/temp_figma_mockups/Waitlsit-bg.jpg";

/* Worker avatar stack – three small circular images in the badge */
const WORKER_AVATARS = [
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=64&h=64&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=64&h=64&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
];

/* ─── FAQ data ──────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    id: 1,
    question: "How does Linkprosoft work?",
    answer:
      "Linkprosoft connects you with verified local professionals for various services. Simply describe what you need, compare real-time quotes, check provider profiles, and hire the professional that best fits your requirements and budget.",
  },
  {
    id: 2,
    question: "Can professionals set their own prices?",
    answer:
      "Yes, all service rendering professionals on Linkprosoft are independent service providers and have full control over setting their own rates and pricing models based on their expertise and experience.",
  },
  {
    id: 3,
    question: "Are all service providers verified?",
    answer:
      "Absolutely. Safety and trust are our top priorities. Every professional goes through an ID check and background verification process before they can offer their services or book clients on the platform.",
  },
  {
    id: 4,
    question: "How do I book a professional?",
    answer:
      "Simply use our search bar to find the category you need, select a verified professional near you, check their availability, agree on the project budget/scope, and confirm your booking securely within the application.",
  },
  {
    id: 5,
    question: "Does Linkprosoft have digital solution professionals?",
    answer:
      "Yes. In addition to home and maintenance services, Linkprosoft connects you with trusted digital professionals, including web designers, developers, graphic designers, digital marketers, IT support specialists, and other tech experts.",
  },
];

/* ─── Accordion Item ────────────────────────────────────────── */
const AccordionItem = ({ item, isExpanded, onToggle }) => (
  <motion.div
    layout
    style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "18px",
      overflow: "hidden",
    }}
  >
    <button
      id={`faq-btn-${item.id}`}
      aria-expanded={isExpanded}
      aria-controls={`faq-panel-${item.id}`}
      onClick={() => onToggle(item.id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        gap: "16px",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
          fontFamily: "var(--font-heading)",
          lineHeight: 1.4,
        }}
      >
        {item.question}
      </span>

      {/* Chevron in blue circle */}
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#1565c0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        <FiChevronDown
          style={{
            color: "#fff",
            fontSize: 18,
            transition: "transform 0.3s ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          id={`faq-panel-${item.id}`}
          role="region"
          aria-labelledby={`faq-btn-${item.id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              padding: "0 24px 20px",
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                marginTop: 14,
                fontFamily: "var(--font-body)",
              }}
            >
              {item.answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ─── Main Page ─────────────────────────────────────────────── */
const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    /* Replace with real API call */
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("You're on the list! We'll notify you at launch 🎉");
    setEmail("");
    setSubmitting(false);
  };

  /* Shared staggered entrance animation factory */
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
  });

  return (
    <>
      {/* ── Scoped styles ─────────────────────────────────────── */}
      <style>{`
        .wl-email-input::placeholder { color: rgba(255,255,255,0.55); }
        .wl-email-input:focus { outline: none; }

        .wl-form-pill { transition: box-shadow 0.2s ease; }
        .wl-form-pill:focus-within {
          box-shadow: 0 0 0 3px rgba(255,255,255,0.35),
                      0 8px 32px rgba(0,0,0,0.35) !important;
        }

        .wl-join-btn {
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .wl-join-btn:hover:not(:disabled) {
          background: #e8f0fe !important;
          transform: scale(1.03);
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
        }
        .wl-join-btn:active:not(:disabled) { transform: scale(0.98); }
        .wl-join-btn:disabled { opacity: 0.75; cursor: not-allowed; }
      `}</style>

      {/* ── Page wrapper ──────────────────────────────────────── */}
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: 80,
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url(${BG_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Subtle dark gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        {/* ── Content ─────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 720,
            padding: "80px 24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ── Badge pill ──────────────────────────────────────── */}
          <motion.div
            {...fadeUp(0)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.30)",
              borderRadius: 9999,
              padding: "6px 20px 6px 8px",
              marginBottom: 32,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            {/* Stacked avatars */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {WORKER_AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Professional"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,0.85)",
                    marginLeft: i === 0 ? 0 : -10,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                  }}
                />
              ))}
            </div>

            <span
              style={{
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.01em",
              }}
            >
              Something big is coming.
            </span>
          </motion.div>

          {/* ── Heading ─────────────────────────────────────────── */}
          <motion.h1
            {...fadeUp(0.08)}
            style={{
              color: "#fff",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 6vw, 3.6rem)",
              lineHeight: 1.15,
              textAlign: "center",
              margin: 0,
              marginBottom: 20,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 16px rgba(0,0,0,0.25)",
            }}
          >
            Good things come to
            <br />
            those who{" "}
            <em style={{ fontStyle: "italic", fontWeight: 700 }}>wait</em>.
          </motion.h1>

          {/* ── Sub-text ────────────────────────────────────────── */}
          <motion.p
            {...fadeUp(0.16)}
            style={{
              color: "rgba(255,255,255,0.88)",
              fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
              lineHeight: 1.6,
              textAlign: "center",
              margin: 0,
              marginBottom: 40,
              fontFamily: "var(--font-body)",
              textShadow: "0 1px 6px rgba(0,0,0,0.18)",
            }}
          >
            Stay close to the launch and be among
            <br />
            the first to see what&apos;s coming.
          </motion.p>

          {/* ── Email form pill ─────────────────────────────────── */}
          <motion.form
            {...fadeUp(0.24)}
            className="wl-form-pill"
            onSubmit={handleSubmit}
            aria-label="Join the Linkprosoft waitlist"
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 520,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: 9999,
              padding: "6px 6px 6px 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
              marginBottom: 60,
            }}
          >
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={submitting}
              autoComplete="email"
              className="wl-email-input"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                fontFamily: "var(--font-body)",
                minWidth: 0,
              }}
            />

            <button
              id="waitlist-submit-btn"
              type="submit"
              disabled={submitting}
              className="wl-join-btn"
              style={{
                background: "#fff",
                color: "#1a1a2e",
                border: "none",
                borderRadius: 9999,
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              {submitting ? "Joining…" : "Join waitlist"}
            </button>
          </motion.form>

          {/* ── FAQ Accordions ───────────────────────────────────── */}
          <motion.div
            {...fadeUp(0.32)}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggle={toggleExpand}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Waitlist;

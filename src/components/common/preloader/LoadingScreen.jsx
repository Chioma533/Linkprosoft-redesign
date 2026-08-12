/**
 * LoadingScreen.jsx
 *
 * The platform's combined loading state as per the Figma design
 * "Skeleton Loading Default.jpg":
 *
 *   ┌────────────────────────────────┐
 *   │   SkeletonLoader  (bottom)     │  ← full-page ghost layout
 *   │                                │
 *   │      ┌──────────────┐          │
 *   │      │  Preloader   │          │  ← logo + 3-pill overlay (fixed, centred)
 *   │      │  (overlay)   │          │
 *   │      └──────────────┘          │
 *   └────────────────────────────────┘
 *
 * Usage:
 *   import LoadingScreen from "../../components/common/preloader/LoadingScreen";
 *   if (loading) return <LoadingScreen />;
 *
 * Props:
 *   onFinish  – optional callback; forwarded to <Preloader />.
 *               When omitted, Preloader still runs its internal timer
 *               but no external side-effect fires on completion.
 */

import SkeletonLoader from "./SkeletonLoader";
import Preloader from "./PreLoader";

/* ─────────────────────────── Overlay wrapper ────────────────────────────── */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9998,                  /* sits on top of skeleton, below nothing */
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  /* Transparent — the Preloader itself carries its own white backdrop.    *
   * We keep the overlay transparent so the skeleton is visible behind.   */
  pointerEvents: "none",
  background: "transparent",
};

/* Override Preloader's own full-screen opaque white so skeleton shows through */
const preloaderOverrideStyle = {
  position: "relative",          /* not fixed — contained within the overlay */
  width: "auto",
  height: "auto",
  background: "transparent",
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const LoadingScreen = ({ onFinish, variant = "buyer" }) => (
  <>
    {/* Layer 1 — full-page skeleton (variant controls card type) */}
    <SkeletonLoader variant={variant} />

    {/* Layer 2 — preloader centred over the skeleton */}
    <div style={overlayStyle}>
      {/*
        We render the Preloader but need it NOT to paint its own
        fixed white overlay (which would cover the skeleton).
        We achieve this by wrapping it in a portal-style container
        that is already positioned/centred, and pass a style override
        via a className on the wrapper. The Preloader's motion.div
        uses inline `style`, so we cannot override it via CSS class —
        instead we re-export a "floating" variant below.
      */}
      <PreloaderFloating onFinish={onFinish} />
    </div>
  </>
);

/* ─────────────────────────────────────────────────────────────────────────── *
 *  PreloaderFloating                                                          *
 *  Identical to Preloader but WITHOUT the fixed full-screen white overlay.   *
 *  It renders only the inner content (logo + pills) on a soft frosted card.  *
 * ─────────────────────────────────────────────────────────────────────────── */
import { motion } from "framer-motion";
import { useEffect } from "react";

const LOGO_SRC = "/temp_figma_mockups/linkprosoft-logo.png";
const PILL_DELAYS = ["0s", "0.35s", "0.7s"];

const floatingStyles = {
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 36px 28px",

  },
  logo: {
    width: "72px",
    height: "72px",
    objectFit: "contain",
  },
  pillsWrapper: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  pillTrack: {
    position: "relative",
    width: "24.21px",
    height: "6.72px",
    borderRadius: "999px",
    background: "#E6F1F6",
    overflow: "hidden",
  },
  pillShimmer: {
    position: "absolute",
    inset: 0,
    borderRadius: "999px",
    background: "#016EA6",
    animation: "pill-pulse 1.4s ease-in-out infinite",
  },
};

const PreloaderFloating = ({ onFinish }) => {
  useEffect(() => {
    /* Ensure pill-pulse keyframe exists (injected by PreLoader.jsx if it
       renders first, but guard here too in case LoadingScreen is used alone) */
    if (!document.getElementById("preloader-kf")) {
      const tag = document.createElement("style");
      tag.id = "preloader-kf";
      tag.textContent = `
        @keyframes pill-pulse {
          0%, 100% { opacity: 0.15; transform: scaleX(0.9); }
          35%, 65% { opacity: 1;    transform: scaleX(1);   }
        }
      `;
      document.head.appendChild(tag);
    }

    const timer = setTimeout(() => onFinish?.(), 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      style={floatingStyles.card}
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <motion.img
        src={LOGO_SRC}
        alt="Linkprosoft"
        style={floatingStyles.logo}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Three pill loaders */}
      <motion.div
        style={floatingStyles.pillsWrapper}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.5, ease: "easeOut" }}
      >
        {PILL_DELAYS.map((delay, i) => (
          <div key={i} style={floatingStyles.pillTrack}>
            <div style={{ ...floatingStyles.pillShimmer, animationDelay: delay }} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;

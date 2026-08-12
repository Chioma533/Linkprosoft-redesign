/**
 * DashboardLoadingScreen.jsx
 *
 * The dashboard's combined loading state:
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │  DashboardShellSkeleton (sidebar + navbar + main)   │
 *   │      ┌─────────────────────────────────────────┐    │
 *   │      │  [subpage content skeleton]             │    │
 *   │      └─────────────────────────────────────────┘    │
 *   │                                                     │
 *   │      ┌───────────────┐                              │
 *   │      │ PreloaderFloat│   ← floating glass card      │
 *   │      │   (centred)   │     (logo + 3 pills)         │
 *   │      └───────────────┘                              │
 *   └─────────────────────────────────────────────────────┘
 *
 * Usage in DashboardLayout.jsx:
 *   import DashboardLoadingScreen from "../components/common/preloader/DashboardLoadingScreen";
 *   if (isLoading) return <DashboardLoadingScreen subpage={activeTab} />;
 *
 * Props:
 *   subpage   — activeTab string from useDashboardStore (default "overview")
 *   onFinish  — optional callback when preloader timer finishes
 */

import { motion }    from "framer-motion";
import { useEffect } from "react";
import DashboardShellSkeleton from "./dashboard/DashboardShellSkeleton";
import OverviewSkeleton       from "./dashboard/OverviewSkeleton";
import TablePageSkeleton      from "./dashboard/TablePageSkeleton";
import WalletSkeleton         from "./dashboard/WalletSkeleton";
import ProfileSkeleton        from "./dashboard/ProfileSkeleton";
import ChatSkeleton           from "./dashboard/ChatSkeleton";
import GridPageSkeleton       from "./dashboard/GridPageSkeleton";

const LOGO_SRC    = "/temp_figma_mockups/linkprosoft-logo.png";
const PILL_DELAYS = ["0s", "0.35s", "0.7s"];

/* ── Floating preloader card (same as in LoadingScreen.jsx) ─────────────── */
const floatingStyles = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 9998,
    display: "flex", alignItems: "center", justifyContent: "center",
    pointerEvents: "none", background: "transparent",
  },
  card: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "28px 32px 24px", borderRadius: 24,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 8px 40px rgba(1,110,166,0.13), 0 2px 12px rgba(0,0,0,0.07)",
    border: "1px solid rgba(1,110,166,0.10)",
    pointerEvents: "auto",
  },
  logo:        { width: 64, height: 64, objectFit: "contain" },
  pillsWrapper:{ marginTop:18, display:"flex", flexDirection:"row",
                 alignItems:"center", justifyContent:"center", gap:8 },
  pillTrack:   { position:"relative", width:"24.21px", height:"6.72px",
                 borderRadius:999, background:"#E6F1F6", overflow:"hidden" },
  pillShimmer: { position:"absolute", inset:0, borderRadius:999,
                 background:"#016EA6", animation:"pill-pulse 1.4s ease-in-out infinite" },
};

const FloatingPreloader = ({ onFinish }) => {
  useEffect(() => {
    /* Ensure pill-pulse keyframe is present */
    if (!document.getElementById("preloader-kf")) {
      const tag = document.createElement("style");
      tag.id = "preloader-kf";
      tag.textContent = `
        @keyframes pill-pulse {
          0%,100% { opacity:0.15; transform:scaleX(0.9); }
          35%,65% { opacity:1;    transform:scaleX(1);   }
        }`;
      document.head.appendChild(tag);
    }
    const t = setTimeout(() => onFinish?.(), 3000);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div style={floatingStyles.overlay}>
      <motion.div
        style={floatingStyles.card}
        initial={{ opacity:0, scale:0.88, y:12 }}
        animate={{ opacity:1, scale:1,    y:0  }}
        exit={{    opacity:0, scale:0.92, y:-8  }}
        transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
      >
        <motion.img
          src={LOGO_SRC} alt="Linkprosoft"
          style={floatingStyles.logo}
          initial={{ opacity:0, scale:0.75 }}
          animate={{ opacity:1, scale:1    }}
          transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
        />
        <motion.div
          style={floatingStyles.pillsWrapper}
          initial={{ opacity:0, y:8 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.35, delay:0.5, ease:"easeOut" }}
        >
          {PILL_DELAYS.map((delay, i) => (
            <div key={i} style={floatingStyles.pillTrack}>
              <div style={{ ...floatingStyles.pillShimmer, animationDelay:delay }} />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ── Subpage → skeleton mapping ─────────────────────────────────────────── */
const resolveContent = (subpage) => {
  switch (subpage) {
    /* Table-based pages */
    case "my-jobs":
      return <TablePageSkeleton cols={6} rows={7} />;
    case "applications":
      return <TablePageSkeleton cols={6} rows={6} />;
    case "manage-jobs":
      return <TablePageSkeleton cols={5} rows={6} />;
    case "schedule":
      return <TablePageSkeleton cols={5} rows={5} showStats={false} />;
    case "job-details":
      return <TablePageSkeleton cols={4} rows={4} showStats={false} showFilter={false} />;
    case "open-dispute":
      return <TablePageSkeleton cols={3} rows={3} showStats={false} showFilter={false} />;

    /* Wallet */
    case "wallet":
      return <WalletSkeleton />;

    /* Profile */
    case "profile":
      return <ProfileSkeleton />;

    /* Chat / Messages */
    case "chat":
    case "messages":
      return <ChatSkeleton />;

    /* Browse grids */
    case "browse-jobs":
      return <GridPageSkeleton cardType="job" />;
    case "browse-professionals":
      return <GridPageSkeleton cardType="professional" />;

    /* Overview (default) */
    case "overview":
    default:
      return <OverviewSkeleton />;
  }
};

/* ── Root export ────────────────────────────────────────────────────────── */
const DashboardLoadingScreen = ({ subpage = "overview", onFinish }) => {
  const isOverview = subpage === "overview" || !subpage;

  useEffect(() => {
    if (!isOverview && onFinish) {
      const t = setTimeout(() => onFinish(), 3000);
      return () => clearTimeout(t);
    }
  }, [isOverview, onFinish]);

  return (
    <>
      <DashboardShellSkeleton>
        {resolveContent(subpage)}
      </DashboardShellSkeleton>
      {isOverview && <FloatingPreloader onFinish={onFinish} />}
    </>
  );
};

export default DashboardLoadingScreen;

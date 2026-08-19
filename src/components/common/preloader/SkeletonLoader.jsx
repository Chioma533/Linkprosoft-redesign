/**
 * SkeletonLoader.jsx
 *
 * Pixel-accurate, responsive ghost skeleton for DefaultBuyerScreen / DefaultProfessionalScreen.
 * Every dimension, padding, gap, and responsive layout shift matches the real page JSX and
 * component source (BuyerNavbar, ProfessionalNavbar, ProfessionalCard, JobCard, SearchBars, BottomNav).
 *
 * Responsive behavior:
 *  - Desktop (>= 768px): 100% pixel-identical to original desktop skeleton (3-col card grid,
 *    desktop navbar with links, desktop hero section, desktop search filters).
 *  - Mobile  (< 768px): Mobile navbar header (hamburger + title + avatar), compact hero section,
 *    single-row horizontal scrollable search bar, 1-col card grid, and fixed bottom navigation bar.
 */

/* ──────────────────────────── Shimmer keyframe ─────────────────────────── */
const SKELETON_KF = `
@keyframes sk-shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position:  800px 0; }
}
`;

function injectSK() {
  if (typeof document === "undefined") return;
  if (document.getElementById("skeleton-kf")) return;
  const tag = document.createElement("style");
  tag.id    = "skeleton-kf";
  tag.textContent = SKELETON_KF;
  document.head.appendChild(tag);
}

/* ──────────────────────────── Design tokens ────────────────────────────── */
const BASE  = "#EAEFF3";
const SHINE = "#F8FAFB";
const shBg  = `linear-gradient(90deg, ${BASE} 25%, ${SHINE} 50%, ${BASE} 75%)`;
const shBgSize = "1600px 100%";
const shAnim   = "sk-shimmer 1.8s ease-in-out infinite";

/* ──────────────────────────── Primitives ───────────────────────────────── */
const Bar = ({ w = "100%", h = 12, r = 8, mt = 0, mb = 0, delay = "0s", className = "", style: extra = {} }) => (
  <div
    className={className}
    style={{
      width: w, height: h, borderRadius: r,
      marginTop: mt, marginBottom: mb,
      background: shBg, backgroundSize: shBgSize,
      animation: shAnim, animationDelay: delay,
      flexShrink: 0, ...extra,
    }}
  />
);

const Circle = ({ size = 40, delay = "0s", className = "", style: extra = {} }) => (
  <div
    className={className}
    style={{
      width: size, height: size, borderRadius: "50%",
      background: shBg, backgroundSize: shBgSize,
      animation: shAnim, animationDelay: delay,
      flexShrink: 0, ...extra,
    }}
  />
);

const Pill = ({ w, h = 38, delay = "0s", className = "", style: extra = {} }) => (
  <Bar w={w} h={h} r={999} delay={delay} className={className} style={extra} />
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  1. NAVBAR SKELETON                                                        *
 *  Desktop: Logo + 4 nav links (left), Message + Bell + Avatar (right)       *
 *  Mobile:  Hamburger + Title (left), Message + Avatar (right)               *
 * ══════════════════════════════════════════════════════════════════════════ */
const NavSkeleton = ({ variant = "buyer" }) => (
  <div style={{ background: "#fff", borderBottom: "1px solid #F0F4F6", width: "100%" }}>
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
      className="px-4 md:px-8"
    >
      {/* Desktop View: Logo + Nav Links (left), Actions (right) */}
      <div className="hidden md:flex items-center gap-8">
        <Circle size={36} delay="0s" />
        <div className="flex items-center gap-6">
          <Bar w={150} h={10} r={6} delay="0.05s" />
          <Bar w={100} h={10} r={6} delay="0.10s" />
          <Bar w={88}  h={10} r={6} delay="0.15s" />
          <Bar w={170} h={10} r={6} delay="0.20s" />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Circle size={22} delay="0.10s" />
        <Circle size={22} delay="0.15s" />
        <Circle size={36} delay="0.20s" />
      </div>

      {/* Mobile View: Hamburger + Page Title (left), Messages + Avatar (right) */}
      <div className="flex md:hidden items-center justify-between w-full h-full">
        <div className="flex items-center gap-3">
          <Circle size={24} delay="0s" />
          <Bar w={variant === "buyer" ? 140 : 100} h={16} r={6} delay="0.05s" />
        </div>
        <div className="flex items-center gap-3">
          <Circle size={20} delay="0.10s" />
          <Circle size={32} delay="0.15s" />
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  2. HERO SKELETON                                                           *
 *  Desktop: py-10 sm:py-14, large H1 & subtext, verification card + banner  *
 *  Mobile:  py-3, compact H1, subtext, mini mobile verification & illustration*
 * ══════════════════════════════════════════════════════════════════════════ */
const HeroSkeleton = ({ variant = "buyer" }) => (
  <div style={{ background: "#EEF5F9", width: "100%" }}>
    <div
      style={{ maxWidth: 1280, margin: "0 auto", boxSizing: "border-box" }}
      className="px-4 sm:px-6 lg:px-8 py-3 sm:py-14"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        {/* Left: Heading + Subtitle + Verification Banner */}
        <div className="flex-1 max-w-full sm:max-w-xl">
          <Bar
            w={variant === "buyer" ? "72%" : "68%"}
            h={18}
            r={6}
            delay="0.05s"
            style={{ maxWidth: 440 }}
          />
          <Bar
            w="52%"
            h={10}
            r={5}
            mt={4}
            delay="0.10s"
            style={{ maxWidth: 320 }}
          />

          {/* Mobile Verification Banner + Illustration */}
          <div className="mt-3 flex items-end justify-between gap-2 sm:hidden">
            <div className="w-[248px] shrink-0 rounded-[6px] border border-[#ff8d28]/30 bg-[#fff4ea] py-2.5 px-2">
              <div className="flex items-center gap-1.5">
                <Circle size={10} delay="0.12s" />
                <Bar w={96} h={7} r={4} delay="0.14s" />
              </div>
              <div className="mt-1 flex items-center justify-between gap-1.5">
                <Bar w={110} h={5} r={3} delay="0.16s" />
                <Bar w={54} h={12} r={999} delay="0.18s" />
              </div>
            </div>
            <div className="w-[35%] opacity-60">
              <Bar w="100%" h={48} r={8} delay="0.20s" />
            </div>
          </div>

          {/* Desktop Verification Banner */}
          <div className="hidden sm:block">
            <Bar w="100%" h={56} r={12} mt={24} delay="0.15s" style={{ maxWidth: 448 }} />
          </div>
        </div>

        {/* Desktop Right Illustration Placeholder */}
        <div className="hidden sm:flex flex-1 max-w-xs items-end justify-center">
          <Bar w={230} h={180} r={16} delay="0.20s" style={{ opacity: 0.55 }} />
        </div>
      </div>
    </div>
    <div style={{ height: 1, background: "rgba(1,110,166,0.10)" }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  3. SEARCH + FILTER BAR SKELETON                                            *
 *  Desktop: py-6, multi-chip flex wrap                                       *
 *  Mobile:  py-2, single-row horizontal scrollable flex container            *
 * ══════════════════════════════════════════════════════════════════════════ */
const SearchSkeleton = () => (
  <div
    style={{ maxWidth: 1280, margin: "0 auto", boxSizing: "border-box" }}
    className="px-4 sm:px-6 lg:px-8 py-2 sm:py-6"
  >
    {/* Single horizontal scrollable row on mobile, wrap on desktop */}
    <div className="flex items-center gap-2 overflow-x-auto flex-nowrap w-full py-1 sm:py-2 scrollbar-none">
      <Pill w={200} h={36} delay="0.05s" className="min-w-[140px] sm:w-[320px] sm:h-[40px] shrink-0 sm:shrink" />
      <Pill w={100} h={36} delay="0.10s" className="sm:w-[118px] sm:h-[40px] shrink-0" />
      <Pill w={90}  h={36} delay="0.15s" className="sm:w-[104px] sm:h-[40px] shrink-0" />
      <Pill w={85}  h={36} delay="0.20s" className="sm:w-[96px]  sm:h-[40px] shrink-0" />
      <Pill w={72}  h={36} delay="0.25s" className="hidden sm:block sm:w-[78px] sm:h-[40px] shrink-0" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  4a. PROFESSIONAL CARD SKELETON                                             *
 * ══════════════════════════════════════════════════════════════════════════ */
const ProfessionalCardSkeleton = ({ delay = "0s" }) => (
  <article style={{
    background: "#F9F9F9",
    borderRadius: 16,
    border: "1px solid #EAEEF1",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}>
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      {/* Header row: avatar + name/role + bookmark */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <Circle size={44} delay={delay} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Bar w="65%" h={13} r={6} delay={delay} />
            <Bar w="45%" h={10} r={5} mt={5} delay={delay} />
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          border: "1px solid #E8ECF0",
          background: "#F0F4F6", flexShrink: 0, marginTop: 2,
        }} />
      </div>

      {/* Stars row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {[0, 0.05, 0.10, 0.15, 0.20].map((d, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: 2,
            background: shBg, backgroundSize: shBgSize,
            animation: shAnim, animationDelay: `calc(${delay} + ${d}s)`,
          }} />
        ))}
        <Bar w={55} h={9} r={5} delay={delay} style={{ marginLeft: 2 }} />
      </div>

      {/* Bio lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        <Bar w="100%" h={10} r={5} delay={delay} />
        <Bar w="92%"  h={10} r={5} delay={delay} />
        <Bar w="75%"  h={10} r={5} delay={delay} />
      </div>
    </div>

    {/* Footer */}
    <div style={{
      padding: "12px 18px 14px",
      borderTop: "1px solid #EAEEF1",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Bar w={76} h={13} r={6} delay={delay} />
      <Pill w={72} h={30} delay={delay} />
    </div>
  </article>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  4b. JOB CARD SKELETON                                                      *
 * ══════════════════════════════════════════════════════════════════════════ */
const JobCardSkeleton = ({ delay = "0s" }) => (
  <article style={{
    background: "#F9F9F9",
    borderRadius: 16,
    border: "1px solid #EAEEF1",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}>
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <Circle size={40} delay={delay} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Bar w="60%" h={13} r={6} delay={delay} />
            <Bar w="40%" h={10} r={5} mt={5} delay={delay} />
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          border: "1px solid #E8ECF0",
          background: "#F0F4F6", flexShrink: 0, marginTop: 2,
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        <Bar w="100%" h={10} r={5} delay={delay} />
        <Bar w="88%"  h={10} r={5} delay={delay} />
        <Bar w="72%"  h={10} r={5} delay={delay} />
      </div>
    </div>

    <div style={{
      padding: "12px 18px 14px",
      borderTop: "1px solid #EAEEF1",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Bar w={76} h={13} r={6} delay={delay} />
      <Pill w={64} h={30} delay={delay} />
    </div>
  </article>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  4c. RESULTS SECTION SKELETON                                               *
 *  Desktop: p-6 sm:p-8, grid-cols-3, 9 cards                                 *
 *  Mobile:  p-4, grid-cols-1, 4 cards                                        *
 * ══════════════════════════════════════════════════════════════════════════ */
const GridSkeleton = ({ cardType = "professional" }) => {
  const CardComp = cardType === "job" ? JobCardSkeleton : ProfessionalCardSkeleton;
  const delays = ["0s","0.07s","0.14s","0.07s","0.14s","0.21s","0.14s","0.21s","0.28s"];

  return (
    <div
      style={{ maxWidth: 1280, margin: "0 auto", boxSizing: "border-box" }}
      className="px-4 sm:px-6 lg:px-8 pb-12"
    >
      <div
        style={{ background: "#ffffff", borderRadius: 20, border: "1px solid #F0F4F6" }}
        className="p-4 sm:p-8"
      >
        <div className="mb-4 sm:mb-6">
          <Bar w="45%" h={16} r={7} delay="0.05s" className="sm:w-[30%] sm:h-[18px]" />
          <Bar w="25%" h={10} r={5} mt={6} delay="0.10s" className="sm:w-[18%] sm:h-[12px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {delays.map((d, i) => (
            <div key={i} className={i >= 4 ? "hidden sm:block" : "block"}>
              <CardComp delay={d} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ *
 *  5. MOBILE BOTTOM NAVIGATION SKELETON                                       *
 *  Fixed bottom navigation bar visible only on mobile screens (< 768px)       *
 * ══════════════════════════════════════════════════════════════════════════ */
const BottomNavSkeleton = () => (
  <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 h-16 flex items-center justify-around px-2 md:hidden">
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="flex flex-col items-center justify-center gap-1 flex-1">
        <Circle size={20} delay={`${i * 0.04}s`} />
        <Bar w={32} h={8} r={4} delay={`${i * 0.04 + 0.02}s`} />
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  ROOT EXPORT                                                                *
 * ══════════════════════════════════════════════════════════════════════════ */
const SkeletonLoader = ({ variant = "buyer" }) => {
  injectSK();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F8FA",
        overflowY: "hidden",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
      className="pb-20 md:pb-0"
    >
      <NavSkeleton variant={variant} />
      <HeroSkeleton variant={variant} />
      <SearchSkeleton />
      <GridSkeleton cardType={variant === "professional" ? "job" : "professional"} />
      <BottomNavSkeleton />
    </div>
  );
};

export default SkeletonLoader;

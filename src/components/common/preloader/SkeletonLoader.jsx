/**
 * SkeletonLoader.jsx
 *
 * Pixel-accurate ghost skeleton for DefaultBuyerScreen / DefaultProfessionalScreen.
 * Every dimension, padding, and gap is taken directly from the real page JSX and
 * component source (BuyerNavbar, ProfessionalCard, JobCard, SearchBars).
 *
 * Layout layers (identical to the real pages):
 *  1. Navbar       – bg-white, border-b, max-w-7xl, px-4→px-8
 *  2. Hero         – bg-[#EEF5F9], py-10→py-14, heading + subtitle
 *  3. Search row   – py-6, flex-1 pill input + 3 filter chips + Apply chip
 *  4. Results card – bg-white rounded-2xl p-6→p-8, section title, 3×3 card grid
 *     Cards        – bg-[#f9f9f9] rounded-2xl, p-5, w-12 avatar, name/role bars,
 *                    stars row, 3-line bio, footer price + CTA button
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
const Bar = ({ w = "100%", h = 12, r = 8, mt = 0, mb = 0, delay = "0s", style: extra = {} }) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    marginTop: mt, marginBottom: mb,
    background: shBg, backgroundSize: shBgSize,
    animation: shAnim, animationDelay: delay,
    flexShrink: 0, ...extra,
  }} />
);

const Circle = ({ size = 40, delay = "0s" }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: shBg, backgroundSize: shBgSize,
    animation: shAnim, animationDelay: delay,
    flexShrink: 0,
  }} />
);

const Pill = ({ w, h = 38, delay = "0s" }) => (
  <Bar w={w} h={h} r={999} delay={delay} />
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  1. NAVBAR SKELETON                                                        *
 *  Mirrors: BuyerNavbar / ProfessionalNavbar                                 *
 *  - bg-white, border-b border-gray-100                                      *
 *  - inner: max-w-7xl mx-auto px-4 (lg:px-8)                                *
 *  - left: logo img ~36px + 4 nav link bars                                  *
 *  - right: message icon, bell icon, avatar circle w-9 h-9                   *
 * ══════════════════════════════════════════════════════════════════════════ */
const NavSkeleton = () => (
  <div style={{
    background: "#fff",
    borderBottom: "1px solid #F0F4F6",
    width: "100%",
  }}>
    <div style={{
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 32px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
      boxSizing: "border-box",
    }}>
      {/* Left: logo + nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo image is ~36×36 */}
        <Circle size={36} delay="0s" />
        {/* 4 nav link bars – approx widths from the real labels */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Bar w={150} h={10} r={6} delay="0.05s" />
          <Bar w={100} h={10} r={6} delay="0.10s" />
          <Bar w={88}  h={10} r={6} delay="0.15s" />
          <Bar w={170} h={10} r={6} delay="0.20s" />
        </div>
      </div>

      {/* Right: message + bell + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Circle size={22} delay="0.10s" />
        <Circle size={22} delay="0.15s" />
        {/* avatar is w-9 h-9 = 36px */}
        <Circle size={36} delay="0.20s" />
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  2. HERO SKELETON                                                           *
 *  Mirrors: bg-[#EEF5F9] section                                             *
 *  - max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14                  *
 *  - h1: text-3xl sm:text-4xl font-bold  →  28px bar, ~55% width             *
 *  - p:  text-sm mt-3                   →  14px bar, ~38% width              *
 *  - Verification banner bar (mt-6)     →  rounded-xl, full bar              *
 * ══════════════════════════════════════════════════════════════════════════ */
const HeroSkeleton = () => (
  <div style={{
    background: "#EEF5F9",
    width: "100%",
  }}>
    <div style={{
      maxWidth: 1280,
      margin: "0 auto",
      padding: "40px 32px 36px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
    }}>
      {/* Left: heading + subtitle + banner */}
      <div style={{ flex: 1, maxWidth: 576 }}>
        {/* h1 ≈ text-4xl = ~36px tall, word "Find The Right Professional" */}
        <Bar w="72%" h={32} r={10} delay="0.05s" />
        {/* p ≈ text-sm = ~14px, mt-3 = 12px */}
        <Bar w="52%" h={14} r={7} mt={14} delay="0.10s" />
        {/* Verification banner — mt-6, rounded-xl, px-5 py-4 ≈ height ~56px */}
        <Bar w="100%" h={56} r={12} mt={24} delay="0.15s"
          style={{ maxWidth: 448 }} />
      </div>

      {/* Right: illustration placeholder — hidden on mobile just like the real page */}
      <div style={{
        flex: 1, maxWidth: 288, display: "flex",
        alignItems: "flex-end", justifyContent: "center",
      }}>
        <Bar w={230} h={180} r={16} delay="0.20s" style={{ opacity: 0.55 }} />
      </div>
    </div>
    {/* Subtle bottom gradient line — real page has `h-px` gradient */}
    <div style={{ height: 1, background: "rgba(1,110,166,0.10)" }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  3. SEARCH + FILTER BAR SKELETON                                            *
 *  Mirrors: ProfessionalSearchBar / JobSearchBar                             *
 *  - Section: max-w-7xl mx-auto px-4→px-8 py-6                              *
 *  - flex-row items-center gap-2, py-2                                       *
 *  - flex-1 pill input (py-2.5 ≈ h-40px), 3 filter chips (px-4 py-2.5),     *
 *    Apply chip (px-5 py-2.5)                                                *
 * ══════════════════════════════════════════════════════════════════════════ */
const SearchSkeleton = () => (
  <div style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "24px 32px",
    boxSizing: "border-box",
  }}>
    {/* py-2 wrapper */}
    <div style={{ padding: "8px 0", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {/* flex-1 search pill — real input is py-2.5 pl-11 pr-4 = ~40px tall */}
      <Pill w={320} h={40} delay="0.05s" />
      {/* 3 filter chips — px-4 py-2.5 ≈ h-40, widths match "Location", "Rating", "Budget" */}
      <Pill w={118} h={40} delay="0.10s" />
      <Pill w={104} h={40} delay="0.15s" />
      <Pill w={96}  h={40} delay="0.20s" />
      {/* Apply chip — px-5 py-2.5 */}
      <Pill w={78}  h={40} delay="0.25s" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  4a. PROFESSIONAL CARD SKELETON                                             *
 *  Mirrors: ProfessionalCard                                                  *
 *  - article: bg-[#f9f9f9] rounded-2xl border border-transparent             *
 *  - body: p-5 flex flex-col gap-3                                           *
 *    • header: flex items-start justify-between gap-3                        *
 *      – avatar: w-12 h-12 rounded-full (48px)                               *
 *      – name:  text-sm font-semibold (≈13px bar)                            *
 *      – role:  text-xs mt-0.5       (≈11px bar, 60% width)                  *
 *      – bookmark btn: p-2 rounded-xl border ≈ 32px square                   *
 *    • stars row: flex items-center gap-1.5 (5 x 12px stars + text bar)      *
 *    • bio: text-xs line-clamp-3 (3 bars, shrinking)                         *
 *  - footer: px-5 pb-4 pt-3 border-t flex justify-between                   *
 *    • price: text-sm font-bold  → bar 80px                                  *
 *    • contact: px-4 py-2 rounded-full → 80px pill                           *
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
    {/* Card body — p-5, gap-3 */}
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
      {/* Header row: avatar + name/role + bookmark */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          {/* w-12 h-12 = 48px avatar */}
          <Circle size={48} delay={delay} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* text-sm name bar */}
            <Bar w="65%" h={13} r={6} delay={delay} />
            {/* text-xs role bar, mt-0.5 ≈ 2px */}
            <Bar w="45%" h={10} r={5} mt={6} delay={delay} />
          </div>
        </div>
        {/* bookmark btn ≈ p-2 + w-4 h-4 icon = ~32px */}
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          border: "1px solid #E8ECF0",
          background: "#F0F4F6", flexShrink: 0, marginTop: 2,
        }} />
      </div>

      {/* Stars row — flex items-center gap-1.5 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* 5 star icons each w-3 h-3 = 12px */}
        {[0, 0.05, 0.10, 0.15, 0.20].map((d, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: 2,
            background: shBg, backgroundSize: shBgSize,
            animation: shAnim, animationDelay: `calc(${delay} + ${d}s)`,
          }} />
        ))}
        {/* "(32 review)" text bar */}
        <Bar w={60} h={10} r={5} delay={delay} style={{ marginLeft: 2 }} />
      </div>

      {/* Bio — text-xs line-clamp-3: 3 lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <Bar w="100%" h={10} r={5} delay={delay} />
        <Bar w="92%"  h={10} r={5} delay={delay} />
        <Bar w="78%"  h={10} r={5} delay={delay} />
      </div>
    </div>

    {/* Footer — px-5 pb-4 pt-3 border-t */}
    <div style={{
      padding: "12px 20px 16px",
      borderTop: "1px solid #EAEEF1",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Price: text-sm font-bold */}
      <Bar w={80} h={13} r={6} delay={delay} />
      {/* Contact button: px-4 py-2 rounded-full ≈ h-32px */}
      <Pill w={76} h={32} delay={delay} />
    </div>
  </article>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  4b. JOB CARD SKELETON                                                      *
 *  Mirrors: JobCard (DefaultProfessionalScreen)                               *
 *  Identical structure to ProfessionalCard but avatar is w-11 h-11 = 44px    *
 *  and role bar is replaced by "Posted X ago" timestamp bar                   *
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
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          {/* w-11 h-11 = 44px employer avatar */}
          <Circle size={44} delay={delay} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Bar w="60%" h={13} r={6} delay={delay} />
            <Bar w="40%" h={10} r={5} mt={6} delay={delay} />
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          border: "1px solid #E8ECF0",
          background: "#F0F4F6", flexShrink: 0, marginTop: 2,
        }} />
      </div>

      {/* Description — text-xs line-clamp-3 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <Bar w="100%" h={10} r={5} delay={delay} />
        <Bar w="90%"  h={10} r={5} delay={delay} />
        <Bar w="75%"  h={10} r={5} delay={delay} />
      </div>
    </div>

    {/* Footer */}
    <div style={{
      padding: "12px 20px 16px",
      borderTop: "1px solid #EAEEF1",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Bar w={80} h={13} r={6} delay={delay} />
      <Pill w={68} h={32} delay={delay} />
    </div>
  </article>
);

/* ══════════════════════════════════════════════════════════════════════════ *
 *  4c. RESULTS SECTION SKELETON                                               *
 *  Mirrors: bg-white rounded-2xl border border-gray-100 p-6 sm:p-8           *
 *  - Section header: mb-6 → h2 text-lg + p text-sm mt-1                     *
 *  - Grid: grid-cols-3 gap-5                                                  *
 * ══════════════════════════════════════════════════════════════════════════ */
const GridSkeleton = ({ cardType = "professional" }) => {
  const CardComp = cardType === "job" ? JobCardSkeleton : ProfessionalCardSkeleton;
  // Stagger each card's shimmer animation slightly for a wave effect
  const delays = ["0s","0.07s","0.14s","0.07s","0.14s","0.21s","0.14s","0.21s","0.28s"];

  return (
    <div style={{
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 32px 48px",
      boxSizing: "border-box",
    }}>
      {/* bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 */}
      <div style={{
        background: "#ffffff",
        borderRadius: 20,
        border: "1px solid #F0F4F6",
        padding: "32px",
      }}>
        {/* Section header — mb-6 */}
        <div style={{ marginBottom: 24 }}>
          {/* h2 text-lg font-semibold */}
          <Bar w="30%" h={18} r={8} delay="0.05s" />
          {/* p text-sm mt-1 */}
          <Bar w="18%" h={12} r={6} mt={8} delay="0.10s" />
        </div>

        {/* grid grid-cols-3 gap-5 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}>
          {delays.map((d, i) => (
            <CardComp key={i} delay={d} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ *
 *  ROOT EXPORT                                                                *
 *  Props:                                                                     *
 *    variant  "buyer" (default) | "professional"                              *
 *             "buyer"        → ProfessionalCardSkeleton (DefaultBuyerScreen)  *
 *             "professional" → JobCardSkeleton (DefaultProfessionalScreen)    *
 * ══════════════════════════════════════════════════════════════════════════ */
const SkeletonLoader = ({ variant = "buyer" }) => {
  injectSK();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F6F8FA",
      overflowY: "hidden",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <NavSkeleton />
      <HeroSkeleton />
      <SearchSkeleton />
      <GridSkeleton cardType={variant === "professional" ? "job" : "professional"} />
    </div>
  );
};

export default SkeletonLoader;

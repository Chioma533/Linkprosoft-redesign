/**
 * DashboardShellSkeleton.jsx
 *
 * Ghost skeleton of DashboardLayout + DashboardSidebar + DashboardNavbar.
 * Renders the chrome around whichever subpage skeleton is passed as children.
 *
 * Sidebar (desktop collapsed = w-16):
 *   bg-[#f9f9f9] border-r border-[#E6F1F6] w-16 h-screen
 *   – logo circle w-10 h-10 (py-6 px-3)
 *   – 6 nav icon stubs w-6 h-6 spaced vertically
 *   – avatar stub w-8 h-8 at bottom
 *
 * Top Navbar (h-20 bg-[#f9f9f9] border-b-2 border-[#E6F1F6]):
 *   – left: hamburger w-5 h-5 + title bar
 *   – right: search pill + message + bell + avatar w-9 h-9
 *
 * Main: flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto (renders children)
 */

/* ─────────────────── Shimmer injection (shared keyframe) ─────────────────── */
const SK_KF = `
@keyframes sk-shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position:  800px 0; }
}
`;
export function injectSK() {
  if (typeof document === "undefined") return;
  if (document.getElementById("skeleton-kf")) return;
  const t = document.createElement("style");
  t.id = "skeleton-kf";
  t.textContent = SK_KF;
  document.head.appendChild(t);
}

// Auto-inject immediately in browser context
if (typeof document !== "undefined") {
  injectSK();
}

/* ─────────────────── Primitive building blocks ───────────────────────────── */
const BASE = "#EAEFF3", SHINE = "#F8FAFB";
const shBg   = `linear-gradient(90deg,${BASE} 25%,${SHINE} 50%,${BASE} 75%)`;
const shSize = "1600px 100%";
const shAnim = "sk-shimmer 1.8s ease-in-out infinite";

export const Bar = ({ w="100%", h=12, r=8, mt=0, mb=0, delay="0s", style:x={} }) => {
  injectSK();
  return (
    <div style={{ width:w, height:h, borderRadius:r, marginTop:mt, marginBottom:mb,
      background:shBg, backgroundSize:shSize, animation:shAnim,
      animationDelay:delay, flexShrink:0, ...x }} />
  );
};

export const Circle = ({ size=40, delay="0s" }) => (
  <div style={{ width:size, height:size, borderRadius:"50%",
    background:shBg, backgroundSize:shSize, animation:shAnim,
    animationDelay:delay, flexShrink:0 }} />
);

export const Pill = ({ w, h=36, delay="0s" }) => (
  <Bar w={w} h={h} r={999} delay={delay} />
);

/* ─────────────────── Sidebar skeleton ────────────────────────────────────── */
const SidebarSkeleton = () => (
  <div style={{
    width: 64, minWidth: 64, height: "100vh",
    background: "#f9f9f9",
    borderRight: "1px solid #E6F1F6",
    display: "flex", flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    boxSizing: "border-box",
  }}>
    {/* Logo */}
    <div style={{ padding: "24px 12px" }}>
      <Circle size={40} />
    </div>

    {/* Nav icon stubs – 6 items */}
    <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center", flex:1 }}>
      {[0,0.04,0.08,0.12,0.16,0.20].map((d,i) => (
        <Circle key={i} size={24} delay={`${d}s`} />
      ))}
    </div>

    {/* Avatar at bottom */}
    <div style={{ padding: "20px 12px" }}>
      <Circle size={32} delay="0.10s" />
    </div>
  </div>
);

/* ─────────────────── Navbar skeleton ─────────────────────────────────────── */
const NavbarSkeleton = () => (
  <header style={{
    height: 80, background: "#f9f9f9",
    borderBottom: "2px solid #E6F1F6",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", boxSizing: "border-box",
    flexShrink: 0,
  }}>
    {/* Left: hamburger icon + page title */}
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ width:20, height:16, borderRadius:4,
        background:shBg, backgroundSize:shSize, animation:shAnim }} />
      <Bar w={140} h={14} r={7} delay="0.05s" />
    </div>

    {/* Right: search + message + bell + avatar */}
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      <Pill w={128} h={34} delay="0.05s" />
      <Circle size={24} delay="0.08s" />
      <Circle size={24} delay="0.11s" />
      <Circle size={36} delay="0.14s" />
    </div>
  </header>
);

/* ─────────────────── Root shell ───────────────────────────────────────────── */
const DashboardShellSkeleton = ({ children }) => {
  injectSK();
  return (
    <div style={{
      display:"flex", background:"rgba(235,243,250,0.30)",
      height:"100vh", overflow:"hidden",
      fontFamily:"'Inter','Segoe UI',sans-serif",
    }}>
      {/* Sidebar — desktop only (hidden on mobile just like real layout) */}
      <SidebarSkeleton />

      {/* Main column */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <NavbarSkeleton />

        {/* Scrollable content */}
        <main style={{
          flex:1, padding:"32px", overflowY:"hidden",
          maxWidth:1280, width:"100%", margin:"0 auto",
          boxSizing:"border-box",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShellSkeleton;

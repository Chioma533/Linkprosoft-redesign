import React, { useState } from "react";
import Preloader              from "../components/common/preloader/PreLoader";
import LoadingScreen          from "../components/common/preloader/LoadingScreen";
import DashboardLoadingScreen from "../components/common/preloader/DashboardLoadingScreen";

/* ─── Section heading ──────────────────────────────────────────────────── */
const SectionHeading = ({ children }) => (
  <h2 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em",
    textTransform:"uppercase", color:"#9CA3AF", marginBottom:10 }}>
    {children}
  </h2>
);

/* ─── Small replay button ──────────────────────────────────────────────── */
const ReplayBtn = ({ id, label, color = "#016EA6", onClick }) => (
  <button
    id={id}
    onClick={onClick}
    style={{
      padding:"8px 14px", borderRadius:10, fontSize:12,
      fontWeight:600, color:"#fff", cursor:"pointer", border:"none",
      background:color, transition:"filter 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.filter="brightness(0.88)"}
    onMouseLeave={e => e.currentTarget.style.filter="brightness(1)"}
  >
    {label}
  </button>
);

/* ─── Dashboard subpage button row ────────────────────────────────────── */
const DASHBOARD_SUBPAGES = [
  { id:"overview",            label:"Overview",            color:"#016EA6" },
  { id:"my-jobs",             label:"My Jobs",             color:"#1D4ED8" },
  { id:"applications",        label:"Applications",        color:"#7C3AED" },
  { id:"schedule",            label:"Schedule",            color:"#0F766E" },
  { id:"wallet",              label:"Wallet",              color:"#B45309" },
  { id:"profile",             label:"Profile",             color:"#BE185D" },
  { id:"chat",                label:"Chat",                color:"#1E3A5F" },
  { id:"browse-jobs",         label:"Browse Jobs",         color:"#065F46" },
  { id:"browse-professionals",label:"Browse Professionals",color:"#831843" },
  { id:"manage-jobs",         label:"Manage Jobs (Emp)",   color:"#374151" },
];

/* ─── Main page ────────────────────────────────────────────────────────── */
const TestPreloaderPage = () => {
  /* ── Preloader-only ──────────────────────────────────────────────────── */
  const [preKey,     setPreKey]     = useState(0);
  const [preVisible, setPreVisible] = useState(false);

  /* ── Full-page LoadingScreen ─────────────────────────────────────────── */
  const [lsKey,      setLsKey]      = useState(0);
  const [lsVisible,  setLsVisible]  = useState(false);
  const [lsVariant,  setLsVariant]  = useState("buyer");

  /* ── Dashboard LoadingScreen ─────────────────────────────────────────── */
  const [dbKey,      setDbKey]      = useState(0);
  const [dbVisible,  setDbVisible]  = useState(false);
  const [dbSubpage,  setDbSubpage]  = useState("overview");

  /* ── Auto-loop ───────────────────────────────────────────────────────── */
  const [autoLoop, setAutoLoop] = useState(false);

  /* helpers */
  const replay = (setVisible, setKey, extra) => {
    setVisible(false);
    setTimeout(() => { extra?.(); setKey(k => k + 1); setVisible(true); }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6"
      style={{ fontFamily:"'Inter','Segoe UI',sans-serif" }}>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Loading State Sandbox</h1>
            <p className="text-gray-500 text-sm mt-1">
              Replay any loading state on demand. Auto-loop fires them continuously.
            </p>
          </div>

          {/* ── SECTION 1: Preloader only ─────────────────────────────── */}
          <div>
            <SectionHeading>1 — Preloader (standalone)</SectionHeading>
            <ReplayBtn
              id="replay-preloader-btn"
              label="▶ Preloader Only"
              onClick={() => replay(setPreVisible, setPreKey)}
            />
          </div>

          {/* ── SECTION 2: Full-page Loading Screen ──────────────────── */}
          <div>
            <SectionHeading>2 — Full-page loading screen (default screens)</SectionHeading>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              <ReplayBtn
                id="replay-buyer-loading-btn"
                label="▶ Buyer Screen"
                color="#1D4ED8"
                onClick={() => replay(setLsVisible, setLsKey, () => setLsVariant("buyer"))}
              />
              <ReplayBtn
                id="replay-professional-loading-btn"
                label="▶ Professional Screen"
                color="#7C3AED"
                onClick={() => replay(setLsVisible, setLsKey, () => setLsVariant("professional"))}
              />
            </div>
          </div>

          {/* ── SECTION 3: Dashboard Loading Screen ──────────────────── */}
          <div>
            <SectionHeading>3 — Dashboard loading screen (per subpage)</SectionHeading>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {DASHBOARD_SUBPAGES.map(({ id, label, color }) => (
                <ReplayBtn
                  key={id}
                  id={`replay-dashboard-${id}-btn`}
                  label={`▶ ${label}`}
                  color={color}
                  onClick={() => replay(setDbVisible, setDbKey, () => setDbSubpage(id))}
                />
              ))}
            </div>
          </div>

          {/* ── Auto-loop ─────────────────────────────────────────────── */}
          <div className="border-t pt-5">
            <label style={{ display:"flex", alignItems:"center", gap:8,
              fontSize:13, color:"#6B7280", cursor:"pointer" }}>
              <input
                type="checkbox" checked={autoLoop}
                onChange={e => setAutoLoop(e.target.checked)}
                style={{ width:16, height:16, accentColor:"#016EA6" }}
              />
              Auto Loop (replays the last demo when it finishes)
            </label>
          </div>
        </div>
      </div>

      {/* ── Overlay renders ───────────────────────────────────────────── */}
      {preVisible && (
        <Preloader key={preKey} onFinish={() => {
          setPreVisible(false);
          if (autoLoop) setTimeout(() => replay(setPreVisible, setPreKey), 800);
        }} />
      )}

      {lsVisible && (
        <LoadingScreen key={lsKey} variant={lsVariant} onFinish={() => {
          setLsVisible(false);
          if (autoLoop) setTimeout(() => replay(setLsVisible, setLsKey, () => setLsVariant(lsVariant)), 800);
        }} />
      )}

      {dbVisible && (
        <DashboardLoadingScreen key={dbKey} subpage={dbSubpage} onFinish={() => {
          setDbVisible(false);
          if (autoLoop) setTimeout(() => replay(setDbVisible, setDbKey, () => setDbSubpage(dbSubpage)), 800);
        }} />
      )}
    </div>
  );
};

export default TestPreloaderPage;

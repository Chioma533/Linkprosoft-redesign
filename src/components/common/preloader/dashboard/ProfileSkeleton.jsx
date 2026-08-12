/**
 * ProfileSkeleton.jsx
 *
 * Ghost skeleton of ProfileSubpage (professional dashboard).
 *
 * Layout (space-y-8):
 *  1. Cover + Profile card
 *       – Cover banner  h-48 (shimmer rectangle)
 *       – Floating avatar  w-28 h-28 rounded-full  (absolute -top-16 left-8)
 *       – Name + role + location row (pt-16 px-8 pb-6)
 *       – Edit button top-right
 *  2. 3 stats cards (grid-cols-3)
 *  3. Skills section (bg-white rounded-3xl p-6)
 *       – Title + 6 pill bars
 *  4. Certifications (bg-white rounded-3xl p-6)
 *       – 3 rows: icon circle + 2 bars
 *  5. Portfolio grid (grid-cols-2 gap-4)
 *       – 4 cards: image rect h-36 + label bar
 *  6. Reviews (bg-white rounded-3xl p-6)
 *       – 2 review blocks
 */

import { Bar, Circle, Pill } from "./DashboardShellSkeleton";

/* ── Certification row ──────────────────────────────────────────────────── */
const CertRow = ({ delay = "0s" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14,
    padding: "12px 0", borderBottom: "1px solid #F5F7FA" }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EAF1F6", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <Bar w="55%" h={11} r={6} delay={delay} />
      <Bar w="40%" h={9}  r={5} mt={5} delay={delay} />
    </div>
  </div>
);

/* ── Review block ───────────────────────────────────────────────────────── */
const ReviewBlock = ({ delay = "0s" }) => (
  <div style={{ padding: "16px 0", borderBottom: "1px solid #F5F7FA" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <Circle size={36} delay={delay} />
      <div>
        <Bar w={100} h={11} r={6} delay={delay} />
        <Bar w={60}  h={9}  r={5} mt={4} delay={delay} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width:12, height:12, borderRadius:2,
            background:"#EAF1F6" }} />
        ))}
      </div>
    </div>
    <Bar w="90%" h={10} r={5} delay={delay} />
    <Bar w="75%" h={10} r={5} mt={6} delay={delay} />
    <Bar w="55%" h={10} r={5} mt={6} delay={delay} />
  </div>
);

/* ── Main export ────────────────────────────────────────────────────────── */
const ProfileSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

    {/* 1. Cover + Profile card */}
    <div style={{ background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", overflow: "hidden" }}>

      {/* Cover banner — h-48 = 192px */}
      <div style={{
        height: 192, position: "relative",
        background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)",
        backgroundSize: "1600px 100%",
        animation: "sk-shimmer 1.8s ease-in-out infinite",
      }}>
        {/* Floating avatar — absolute -top-16 left-8 relative to the card below */}
        {/* We position it at the bottom of the cover */}
        <div style={{
          position: "absolute", bottom: -56, left: 32,
          width: 112, height: 112, borderRadius: "50%",
          border: "4px solid #fff",
          background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)",
          backgroundSize: "1600px 100%",
          animation: "sk-shimmer 1.8s ease-in-out infinite",
          zIndex: 1,
        }} />
      </div>

      {/* Profile info area — px-8 pb-8, pt-16 to clear the floating avatar */}
      <div style={{ padding: "64px 32px 32px", position: "relative" }}>
        {/* Edit button — top-right */}
        <div style={{ position: "absolute", top: 16, right: 32 }}>
          <Pill w={96} h={34} delay="0.05s" />
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Bar w={200} h={20} r={8} />
          <Pill w={44} h={22} delay="0.05s" />
        </div>
        <Bar w={280} h={11} r={6} mt={6} delay="0.05s" />

        {/* Location + member-since row */}
        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          <Bar w={90}  h={9} r={5} delay="0.08s" />
          <Bar w={130} h={9} r={5} delay="0.10s" />
        </div>
      </div>
    </div>

    {/* 2. 3 stats cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
      {["0s","0.05s","0.10s"].map((d, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 24,
          border: "1px solid #F0F4F6", padding: 20,
          display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12,
            background: "#EAF1F6", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Bar w="55%" h={11} r={6} delay={d} />
            <Bar w="40%" h={20} r={8} mt={7} delay={d} />
          </div>
        </div>
      ))}
    </div>

    {/* 3. Skills */}
    <div style={{ background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", padding: 24 }}>
      <Bar w={60} h={14} r={7} mb={20} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {[80, 100, 72, 90, 68, 84].map((w, i) => (
          <Pill key={i} w={w} h={30} delay={`${i * 0.04}s`} />
        ))}
      </div>
    </div>

    {/* 4. Certifications */}
    <div style={{ background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", padding: 24 }}>
      <Bar w={120} h={14} r={7} mb={8} />
      {["0s","0.06s","0.12s"].map((d, i) => (
        <CertRow key={i} delay={d} />
      ))}
    </div>

    {/* 5. Portfolio grid — grid-cols-2 gap-4 */}
    <div>
      <Bar w={80} h={14} r={7} mb={16} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {["0s","0.05s","0.10s","0.15s"].map((d, i) => (
          <div key={i}>
            <div style={{
              height: 144, borderRadius: 16,
              background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)",
              backgroundSize: "1600px 100%",
              animation: "sk-shimmer 1.8s ease-in-out infinite",
              animationDelay: d,
            }} />
            <Bar w="60%" h={11} r={6} mt={8} delay={d} />
            <Bar w="40%" h={9}  r={5} mt={4} delay={d} />
          </div>
        ))}
      </div>
    </div>

    {/* 6. Reviews */}
    <div style={{ background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 8 }}>
        <Bar w={70} h={14} r={7} />
        <Bar w={40} h={11} r={6} delay="0.05s" />
      </div>
      <ReviewBlock delay="0.05s" />
      <ReviewBlock delay="0.10s" />
    </div>

  </div>
);

export default ProfileSkeleton;

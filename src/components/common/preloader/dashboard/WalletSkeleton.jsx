/**
 * WalletSkeleton.jsx
 *
 * Ghost skeleton of WalletSubpage (shared by professional + employer).
 *
 * Layout (space-y-8):
 *  1. Welcome header
 *  2. Outer pale-blue wrapper (bg-[#E6F1F6] p-5 rounded-3xl)
 *       a. Dark wallet banner (bg-[#00273A] rounded-3xl p-6/p-8)
 *            – Left: currency badge + balance + sub-text + CTA buttons
 *            – Right: decorative image placeholder
 *       b. 4 stats cards (grid-cols-4 gap-4 mt-4)
 *  3. Active Escrow card  (bg-white rounded-3xl p-6)
 *       – title + 4 escrow rows
 *  4. Recent Transactions (bg-white rounded-3xl p-6)
 *       – title + filter select + 3 transaction rows
 */

import { Bar, Circle, Pill } from "./DashboardShellSkeleton";

/* ── Escrow row ─────────────────────────────────────────────────────────── */
const EscrowRow = ({ delay = "0s" }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 0", borderBottom: "1px solid #F5F7FA", gap: 12 }}>
    <div style={{ flex: 1 }}>
      <Bar w="55%" h={11} r={6} delay={delay} />
      <Bar w="38%" h={9} r={5} mt={5} delay={delay} />
    </div>
    <Bar w={90} h={14} r={7} delay={delay} />
    <Pill w={90} h={26} delay={delay} />
    <Pill w={80} h={30} delay={delay} />
  </div>
);

/* ── Transaction row ────────────────────────────────────────────────────── */
const TxRow = ({ delay = "0s" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14,
    padding: "14px 0", borderBottom: "1px solid #F5F7FA" }}>
    {/* Icon circle */}
    <Circle size={40} delay={delay} />
    <div style={{ flex: 1 }}>
      <Bar w="42%" h={12} r={6} delay={delay} />
      <Bar w="30%" h={9}  r={5} mt={5} delay={delay} />
    </div>
    <div style={{ textAlign: "right" }}>
      <Bar w={80} h={12} r={6} delay={delay} />
      <Pill w={72} h={20} delay={delay} style={{ marginTop: 5 }} />
    </div>
  </div>
);

/* ── Main export ────────────────────────────────────────────────────────── */
const WalletSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

    {/* 1. Welcome header */}
    <div>
      <Bar w={240} h={26} r={10} />
      <Bar w={300} h={13} r={7} mt={8} delay="0.04s" />
    </div>

    {/* 2. Outer pale-blue wrapper */}
    <div style={{ background: "#E6F1F6", borderRadius: 24, padding: 20 }}>

      {/* 2a. Dark wallet banner */}
      <div style={{
        background: "#00273A", borderRadius: 24,
        padding: "32px", position: "relative",
        overflow: "hidden", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        minHeight: 176,
      }}>
        {/* Left content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, zIndex: 1 }}>
          {/* Currency badge */}
          <div style={{ width: 60, height: 28, borderRadius: 10,
            background: "rgba(255,255,255,0.12)", display: "flex",
            alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 32, height: 10, borderRadius: 5,
              background: "rgba(255,255,255,0.35)" }} />
          </div>
          {/* Balance */}
          <div style={{ width: 160, height: 28, borderRadius: 8,
            background: "rgba(255,255,255,0.20)" }} />
          {/* Sub-text */}
          <div style={{ width: 100, height: 10, borderRadius: 5,
            background: "rgba(255,255,255,0.15)" }} />
          {/* Button row */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <div style={{ width: 110, height: 36, borderRadius: 20,
              background: "rgba(255,255,255,0.18)" }} />
            <div style={{ width: 96, height: 36, borderRadius: 20,
              background: "rgba(255,255,255,0.12)" }} />
          </div>
        </div>

        {/* Right: decorative image placeholder */}
        <div style={{ width: 140, height: 120, borderRadius: 16,
          background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
      </div>

      {/* 2b. 4 stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 16, marginTop: 16 }}>
        {["0s","0.05s","0.10s","0.15s"].map((d, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 20, padding: "16px",
            display: "flex", alignItems: "center", gap: 12,
            border: "1px solid rgba(1,110,166,0.06)",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10,
              background: "#EAF1F6", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Bar w="55%" h={10} r={5} delay={d} />
              <Bar w="40%" h={18} r={7} mt={7} delay={d} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 3. Active Escrow */}
    <div style={{ background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20 }}>
        <Bar w={130} h={14} r={7} />
        <Pill w={80} h={28} delay="0.05s" />
      </div>
      {["0s","0.05s","0.10s","0.15s"].map((d, i) => (
        <EscrowRow key={i} delay={d} />
      ))}
    </div>

    {/* 4. Recent Transactions */}
    <div style={{ background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20 }}>
        <Bar w={160} h={14} r={7} />
        <div style={{ display: "flex", gap: 8 }}>
          <Pill w={72}  h={28} delay="0.05s" />
          <Pill w={80}  h={28} delay="0.08s" />
        </div>
      </div>
      {["0s","0.06s","0.12s"].map((d, i) => (
        <TxRow key={i} delay={d} />
      ))}
    </div>

  </div>
);

export default WalletSkeleton;

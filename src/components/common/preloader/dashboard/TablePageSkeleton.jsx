/**
 * TablePageSkeleton.jsx
 *
 * Shared skeleton for all table-based dashboard subpages:
 *   - My Jobs (professional)
 *   - Applications (professional)
 *   - Manage Jobs (employer)
 *   - Schedule (professional)
 *   - Job Details (employer)
 *   - Open Dispute (employer)
 *
 * Layout (space-y-8):
 *  1. Welcome header
 *  2. 4 stats cards (grid-cols-4) — optional via showStats prop
 *  3. Filter bar (search pill + filter chips + action button)
 *  4. White card with table (thead + rows)
 *
 * Props:
 *  cols      — number of table columns (default 6)
 *  rows      — number of data rows (default 7)
 *  showStats — render stats row (default true)
 *  showFilter— render filter bar (default true)
 */

import { Bar, Circle, Pill } from "./DashboardShellSkeleton";

/* ── Stat card ──────────────────────────────────────────────────────────── */
const StatCardSk = ({ delay = "0s" }) => (
  <div style={{
    background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6",
    padding: "20px", display: "flex", alignItems: "center", gap: 16,
  }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EAF1F6", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <Bar w="55%" h={11} r={6} delay={delay} />
      <Bar w="38%" h={20} r={8} mt={8} delay={delay} />
    </div>
  </div>
);

/* ── Table header cell ──────────────────────────────────────────────────── */
const ThSk = ({ w = 55, delay = "0s" }) => (
  <th style={{ paddingBottom: 12, paddingRight: 16, textAlign: "left" }}>
    <Bar w={w} h={9} r={5} delay={delay} />
  </th>
);

/* ── Table data row ─────────────────────────────────────────────────────── */
const TrSk = ({ cols = 6, delay = "0s" }) => {
  // Each column gets a proportionally different width for realism
  const widths = [70, "72%", 80, 90, 68, 80];
  return (
    <tr style={{ borderBottom: "1px solid #F7F9FB" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "13px 16px 13px 0" }}>
          {i === cols - 1 ? (
            /* Last col is usually an action button */
            <Pill w={80} h={28} delay={delay} />
          ) : i === cols - 2 ? (
            /* Second-to-last col is often a status badge */
            <Pill w={72} h={22} delay={delay} />
          ) : (
            <Bar w={widths[i] ?? "60%"} h={10} r={6} delay={delay} />
          )}
        </td>
      ))}
    </tr>
  );
};

/* ── Main export ────────────────────────────────────────────────────────── */
const TablePageSkeleton = ({
  cols = 6,
  rows = 7,
  showStats = true,
  showFilter = true,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

    {/* 1. Welcome header */}
    <div>
      <Bar w={220} h={26} r={10} />
      <Bar w={160} h={13} r={7} mt={8} delay="0.04s" />
    </div>

    {/* 2. Stats row */}
    {showStats && (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
        {["0s", "0.05s", "0.10s", "0.15s"].map((d, i) => (
          <StatCardSk key={i} delay={d} />
        ))}
      </div>
    )}

    {/* 3. Filter bar */}
    {showFilter && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Search pill — flex-1 style */}
        <div style={{
          position: "relative", flex: "0 0 auto",
          width: 240, height: 38, borderRadius: 999,
          background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)",
          backgroundSize: "1600px 100%",
          animation: "sk-shimmer 1.8s ease-in-out infinite",
        }} />
        <Pill w={112} h={38} delay="0.05s" />
        <Pill w={104} h={38} delay="0.09s" />
        <Pill w={96}  h={38} delay="0.13s" />
        <Pill w={88}  h={38} delay="0.17s" />
      </div>
    )}

    {/* 4. Table card */}
    <div style={{
      background: "#fff", borderRadius: 24,
      border: "1px solid #F0F4F6", padding: 24,
    }}>
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24 }}>
        <Bar w={120} h={14} r={7} />
        <div style={{ display: "flex", gap: 8 }}>
          <Pill w={72}  h={30} delay="0.05s" />
          <Pill w={88}  h={30} delay="0.08s" />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F0F4F6" }}>
              {[60, 80, 60, 70, 58, 56].slice(0, cols).map((w, i) => (
                <ThSk key={i} w={w} delay={`${i * 0.03}s`} />
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TrSk key={i} cols={cols} delay={`${i * 0.04}s`} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 20, paddingTop: 16, borderTop: "1px solid #F5F7FA" }}>
        <Bar w={90} h={10} r={5} delay="0.05s" />
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i === 0 ? "#016EA6" : "#EEF3F6",
            }} />
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default TablePageSkeleton;

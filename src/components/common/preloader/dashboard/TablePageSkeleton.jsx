import React from "react";
import { Bar, Circle, Pill, useIsMobile } from "./DashboardShellSkeleton";

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

const ThSk = ({ w = 55, delay = "0s" }) => (
  <th style={{ paddingBottom: 12, paddingRight: 16, textAlign: "left" }}>
    <Bar w={w} h={9} r={5} delay={delay} />
  </th>
);

const TrSk = ({ cols = 6, delay = "0s" }) => {
  const widths = [70, "72%", 80, 90, 68, 80];
  return (
    <tr style={{ borderBottom: "1px solid #F7F9FB" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "13px 16px 13px 0" }}>
          {i === cols - 1 ? (
            <Pill w={80} h={28} delay={delay} />
          ) : i === cols - 2 ? (
            <Pill w={72} h={22} delay={delay} />
          ) : (
            <Bar w={widths[i] ?? "60%"} h={10} r={6} delay={delay} />
          )}
        </td>
      ))}
    </tr>
  );
};

const TableRowMobile = ({ delay = "0s" }) => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F4F6", padding: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <Bar w={88} h={10} r={5} delay={delay} />
      <Pill w={62} h={22} delay={delay} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Bar w="70%" h={9} r={5} delay={delay} />
      <Bar w="60%" h={9} r={5} delay={delay} />
      <Bar w="78%" h={9} r={5} delay={delay} />
    </div>
  </div>
);

const TablePageSkeleton = ({ cols = 6, rows = 7, showStats = true, showFilter = true }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", padding: 14 }}>
          <Bar w={180} h={20} r={8} />
          <Bar w={120} h={10} r={5} mt={8} delay="0.04s" />
        </div>

        {showStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {["0s", "0.05s", "0.10s", "0.15s"].map((d, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0F4F6", padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#EAF1F6", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Bar w="60%" h={8} r={4} delay={d} />
                  <Bar w="45%" h={12} r={6} mt={6} delay={d} />
                </div>
              </div>
            ))}
          </div>
        )}

        {showFilter && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            <div style={{ minWidth: 150, height: 34, borderRadius: 999, background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite" }} />
            <Pill w={84} h={34} delay="0.05s" />
            <Pill w={78} h={34} delay="0.09s" />
            <Pill w={72} h={34} delay="0.13s" />
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Bar w={100} h={12} r={6} />
            <Pill w={56} h={24} delay="0.04s" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
              <TableRowMobile key={i} delay={`${i * 0.04}s`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <Bar w={220} h={26} r={10} />
        <Bar w={160} h={13} r={7} mt={8} delay="0.04s" />
      </div>

      {showStats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {["0s", "0.05s", "0.10s", "0.15s"].map((d, i) => (
            <StatCardSk key={i} delay={d} />
          ))}
        </div>
      )}

      {showFilter && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "0 0 auto", width: 240, height: 38, borderRadius: 999, background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite" }} />
          <Pill w={112} h={38} delay="0.05s" />
          <Pill w={104} h={38} delay="0.09s" />
          <Pill w={96}  h={38} delay="0.13s" />
          <Pill w={88}  h={38} delay="0.17s" />
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Bar w={120} h={14} r={7} />
          <div style={{ display: "flex", gap: 8 }}>
            <Pill w={72}  h={30} delay="0.05s" />
            <Pill w={88}  h={30} delay="0.08s" />
          </div>
        </div>

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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: "1px solid #F5F7FA" }}>
          <Bar w={90} h={10} r={5} delay="0.05s" />
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "#016EA6" : "#EEF3F6" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePageSkeleton;

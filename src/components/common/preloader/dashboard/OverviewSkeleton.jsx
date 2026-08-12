/**
 * OverviewSkeleton.jsx
 *
 * Covers both OverviewSubpage (professional) and EmployerOverviewSubpage.
 *
 * Layout (space-y-8):
 *  1. Welcome header   — h2 (text-2xl) + subtitle (text-sm)
 *  2. 4 stats cards    — grid grid-cols-4 gap-6
 *  3. Middle grid      — grid grid-cols-3 gap-8
 *       Left col-span-2: white card with table header + 6 rows × 5 cols
 *       Right col-span-1: messages/right-panel with 4 message rows
 *  4. Bottom grid      — grid grid-cols-3 gap-8
 *       3 white cards (notifications, performance, recent jobs)
 */

import { Bar, Circle, Pill } from "./DashboardShellSkeleton";

/* ── Stat card ──────────────────────────────────────────────────────────── */
const StatCardSk = ({ delay = "0s" }) => (
  <div style={{
    background:"#fff", borderRadius:24, border:"1px solid #F0F4F6",
    padding:"20px", display:"flex", alignItems:"center", gap:16,
  }}>
    {/* Icon square */}
    <div style={{ width:40, height:40, borderRadius:12,
      background:"#EAF1F6", flexShrink:0 }} />
    <div style={{ flex:1 }}>
      <Bar w="55%" h={11} r={6} delay={delay} />
      <Bar w="38%" h={20} r={8} mt={8} delay={delay} />
    </div>
  </div>
);

/* ── Single table row ───────────────────────────────────────────────────── */
const TableRow = ({ cols = 5, delay = "0s" }) => (
  <tr style={{ borderBottom:"1px solid #F5F7FA" }}>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding:"14px 0", paddingRight:16 }}>
        <Bar w={i === 0 ? 70 : i === 1 ? "85%" : i === 2 ? 80 : i === 3 ? 60 : 72}
             h={10} r={6} delay={delay} />
      </td>
    ))}
  </tr>
);

/* ── Message row ────────────────────────────────────────────────────────── */
const MessageRow = ({ delay = "0s" }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
    borderBottom:"1px solid #F5F7FA" }}>
    <Circle size={36} delay={delay} />
    <div style={{ flex:1 }}>
      <Bar w="50%" h={11} r={6} delay={delay} />
      <Bar w="75%" h={9} r={5} mt={5} delay={delay} />
    </div>
    <Bar w={32} h={9} r={5} delay={delay} />
  </div>
);

/* ── Notification row ───────────────────────────────────────────────────── */
const NotifRow = ({ delay = "0s" }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0",
    borderBottom:"1px solid #F5F7FA" }}>
    <div style={{ width:8, height:8, borderRadius:"50%",
      background:"#016EA6", flexShrink:0, marginTop:3 }} />
    <div style={{ flex:1 }}>
      <Bar w="80%" h={10} r={6} delay={delay} />
      <Bar w="45%" h={9} r={5} mt={5} delay={delay} />
    </div>
  </div>
);

/* ── Performance metric row ─────────────────────────────────────────────── */
const PerfRow = ({ delay = "0s" }) => (
  <div style={{ display:"flex", alignItems:"center", gap:16,
    background:"#F9FAFB", padding:12, borderRadius:16, marginBottom:12 }}>
    <Circle size={40} delay={delay} />
    <div style={{ flex:1 }}>
      <Bar w="50%" h={11} r={6} delay={delay} />
      <Bar w="70%" h={9} r={5} mt={5} delay={delay} />
    </div>
  </div>
);

/* ── Main export ────────────────────────────────────────────────────────── */
const OverviewSkeleton = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:32 }}>

    {/* 1. Welcome header */}
    <div>
      <Bar w={220} h={26} r={10} />
      <Bar w={160} h={13} r={7} mt={8} delay="0.05s" />
    </div>

    {/* 2. Stats row — grid-cols-4 */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
      {["0s","0.05s","0.10s","0.15s"].map((d,i) => (
        <StatCardSk key={i} delay={d} />
      ))}
    </div>

    {/* 3. Middle grid — col-span-2 table + col-span-1 messages */}
    <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:32 }}>

      {/* Active Jobs table */}
      <div style={{ background:"#fff", borderRadius:24,
        border:"1px solid #F0F4F6", padding:24 }}>
        {/* Card header */}
        <div style={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", marginBottom:24 }}>
          <Bar w={110} h={14} r={7} />
          <div style={{ display:"flex", gap:8 }}>
            <Pill w={70}  h={30} delay="0.05s" />
            <Pill w={90}  h={30} delay="0.08s" />
            <Pill w={100} h={30} delay="0.11s" />
          </div>
        </div>

        {/* Table */}
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #F0F4F6" }}>
              {["Order ID","Job title","Category","Client","Status","Payment"].map((_, i) => (
                <th key={i} style={{ paddingBottom:12, paddingRight:16 }}>
                  <Bar w={i===0?60:i===1?70:55} h={9} r={5} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["0s","0.04s","0.08s","0.12s","0.16s"].map((d, i) => (
              <TableRow key={i} cols={6} delay={d} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Messages panel */}
      <div style={{ background:"#fff", borderRadius:24,
        border:"1px solid #F0F4F6", padding:24,
        display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:24 }}>
            <Bar w={130} h={14} r={7} />
            <Bar w={50}  h={11} r={6} delay="0.05s" />
          </div>
          {["0s","0.05s","0.10s","0.15s"].map((d, i) => (
            <MessageRow key={i} delay={d} />
          ))}
        </div>
        {/* "View all" link */}
        <div style={{ borderTop:"1px solid #F5F7FA", paddingTop:16,
          marginTop:16, textAlign:"center" }}>
          <Bar w={100} h={10} r={6} style={{ margin:"0 auto" }} />
        </div>
      </div>
    </div>

    {/* 4. Bottom grid — grid-cols-3 */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32 }}>

      {/* Notifications */}
      <div style={{ background:"#fff", borderRadius:24,
        border:"1px solid #F0F4F6", padding:24 }}>
        <div style={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", marginBottom:24 }}>
          <Bar w={110} h={14} r={7} />
          <Bar w={50}  h={11} r={6} delay="0.05s" />
        </div>
        {["0s","0.05s","0.10s","0.15s","0.20s"].map((d, i) => (
          <NotifRow key={i} delay={d} />
        ))}
      </div>

      {/* Performance */}
      <div style={{ background:"#fff", borderRadius:24,
        border:"1px solid #F0F4F6", padding:24 }}>
        <div style={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", marginBottom:24 }}>
          <Bar w={130} h={14} r={7} />
          <Bar w={70}  h={22} r={6} delay="0.05s" />
        </div>
        <PerfRow delay="0.05s" />
        <PerfRow delay="0.10s" />
        <PerfRow delay="0.15s" />
      </div>

      {/* Recent Jobs placeholder */}
      <div style={{ background:"#fff", borderRadius:24,
        border:"1px solid #F0F4F6", padding:24 }}>
        <Bar w={110} h={14} r={7} mb={24} />
        {/* Dashed empty state box */}
        <div style={{ height:176, borderRadius:16,
          border:"1px dashed #E0E7ED",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#EEF2F5" }} />
          <Bar w={130} h={9} r={5} />
          <Bar w={100} h={9} r={5} delay="0.05s" />
        </div>
      </div>
    </div>

  </div>
);

export default OverviewSkeleton;

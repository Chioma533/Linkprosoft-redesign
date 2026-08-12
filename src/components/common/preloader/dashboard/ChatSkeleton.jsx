/**
 * ChatSkeleton.jsx
 *
 * Ghost skeleton for ChatSubpage (professional) and EmployerMessagesSubpage.
 *
 * Layout: two-panel split inside a white card:
 *
 *  ┌──────────────────────────┬────────────────────────────────────────────┐
 *  │ Contacts list  (w-80)    │  Conversation panel (flex-1)               │
 *  │ – Search bar             │  – Header: avatar + name + status dot      │
 *  │ – 5 conversation rows    │  – Message bubbles (alternating)           │
 *  │   (avatar + name + msg)  │  – Input bar at bottom                     │
 *  └──────────────────────────┴────────────────────────────────────────────┘
 */

import { Bar, Circle, Pill } from "./DashboardShellSkeleton";

const shBg   = "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)";
const shSize = "1600px 100%";
const shAnim = "sk-shimmer 1.8s ease-in-out infinite";

/* ── Contact row (left panel) ───────────────────────────────────────────── */
const ContactRow = ({ active = false, delay = "0s" }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 16px",
    background: active ? "#EEF5F9" : "transparent",
    borderBottom: "1px solid #F5F7FA",
  }}>
    <Circle size={40} delay={delay} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <Bar w="55%" h={11} r={6} delay={delay} />
      <Bar w="80%" h={9}  r={5} mt={5} delay={delay} />
    </div>
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
      <Bar w={28} h={9} r={5} delay={delay} />
      {active && <Pill w={18} h={18} delay={delay} />}
    </div>
  </div>
);

/* ── Received bubble (left-aligned) ────────────────────────────────────── */
const ReceivedBubble = ({ w = "55%", delay = "0s" }) => (
  <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:12 }}>
    <div style={{
      maxWidth: w, padding: "12px 16px",
      borderRadius: "0 16px 16px 16px",
      background: shBg, backgroundSize: shSize,
      animation: shAnim, animationDelay: delay,
      height: 38,
    }} />
  </div>
);

/* ── Sent bubble (right-aligned) ────────────────────────────────────────── */
const SentBubble = ({ w = "45%", delay = "0s" }) => (
  <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
    <div style={{
      maxWidth: w, padding: "12px 16px",
      borderRadius: "16px 0 16px 16px",
      background: "#E6F1F6",
      height: 38,
      width: w,
    }} />
  </div>
);

/* ── Main export ────────────────────────────────────────────────────────── */
const ChatSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6",
    display: "flex", overflow: "hidden",
    height: "calc(100vh - 160px)", /* fills the main content area */
  }}>

    {/* LEFT: Contacts list — w-80 = 320px */}
    <div style={{
      width: 300, minWidth: 300, borderRight: "1px solid #F0F4F6",
      display: "flex", flexDirection: "column",
    }}>
      {/* Search */}
      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{
          height: 38, borderRadius: 999,
          background: shBg, backgroundSize: shSize, animation: shAnim,
        }} />
      </div>

      {/* Contact rows */}
      {[true,false,false,false,false].map((active, i) => (
        <ContactRow key={i} active={active} delay={`${i * 0.05}s`} />
      ))}
    </div>

    {/* RIGHT: Conversation panel */}
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #F0F4F6",
        display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
      }}>
        <Circle size={42} />
        <div>
          <Bar w={130} h={12} r={6} />
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E" }} />
            <Bar w={60} h={9} r={5} delay="0.04s" />
          </div>
        </div>
        {/* Action icons right */}
        <div style={{ marginLeft:"auto", display:"flex", gap:14 }}>
          <Circle size={20} delay="0.05s" />
          <Circle size={20} delay="0.09s" />
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex:1, padding:"24px", overflowY:"hidden" }}>
        {/* Date divider */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <Bar w={80} h={9} r={12} delay="0.02s" style={{ margin:"0 auto" }} />
        </div>

        <ReceivedBubble w="52%" delay="0.04s" />
        <SentBubble      w="40%" delay="0.08s" />
        <ReceivedBubble  w="60%" delay="0.12s" />
        <ReceivedBubble  w="45%" delay="0.15s" />
        <SentBubble      w="50%" delay="0.18s" />
        <SentBubble      w="38%" delay="0.22s" />
        <ReceivedBubble  w="55%" delay="0.25s" />
      </div>

      {/* Message input */}
      <div style={{
        padding: "14px 20px", borderTop: "1px solid #F0F4F6",
        display:"flex", alignItems:"center", gap:12, flexShrink:0,
      }}>
        <div style={{
          flex:1, height:44, borderRadius:999,
          background: shBg, backgroundSize:shSize, animation:shAnim,
        }} />
        <Circle size={40} delay="0.05s" />
      </div>
    </div>
  </div>
);

export default ChatSkeleton;

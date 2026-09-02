import React from "react";
import { Bar, Circle, Pill, useIsMobile } from "./DashboardShellSkeleton";

const shBg   = "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)";
const shSize = "1600px 100%";
const shAnim = "sk-shimmer 1.8s ease-in-out infinite";

const ProCardSk = ({ delay = "0s" }) => (
  <article style={{
    background: "#F9F9F9", borderRadius: 16,
    border: "1px solid #EAEEF1",
    display: "flex", flexDirection: "column", overflow: "hidden",
  }}>
    <div style={{ padding: 20, display:"flex", flexDirection:"column", gap:12, flex:1 }}>
      <div style={{ display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
          <Circle size={48} delay={delay} />
          <div style={{ flex:1 }}>
            <Bar w="65%" h={13} r={6} delay={delay} />
            <Bar w="45%" h={10} r={5} mt={6} delay={delay} />
          </div>
        </div>
        <div style={{ width:32, height:32, borderRadius:10,
          border:"1px solid #E8ECF0", background:"#F0F4F6", flexShrink:0 }} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width:12, height:12, borderRadius:2,
            background:shBg, backgroundSize:shSize,
            animation:shAnim, animationDelay:delay }} />
        ))}
        <Bar w={55} h={9} r={5} delay={delay} style={{ marginLeft:4 }} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
        <Bar w="100%" h={10} r={5} delay={delay} />
        <Bar w="88%"  h={10} r={5} delay={delay} />
        <Bar w="72%"  h={10} r={5} delay={delay} />
      </div>
    </div>
    <div style={{ padding:"12px 20px 16px", borderTop:"1px solid #EAEEF1",
      display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <Bar w={80} h={13} r={6} delay={delay} />
      <Pill w={72} h={30} delay={delay} />
    </div>
  </article>
);

const JobCardSk = ({ delay = "0s" }) => (
  <article style={{
    background: "#F9F9F9", borderRadius: 16,
    border: "1px solid #EAEEF1",
    display: "flex", flexDirection: "column", overflow: "hidden",
  }}>
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:12, flex:1 }}>
      <div style={{ display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
          <Circle size={44} delay={delay} />
          <div style={{ flex:1 }}>
            <Bar w="60%" h={13} r={6} delay={delay} />
            <Bar w="40%" h={10} r={5} mt={6} delay={delay} />
          </div>
        </div>
        <div style={{ width:32, height:32, borderRadius:10,
          border:"1px solid #E8ECF0", background:"#F0F4F6", flexShrink:0 }} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
        <Bar w="100%" h={10} r={5} delay={delay} />
        <Bar w="88%"  h={10} r={5} delay={delay} />
        <Bar w="70%"  h={10} r={5} delay={delay} />
      </div>
    </div>
    <div style={{ padding:"12px 20px 16px", borderTop:"1px solid #EAEEF1",
      display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <Bar w={80} h={13} r={6} delay={delay} />
      <Pill w={64} h={30} delay={delay} />
    </div>
  </article>
);

const GridPageSkeletonMobile = ({ cardType = "professional" }) => {
  const CardSk = cardType === "job" ? JobCardSk : ProCardSk;
  const delays = ["0s","0.06s","0.12s","0.06s"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:"#fff", borderRadius:18, border:"1px solid #F0F4F6", padding:14 }}>
        <Bar w={148} h={18} r={7} />
        <Bar w={90} h={9} r={5} mt={8} delay="0.04s" />
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, overflowX:"auto", paddingBottom:4 }}>
        <div style={{ minWidth: 160, height: 34, borderRadius: 999, background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite" }} />
        <Pill w={80} h={34} delay="0.05s" />
        <Pill w={74} h={34} delay="0.09s" />
        <Pill w={70} h={34} delay="0.13s" />
      </div>

      <div style={{ background:"#fff", borderRadius:18, border:"1px solid #F0F4F6", padding:14 }}>
        <div style={{ marginBottom:14 }}>
          <Bar w="38%" h={12} r={6} delay="0.04s" />
          <Bar w="20%" h={9} r={5} mt={6} delay="0.07s" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:12 }}>
          {delays.map((d, i) => (
            <CardSk key={i} delay={d} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GridPageSkeleton = ({ cardType = "professional" }) => {
  const isMobile = useIsMobile();
  if (isMobile) return <GridPageSkeletonMobile cardType={cardType} />;

  const CardSk = cardType === "job" ? JobCardSk : ProCardSk;
  const delays = ["0s","0.06s","0.12s","0.06s","0.12s","0.18s"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <Bar w={180} h={22} r={9} />
          <Bar w={120} h={11} r={6} mt={6} delay="0.04s" />
        </div>
        <Pill w={110} h={36} delay="0.05s" />
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", padding:"4px 0" }}>
        <Pill w={280} h={40} delay="0.03s" />
        <Pill w={112} h={40} delay="0.07s" />
        <Pill w={100} h={40} delay="0.11s" />
        <Pill w={92}  h={40} delay="0.15s" />
        <Pill w={76}  h={40} delay="0.19s" />
      </div>

      <div style={{ background:"#fff", borderRadius:20, border:"1px solid #F0F4F6", padding:24 }}>
        <div style={{ marginBottom:24 }}>
          <Bar w="28%" h={16} r={7} delay="0.04s" />
          <Bar w="16%" h={11} r={6} mt={7} delay="0.07s" />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {delays.map((d, i) => (
            <CardSk key={i} delay={d} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridPageSkeleton;

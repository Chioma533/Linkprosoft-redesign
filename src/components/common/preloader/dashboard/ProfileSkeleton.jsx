import React from "react";
import { Bar, Circle, Pill, useIsMobile } from "./DashboardShellSkeleton";

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

const ProfileSkeletonMobile = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", overflow: "hidden" }}>
      <div style={{ height: 132, position: "relative", background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite" }}>
        <div style={{ position: "absolute", left: 18, bottom: -32, width: 64, height: 64, borderRadius: "50%", border: "3px solid #fff", background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite" }} />
      </div>

      <div style={{ padding: "42px 16px 16px", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, right: 16 }}>
          <Pill w={74} h={28} delay="0.05s" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Bar w={120} h={16} r={7} />
          <Pill w={36} h={18} delay="0.05s" />
        </div>
        <Bar w={180} h={9} r={5} delay="0.05s" />
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <Bar w={68} h={8} r={4} delay="0.08s" />
          <Bar w={90} h={8} r={4} delay="0.10s" />
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
      {["0s","0.05s","0.10s"].map((d, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0F4F6", padding: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 10, background: "#EAF1F6", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Bar w="60%" h={8} r={4} delay={d} />
            <Bar w="42%" h={12} r={6} mt={5} delay={d} />
          </div>
        </div>
      ))}
    </div>

    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", padding: 14 }}>
      <Bar w={56} h={12} r={6} mb={12} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[72, 82, 64, 90, 66, 78].map((w, i) => (
          <Pill key={i} w={w} h={28} delay={`${i * 0.04}s`} />
        ))}
      </div>
    </div>

    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", padding: 14 }}>
      <Bar w={88} h={12} r={6} mb={8} />
      {["0s","0.06s","0.12s"].map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 2 ? "1px solid #F5F7FA" : "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#EAF1F6", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Bar w="60%" h={8} r={4} delay={d} />
            <Bar w="42%" h={8} r={4} mt={5} delay={d} />
          </div>
        </div>
      ))}
    </div>

    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", padding: 14 }}>
      <Bar w={62} h={12} r={6} mb={12} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {["0s","0.05s","0.10s","0.15s"].map((d, i) => (
          <div key={i}>
            <div style={{ height: 100, borderRadius: 12, background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite", animationDelay: d }} />
            <Bar w="68%" h={8} r={4} mt={8} delay={d} />
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F4F6", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Bar w={62} h={12} r={6} />
        <Bar w={28} h={8} r={4} delay="0.05s" />
      </div>
      <ReviewBlock delay="0.05s" />
      <ReviewBlock delay="0.10s" />
    </div>
  </div>
);

const ProfileSkeleton = () => {
  const isMobile = useIsMobile();
  if (isMobile) return <ProfileSkeletonMobile />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6", overflow: "hidden" }}>
        <div style={{ height: 192, position: "relative", background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite" }}>
          <div style={{ position: "absolute", bottom: -56, left: 32, width: 112, height: 112, borderRadius: "50%", border: "4px solid #fff", background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite", zIndex: 1 }} />
        </div>

        <div style={{ padding: "64px 32px 32px", position: "relative" }}>
          <div style={{ position: "absolute", top: 16, right: 32 }}>
            <Pill w={96} h={34} delay="0.05s" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Bar w={200} h={20} r={8} />
            <Pill w={44} h={22} delay="0.05s" />
          </div>
          <Bar w={280} h={11} r={6} mt={6} delay="0.05s" />
          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            <Bar w={90}  h={9} r={5} delay="0.08s" />
            <Bar w={130} h={9} r={5} delay="0.10s" />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {["0s","0.05s","0.10s"].map((d, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EAF1F6", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Bar w="55%" h={11} r={6} delay={d} />
              <Bar w="40%" h={20} r={8} mt={7} delay={d} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6", padding: 24 }}>
        <Bar w={60} h={14} r={7} mb={20} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[80, 100, 72, 90, 68, 84].map((w, i) => (
            <Pill key={i} w={w} h={30} delay={`${i * 0.04}s`} />
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6", padding: 24 }}>
        <Bar w={120} h={14} r={7} mb={8} />
        {["0s","0.06s","0.12s"].map((d, i) => (
          <CertRow key={i} delay={d} />
        ))}
      </div>

      <div>
        <Bar w={80} h={14} r={7} mb={16} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {["0s","0.05s","0.10s","0.15s"].map((d, i) => (
            <div key={i}>
              <div style={{ height: 144, borderRadius: 16, background: "linear-gradient(90deg,#EAEFF3 25%,#F8FAFB 50%,#EAEFF3 75%)", backgroundSize: "1600px 100%", animation: "sk-shimmer 1.8s ease-in-out infinite", animationDelay: d }} />
              <Bar w="60%" h={11} r={6} mt={8} delay={d} />
              <Bar w="40%" h={9} r={5} mt={4} delay={d} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0F4F6", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Bar w={70} h={14} r={7} />
          <Bar w={40} h={11} r={6} delay="0.05s" />
        </div>
        <ReviewBlock delay="0.05s" />
        <ReviewBlock delay="0.10s" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;

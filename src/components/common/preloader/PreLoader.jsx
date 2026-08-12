import { motion } from "framer-motion";
import { useEffect } from "react";

const LOGO_SRC = "/temp_figma_mockups/linkprosoft-logo.png";

/* ─────────────────────────────────────────────
   Inline styles — keeps the animation
   self-contained and zero-dependency on CSS files
───────────────────────────────────────────── */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
  },
  logo: {
    width: "110px",
    height: "110px",
    objectFit: "contain",
  },
  brand: {
    marginTop: "10px",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    color: "#016EA6",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    textTransform: "uppercase",
  },
  pillsWrapper: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  pillTrack: {
    position: "relative",
    width: "24.21px",
    height: "6.72px",
    borderRadius: "999px",
    background: "#E6F1F6",
    overflow: "hidden",
  },
  pillShimmer: {
    position: "absolute",
    inset: 0,
    borderRadius: "999px",
    background: "#016EA6",
    animation: "pill-pulse 1.4s ease-in-out infinite",
  },
};

/* Keyframes injected once into <head> */
const KEYFRAMES = `
@keyframes pill-pulse {
  0%, 100% { opacity: 0.15; transform: scaleX(0.9); }
  35%, 65% { opacity: 1; transform: scaleX(1); }
}
`;

function injectKeyframes() {
  if (document.getElementById("preloader-kf")) return;
  const tag = document.createElement("style");
  tag.id = "preloader-kf";
  tag.textContent = KEYFRAMES;
  document.head.appendChild(tag);
}

/* Each pill gets a staggered delay for a continuous left-to-right flow */
const PILL_DELAYS = ["0s", "0.35s", "0.7s"];

const Preloader = ({ onFinish }) => {
  useEffect(() => {
    injectKeyframes();

    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      style={styles.overlay}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
    >
      <div style={styles.inner}>
        {/* Logo */}
        <motion.img
          src={LOGO_SRC}
          alt="Linkprosoft"
          style={styles.logo}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Three pill loaders */}
        <motion.div
          style={styles.pillsWrapper}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
        >
          {PILL_DELAYS.map((delay, i) => (
            <div key={i} style={styles.pillTrack}>
              <div
                style={{
                  ...styles.pillShimmer,
                  animationDelay: delay,
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;

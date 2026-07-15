import { useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../../../components/common/Button";

// Simple custom confetti particles with framer-motion
const confettiColors = ["#016EA6", "#FBBF24", "#EF4444", "#10B981", "#8B5CF6", "#EC4899"];

const ConfettiParticle = ({ idx }) => {
  const randomX = Math.random() * 100 - 50; // -50vw to 50vw
  const randomDelay = Math.random() * 2;
  const randomDuration = Math.random() * 3 + 2; // 2s to 5s
  const randomColor = confettiColors[idx % confettiColors.length];
  const size = Math.random() * 8 + 6; // 6px to 14px

  return (
    <motion.div
      initial={{ y: -50, x: `${randomX}vw`, rotate: 0, opacity: 1 }}
      animate={{
        y: "90vh",
        x: `${randomX + (Math.random() * 100 - 50)}vw`,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        opacity: [1, 1, 0.8, 0],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        backgroundColor: randomColor,
        borderRadius: idx % 3 === 0 ? "50%" : idx % 3 === 1 ? "4px" : "0px",
        zIndex: 50,
      }}
    />
  );
};

const WelcomeSuccess = ({ onDashboardRedirect }) => {
  useEffect(() => {
    // Optionally trigger any welcome success actions
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[480px] mx-auto px-4 md:px-0 flex flex-col items-center py-8 md:py-12 relative overflow-hidden"
    >
      {/* Confetti container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-[600px] w-full">
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiParticle key={i} idx={i} />
        ))}
      </div>

      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10 flex flex-col items-center text-center relative z-10">
        {/* Envelope and Checkmark Icon (Custom Vector Design matching screenshot) */}
        <div className="w-40 h-32 relative flex items-center justify-center mb-6">
          <svg
            className="w-full h-full"
            viewBox="0 0 160 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Confetti lines surrounding the envelope */}
            <circle cx="20" cy="30" r="2.5" fill="#EF4444" opacity="0.4" />
            <circle cx="140" cy="40" r="2" fill="#FBBF24" opacity="0.5" />
            <circle cx="15" cy="80" r="3" fill="#016EA6" opacity="0.3" />
            <circle cx="130" cy="85" r="2.5" fill="#10B981" opacity="0.4" />

            {/* Back envelope flap */}
            <path
              d="M15 90V45C15 42.2386 17.2386 40 20 40H140C142.761 40 145 42.2386 145 45V90C145 92.7614 142.761 95 140 95H20C17.2386 95 15 92.7614 15 90Z"
              fill="#F4F9FC"
              stroke="#D6E6F2"
              strokeWidth="2"
            />

            {/* Popping Card */}
            <motion.g
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 120 }}
            >
              {/* Blue Card with Checkmark */}
              <rect x="45" y="25" width="70" height="55" rx="8" fill="#016EA6" />
              {/* Checkmark inside a circle */}
              <circle cx="80" cy="50" r="14" fill="#01527C" />
              <path
                d="M74 50L78 54L86 46"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Front envelope cutout / bottom fold (V shape) */}
            <path
              d="M15 45L80 75L145 45V90C145 92.7614 142.761 95 140 95H20C17.2386 95 15 92.7614 15 90V45Z"
              fill="white"
              stroke="#D6E6F2"
              strokeWidth="2"
            />
            {/* Internal overlay gradient lines for paper fold effect */}
            <path d="M15 94L65 67" stroke="#E6EEF5" strokeWidth="2" />
            <path d="M145 94L95 67" stroke="#E6EEF5" strokeWidth="2" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2 font-sans">
          Welcome Onboard!!!
        </h2>
        <p className="text-gray-400 text-sm font-light mb-8 max-w-[280px] leading-relaxed">
          We are happy that you are here, have a good one...
        </p>

        <Button
          onClick={onDashboardRedirect}
          className="w-full !rounded-full !bg-[#016EA6] hover:!bg-[#016EA6]/95 py-3.5 text-base shadow-sm font-medium tracking-wide"
        >
          Go to dashboard
        </Button>
      </div>
    </motion.div>
  );
};

export default WelcomeSuccess;

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "../../../assets/images/logo2.jpg"; // Change to your logo

const Preloader = ({ onFinish }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1100);

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, 2600);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-gray-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Blue Expansion */}
      <motion.div
        initial={{
          clipPath: "inset(50% 50% 50% 50%)",
          transformOrigin: "center",
        }}
        animate={{
          clipPath: "inset(0% 0% 0% 0%)",
        }}
        transition={{
          delay: 0.45,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 bg-[#016EA6]"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Logo */}
        <motion.img
          src={Logo}
          alt="Linkprosoft"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-24 h-24 object-contain"
        />

        <AnimatePresence>
          {showText && (
            <motion.div className="mt-6 flex text-white text-3xl font-bold tracking-wider">
              {"LINKPROSOFT".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Preloader;



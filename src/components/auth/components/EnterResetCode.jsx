import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import Button from "../../../components/common/Button";

const EnterResetCode = ({ email, onSubmit, onResend, isLoading, error }) => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [shouldShake, setShouldShake] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle resend countdown timer
  useEffect(() => {
    let timer;
    if (isResendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(30);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled, countdown]);

  // Shake animation triggered by errors
  useEffect(() => {
    if (error) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (element, index) => {
    const val = element.value;
    if (isNaN(Number(val))) return; // only allow numbers

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // Focus next input
    if (val !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      const newCode = pasteData.split("");
      setCode(newCode);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length === 6) {
      onSubmit(otpCode);
    } else {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    }
  };

  const handleResendClick = () => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    onResend();
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4 },
    },
    idle: { x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[480px] mx-auto px-4 md:px-0 flex flex-col items-center py-8 md:py-12"
    >
      <motion.div
        variants={shakeVariants}
        animate={shouldShake ? "shake" : "idle"}
        className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10 flex flex-col items-center text-center"
      >
        {/* Envelope Icon */}
        <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-[#016EA6] mb-6">
          <FiMail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2 font-sans">
          Enter Reset Code
        </h2>
        <p className="text-gray-400 text-sm font-light mb-8 max-w-[320px] leading-relaxed">
          Please enter the reset code we sent to{" "}
          <span className="font-medium text-gray-700">{email || "your email"}</span>
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* OTP inputs */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-8">
            {code.slice(0, 3).map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={val}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="w-11 h-11 md:w-12 md:h-12 border border-gray-200 focus:border-[#016EA6] focus:ring-1 focus:ring-[#016EA6]/20 rounded-full text-center font-semibold text-gray-900 text-lg md:text-xl outline-none transition-all"
                disabled={isLoading}
              />
            ))}

            <span className="text-gray-300 font-medium px-0.5">-</span>

            {code.slice(3, 6).map((val, idx) => {
              const realIdx = idx + 3;
              return (
                <input
                  key={realIdx}
                  ref={(el) => (inputRefs.current[realIdx] = el)}
                  type="text"
                  maxLength="1"
                  value={val}
                  onChange={(e) => handleChange(e.target, realIdx)}
                  onKeyDown={(e) => handleKeyDown(e, realIdx)}
                  onPaste={handlePaste}
                  className="w-11 h-11 md:w-12 md:h-12 border border-gray-200 focus:border-[#016EA6] focus:ring-1 focus:ring-[#016EA6]/20 rounded-full text-center font-semibold text-gray-900 text-lg md:text-xl outline-none transition-all"
                  disabled={isLoading}
                />
              );
            })}
          </div>

          {error && <p className="text-xs text-red-500 font-medium mb-6">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading || code.some((v) => v === "")}
            className="w-full !rounded-full !bg-[#016EA6] hover:!bg-[#016EA6]/95 py-3.5 text-base shadow-sm font-medium tracking-wide"
          >
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          Didn&apos;t receive a code?{" "}
          <button
            onClick={handleResendClick}
            disabled={isResendDisabled || isLoading}
            className={`font-semibold cursor-pointer outline-none ${
              isResendDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#016EA6] hover:underline hover:bg-transparent"
            }`}
          >
            {isResendDisabled ? `Resend in ${countdown}s` : "Resend"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnterResetCode;

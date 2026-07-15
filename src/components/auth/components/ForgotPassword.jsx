import { useState } from "react";
import { FiMail, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const ForgotPassword = ({ onSubmit, onClose, isLoading, error }) => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError("");
  };

  const validate = () => {
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(email.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[480px] mx-auto px-4 md:px-0 flex flex-col items-center py-8 md:py-12 relative"
    >
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10 flex flex-col items-center text-center relative">
        {/* Close Button X in top right */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer outline-none hover:bg-transparent"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Custom Rosette/Seal Stamp SVG with question mark */}
        <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-[#016EA6] mb-6 mt-2">
          <svg
            className="w-6 h-6 text-[#016EA6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l2.4 1.8 2.9-.6.8 2.9 2.7 1.2-.8 2.9 1.8 2.4-1.8 2.4.8 2.9-2.7 1.2-.8 2.9-2.9-.6L12 22l-2.4-1.8-2.9.6-.8-2.9-2.7-1.2.8-2.9-1.8-2.4 1.8-2.4-.8-2.9 2.7-1.2.8-2.9 2.9.6L12 2z" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2 font-sans">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-sm font-light mb-8 max-w-[280px] leading-relaxed">
          Please enter your email to receive the reset code
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter mail"
            value={email}
            onChange={handleChange}
            error={validationError || error}
            disabled={isLoading}
            leftIcon={FiMail}
            required
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full !rounded-full !bg-[#016EA6] hover:!bg-[#016EA6]/95 py-3.5 text-base shadow-sm font-medium tracking-wide mt-2"
          >
            {isLoading ? "Sending code..." : "Reset password"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;

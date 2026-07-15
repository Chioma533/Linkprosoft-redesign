import { useState } from "react";
import { FiLock, FiKey, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const CreateNewPassword = ({ onSubmit, onClose, isLoading, error }) => {
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setPassword(e.target.value);
    if (validationError) setValidationError("");
  };

  const validate = () => {
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(password);
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

        {/* Key Icon */}
        <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-[#016EA6] mb-6 mt-2">
          <FiKey className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2 font-sans">
          Create new password
        </h2>
        <p className="text-gray-400 text-sm font-light mb-8 max-w-[280px] leading-relaxed">
          Ensure new password is different from the previous password
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={handleChange}
            error={validationError || error}
            disabled={isLoading}
            leftIcon={FiLock}
            required
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full !rounded-full !bg-[#016EA6] hover:!bg-[#016EA6]/95 py-3.5 text-base shadow-sm font-medium tracking-wide mt-2"
          >
            {isLoading ? "Updating password..." : "Continue"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateNewPassword;

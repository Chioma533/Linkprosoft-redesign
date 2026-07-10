import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import RoleSelection from "../features/auth/components/RoleSelection";
import SignupForm from "../features/auth/components/SignupForm";
import OtpVerification from "../features/auth/components/OtpVerification";
import WelcomeSuccess from "../features/auth/components/WelcomeSuccess";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, verifyOtp } = useAuth();

  const [step, setStep] = useState("role-selection"); // role-selection, signup-form, otp-verification, success
  const [role, setRole] = useState("employer"); // default to employer ('I'm looking to hire')
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleNextStep = () => {
    if (step === "role-selection") {
      setStep("signup-form");
    }
  };

  const handleBackToRole = () => {
    setStep("role-selection");
    setApiError("");
  };

  const handleSignupSubmit = async (formData) => {
    setIsLoading(true);
    setApiError("");
    try {
      await signup(formData);
      setEmail(formData.email);
      toast.success("Account created successfully! Verification code sent.");
      setStep("otp-verification");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Signup failed. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (code) => {
    setIsLoading(true);
    setApiError("");
    try {
      await verifyOtp(email, code);
      toast.success("Email verified successfully! Welcome onboard.");
      setStep("success");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Verification failed. Invalid code.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    toast.success("A new verification code has been sent to " + email);
    // Add resend logic if backend supports it. For now, we simulate resend and alert.
  };

  const handleDashboardRedirect = () => {
    navigate("/dashboard");
  };

  // Select transition variants based on step flow direction
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-[#EBF3FA]/40 flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-[1000px] flex justify-center">
        <AnimatePresence mode="wait">
          {step === "role-selection" && (
            <motion.div
              key="role-selection"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <RoleSelection role={role} onChangeRole={setRole} onNext={handleNextStep} />
            </motion.div>
          )}

          {step === "signup-form" && (
            <motion.div
              key="signup-form"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SignupForm
                role={role}
                onSubmit={handleSignupSubmit}
                onBack={handleBackToRole}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {step === "otp-verification" && (
            <motion.div
              key="otp-verification"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <OtpVerification
                email={email}
                onSubmit={handleOtpSubmit}
                onResend={handleResendCode}
                isLoading={isLoading}
                error={apiError}
              />
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WelcomeSuccess onDashboardRedirect={handleDashboardRedirect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupPage;

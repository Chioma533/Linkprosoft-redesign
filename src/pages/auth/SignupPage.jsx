import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import RoleSelection from "../../components/auth/components/RoleSelection";
import SignupForm from "../../components/auth/components/SignupForm";
import OtpVerification from "../../components/auth/components/OtpVerification";
import WelcomeSuccess from "../../components/auth/components/WelcomeSuccess";
import ProfessionalTypeSelection from "../../components/auth/components/ProfessionalTypeSelection";
import { useAuthStore } from "../../store/authStore";
import { redirectToDashboard } from "../../utils/getDashboardRoute";

const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("role-selection"); // role-selection, professional-type, signup-form, otp-verification, success
  const [role, setRole] = useState("professional"); // default to professional
  const [professionalType, setProfessionalType] = useState(null); // digital or none-digital
  const [email, setEmail] = useState("");
  const [apiError, setApiError] = useState("");
  const { googleSignin, signup, verifyOtp, user, isLoading, error } = useAuthStore();

  const handleNextStep = () => {
    if (step === "role-selection") {
      if (role === "professional") {
        setStep("professional-type");
      } else {
        setStep("signup-form");
      }
    } else if (step === "professional-type") {
      setStep("signup-form");
    }
  };

  const handleBackToRole = () => {
    if (step === "signup-form") {
      if (role === "professional") {
        setStep("professional-type");
      } else {
        setStep("role-selection");
      }
    } else if (step === "professional-type") {
      setStep("role-selection");
    } else {
      setStep("role-selection");
    }
    setApiError("");
  };

  const handleSignupSubmit = async (formData) => {
    try {
      console.log("Received formData:", formData);
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,

        role,

        professional_type: role === "professional" ? professionalType : undefined,
      };

      console.log("Signup Payload:", payload);

      await signup(payload);

      setEmail(formData.email);

      toast.success("Account created successfully! Verification code sent.");
      setStep("otp-verification");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Signup failed. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleOtpSubmit = async (code) => {
    setApiError("");
    try {
      await verifyOtp(email, code);
      toast.success("Email verified successfully! Welcome onboard.");
      setStep("success");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Verification failed. Invalid code.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleResendCode = async () => {
    toast.success("A new verification code has been sent to " + email);
    // Add resend logic if backend supports it. For now, we simulate resend and alert.
  };

  const handleGoogleSignup = async () => {
    try {
      await googleSignin(role);
    } catch (error) {
      const errMsg = typeof error === "string" ? error : "Google signup failed. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleDashboardRedirect = () => {
    redirectToDashboard(user?.role, navigate, { replace: true });
  };

  // Select transition variants based on step flow direction
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-[#EBF3FA]/40 flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-250 flex justify-center">
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

          {step === "professional-type" && (
            <motion.div
              key="professional-type"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ProfessionalTypeSelection
                professionalType={professionalType}
                onChangeType={setProfessionalType}
                onNext={handleNextStep}
                onBack={handleBackToRole}
              />
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
                onGoogleSignup={handleGoogleSignup}
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

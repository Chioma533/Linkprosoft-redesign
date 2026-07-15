import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import LoginForm from "../../components/auth/components/LoginForm";
import ForgotPassword from "../../components/auth/components/ForgotPassword";
import EnterResetCode from "../../components/auth/components/EnterResetCode";
import CreateNewPassword from "../../components/auth/components/CreateNewPassword";
import ResetSuccess from "../../components/auth/components/ResetSuccess";
import { useAuthStore } from "../../store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login, forgot-password, enter-code, create-password, reset-success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [apiError, setApiError] = useState("");

  const { login, forgotPassword, verifyResetCode, resetPassword, isLoading, error } = useAuthStore();

  const handleLoginSubmit = async (credentials) => {
   try{
    await login(credentials);

    toast.success("Welcome back!");

    navigate("/dashboard");
   }catch(err){
    toast.error(
      err.response?.data?.message || err || "Login failed. Please verify your credentials."
    );  
   }

  };

  const handleForgotPasswordSubmit = async (targetEmail) => {
    setApiError("");
    try {
      await forgotPassword(targetEmail);
      setEmail(targetEmail);
      toast.success("Reset code sent successfully!");
      setStep("enter-code");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Failed to send reset code. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleVerifyResetCodeSubmit = async (otpCode) => {
    setApiError("");
    try {
      await verifyResetCode(email, otpCode);
      setCode(otpCode);
      toast.success("Code verified successfully!");
      setStep("create-password");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Invalid code. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleResetPasswordSubmit = async (newPassword) => {
    setApiError("");
    try {
      await resetPassword(email, code, newPassword);
      toast.success("Password reset successfully!");
      setStep("reset-success");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Failed to reset password. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleResendCode = async () => {
    try {
      await forgotPassword(email);
      toast.success("A new reset code has been sent to " + email);
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Failed to resend code.";
      toast.error(errMsg);
    }
  };

  const handleCloseReset = () => {
    setStep("login");
    setApiError("");
  };

  const handleDashboardRedirect = () => {
    // If auth session is automatically established, navigate to dashboard. Otherwise, go to login.
    navigate("/login");
    setStep("login");
  };

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-[#EBF3FA]/40 flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-250 flex justify-center">
        <AnimatePresence mode="wait">
          {step === "login" && (
            <motion.div
              key="login"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LoginForm
                onSubmit={handleLoginSubmit}
                onForgotPassword={() => setStep("forgot-password")}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          )}

          {step === "forgot-password" && (
            <motion.div
              key="forgot-password"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ForgotPassword
                onSubmit={handleForgotPasswordSubmit}
                onClose={handleCloseReset}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          )}

          {step === "enter-code" && (
            <motion.div
              key="enter-code"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <EnterResetCode
                email={email}
                onSubmit={handleVerifyResetCodeSubmit}
                onResend={handleResendCode}
                isLoading={isLoading}
                error={apiError}
              />
            </motion.div>
          )}

          {step === "create-password" && (
            <motion.div
              key="create-password"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CreateNewPassword
                onSubmit={handleResetPasswordSubmit}
                onClose={handleCloseReset}
                isLoading={isLoading}
                error={apiError}
              />
            </motion.div>
          )}

          {step === "reset-success" && (
            <motion.div
              key="reset-success"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ResetSuccess onDashboardRedirect={handleDashboardRedirect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;
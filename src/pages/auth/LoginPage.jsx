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
import { getDashboardRoute } from "../../utils/getDashboardRoute";
import { redirectWithPreloader } from "../../utils/helper";
import { usePreloader } from "../../context/PreLoaderContext";
const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login, forgot-password, enter-code, create-password, reset-success
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [apiError, setApiError] = useState("");

  const {
    login,
    googleSignin,
    forgotPassword,
    resendOtp,
    verifyResetCode,
    resetPassword,
    isLoading,
    isResendingOtp,
    error,
  } = useAuthStore();
  const { showPreloader } = usePreloader();

  const handleLoginSubmit = async (credentials) => {
    try {
      const response = await login(credentials);

      toast.success("Welcome back!");
      showPreloader(() => {
        navigate(getDashboardRoute(response.data.user.role), {
          replace: true,
        });
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === "string"
          ? err
          : "Login failed. Please verify your credentials.");

      toast.error(message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Google login params:', { role: 'professional', professionalType: undefined });
      const response = await googleSignin('professional', undefined);
      navigate(getDashboardRoute(response.data.user.role), { replace: true });
    } catch (err) {
      toast.error(err || "Google sign-in failed. Please try again.");
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
      const errMsg =
        typeof err === "string"
          ? err
          : "Failed to send reset code. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleVerifyResetCodeSubmit = async (otpCode) => {
    setApiError("");
    try {
      const response = await verifyResetCode(email, otpCode);
      const verifiedResetToken = response?.data?.resetToken;
      if (!verifiedResetToken) {
        throw new Error("Could not start password reset. Please request a new code.");
      }
      setResetToken(verifiedResetToken);
      toast.success("Code verified successfully!");
      setStep("create-password");
    } catch (err) {
      const errMsg =
        typeof err === "string" ? err : err?.message || "Invalid code. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleResetPasswordSubmit = async (newPassword) => {
    setApiError("");
    try {
      await resetPassword(resetToken, newPassword);
      toast.success("Password reset successfully!");
      setResetToken("");
      setStep("reset-success");
    } catch (err) {
      const errMsg =
        typeof err === "string"
          ? err
          : "Failed to reset password. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendOtp(email, "password_reset");
      toast.success("If the email exists, a new reset code has been sent.");
      return true;
    } catch (err) {
      const errMsg = typeof err === "string" ? err : "Failed to resend code.";
      toast.error(errMsg);
      return false;
    }
  };

  const handleCloseReset = () => {
    setStep("login");
    setEmail("");
    setResetToken("");
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
    <div className="auth-page min-h-screen bg-[#EBF3FA]/40 flex flex-col justify-center items-center py-10 px-4">
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
                onGoogleLogin={handleGoogleLogin}
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
                isResending={isResendingOtp}
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

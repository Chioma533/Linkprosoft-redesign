import { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const validatePassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^a-zA-Z0-9]/.test(password);

const ChangePasswordModal = ({ open, onClose }) => {
  const { changePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError("Use 8+ characters with uppercase, number, and special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF6E8] text-[#D28A21]">
              <KeyRound className="h-4 w-4" />
            </span>
            <h2 className="text-base font-semibold text-gray-900">Change password</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["Current password", "New password", "Confirm new password"].map((label, index) => {
            const setters = [setCurrentPassword, setNewPassword, setConfirmPassword];
            const values = [currentPassword, newPassword, confirmPassword];
            return (
              <label key={label} className="block">
                <span className="mb-1 block text-xs font-medium text-gray-700">{label}</span>
                <input
                  type="password"
                  value={values[index]}
                  onChange={(event) => setters[index](event.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0879A8]"
                />
              </label>
            );
          })}
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#0879A8] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

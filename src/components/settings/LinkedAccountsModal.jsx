import { useEffect, useState } from "react";
import { Link2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { authService } from "../../api/services/authService";
import { useAuthStore } from "../../store/authStore";

const LinkedAccountsModal = ({ open, onClose }) => {
  const { googleSignin, user } = useAuthStore();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState("");

  useEffect(() => {
    if (!open) return;
    let active = true;
    setIsLoading(true);
    authService.getLinkedAccounts()
      .then((response) => {
        if (active) setProviders(response?.data?.providers || []);
      })
      .catch((error) => {
        if (active) toast.error(error?.response?.data?.message || "Failed to load linked accounts.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  const handleUnlink = async (provider) => {
    setIsSubmitting(provider);
    try {
      await authService.unlinkLinkedAccount(provider);
      setProviders((current) =>
        current.map((item) => item.provider === provider ? { ...item, linked: false } : item)
      );
      toast.success("Google account unlinked.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to unlink account.");
    } finally {
      setIsSubmitting("");
    }
  };

  const handleGoogleLink = async () => {
    await googleSignin(user?.role || "professional", user?.professionalType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF5F8] text-[#5D7E91]">
              <Link2 className="h-4 w-4" />
            </span>
            <h2 className="text-base font-semibold text-gray-900">Linked accounts</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <p className="py-4 text-sm text-gray-500">Loading linked accounts...</p>
        ) : (
          <div className="space-y-3">
            {providers.map((provider) => (
              <div key={provider.provider} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-gray-800">{provider.provider}</p>
                  <p className="text-[11px] text-gray-400">{provider.linked ? "Linked" : "Not linked"}</p>
                </div>
                {provider.provider === "google" && (
                  <button
                    type="button"
                    onClick={() => provider.linked ? handleUnlink("google") : handleGoogleLink()}
                    disabled={Boolean(isSubmitting)}
                    className="rounded-full border border-[#0879A8] px-3 py-1.5 text-xs font-semibold text-[#0879A8] disabled:opacity-50"
                  >
                    {isSubmitting === "google" ? "Updating..." : provider.linked ? "Unlink" : "Connect"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedAccountsModal;

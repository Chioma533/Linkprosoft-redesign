import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const VerificationSuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-[340px] rounded-2xl bg-white p-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7fb] text-[#0879aa]">
        <Check size={34} />
      </div>
      <h2 className="mt-5 text-xl font-bold">Dossier Submitted!</h2>
      <p className="mt-1 text-xs text-[#85898b]">
        Your verification dossier is now in the administrative review queue.
      </p>
      <Link
        to="/home"
        id="view-profile-btn"
        className="mt-6 block rounded-full bg-[#0879aa] py-3 text-xs text-white hover:bg-[#076b97] transition font-bold"
      >
        Return to Dashboard
      </Link>
      <button type="button" onClick={onClose} className="mt-2 w-full rounded-full bg-[#fafafa] py-3 text-xs text-[#4d5254] hover:bg-gray-100 transition cursor-pointer">
        Close
      </button>
    </div>
  </div>
);

export default VerificationSuccessModal;

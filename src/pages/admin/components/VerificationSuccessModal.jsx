import React from "react";
import { CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerificationSuccessModal = ({ userName, onClose, onViewDetails }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/admin");
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          {/* Celebration Illustration */}
          <div className="relative h-40 flex items-center justify-center">
            {/* Confetti decorative elements */}
            <div className="absolute top-4 left-8 text-2xl">🎉</div>
            <div className="absolute top-6 right-10 text-xl">✨</div>
            <div className="absolute bottom-8 left-12 text-xl">🎊</div>
            <div className="absolute bottom-10 right-12 text-2xl">✓</div>

            {/* Checkmark circle */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Verification Successful
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800">{userName}</span> has
              been added to the cream verification list on LinkProSoft.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={onViewDetails}
              className="w-full py-3 bg-[#016EA6] hover:bg-[#005A8A] text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              View Details
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Go back home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationSuccessModal;

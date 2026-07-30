import React from "react";
import { FiAlertTriangle, FiCheck, FiXCircle } from "react-icons/fi";

const ProjectModals = ({
  activeModal,
  onClose,
  onConfirmSubmit,
  onConfirmCancel,
  onGoToWallet,
  onGoBackHome,
  job
}) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in">
      {/* Modal Card */}
      <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative animate-scale-up">
        
        {/* Modal: Confirm Submit */}
        {activeModal === "confirm-submit" && (
          <>
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Are you sure you want to submit project?</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Please confirm you have completed the <br /> clients requirements before submitting.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={onConfirmSubmit} className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold transition-all cursor-pointer">
                Submit
              </button>
              <button onClick={onClose} className="w-full border border-gray-100 hover:bg-gray-50 text-gray-500 py-3 rounded-full text-xs font-bold transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Modal: Success Submit */}
        {activeModal === "success-submit" && (
          <>
            <div className="w-16 h-16 bg-sky-50 text-[#016EA6] rounded-full flex items-center justify-center mx-auto">
              <FiCheck className="w-8 h-8 stroke-[3px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Congratulations, you have completed a job!</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                You have done well, now your money will be <br /> released from our escrow wallet. Get more done!!
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={onGoToWallet} className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold transition-all cursor-pointer">
                Go to wallet
              </button>
              <button onClick={onGoBackHome} className="w-full border border-gray-100 hover:bg-gray-50 text-gray-500 py-3 rounded-full text-xs font-bold transition-all cursor-pointer">
                Go back home
              </button>
            </div>
          </>
        )}

        {/* Modal: Confirm Cancel */}
        {activeModal === "confirm-cancel" && (
          <>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <FiXCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Are you sure you want to cancel this project?</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Cancelling this project ends all agreement between you and the client.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={onConfirmCancel} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer">
                Yes, Cancel Project
              </button>
              <button onClick={onClose} className="w-full border border-gray-100 hover:bg-gray-50 text-gray-500 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer">
                No, Go back
              </button>
            </div>
          </>
        )}

        {/* Modal: Success Cancel */}
        {activeModal === "success-cancel" && (
          <>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <FiXCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Project cancelled</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase">
                {job.orderId} ({job.title}) HAS BEEN CANCELLED!
              </p>
            </div>
            <div className="pt-2">
              <button onClick={onGoBackHome} className="w-full border border-gray-100 hover:bg-gray-50 text-gray-500 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer">
                Okay
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ProjectModals;

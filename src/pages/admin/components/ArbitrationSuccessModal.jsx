import React from "react";
import { Check, CheckCircle2, ChevronRight, X } from "lucide-react";

const ArbitrationSuccessModal = ({ dispute, onClose, onBackToList }) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (Drawer on mobile, Modal on desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-150 max-h-[90vh] overflow-y-auto flex flex-col items-center p-6 text-center
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-sm md:rounded-2xl md:border border-gray-150 md:max-h-[80vh]
        transition-all duration-300 ease-out"
      >
        {/* Confetti Visual & Avatars Group */}
        <div className="relative w-full py-8 flex flex-col items-center justify-center overflow-hidden">
          {/* Custom SVG Confetti Decoration */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 120">
            {/* Pink square */}
            <rect x="25" y="30" width="6" height="6" fill="#f43f5e" transform="rotate(25)" />
            {/* Green circle */}
            <circle cx="160" cy="45" r="3" fill="#10b981" />
            {/* Yellow triangle */}
            <path d="M 140 20 L 145 30 L 135 30 Z" fill="#f59e0b" transform="rotate(-15)" />
            {/* Blue line curve */}
            <path d="M 30 80 Q 40 70 50 85" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            {/* Amber square */}
            <rect x="175" y="80" width="5" height="5" fill="#f59e0b" transform="rotate(45)" />
          </svg>

          {/* Overlapping User Avatars Circle */}
          <div className="relative flex items-center justify-center mt-2 select-none">
            {/* Left avatar */}
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#016EA6] border-2 border-white flex items-center justify-center font-extrabold text-lg z-10">
              {dispute.employer.charAt(0)}
            </div>
            {/* Right avatar */}
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10b981] border-2 border-white flex items-center justify-center font-extrabold text-lg -ml-4 z-20">
              {dispute.professional.charAt(0)}
            </div>

            {/* Checkmark Badge Overlay */}
            <div className="absolute bottom-0 right-3 bg-emerald-500 text-white rounded-full p-1 border-2 border-white z-30 flex items-center justify-center">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Modal Info */}
        <div className="space-y-2.5 mt-2">
          <h3 className="text-base font-extrabold text-gray-900">Dispute Resolved Successfully</h3>
          <p className="text-[11px] text-gray-550 font-semibold px-4 leading-relaxed">
            Escrow funds have been split and released. Parties have been notified via platform alert logs and confirmation emails.
          </p>
        </div>

        {/* Actions panel */}
        <div className="w-full space-y-2 mt-6">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer border border-[#016EA6]"
          >
            View Details
          </button>
          <button 
            onClick={onBackToList}
            className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-650 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </>
  );
};

export default ArbitrationSuccessModal;

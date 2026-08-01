import React from "react";

const SuccessModal = ({ onGoHome }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden pt-8 pb-10 px-8 text-center">
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none">
          <img
            src="/ribbon.png"
            alt="Ribbon banner"
            className="w-full object-cover max-h-36 opacity-90"
          />
        </div>

        <div className="relative flex justify-center mb-5 pt-4 z-10">
          <img
            src="/3dbluetick.png"
            alt="Success checkmark"
            className="w-20 h-20 object-contain drop-shadow-md"
          />
        </div>

        <h2 className="relative z-10 text-lg font-bold text-gray-900 mb-2">Job posted Successfully!</h2>
        <p className="relative z-10 text-sm text-gray-400 leading-relaxed mb-8">We'll notify you when a professional<br />applies or contacts you.</p>

        <button
          onClick={onGoHome}
          className="relative z-10 w-full py-3.5 rounded-full bg-[#016EA6] hover:bg-[#061EA6] text-white text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

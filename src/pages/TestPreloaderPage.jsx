import React, { useState } from "react";
import Preloader from "../components/common/preloader/PreLoader";

const TestPreloaderPage = () => {
  const [key, setKey] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [autoLoop, setAutoLoop] = useState(false);

  const handleRestart = () => {
    setIsFinished(false);
    setKey((prev) => prev + 1);
  };

  const handleFinish = () => {
    setIsFinished(true);
    if (autoLoop) {
      setTimeout(() => {
        handleRestart();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 relative">
      {/* Background content to simulate page content behind preloader */}
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Preloader Test Sandbox
        </h1>
        <p className="text-gray-600 text-sm">
          Test and preview the Linkprosoft preloader animation in real-time.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#015682] text-white font-medium rounded-lg shadow transition-colors cursor-pointer"
          >
            Replay Animation
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoLoop}
              onChange={(e) => setAutoLoop(e.target.checked)}
              className="w-4 h-4 text-[#016EA6] rounded border-gray-300 focus:ring-[#016EA6]"
            />
            Auto Loop
          </label>
        </div>

        {isFinished && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg animate-fade-in">
            ✓ Preloader finished (`onFinish` callback triggered)
          </div>
        )}
      </div>

      {/* Render Preloader when not finished */}
      {!isFinished && <Preloader key={key} onFinish={handleFinish} />}
    </div>
  );
};

export default TestPreloaderPage;

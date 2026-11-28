import { Camera, X } from "lucide-react";
import selfieImage from "../../../assets/images/faceverification_illustration.jpg";
import VerificationHeader from "../../../components/verification/VerificationHeader";
import VerificationActionBar from "../../../components/verification/VerificationActionBar";
import useSelfieCamera from "../../../hooks/verification/useSelfieCamera";

const FaceVerificationStep = ({
  view,
  selfieCaptured,
  selfiePreviewUrl,
  setSelfieCaptured,
  setSelfieBlob,
  setSelfieMediaId,
  setSelfiePreviewUrl,
  errors,
  isLoading,
  onBack,
  onContinue,
}) => {
  const camera = useSelfieCamera({
    view,
    setSelfieBlob,
    setSelfieMediaId,
    setSelfiePreviewUrl,
    setSelfieCaptured,
  });

  return (
    <>
      <VerificationHeader title="Face Verification." description="Snap a selfie to match your face with the identity document provided" />
      <div className="verification-panel mt-4 grid gap-3 rounded-2xl border border-[#e7e8e8] p-3 sm:h-[clamp(280px,44vh,390px)] sm:grid-cols-[1.2fr_.85fr] sm:gap-4 sm:p-4">
        <div className="relative h-[220px] overflow-hidden rounded-xl bg-[#f9fbfb] sm:h-full">
          {camera.isCameraActive ? (
            <video ref={camera.videoRef} autoPlay playsInline muted aria-label="Live selfie camera" className="absolute inset-0 h-full w-full object-cover object-center" />
          ) : (
            <img src={selfieImage} alt="Face verification camera guide" className="absolute inset-0 h-full w-full object-cover object-center" />
          )}
          <div className="absolute inset-0 bg-slate-900/10" />
          <button
            type="button"
            onClick={camera.isCameraActive ? camera.captureSelfie : camera.startCamera}
            className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#171a1c] shadow-md transition hover:bg-[#f1f8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0879aa]"
          >
            <Camera size={17} className="text-[#0879aa]" />
            <span>{camera.isCameraActive ? "Capture Selfie" : selfieCaptured ? "Retake Selfie" : "Take Selfie"}</span>
          </button>
          {camera.isCameraActive && (
            <button type="button" onClick={camera.stopCamera} aria-label="Close live camera" className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-[#424648] shadow transition hover:bg-white">
              <X size={16} />
            </button>
          )}
          {(camera.cameraError || errors.selfie) && (
            <p role="alert" className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 px-3 py-2 text-center text-xs text-rose-600">
              {camera.cameraError || errors.selfie}
            </p>
          )}
        </div>
        <aside className="flex h-[220px] min-h-0 flex-col rounded-xl bg-[#fafafa] p-3 sm:h-full sm:p-4">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
            <span className="text-sm text-[#424648]">Preview</span>
            {selfiePreviewUrl && (
              <button type="button" onClick={camera.clearSelfie} aria-label="Remove selfie" className="rounded-full p-1 text-[#787d80] transition hover:bg-rose-50 hover:text-rose-600">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="mt-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-white">
            {selfiePreviewUrl ? (
              <img src={selfiePreviewUrl} alt="Selected selfie preview" className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 px-4 text-center text-[#85898b]">
                <Camera size={30} className="text-[#9cbac7]" />
                <p className="text-xs">Your selfie preview will appear here</p>
              </div>
            )}
          </div>
        </aside>
      </div>
      <VerificationActionBar onBack={onBack} onContinue={onContinue} isLoading={isLoading} />
    </>
  );
};

export default FaceVerificationStep;

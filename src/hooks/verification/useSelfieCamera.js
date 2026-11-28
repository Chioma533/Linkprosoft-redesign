import { useEffect, useRef, useState } from "react";

export default function useSelfieCamera({
  view,
  setSelfieBlob,
  setSelfieMediaId,
  setSelfiePreviewUrl,
  setSelfieCaptured,
}) {
  const objectUrlRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const currentViewRef = useRef(view);
  const isMountedRef = useRef(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  currentViewRef.current = view;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!isCameraActive || !video || !streamRef.current) return undefined;
    video.srcObject = streamRef.current;
    return () => {
      video.srcObject = null;
    };
  }, [isCameraActive]);

  useEffect(() => {
    if (view === "face") return;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  }, [view]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Live camera access requires a supported browser on HTTPS or localhost.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      if (!isMountedRef.current || currentViewRef.current !== "face") {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      if (!isMountedRef.current || currentViewRef.current !== "face") return;
      setCameraError(
        error?.name === "NotAllowedError"
          ? "Camera access was denied. Allow camera access in your browser settings and try again."
          : error?.name === "NotFoundError"
            ? "No camera was found on this device."
            : "Unable to start the camera. Check your camera connection and permissions.",
      );
    }
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) {
      setCameraError(
        "The camera is starting. Please try capturing again in a moment.",
      );
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError(
        "This browser could not capture the selfie. Please try again.",
      );
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!isMountedRef.current || currentViewRef.current !== "face") return;
      if (!blob) {
        setCameraError(
          "The selfie could not be captured. Please try again.",
        );
        return;
      }

      const file = new File([blob], `selfie-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const previewUrl = URL.createObjectURL(file);
      objectUrlRef.current = previewUrl;
      setSelfieBlob(file);
      setSelfieMediaId(null);
      setSelfiePreviewUrl(previewUrl);
      setSelfieCaptured(true);
      setCameraError("");
      stopCamera();
    }, "image/jpeg", 0.92);
  };

  const clearSelfie = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSelfieCaptured(false);
    setSelfieBlob(null);
    setSelfieMediaId(null);
    setSelfiePreviewUrl(null);
  };

  return {
    videoRef,
    isCameraActive,
    cameraError,
    startCamera,
    stopCamera,
    captureSelfie,
    clearSelfie,
  };
}

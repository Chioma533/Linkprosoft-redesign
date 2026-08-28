import { useState } from "react";
import {
  VERIFICATION_VIEWS,
  INITIAL_PROFILE,
} from "../../constants/verification";

const useVerification = () => {
  const [view, setView] = useState(VERIFICATION_VIEWS.OVERVIEW);

  const [profile, setProfile] = useState(INITIAL_PROFILE);

  const [selfieCaptured, setSelfieCaptured] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const startVerification = () => {
    setView(VERIFICATION_VIEWS.IDENTITY);
  };

  const goToView = (nextView) => {
    setView(nextView);
  };

  const updateProfile = (field, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  };

  const handleIdentityUpload = (file) => {
    setUploadedFile(file);
  };

  const captureSelfie = () => {
    setSelfieCaptured(true);
  };

  const showVerificationSuccess = () => {
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  return {
    view,
    profile,
    selfieCaptured,
    uploadedFile,
    showSuccess,

    setView: goToView,
    startVerification,

    updateProfile,

    handleIdentityUpload,

    captureSelfie,

    showVerificationSuccess,
    closeSuccess,
  };
};

export default useVerification;

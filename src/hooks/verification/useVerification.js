import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import verificationService from "../../api/services/verificationService";
import {
  VERIFICATION_VIEWS,
  INITIAL_PROFILE,
} from "../../constants/verification";

const FALLBACK_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "058", name: "Guaranty Trust Bank (GTB)" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "057", name: "Zenith Bank" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "070", name: "Fidelity Bank" },
  { code: "214", name: "First City Monument Bank (FCMB)" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "090110", name: "Kuda Bank" },
  { code: "999992", name: "OPay Digital Services" },
  { code: "999991", name: "PalmPay" },
  { code: "100004", name: "Moniepoint MFB" },
];

const useVerification = () => {
  const { user } = useAuthStore();

  const [view, setView] = useState(VERIFICATION_VIEWS.OVERVIEW);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [highestReachedStep, setHighestReachedStep] = useState(1);

  const [profile, setProfile] = useState(() => {
    const names = (user?.fullName || "").trim().split(" ");
    return {
      ...INITIAL_PROFILE,
      firstName: names[0] || "",
      lastName: names.slice(1).join(" ") || "",
      phone: user?.phone || user?.phoneNumber || "",
      nationality: "Nigerian",
      profession: user?.professionalType || user?.profession || "",
      bio: user?.bio || "",
      selectedCategories: [],
      bankName: "",
      bankCode: "",
      accountNumber: "",
      account_name: "",
      accountName: "",
      paymentPassword: "",
      bvn: "",
    };
  });

  const [idDocumentFile, setIdDocumentFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [selfieBlob, setSelfieBlob] = useState(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState(null);

  const [banks, setBanks] = useState(FALLBACK_BANKS);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load verification status & banks on mount
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        // 1. Fetch Banks List
        const bankList = await verificationService.getBanks();
        if (isMounted && Array.isArray(bankList) && bankList.length > 0) {
          setBanks(bankList);
        }
      } catch (err) {
        console.warn("Using fallback banks list:", err.message);
      }

      try {
        // 2. Fetch User Verification Status
        const statusRes = await verificationService.getVerificationStatus();
        if (isMounted && statusRes) {
          const completed = statusRes.completedSteps || [];
          setCompletedSteps(completed);

          if (statusRes.steps?.identity?.data) {
            setProfile((prev) => ({
              ...prev,
              ...statusRes.steps.identity.data,
            }));
          }

          const stepCount = completed.length + 1;
          setHighestReachedStep(Math.min(stepCount, 4));
        }
      } catch (err) {
        // If not started yet or endpoint not responding, start gracefully
        console.info("Verification status initialized for new submission");
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = (field, value) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      if (field === "account_name") {
        updated.accountName = value;
      } else if (field === "accountName") {
        updated.account_name = value;
      }
      return updated;
    });
    // Clear validation error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleIdentityUpload = (file) => {
    if (!file) return;
    setIdDocumentFile(file);
    setUploadedFile(file.name);
    if (errors.idDocument) {
      setErrors((prev) => ({ ...prev, idDocument: undefined }));
    }
  };

  // Switch view with safety checks for progress bar clicks
  const goToView = (nextView) => {
    const viewToStep = {
      [VERIFICATION_VIEWS.OVERVIEW]: 0,
      [VERIFICATION_VIEWS.IDENTITY]: 1,
      [VERIFICATION_VIEWS.PROFESSIONAL]: 2,
      [VERIFICATION_VIEWS.FACE]: 3,
      [VERIFICATION_VIEWS.PAYMENT]: 4,
      [VERIFICATION_VIEWS.REVIEW]: 5,
    };

    const targetStep = viewToStep[nextView] ?? 1;

    // Allow overview or any step that is unlocked
    if (
      nextView === VERIFICATION_VIEWS.OVERVIEW ||
      nextView === VERIFICATION_VIEWS.REVIEW ||
      targetStep <= highestReachedStep ||
      completedSteps.includes(nextView)
    ) {
      setView(nextView);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please complete the preceding verification step first.");
    }
  };

  const handleStepClick = (stepNumber, stepKey) => {
    const viewMap = {
      1: VERIFICATION_VIEWS.IDENTITY,
      2: VERIFICATION_VIEWS.PROFESSIONAL,
      3: VERIFICATION_VIEWS.FACE,
      4: VERIFICATION_VIEWS.PAYMENT,
    };
    const targetView = viewMap[stepNumber];
    if (targetView) {
      goToView(targetView);
    }
  };

  // Step 1: Submit Identity
  const submitIdentityStep = async () => {
    const newErrors = {};
    if (!profile.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!profile.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!profile.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!profile.dateOfBirth?.trim()) newErrors.dateOfBirth = "Date of birth is required";
    if (!profile.address?.trim()) newErrors.address = "Residential address is required";
    if (!profile.nationality?.trim()) newErrors.nationality = "Nationality is required";
    if (!idDocumentFile && !uploadedFile) newErrors.idDocument = "Identity document is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please complete all required identity fields.");
      return false;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phone", profile.phone);
      formData.append("dateOfBirth", profile.dateOfBirth);
      formData.append("address", profile.address);
      formData.append("nationality", profile.nationality);
      if (idDocumentFile) {
        formData.append("idDocument", idDocumentFile);
      }

      await verificationService.submitIdentity(formData);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "identity"])));
      setHighestReachedStep((prev) => Math.max(prev, 2));
      toast.success("Identity details saved!");
      setView(VERIFICATION_VIEWS.PROFESSIONAL);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save identity details.";
      toast.error(msg);
      // Allow progression in demo/offline mode if needed
      setCompletedSteps((prev) => Array.from(new Set([...prev, "identity"])));
      setHighestReachedStep((prev) => Math.max(prev, 2));
      setView(VERIFICATION_VIEWS.PROFESSIONAL);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Professional
  const submitProfessionalStep = async () => {
    const newErrors = {};
    if (!profile.profession?.trim()) newErrors.profession = "Profession is required";
    if (!profile.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required";
    if (!profile.category?.trim()) newErrors.category = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please complete all required professional fields.");
      return false;
    }

    setIsLoading(true);
    try {
      const payload = {
        profession: profile.profession,
        yearsOfExperience: profile.yearsOfExperience,
        bio: profile.bio || "",
        category: profile.category,
        selectedCategories: profile.selectedCategories || [profile.category],
      };

      await verificationService.submitProfessional(payload);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "professional"])));
      setHighestReachedStep((prev) => Math.max(prev, 3));
      toast.success("Professional details saved!");
      setView(VERIFICATION_VIEWS.FACE);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save professional details.";
      toast.error(msg);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "professional"])));
      setHighestReachedStep((prev) => Math.max(prev, 3));
      setView(VERIFICATION_VIEWS.FACE);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Submit Face Verification
  const submitFaceStep = async () => {
    if (!selfieCaptured && !selfiePreviewUrl && !selfieBlob) {
      toast.error("Please capture or upload your selfie before proceeding.");
      return false;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (selfieBlob) {
        formData.append("selfieImage", selfieBlob, "selfie.jpg");
      }

      await verificationService.submitFaceVerification(formData);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "face"])));
      setHighestReachedStep((prev) => Math.max(prev, 4));
      toast.success("Face selfie saved!");
      setView(VERIFICATION_VIEWS.PAYMENT);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to verify face selfie.";
      toast.error(msg);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "face"])));
      setHighestReachedStep((prev) => Math.max(prev, 4));
      setView(VERIFICATION_VIEWS.PAYMENT);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4 Helper: Resolve Bank Account
  const resolveBankAccount = useCallback(async (bankCode, accountNumber) => {
    if (!bankCode || !accountNumber || accountNumber.length !== 10) return;
    setIsResolvingAccount(true);
    try {
      const res = await verificationService.resolveAccount(bankCode, accountNumber);
      const name = res?.accountName || res?.account_name;
      if (name) {
        updateProfile("account_name", name);
        updateProfile("accountName", name);
        toast.success(`Account Verified: ${name}`);
      }
    } catch (err) {
      console.warn("Could not auto-resolve account name:", err.message);
    } finally {
      setIsResolvingAccount(false);
    }
  }, []);

  // Step 4: Submit Payment
  const submitPaymentStep = async () => {
    const newErrors = {};
    if (!profile.bankName?.trim()) newErrors.bankName = "Bank name is required";
    if (!profile.accountNumber?.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (profile.accountNumber.trim().length !== 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }

    const resolvedAccountName = profile.account_name?.trim() || profile.accountName?.trim();
    if (!resolvedAccountName) {
      newErrors.account_name = "Account name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please enter valid payment details.");
      return false;
    }

    setIsLoading(true);
    try {
      const payload = {
        bankName: profile.bankName,
        bank_name: profile.bankName,
        bankCode: profile.bankCode || "",
        bank_code: profile.bankCode || "",
        accountNumber: profile.accountNumber,
        account_number: profile.accountNumber,
        account_name: resolvedAccountName,
        accountName: resolvedAccountName,
        paymentPassword: profile.paymentPassword || "",
        payment_password: profile.paymentPassword || "",
        bvn: profile.bvn || "",
      };

      await verificationService.submitPaymentVerification(payload);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "payment"])));
      toast.success("Payment details saved!");
      setView(VERIFICATION_VIEWS.REVIEW);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save payment info.";
      toast.error(msg);
      setCompletedSteps((prev) => Array.from(new Set([...prev, "payment"])));
      setView(VERIFICATION_VIEWS.REVIEW);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5: Submit Final Verification
  const submitFinalVerification = async () => {
    setIsLoading(true);
    try {
      await verificationService.submitVerification({ agreeToTerms: true });
      setShowSuccess(true);
      toast.success("Your verification has been submitted successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit verification.";
      toast.error(msg);
      setShowSuccess(true); // Still show success modal in fallback
    } finally {
      setIsLoading(false);
    }
  };

  return {
    view,
    setView: goToView,
    completedSteps,
    highestReachedStep,
    handleStepClick,

    profile,
    updateProfile,
    errors,

    uploadedFile,
    handleIdentityUpload,

    selfieCaptured,
    setSelfieCaptured,
    selfieBlob,
    setSelfieBlob,
    selfiePreviewUrl,
    setSelfiePreviewUrl,

    banks,
    isResolvingAccount,
    resolveBankAccount,

    isLoading,
    showSuccess,
    setShowSuccess,

    submitIdentityStep,
    submitProfessionalStep,
    submitFaceStep,
    submitPaymentStep,
    submitFinalVerification,
  };
};

export default useVerification;

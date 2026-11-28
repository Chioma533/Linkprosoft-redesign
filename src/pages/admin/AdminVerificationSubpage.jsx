import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Users, 
  Briefcase, 
  PauseCircle, 
  Search, 
  ChevronDown, 
  Eye, 
  ArrowUpRight, 
  Check, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../api/services/adminService";
import mediaService from "../../api/services/mediaService";

const getStepData = (request, step) =>
  request?.steps?.[step]?.data || request?.[step]?.data || request?.[step] || {};

const formatDate = (date, locale = "en-GB") =>
  date
    ? new Date(date).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" }).toLowerCase()
    : "";

const normalizeVerificationRequest = (request) => {
  const user = request.user || {};
  const identity = getStepData(request, "identity");
  const professional = getStepData(request, "professional");
  const face = getStepData(request, "face");
  const verificationId = request.id || request.verificationId || request.requestId || request._id || "";
  const userName =
    request.userName ||
    request.name ||
    user.fullName ||
    user.name ||
    `${identity.firstName || user.firstName || ""} ${identity.lastName || user.lastName || ""}`.trim() ||
    "User";
  const initials = userName.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "US";
  const status = String(request.status || "pending_review").toLowerCase();
  const submittedAt = request.submittedAt || request.createdAt;

  return {
    ...request,
    id: String(verificationId),
    verificationId: String(verificationId),
    userId: request.userId || user.id || user._id || "",
    name: userName,
    initials,
    accountType: ["employer", "client"].includes(String(request.role || user.role || "").toLowerCase())
      ? "Client"
      : "Professional",
    verificationType: request.type || request.verificationType || "Identity & Professional Verification",
    submitted: formatDate(submittedAt),
    status,
    statusText: status === "pending_review" ? "Pending Review" : status.replaceAll("_", " "),
    details: {
      name: userName,
      profession: professional.profession || request.details?.profession || user.profession || user.category || "",
      email: request.email || request.details?.email || user.email || "",
      phone: identity.phone || request.details?.phone || user.phone || user.phoneNumber || "",
      location: identity.address || request.details?.location || user.address || user.location || "",
      submittedDate: formatDate(submittedAt, "en-US"),
      nationality: identity.nationality || request.details?.nationality || "",
      dateOfBirth: identity.dateOfBirth || identity.dob || request.details?.dateOfBirth || "",
      idType: identity.idType || identity.documentType || request.details?.idType || "",
      idNumber: identity.idNumber || request.details?.idNumber || "",
      yearsOfExperience: professional.yearsOfExperience || request.details?.yearsOfExperience || "",
      bio: professional.bio || request.details?.bio || "",
    },
    documents: {
      idFront: request.idDocumentUrl || identity.idDocumentUrl || identity.documentUrl || request.documents?.idFront || "",
      idFrontMediaId: request.idDocumentMediaId || identity.idDocumentMediaId || identity.documentMediaId || "",
      idBack: request.idDocumentBackUrl || identity.idDocumentBackUrl || identity.documentBackUrl || request.documents?.idBack || "",
      idBackMediaId: request.idDocumentBackMediaId || identity.idDocumentBackMediaId || identity.documentBackMediaId || "",
      selfie: request.selfieUrl || face.selfieUrl || request.documents?.selfie || "",
      selfieMediaId: request.selfieMediaId || face.selfieMediaId || "",
    },
  };
};

const AdminVerificationSubpage = ({ initialUser = null, onNavigate }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const detailRequestSequence = useRef(0);
  const initialUserHandled = useRef("");

  // Review Decision form states
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /*
  // Seed verification requests data fallback
  const defaultRequests = [
    {
      id: "#VR-88219",
      userId: "USR-88219",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88220",
      userId: "USR-88220",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88221",
      userId: "USR-88221",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88222",
      userId: "USR-88222",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88223",
      userId: "USR-88223",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88224",
      userId: "USR-88224",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88225",
      userId: "USR-88225",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
    {
      id: "#VR-88226",
      userId: "USR-88226",
      name: "Marvellous Samuel",
      initials: "MS",
      accountType: "Professional",
      verificationType: "Identity Verification",
      submitted: "24 jul 2026",
      status: "in_progress",
      statusText: "In Progress",
      details: {
        name: "Samuel Owoniyi",
        profession: "Plumber",
        email: "samuel293@gmail.com",
        phone: "+234 802 123 4567",
        location: "Lagos, Nigeria",
        submittedDate: "Jul 30, 2026",
      },
    },
  ];
  */

  const [requests, setRequests] = useState([]);

  const fetchVerificationData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const res = await adminService.getAdminVerifications({
        page,
        limit: 20,
        status: "pending_review",
      });
      const items = Array.isArray(res) ? res : res?.items || res?.requests || [];
      const normalized = items.map(normalizeVerificationRequest);
      const total = Number(res?.total ?? res?.meta?.total ?? res?.pagination?.total);
      setRequests(normalized);
      setTotalRequests(Number.isFinite(total) ? total : normalized.length);
      const lastPage = Math.max(1, Math.ceil((Number.isFinite(total) ? total : normalized.length) / 20));
      if (page > lastPage) setPage(lastPage);
    } catch (err) {
      console.warn("[AdminVerificationSubpage] Error fetching verification requests:", err);
      setRequests([]);
      setTotalRequests(0);
      setLoadError("Unable to load verification requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVerificationData();
  }, [fetchVerificationData]);

  const handleOpenRequest = useCallback(async (request) => {
    setSelectedRequest(request);
    setIsLoadingDetails(true);
    setRejectionReason("");
    setAdminNotes("");
    const sequence = ++detailRequestSequence.current;

    try {
      const response = await adminService.getAdminVerificationById(request.verificationId);
      const detail = response?.verification || response?.request || response?.item || response;
      const normalized = normalizeVerificationRequest({
        ...request,
        ...detail,
        id: request.verificationId,
        verificationId: request.verificationId,
      });
      const documents = { ...normalized.documents };
      const mediaAssets = [
        ["idFront", documents.idFrontMediaId],
        ["idBack", documents.idBackMediaId],
        ["selfie", documents.selfieMediaId],
      ].filter(([key, mediaId]) => mediaId && !documents[key]);
      const resolvedAssets = await Promise.allSettled(
        mediaAssets.map(async ([key, mediaId]) => [key, await mediaService.getUrl(mediaId)])
      );

      let failedMediaCount = 0;
      resolvedAssets.forEach((result) => {
        if (result.status === "fulfilled") {
          documents[result.value[0]] = result.value[1];
        } else {
          failedMediaCount += 1;
          console.warn("[AdminVerificationSubpage] Failed to load a verification document:", result.reason);
        }
      });

      if (sequence === detailRequestSequence.current) {
        setSelectedRequest({ ...normalized, documents });
        if (failedMediaCount > 0) {
          toast.error("Some uploaded documents could not be loaded.");
        }
      }
    } catch (err) {
      console.warn("[AdminVerificationSubpage] Error fetching verification details:", err);
      if (sequence === detailRequestSequence.current) {
        toast.error("Unable to load verification details. Please try again.");
      }
    } finally {
      if (sequence === detailRequestSequence.current) {
        setIsLoadingDetails(false);
      }
    }
  }, []);

  const closeSelectedRequest = () => {
    detailRequestSequence.current += 1;
    setIsLoadingDetails(false);
    setSelectedRequest(null);
  };

  // If initialUser was passed (e.g. from Users table "Unverified" link), focus directly on that user's dossier
  useEffect(() => {
    if (!initialUser || isLoading) return;
    const userKey = String(initialUser.id || initialUser._id || "");
    if (initialUserHandled.current === userKey) return;
    initialUserHandled.current = userKey;

    // Check if initialUser already exists in requests queue
    const matched = requests.find((r) => r.userId === initialUser.id || r.userId === initialUser._id);
    if (matched) {
      handleOpenRequest(matched);
      return;
    }

    // Build the request dossier from initialUser
    const userReq = {
      id: `#VR-${initialUser.id ? String(initialUser.id).slice(-5) : "88219"}`,
      userId: initialUser.id || initialUser._id,
      name: initialUser.name || "User",
      initials: (initialUser.name || "U")
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "US",
      accountType: initialUser.role === "employer" ? "Client" : "Professional",
      verificationType: "Identity & Professional Verification",
      submitted: initialUser.joined || "Recently",
      status: initialUser.verified === "verified" ? "approved" : "in_progress",
      statusText: initialUser.verified === "verified" ? "Approved" : "In Progress",
      details: {
        name: initialUser.name || "User",
        profession: initialUser.category || "Professional",
        email: initialUser.email || "user@linkprosoft.com",
        phone: initialUser.phone || "+234 800 000 0000",
        location: initialUser.location || "Lagos, Nigeria",
        submittedDate: initialUser.joined || "Recently",
      },
      documents: initialUser.documents || null,
      idDocumentUrl: initialUser.idDocumentUrl || null,
      idDocumentBackUrl: initialUser.idDocumentBackUrl || null,
      selfieUrl: initialUser.selfieUrl || null,
    };

    setSelectedRequest(userReq);

    // Fetch user dossier from backend if available to enrich with real uploaded documents
    if (initialUser.id) {
      adminService
        .getUserById(initialUser.id)
        .then((res) => {
          const dossier = res?.data?.user || res?.data || res;
          if (dossier) {
            setSelectedRequest((prev) => {
              if (!prev || prev.userId !== (initialUser.id || initialUser._id)) return prev;
              const docUrl =
                dossier.idDocumentUrl ||
                dossier.verification?.idDocumentUrl ||
                dossier.identityDocumentUrl ||
                dossier.kyc?.idUrl;
              const docBackUrl =
                dossier.idDocumentBackUrl ||
                dossier.verification?.idDocumentBackUrl;
              const selfie =
                dossier.selfieUrl ||
                dossier.faceUrl ||
                dossier.verification?.selfieUrl ||
                dossier.kyc?.selfieUrl;

              return {
                ...prev,
                details: {
                  ...prev.details,
                  name: dossier.fullName || dossier.name || prev.details.name,
                  email: dossier.email || prev.details.email,
                  phone: dossier.phone || dossier.phoneNumber || prev.details.phone,
                  profession: dossier.profession || dossier.category || prev.details.profession,
                  location: dossier.address || dossier.location || prev.details.location,
                  submittedDate: dossier.createdAt
                    ? new Date(dossier.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                    : prev.details.submittedDate,
                },
                idDocumentUrl: docUrl || prev.idDocumentUrl,
                idDocumentBackUrl: docBackUrl || prev.idDocumentBackUrl,
                selfieUrl: selfie || prev.selfieUrl,
              };
            });
          }
        })
        .catch((e) => {
          console.warn("[AdminVerificationSubpage] Failed to fetch additional user dossier:", e.message);
        });
    }
  }, [initialUser, isLoading, requests, handleOpenRequest]);

  const statCards = [
    {
      id: "pending",
      title: "Pending",
      value: isLoading ? "..." : totalRequests.toLocaleString(),
      trend: /* "+20% this week" */ "",
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "approved-today",
      title: "Approved Today",
      value: isLoading ? "..." : /* "12" */ "0",
      trend: /* "+20% this week" */ "",
      icon: Briefcase,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "rejected-today",
      title: "Rejected Today",
      value: isLoading ? "..." : /* "186" */ "0",
      trend: /* "+20% this week" */ "",
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "needs-info",
      title: "Needs More Info",
      value: isLoading ? "..." : /* "₦860K" */ "0",
      trend: /* "+20% this week" */ "",
      icon: PauseCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
  ];

  const handleApprove = async () => {
    const verificationId = selectedRequest?.verificationId;
    if (!verificationId) {
      toast.error("This verification request is missing its ID.");
      return;
    }

    try {
      await adminService.approveAdminVerification(verificationId);
      toast.success("Verification request approved successfully");
      await fetchVerificationData();
    } catch (err) {
      console.warn("[AdminVerificationSubpage] Failed to approve verification request:", err);
      toast.error(err.response?.data?.message || "Unable to approve verification request.");
      return;
    }
    setShowSuccessModal(true);
  };

  const handleReject = async () => {
    const verificationId = selectedRequest?.verificationId;
    if (!verificationId) {
      toast.error("This verification request is missing its ID.");
      return;
    }
    if (!rejectionReason && !adminNotes.trim()) {
      toast.error("Provide a rejection reason before rejecting this request.");
      return;
    }

    try {
      await adminService.rejectAdminVerification(verificationId, {
        rejectionReason: [rejectionReason, adminNotes.trim()].filter(Boolean).join(": "),
        rejectedStep: "identity",
      });
      toast.success(`Verification request for ${selectedRequest?.details?.name || "user"} rejected.`);
      closeSelectedRequest();
      await fetchVerificationData();
    } catch (err) {
      console.warn("[AdminVerificationSubpage] Failed to reject verification request:", err);
      toast.error(err.response?.data?.message || "Unable to reject verification request.");
      return;
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.details.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccountType =
      accountTypeFilter === "all"
        ? true
        : r.accountType.toLowerCase() === accountTypeFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" ? true : r.status === statusFilter;

    return matchesSearch && matchesAccountType && matchesStatus;
  });
  const totalPages = Math.max(1, Math.ceil(totalRequests / 20));

  // SCREEN 2: Details Review View
  if (selectedRequest) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
            Verification Request {selectedRequest.id}
          </h1>
          <button
            onClick={() => {
              closeSelectedRequest();
              if (initialUser && onNavigate) {
                onNavigate("users");
              }
            }}
            className="text-xs font-bold text-[#016EA6] hover:underline cursor-pointer border-none bg-transparent"
          >
            ← {initialUser ? "Back to Users" : "Back to all requests"}
          </button>
        </div>

        {/* Top Summary Banner Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-8 sm:gap-12">
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Status</span>
              <span className="bg-[#FFF4E5] text-[#FF9800] font-bold text-xs px-3 py-1 rounded-full inline-block">
                  {selectedRequest.statusText}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Type</span>
              <span className="bg-[#FFF4E5] text-[#FF9800] font-bold text-xs px-3 py-1 rounded-full inline-block">
                {selectedRequest.verificationType}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Submitted on</span>
              <span className="bg-gray-100 text-gray-700 font-bold text-xs px-3 py-1 rounded-full inline-block">
                {selectedRequest.details?.submittedDate || "—"}
              </span>
            </div>
          </div>

          {/* Right Watermark Graphic */}
          <div className="hidden md:flex p-3 bg-gray-50 rounded-2xl text-gray-300 shrink-0">
            <FileText className="w-10 h-10 stroke-[1.5]" />
          </div>
        </div>

        {isLoadingDetails && (
          <div className="flex items-center gap-2 text-sm text-gray-500" role="status">
            <Loader2 className="w-4 h-4 animate-spin text-[#016EA6]" />
            Loading submitted details and documents...
          </div>
        )}

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN (~60% width) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Card 1: User Profile Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs flex items-center gap-4 sm:gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-50 text-[#016EA6] flex items-center justify-center font-extrabold text-xl shrink-0">
                {selectedRequest.initials}
              </div>

              <div className="space-y-1 text-xs font-semibold text-gray-600">
                <h4 className="text-base sm:text-lg font-extrabold text-gray-900">
                  {selectedRequest.details?.name || "User"}
                </h4>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedRequest.details?.profession || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedRequest.details?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedRequest.details?.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedRequest.details?.location || "—"}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500">
                  {selectedRequest.details?.nationality && <span>Nationality: {selectedRequest.details.nationality}</span>}
                  {selectedRequest.details?.dateOfBirth && <span>Date of birth: {selectedRequest.details.dateOfBirth}</span>}
                  {selectedRequest.details?.idType && <span>ID type: {selectedRequest.details.idType}</span>}
                  {selectedRequest.details?.idNumber && <span>ID number: {selectedRequest.details.idNumber}</span>}
                  {selectedRequest.details?.yearsOfExperience && (
                    <span>Experience: {selectedRequest.details.yearsOfExperience} years</span>
                  )}
                </div>
                {selectedRequest.details?.bio && (
                  <p className="max-w-2xl text-gray-500 leading-relaxed">{selectedRequest.details.bio}</p>
                )}
              </div>
            </div>

            {/* Card 2: Submitted Documents */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
              <h4 className="font-extrabold text-gray-900 text-base tracking-tight">
                Submitted Documents
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Card Front */}
                <div className="bg-gray-50/70 rounded-2xl p-3.5 border-none space-y-2">
                  {selectedRequest.documents?.idFront || selectedRequest.idDocumentUrl ? (
                    <a href={selectedRequest.documents?.idFront || selectedRequest.idDocumentUrl} target="_blank" rel="noreferrer">
                      <img
                        src={selectedRequest.documents?.idFront || selectedRequest.idDocumentUrl}
                        alt="Uploaded government ID"
                        className="w-full h-32 object-contain rounded-xl shadow-xs bg-white"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-white flex items-center justify-center text-xs text-gray-400">
                      No identity document uploaded
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Government ID</span>
                      <span className="text-[10px] font-medium text-gray-400 block">
                        {selectedRequest.details?.idType || "Identity Document"}
                      </span>
                    </div>
                    {selectedRequest.documents?.idFront || selectedRequest.idDocumentUrl
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2]" />
                      : <span className="text-[10px] text-gray-400">Missing</span>}
                  </div>
                </div>

                {/* ID Card Back */}
                <div className="bg-gray-50/70 rounded-2xl p-3.5 border-none space-y-2">
                  {selectedRequest.documents?.idBack || selectedRequest.idDocumentBackUrl ? (
                    <a href={selectedRequest.documents?.idBack || selectedRequest.idDocumentBackUrl} target="_blank" rel="noreferrer">
                      <img
                        src={selectedRequest.documents?.idBack || selectedRequest.idDocumentBackUrl}
                        alt="Uploaded secondary identity document"
                        className="w-full h-32 object-contain rounded-xl shadow-xs bg-white"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-white flex items-center justify-center text-xs text-gray-400">
                      No secondary document uploaded
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Government ID</span>
                      <span className="text-[10px] font-medium text-gray-400 block">Back / Secondary Document</span>
                    </div>
                    {selectedRequest.documents?.idBack || selectedRequest.idDocumentBackUrl
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2]" />
                      : <span className="text-[10px] text-gray-400">Optional</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Selfie Uploaded */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900 text-base tracking-tight">
                  Selfie Uploaded
                </h4>
                {selectedRequest.documents?.selfie || selectedRequest.selfieUrl
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2]" />
                  : <span className="text-[10px] text-gray-400">Missing</span>}
              </div>

              {selectedRequest.documents?.selfie || selectedRequest.selfieUrl ? (
                <a href={selectedRequest.documents?.selfie || selectedRequest.selfieUrl} target="_blank" rel="noreferrer">
                  <img
                    src={selectedRequest.documents?.selfie || selectedRequest.selfieUrl}
                    alt="Uploaded verification selfie"
                    className="w-full max-w-md h-52 object-contain rounded-2xl border-none shadow-xs bg-gray-50"
                  />
                </a>
              ) : (
                <div className="w-full h-44 rounded-2xl bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                  No verification selfie uploaded
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (~40% width): Review Decision */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-5">
            <h4 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
              Review Decision
            </h4>

            {/* Rejection Reason Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Rejection Reason (if there's any)
              </label>
              <div className="relative">
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/90 focus:bg-gray-100/80 rounded-2xl text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select a reason</option>
                  <option value="Blurry document image">Blurry Document Image</option>
                  <option value="Name mismatch">Name Mismatch</option>
                  <option value="Expired ID document">Expired ID Document</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Admin Notes Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes"
                rows={4}
                className="w-full px-4 py-3 bg-gray-50/90 focus:bg-gray-100/80 rounded-2xl text-xs font-medium text-gray-800 outline-none border-none resize-none h-32 placeholder:text-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleApprove}
                className="w-full py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer border-none"
              >
                Approve Request
              </button>
              <button
                onClick={handleReject}
                className="w-full py-3.5 bg-[#FFEBEB] hover:bg-[#FFD6D6] text-[#FF4D4D] font-bold text-sm rounded-2xl transition-all cursor-pointer border-none"
              >
                Reject user
              </button>
            </div>
          </div>
        </div>

        {/* SCREEN 3: Verification Successful Confirmation Modal Overlay */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-none text-center overflow-hidden animate-in fade-in zoom-in-95">
              {/* Confetti Ribbon Graphics */}
              <div className="absolute top-4 left-6 w-3 h-3 bg-pink-500 rounded-sm transform rotate-45 animate-bounce" />
              <div className="absolute top-8 left-12 w-2 h-4 bg-purple-500 rounded-full transform -rotate-12" />
              <div className="absolute top-6 right-8 w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="absolute top-10 right-14 w-2 h-4 bg-cyan-400 rounded-sm transform rotate-30" />
              <div className="absolute top-14 left-8 w-4 h-2 bg-emerald-400 rounded-full transform rotate-12" />

              {/* Avatar + Green Check Badge */}
              <div className="relative z-10 my-4 inline-flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 text-[#016EA6] flex items-center justify-center text-xl font-extrabold shadow-md">
                    {selectedRequest.initials}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#22C55E] rounded-full border-2 border-white flex items-center justify-center text-white shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-2">
                Verification Successful
              </h3>
              <p className="text-xs font-semibold text-gray-500 max-w-xs mx-auto leading-relaxed mt-2">
                {selectedRequest.details?.name || "The applicant"} is now verified on Linkprosoft.
              </p>

              <div className="space-y-2.5 mt-7">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    closeSelectedRequest();
                    if (initialUser && onNavigate) {
                      onNavigate("users");
                    }
                  }}
                  className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-full transition-all cursor-pointer border-none"
                >
                  {initialUser ? "Go back to Users" : "Go back to Requests"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 1: Main Table View
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
          Verification Requests
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
          Review identity verification requests submitted by professionals and clients.
        </p>
      </div>

      {/* Top 4 Stat Cards (Border-less) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-full ${card.iconBg || ""}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor} stroke-[1.8]`} />
                </div>
              </div>
              <div className="mt-3 mb-2">
                <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block leading-none">
                  {card.value}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Verification Requests Table Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
        {/* Table Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
            All Request
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or ID...."
                className="pl-9 pr-4 py-2 bg-gray-50/90 focus:bg-gray-100/80 rounded-full text-xs font-medium text-gray-700 outline-none border-none w-full sm:w-56 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Account Type Dropdown */}
            <div className="relative">
              <select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">Account Type: All</option>
                <option value="professional">Professional</option>
                <option value="client">Client</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Today Dropdown */}
            <div className="relative">
              <select className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all">
                <option>Today</option>
                <option>This Week</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all">
                <option>Sort by:</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-none">
            <thead>
              <tr className="border-none text-xs font-semibold text-gray-400">
                <th className="py-3.5 px-3">User</th>
                <th className="py-3.5 px-3">Account Type</th>
                <th className="py-3.5 px-3">Verification type</th>
                <th className="py-3.5 px-3">Submitted</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="border-none">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400 text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#016EA6]" />
                      <span>Loading verification requests...</span>
                    </div>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-rose-600 text-xs font-medium">
                    {loadError}{" "}
                    <button onClick={fetchVerificationData} className="font-bold underline">
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400 text-xs font-medium">
                    No verification requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, idx) => (
                  <tr
                    key={req.verificationId || idx}
                    onClick={() => handleOpenRequest(req)}
                    className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#016EA6] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {req.initials}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-800">
                          {req.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFF4E5] text-[#FF9800]">
                        {req.accountType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {req.verificationType}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">
                      {req.submitted}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFF4E5] text-[#FF9800]">
                        {req.statusText}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRequest(req);
                        }}
                        className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400 text-xs font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#016EA6]" />
              <span>Loading requests...</span>
            </div>
          ) : loadError ? (
            <div className="text-center py-8 text-rose-600 text-xs font-medium">
              {loadError}{" "}
              <button onClick={fetchVerificationData} className="font-bold underline">
                Retry
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs font-medium">
              No verification requests found.
            </div>
          ) : (
            filteredRequests.map((req, idx) => (
              <div
                key={req.verificationId || idx}
                onClick={() => handleOpenRequest(req)}
                className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#016EA6] text-white flex items-center justify-center text-[10px] font-bold">
                      {req.initials}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm">{req.name}</h4>
                  </div>
                  <button className="p-1 text-gray-500 hover:text-[#016EA6]">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Type: {req.accountType}</span>
                  <span>Submitted: {req.submitted}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-gray-700">{req.verificationType}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#FF9800]">
                    {req.statusText}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
          <span className="text-xs font-medium text-gray-500">
            {totalRequests === 0
              ? "No requests"
              : `Showing ${(page - 1) * 20 + 1}-${Math.min(page * 20, totalRequests)} of ${totalRequests} requests`}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || isLoading}
              className="px-3 h-7 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-500 font-semibold text-xs border-none"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-gray-600">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages || isLoading}
              className="px-3 h-7 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-500 font-semibold text-xs border-none"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationSubpage;

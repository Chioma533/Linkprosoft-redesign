import React, { useState, useEffect, useCallback } from "react";
import { 
  X, 
  ChevronRight, 
  Wallet, 
  RotateCcw, 
  Split, 
  Lock, 
  AlertTriangle, 
  Check, 
  Download,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Loader2,
  FileText,
  ShieldAlert
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../../api/services/adminService";
import EvidenceLightbox from "../../../components/common/EvidenceLightbox";
import DocumentPreview from "../../../components/common/DocumentPreview";

const AdminDisputeDetails = ({ dispute, onBack, onResolve }) => {
  const [activeModal, setActiveModal] = useState(null); // 'release' | 'refund' | 'split' | 'profile' | 'success' | null
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [activeLightboxIdx, setActiveLightboxIdx] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const cleanDisputeId = dispute?.rawId || dispute?.id?.replace?.(/^#/, "") || dispute?.id;

  const fetchEvidence = useCallback(async () => {
    if (!cleanDisputeId) return;
    setEvidenceLoading(true);
    try {
      const res = await adminService.getDisputeEvidence(cleanDisputeId);
      const items = res?.data || res?.items || res || [];
      if (Array.isArray(items) && items.length > 0) {
        setEvidence(items);
      } else if (Array.isArray(dispute?.evidence) && dispute.evidence.length > 0) {
        setEvidence(dispute.evidence);
      } else {
        setEvidence([]);
      }
    } catch (err) {
      console.warn("[AdminDisputeDetails] Error fetching dispute evidence:", err);
      if (Array.isArray(dispute?.evidence) && dispute.evidence.length > 0) {
        setEvidence(dispute.evidence);
      } else {
        setEvidence([]);
      }
    } finally {
      setEvidenceLoading(false);
    }
  }, [cleanDisputeId, dispute?.evidence]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const handleDownloadAll = async () => {
    if (!evidence.length) {
      toast.error("No evidence files available to download");
      return;
    }
    setDownloadingAll(true);
    toast.loading("Generating audited download links...", { id: "dl-all" });
    try {
      for (const item of evidence) {
        try {
          const res = await adminService.downloadEvidence(cleanDisputeId, item.media_id || item.id);
          const dlUrl = res?.data?.downloadUrl || res?.downloadUrl || item.deliveryUrl;
          if (dlUrl) {
            const link = document.createElement("a");
            link.href = dlUrl;
            link.download = item.original_filename || `evidence-${item.id}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (itemErr) {
          console.warn("Error downloading item:", itemErr);
        }
      }
      toast.success("Download links triggered and logged to audit trail", { id: "dl-all" });
    } catch (err) {
      toast.error("Failed to download some evidence files", { id: "dl-all" });
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleActionConfirm = (actionType) => {
    setActiveModal(null);
    if (onResolve) {
      onResolve(dispute.id, { type: actionType, percentage: splitPercentage });
    }
    setActiveModal("success");
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
            {dispute.id || "#DSP-1024"}
          </h1>
          <span className="bg-gray-100 text-gray-700 font-bold text-xs px-3 py-1 rounded-full">
            Open
          </span>
          <span className="bg-[#FFF1F2] text-rose-600 font-bold text-xs px-3 py-1 rounded-full">
            High priority
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN (~55% width) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Job Info Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
                {dispute.jobTitle || "Kitchen Plumbing Repair"}
              </h3>
              <span className="bg-[#FFF4E5] text-[#FF9800] font-bold text-xs px-3 py-1 rounded-full">
                In Progress
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs font-semibold">
              <div className="flex items-center justify-between text-gray-600">
                <span className="text-gray-400">Job ID</span>
                <span className="font-bold text-gray-900">#958603</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="text-gray-400">Category</span>
                <span className="font-bold text-gray-900">Plumbing</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="text-gray-400">Date Issued</span>
                <span className="font-bold text-gray-900">23 Jun, 2026</span>
              </div>
            </div>
          </div>

          {/* Card 2: Dispute Overview Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-3">
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
              Dispute Overview
            </h3>
            <span className="inline-block bg-[#E0F2FE] text-[#016EA6] px-3.5 py-1 rounded-full font-bold text-xs">
              Reason: Incomplete Deliverables
            </span>
            <p className="text-xs font-medium text-gray-500 leading-relaxed pt-1">
              The client claims that the plumbing work was completed, but within 24 hours the newly installed kitchen sink began leaking beneath the cabinet. According to the client, water is seeping from the pipe connections, causing damage to the cabinet flooring. The professional was contacted several times for repairs but has not responded to follow-up messages or scheduled a return visit for more than 48 hours. The client is requesting a review of the completed work and a refund from the escrow balance if the issue is confirmed.
            </p>
          </div>

          {/* Card 3: Evidence Gallery Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                  Evidence Gallery
                </h3>
                {evidence.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#016EA6]">
                    {evidence.length} {evidence.length === 1 ? "file" : "files"}
                  </span>
                )}
              </div>
              {evidence.length > 0 && (
                <button 
                  type="button"
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="text-xs font-bold text-[#016EA6] hover:underline cursor-pointer border-none bg-transparent inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingAll ? "Downloading..." : "Download All (Audited)"}</span>
                </button>
              )}
            </div>

            {evidenceLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#016EA6]" />
                <span className="text-xs font-medium">Loading verified evidence...</span>
              </div>
            ) : evidence.length === 0 ? (
              <div className="py-10 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700">No evidence submitted yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Neither party has uploaded photos, documents, or reference files for this dispute.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {evidence.map((item, idx) => {
                  const isPdf =
                    item.content_type === "application/pdf" ||
                    item.original_filename?.toLowerCase().endsWith(".pdf");

                  return (
                    <div
                      key={item.id || idx}
                      className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group transition-all hover:shadow-sm"
                    >
                      {/* Evidence Type & Moderation Status Badges */}
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs ${
                            item.evidence_type === "assignment_ref"
                              ? "bg-purple-100 text-purple-700"
                              : item.evidence_type === "chat_ref"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item.evidence_type === "assignment_ref"
                            ? "Assignment Asset"
                            : item.evidence_type === "chat_ref"
                            ? "Chat Attachment"
                            : "Direct Upload"}
                        </span>
                        {item.moderation_status && item.moderation_status !== "pending" && (
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shadow-xs ${
                              item.moderation_status === "approved"
                                ? "bg-emerald-600 text-white"
                                : item.moderation_status === "flagged"
                                ? "bg-amber-500 text-white"
                                : "bg-rose-600 text-white"
                            }`}
                          >
                            {item.moderation_status}
                          </span>
                        )}
                      </div>

                      {/* Document / Media Preview */}
                      <DocumentPreview
                        url={item.deliveryUrl}
                        contentType={item.content_type || ""}
                        filename={item.original_filename || `Evidence #${idx + 1}`}
                        caption={item.caption}
                        className="h-36 sm:h-44 w-full"
                        onClick={() => setActiveLightboxIdx(idx)}
                        onDownload={() => {
                          adminService
                            .downloadEvidence(cleanDisputeId, item.media_id || item.id)
                            .then((res) => {
                              const url = res?.data?.downloadUrl || res?.downloadUrl || item.deliveryUrl;
                              if (url) window.open(url, "_blank");
                            })
                            .catch(() => {
                              if (item.deliveryUrl) window.open(item.deliveryUrl, "_blank");
                            });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (~45% width) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Parties Involved */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
              Parties Involved
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Client Profile Card */}
              <div className="bg-gray-50/70 rounded-2xl p-4 border-none text-center space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover mx-auto"
                />
                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <h5 className="text-xs font-bold text-gray-800">Samuel Owoniyi</h5>
                    <span className="text-[10px] font-bold text-[#016EA6] bg-blue-50 px-2 py-0.5 rounded">Client</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">samuel293@gmail.com</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">12 jobs posted</p>
                </div>
                <button
                  onClick={() => setSelectedUserForProfile({ name: "Samuel Owoniyi", role: "Client", email: "samuel293@gmail.com" })}
                  className="w-full py-2 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
                >
                  View Profile
                </button>
              </div>

              {/* Professional Profile Card */}
              <div className="bg-gray-50/70 rounded-2xl p-4 border-none text-center space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Professional"
                  className="w-12 h-12 rounded-full object-cover mx-auto"
                />
                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <h5 className="text-xs font-bold text-gray-800">Samuel Owoniyi</h5>
                    <span className="text-[10px] font-bold text-[#016EA6] bg-blue-50 px-2 py-0.5 rounded">Professional</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">samuel293@gmail.com</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">12 jobs posted</p>
                </div>
                <button
                  onClick={() => setSelectedUserForProfile({ name: "Samuel Owoniyi", role: "Professional", email: "samuel293@gmail.com" })}
                  className="w-full py-2 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Escrow Status Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                Escrow Status
              </h3>
              <span className="bg-[#E6F9F0] text-[#00CC66] font-bold text-xs px-3 py-1 rounded-full">
                Locked
              </span>
            </div>

            {/* Dark Blue Graphic Container */}
            <div className="bg-[#016EA6] rounded-2xl p-5 text-white flex items-center justify-between shadow-md relative overflow-hidden">
              <div>
                <span className="text-xs text-white/80 font-medium block">Money hold</span>
                <span className="text-2xl sm:text-3xl font-extrabold block mt-1">₦540,000</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <Lock className="w-7 h-7 stroke-[2]" />
              </div>
            </div>

            <p className="text-[11px] font-medium text-gray-400">
              Funded Jan 5, 2024 ● Paid with card: Visa ****4242
            </p>
          </div>

          {/* Card 3: Resolution Actions Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
              Resolution Actions
            </h3>

            <div className="space-y-3">
              {/* Release Escrow */}
              <button
                onClick={() => setActiveModal("release")}
                className="w-full bg-gray-50/70 hover:bg-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors border-none text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-gray-700 shadow-xs">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Release Escrow</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Refund Client */}
              <button
                onClick={() => setActiveModal("refund")}
                className="w-full bg-gray-50/70 hover:bg-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors border-none text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-gray-700 shadow-xs">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Refund Client</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Split Money */}
              <button
                onClick={() => setActiveModal("split")}
                className="w-full bg-gray-50/70 hover:bg-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors border-none text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-gray-700 shadow-xs">
                    <Split className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Split Money</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Keep Escrow on Hold */}
              <button
                onClick={() => toast.success("Dispute status kept on hold.")}
                className="w-full bg-gray-50/70 hover:bg-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors border-none text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-gray-700 shadow-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Keep Escrow on Hold</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Evidence Lightbox with Audited Expiring Download Links */}
      {activeLightboxIdx !== null && evidence.length > 0 && (
        <EvidenceLightbox
          evidenceList={evidence}
          currentIndex={activeLightboxIdx}
          disputeId={cleanDisputeId}
          onClose={() => setActiveLightboxIdx(null)}
          onNavigate={(newIdx) => setActiveLightboxIdx(newIdx)}
          onEvidenceUpdated={fetchEvidence}
        />
      )}

      {/* MODAL 1: Release Escrow Modal Overlay */}
      {activeModal === "release" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border-none transform transition-all animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Release Escrow</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full border-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-2">
              <h4 className="text-xs font-bold text-gray-700">Professional Details</h4>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Samuel Owoniyi"
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute -top-1 -right-1" />
                </div>
                <div className="space-y-1 text-xs font-semibold text-gray-600">
                  <h5 className="text-sm font-extrabold text-gray-900">Samuel Owoniyi</h5>
                  <div className="flex items-center gap-1 text-gray-500"><Briefcase className="w-3.5 h-3.5 text-gray-400" /> Plumber</div>
                  <div className="flex items-center gap-1 text-gray-500"><Mail className="w-3.5 h-3.5 text-gray-400" /> samuel293@gmail.com</div>
                  <div className="flex items-center gap-1 text-gray-500"><Phone className="w-3.5 h-3.5 text-gray-400" /> +234 802 123 4567</div>
                  <div className="flex items-center gap-1 text-gray-500"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Lagos, Nigeria</div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF5ED] text-[#FF7A00] rounded-2xl p-4 border-none flex items-start gap-2.5 my-5 text-xs font-medium leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Escrow will be released to Samuel and he will be able to withdraw to his local bank kindly reconfirm this if you are not sure</span>
            </div>

            <button
              onClick={() => handleActionConfirm("release")}
              className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none"
            >
              Release escrow
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Refund Client Modal Overlay */}
      {activeModal === "refund" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border-none transform transition-all animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Refund Client</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full border-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-2">
              <h4 className="text-xs font-bold text-gray-700">Professional Details</h4>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Elvis Chimanda"
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute -top-1 -right-1" />
                </div>
                <div className="space-y-1 text-xs font-semibold text-gray-600">
                  <h5 className="text-sm font-extrabold text-gray-900">Elvis Chimanda</h5>
                  <div className="flex items-center gap-1 text-gray-500"><Mail className="w-3.5 h-3.5 text-gray-400" /> samuel293@gmail.com</div>
                  <div className="flex items-center gap-1 text-gray-500"><Phone className="w-3.5 h-3.5 text-gray-400" /> +234 802 123 4567</div>
                  <div className="flex items-center gap-1 text-gray-500"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Lagos, Nigeria</div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF5ED] text-[#FF7A00] rounded-2xl p-4 border-none flex items-start gap-2.5 my-5 text-xs font-medium leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>The money held in escrow will be refunded to Elvis, kindly reconfirm if you are not sure about this</span>
            </div>

            <button
              onClick={() => handleActionConfirm("refund")}
              className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none"
            >
              Refund Client
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Split Escrow Modal Overlay */}
      {activeModal === "split" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border-none transform transition-all animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl">
                  <Split className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Split Escrow</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full border-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Box */}
            <div className="bg-gray-50/80 rounded-2xl p-5 my-4 space-y-4 text-center">
              <span className="bg-[#016EA6] text-white font-bold text-xs px-3.5 py-1 rounded-full inline-block">
                {splitPercentage}/{100 - splitPercentage}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={splitPercentage}
                onChange={(e) => setSplitPercentage(Number(e.target.value))}
                className="w-full accent-[#016EA6] cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-3 text-left pt-2">
                <div className="bg-white rounded-xl p-3 flex items-center gap-2.5 border-none shadow-xs">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover" alt="Client" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-800 truncate">Samuel Owoniyi</span>
                      <span className="text-[9px] text-[#016EA6] bg-blue-50 px-1.5 py-0.5 rounded">Client</span>
                    </div>
                    <span className="text-[10px] text-gray-400 truncate block">samuel293@gmail.com</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 flex items-center gap-2.5 border-none shadow-xs">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover" alt="Professional" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-800 truncate">Samuel Owoniyi</span>
                      <span className="text-[9px] text-[#016EA6] bg-blue-50 px-1.5 py-0.5 rounded">Professional</span>
                    </div>
                    <span className="text-[10px] text-gray-400 truncate block">samuel293@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF5ED] text-[#FF7A00] rounded-2xl p-4 border-none flex items-start gap-2.5 mb-5 text-xs font-medium leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Escrow will be released to Samuel and according to the percentage your have chose, kindly reconfirm this if you are not sure</span>
            </div>

            <button
              onClick={() => handleActionConfirm("split")}
              className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none"
            >
              Split escrow
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Dispute Resolved Successfully Confirmation */}
      {activeModal === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-none text-center overflow-hidden animate-in fade-in zoom-in-95">
            {/* Confetti graphics */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-pink-500 rounded-sm transform rotate-45" />
            <div className="absolute top-8 left-12 w-2 h-4 bg-purple-500 rounded-full" />
            <div className="absolute top-6 right-8 w-3 h-3 bg-yellow-400 rounded-full" />

            {/* Dual Overlapping Avatars with Green Check Badge */}
            <div className="relative z-10 my-4 inline-flex items-center justify-center">
              <div className="flex items-center -space-x-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-md"
                  alt="Client"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-md"
                  alt="Professional"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-3">
              Dispute Resolved Successfully
            </h3>
            <p className="text-xs font-semibold text-gray-500 max-w-xs mx-auto leading-relaxed mt-2">
              The dispute is now closed. Both parties have been notified, and funds have been processed.
            </p>

            <div className="space-y-2.5 mt-7">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none"
              >
                View Details
              </button>
              <button
                onClick={onBack}
                className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-full transition-all cursor-pointer border-none"
              >
                Go back home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisputeDetails;

import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  Flag,
  EyeOff,
  Clock,
  User,
  Tag,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../api/services/adminService";

const EvidenceLightbox = ({
  evidenceList = [],
  currentIndex = 0,
  disputeId,
  onClose,
  onNavigate,
  onEvidenceUpdated,
}) => {
  const [index, setIndex] = useState(currentIndex);
  const [downloading, setDownloading] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationNotes, setModerationNotes] = useState("");
  const [showModNotes, setShowModNotes] = useState(false);

  const current = evidenceList[index];

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, evidenceList.length]);

  if (!current) return null;

  const handlePrev = () => {
    const nextIdx = (index - 1 + evidenceList.length) % evidenceList.length;
    setIndex(nextIdx);
    onNavigate?.(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (index + 1) % evidenceList.length;
    setIndex(nextIdx);
    onNavigate?.(nextIdx);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await adminService.downloadEvidence(disputeId, current.media_id || current.id);
      const downloadUrl = res?.data?.downloadUrl || res?.downloadUrl || current.deliveryUrl;
      if (!downloadUrl) throw new Error("No download link generated");

      // Trigger browser download via invisible anchor
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = current.original_filename || `dispute-${disputeId}-evidence-${index + 1}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Expiring download link generated & audit logged");
    } catch (err) {
      console.warn("Download error:", err);
      // Fallback to direct deliveryUrl if available
      if (current.deliveryUrl) {
        window.open(current.deliveryUrl, "_blank");
        toast.success("Opening media file in new tab");
      } else {
        toast.error("Failed to generate download link");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleModerate = async (status) => {
    setIsModerating(true);
    try {
      await adminService.moderateEvidence(disputeId, current.media_id || current.id, {
        status,
        notes: moderationNotes.trim() || undefined,
      });
      toast.success(`Evidence marked as ${status}`);
      setShowModNotes(false);
      setModerationNotes("");
      onEvidenceUpdated?.();
    } catch (err) {
      console.warn("Moderation error:", err);
      toast.error(err.response?.data?.message || "Failed to update moderation status");
    } finally {
      setIsModerating(false);
    }
  };

  const isPdf =
    current.content_type === "application/pdf" ||
    current.original_filename?.toLowerCase().endsWith(".pdf");

  const isVideo =
    current.content_type?.startsWith("video/") ||
    /\.(mp4|webm|mov)$/i.test(current.original_filename || "");

  const isImage =
    current.content_type?.startsWith("image/") ||
    (!isPdf && !isVideo && !current.content_type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer border-none"
        title="Close (Esc)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev / Next buttons */}
      {evidenceList.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer border-none"
            title="Previous (Left arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer border-none"
            title="Next (Right arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Modal Layout */}
      <div className="relative max-w-6xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        {/* Left Side: Media Display Area */}
        <div className="flex-1 min-h-[300px] lg:min-h-[550px] bg-black/60 flex items-center justify-center p-4 relative overflow-hidden">
          {isImage && (
            <img
              src={current.deliveryUrl}
              alt={current.caption || current.original_filename || "Evidence image"}
              className="max-w-full max-h-[75vh] object-contain rounded-xl select-none"
            />
          )}

          {isPdf && (
            <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center p-6 bg-gray-900 rounded-xl text-center">
              <iframe
                src={`${current.deliveryUrl}#toolbar=0`}
                title="PDF Evidence Document"
                className="w-full h-[65vh] rounded-lg border border-gray-800 bg-white"
              />
            </div>
          )}

          {isVideo && (
            <video
              src={current.deliveryUrl}
              controls
              className="max-w-full max-h-[75vh] rounded-xl"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          )}

          {/* Item Counter Pill */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-semibold">
            {index + 1} of {evidenceList.length}
          </div>
        </div>

        {/* Right Side: Evidence Metadata & Moderation Panel */}
        <div className="w-full lg:w-96 bg-[#1F2937] p-5 sm:p-6 flex flex-col justify-between text-gray-200 space-y-5 overflow-y-auto max-h-[90vh]">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    current.evidence_type === "assignment_ref"
                      ? "bg-purple-900/60 text-purple-300 border border-purple-700"
                      : current.evidence_type === "chat_ref"
                      ? "bg-blue-900/60 text-blue-300 border border-blue-700"
                      : "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                  }`}
                >
                  {current.evidence_type || "uploaded"}
                </span>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    current.moderation_status === "approved"
                      ? "bg-emerald-900/60 text-emerald-300"
                      : current.moderation_status === "flagged"
                      ? "bg-amber-900/60 text-amber-300"
                      : current.moderation_status === "redacted"
                      ? "bg-rose-900/60 text-rose-300"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {current.moderation_status || "pending"}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-2 truncate" title={current.original_filename}>
                {current.original_filename || "Evidence File"}
              </h4>
            </div>

            {/* Caption */}
            {current.caption ? (
              <div className="p-3 bg-gray-800/80 rounded-2xl border border-gray-700 text-xs text-gray-300 leading-relaxed font-medium">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Caption</span>
                {current.caption}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No caption provided by submitter.</p>
            )}

            {/* Metadata Fields */}
            <div className="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <User className="w-3.5 h-3.5" /> Uploaded by
                </span>
                <span className="font-semibold text-white">
                  {current.uploaded_by_name || (current.uploaded_by ? `User ${current.uploaded_by.slice(0, 8)}` : "Party")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-3.5 h-3.5" /> Submitted
                </span>
                <span className="font-semibold text-white">
                  {current.submitted_at ? new Date(current.submitted_at).toLocaleString() : "Recently"}
                </span>
              </div>

              {current.byte_size && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Tag className="w-3.5 h-3.5" /> File size
                  </span>
                  <span className="font-semibold text-white">
                    {(Number(current.byte_size) / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>

            {/* Moderation Controls for Admins */}
            <div className="pt-3 border-t border-gray-700 space-y-2">
              <span className="text-xs font-bold text-gray-300 block">Admin Moderation</span>

              {showModNotes && (
                <textarea
                  rows={2}
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  placeholder="Optional moderation notes..."
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#016EA6]"
                />
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleModerate("approved")}
                  disabled={isModerating}
                  className="py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!showModNotes) setShowModNotes(true);
                    else handleModerate("flagged");
                  }}
                  disabled={isModerating}
                  className="py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Flag className="w-3.5 h-3.5" /> Flag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!showModNotes) setShowModNotes(true);
                    else handleModerate("redacted");
                  }}
                  disabled={isModerating}
                  className="py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-600/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <EyeOff className="w-3.5 h-3.5" /> Redact
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons at bottom */}
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-2.5 bg-[#016EA6] hover:bg-[#0158a0] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{downloading ? "Generating signed link..." : "Download Original (Audited)"}</span>
            </button>

            {current.deliveryUrl && (
              <a
                href={current.deliveryUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceLightbox;

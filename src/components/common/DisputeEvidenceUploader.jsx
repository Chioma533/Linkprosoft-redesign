import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  FileText,
  Film,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import mediaService from "../../api/services/mediaService";
import disputeService from "../../api/services/disputeService";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const DisputeEvidenceUploader = ({
  disputeId = null,
  onEvidenceChange,
  existingEvidence = [],
  maxFiles = 8,
}) => {
  const fileInputRef = useRef(null);
  const [stagedFiles, setStagedFiles] = useState([]); // [{ id, file, previewUrl, caption, status: 'idle'|'uploading'|'ready'|'error', mediaId, error }]

  const handleSelectFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";
    if (!selected.length) return;

    if (stagedFiles.length + selected.length > maxFiles) {
      toast.error(`You can upload at most ${maxFiles} evidence files`);
      return;
    }

    const validItems = [];
    for (const file of selected) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error(`Unsupported format: ${file.name}. Use JPG, PNG, PDF or MP4.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} exceeds 10MB limit.`);
        continue;
      }

      const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      validItems.push({
        id: crypto.randomUUID(),
        file,
        previewUrl,
        caption: "",
        status: "idle",
        mediaId: null,
        error: null,
      });
    }

    const updated = [...stagedFiles, ...validItems];
    setStagedFiles(updated);
    onEvidenceChange?.(updated);
  };

  const handleCaptionChange = (id, newCaption) => {
    const updated = stagedFiles.map((item) =>
      item.id === id ? { ...item, caption: newCaption } : item
    );
    setStagedFiles(updated);
    onEvidenceChange?.(updated);
  };

  const handleRemove = async (item) => {
    // If it was already submitted to backend and disputeId is set, delete via API
    if (disputeId && item.mediaId) {
      try {
        await disputeService.deleteEvidence(disputeId, item.mediaId);
        toast.success("Evidence removed");
      } catch (err) {
        console.warn("Error deleting evidence:", err);
      }
    }

    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    const updated = stagedFiles.filter((f) => f.id !== item.id);
    setStagedFiles(updated);
    onEvidenceChange?.(updated);
  };

  // Upload a single staged item
  const uploadItem = async (item, targetDisputeId = disputeId) => {
    if (item.status === "ready" && item.mediaId) return item;

    setStagedFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "uploading", error: null } : f))
    );

    try {
      // 1. Upload to S3 storage with purpose dispute_evidence
      const { mediaId } = await mediaService.uploadFile(item.file, "dispute_evidence");

      // 2. If disputeId is known, submit evidence right away
      if (targetDisputeId) {
        await disputeService.submitEvidence(targetDisputeId, {
          mediaId,
          caption: item.caption.trim() || undefined,
        });
      }

      const completedItem = { ...item, mediaId, status: "ready", error: null };
      setStagedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? completedItem : f))
      );
      return completedItem;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Upload failed";
      setStagedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "error", error: errorMsg } : f))
      );
      throw err;
    }
  };

  // Public method exposed via ref/caller to upload all pending items
  const uploadAll = async (targetDisputeId = disputeId) => {
    const results = [];
    for (const item of stagedFiles) {
      if (item.status !== "ready") {
        const uploaded = await uploadItem(item, targetDisputeId);
        results.push(uploaded);
      } else {
        results.push(item);
      }
    }
    return results;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-gray-700 block">Supporting Evidence</label>
          <span className="text-[11px] text-gray-400">
            Upload pictures, PDF invoices, contracts, or videos (max {maxFiles} files, up to 10MB each)
          </span>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={stagedFiles.length >= maxFiles}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#016EA6] hover:bg-[#0158a0] text-white rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Files</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.mp4,.webm,.mov"
          className="hidden"
          onChange={handleSelectFiles}
        />
      </div>

      {/* Staged files grid / list */}
      {stagedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {stagedFiles.map((item) => {
            const isImage = item.file.type.startsWith("image/");
            const isPdf = item.file.type === "application/pdf";
            const isVideo = item.file.type.startsWith("video/");

            return (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-between space-y-2 relative group"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full border border-gray-200 shadow-xs transition cursor-pointer z-10"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* File info row */}
                <div className="flex items-start gap-3">
                  {/* Thumbnail / Icon */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                    {isImage && item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : isPdf ? (
                      <FileText className="w-6 h-6 text-red-500" />
                    ) : isVideo ? (
                      <Film className="w-6 h-6 text-purple-500" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-800 truncate" title={item.file.name}>
                      {item.file.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    {/* Status badge */}
                    <div className="mt-1 flex items-center gap-1">
                      {item.status === "uploading" && (
                        <span className="text-[10px] font-semibold text-[#016EA6] flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                        </span>
                      )}
                      {item.status === "ready" && (
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      )}
                      {item.status === "error" && (
                        <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {item.error || "Failed"}
                        </span>
                      )}
                      {item.status === "idle" && (
                        <span className="text-[10px] font-medium text-gray-400">
                          Pending submission
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Caption Input */}
                <div>
                  <input
                    type="text"
                    maxLength={500}
                    placeholder="Add caption (e.g. Broken pipe leak beneath sink)..."
                    value={item.caption}
                    onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 placeholder-gray-400 outline-none focus:border-[#016EA6]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DisputeEvidenceUploader;

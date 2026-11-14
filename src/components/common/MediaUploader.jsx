import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import mediaService from "../../api/services/mediaService";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

const MediaUploader = ({ purpose, label = "Upload file", acceptDocuments = false, onUploaded, compact = false }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const accepted = acceptDocuments ? DOCUMENT_TYPES : IMAGE_TYPES;
    if (!accepted.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError(`Use ${acceptDocuments ? "a JPG, PNG, WebP, or PDF" : "a JPG, PNG, or WebP image"} up to 5 MB.`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { mediaId } = await mediaService.uploadFile(file, purpose);
      setFileName(file.name);
      await onUploaded?.({ mediaId, file });
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={compact ? "inline-flex" : "space-y-1"}>
      <input ref={inputRef} type="file" accept={acceptDocuments ? "image/jpeg,image/png,image/webp,application/pdf" : "image/jpeg,image/png,image/webp"} className="hidden" onChange={handleChange} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-full bg-[#016EA6] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#015582] disabled:cursor-wait disabled:opacity-60">
        <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : label}
      </button>
      {!compact && fileName && <p className="text-[10px] text-emerald-600">Uploaded: {fileName}</p>}
      {!compact && error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
};

export default MediaUploader;

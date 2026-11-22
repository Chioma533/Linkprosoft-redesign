import React, { useState } from "react";
import { FileText, Film, Music, Download, ExternalLink, AlertCircle } from "lucide-react";

/**
 * Robust, type-aware document and media preview component.
 * Ensures PDFs, videos, and audio are not forced through standard <img> tags.
 */
const DocumentPreview = ({
  url,
  contentType = "",
  filename = "document",
  caption = "",
  className = "",
  aspectRatio = "aspect-video",
  onClick,
  showActions = true,
  onDownload,
}) => {
  const [loadError, setLoadError] = useState(false);

  const isPdf =
    contentType === "application/pdf" ||
    (filename && filename.toLowerCase().endsWith(".pdf")) ||
    (url && url.toLowerCase().includes(".pdf"));

  const isImage =
    contentType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename || "");

  const isVideo =
    contentType.startsWith("video/") ||
    /\.(mp4|webm|mov|ogg)$/i.test(filename || "");

  const isAudio =
    contentType.startsWith("audio/") ||
    /\.(mp3|wav|ogg|m4a|aac)$/i.test(filename || "");

  if (loadError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 ${className}`}
      >
        <AlertCircle className="w-8 h-8 text-gray-300 mb-1" />
        <span className="text-xs font-semibold">Preview unavailable</span>
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="mt-2 text-[11px] font-bold text-[#016EA6] hover:underline inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> Download file
          </button>
        )}
      </div>
    );
  }

  // 1. Image preview
  if (isImage) {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl bg-gray-100 group ${className} ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        <img
          src={url}
          alt={caption || filename}
          onError={() => setLoadError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-white">
            <p className="text-[11px] font-semibold truncate">{caption}</p>
          </div>
        )}
      </div>
    );
  }

  // 2. PDF preview
  if (isPdf) {
    return (
      <div
        className={`relative flex flex-col justify-between p-4 rounded-2xl bg-red-50/60 border border-red-100 group ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
              PDF Document
            </span>
            <h5 className="text-xs font-bold text-gray-800 truncate mt-0.5" title={filename}>
              {filename}
            </h5>
            {caption && (
              <p className="text-[11px] text-gray-500 font-medium line-clamp-2 mt-1">
                {caption}
              </p>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-red-100/60">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[11px] font-bold text-red-700 hover:text-red-800 inline-flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View PDF
              </a>
            )}
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="text-[11px] font-bold text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 ml-auto"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. Video preview
  if (isVideo) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-black ${className}`}>
        <video
          src={url}
          controls
          className="w-full h-full object-contain"
          preload="metadata"
          onError={() => setLoadError(true)}
        >
          Your browser does not support the video tag.
        </video>
        {caption && (
          <div className="p-2 bg-gray-900 text-white text-[11px] font-medium truncate">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // 4. Audio preview
  if (isAudio) {
    return (
      <div className={`p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 ${className}`}>
        <div className="flex items-center gap-2.5 text-blue-700">
          <Music className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold truncate">{filename || "Audio clip"}</span>
        </div>
        <audio src={url} controls className="w-full h-9" preload="metadata" />
        {caption && <p className="text-[10px] text-gray-500 font-medium">{caption}</p>}
      </div>
    );
  }

  // 5. Generic Document / Other
  return (
    <div className={`p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-gray-200 text-gray-600 rounded-xl shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Attachment
          </span>
          <h5 className="text-xs font-bold text-gray-800 truncate mt-0.5">{filename}</h5>
          {caption && <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{caption}</p>}
        </div>
      </div>
      {onDownload && (
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onDownload}
            className="text-[11px] font-bold text-[#016EA6] hover:underline inline-flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;

import React, { useState } from "react";
import { CheckCheck, FileText, Download, ExternalLink, Film, Music, X } from "lucide-react";

const formatBytes = (bytes) => {
  if (!bytes) return "";
  const num = Number(bytes);
  if (isNaN(num)) return "";
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const MessageBubble = ({ msg, currentUserId }) => {
  const [activeMediaZoom, setActiveMediaZoom] = useState(null);

  const isMe = msg.senderId ? msg.senderId === currentUserId : msg.from === "me";
  const content = msg.content ?? msg.text;
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : msg.time;

  // Normalize attachments (support new multi-attachments array and legacy single attachment)
  let attachments = Array.isArray(msg.attachments) ? msg.attachments : [];
  if (!attachments.length && msg.attachmentUrl) {
    attachments = [
      {
        id: "legacy",
        url: msg.attachmentUrl,
        contentType:
          msg.attachmentType === "image"
            ? "image/jpeg"
            : msg.attachmentType === "document"
            ? "application/pdf"
            : msg.attachmentType === "audio"
            ? "audio/mpeg"
            : msg.attachmentType === "video"
            ? "video/mp4"
            : "application/octet-stream",
        originalFilename: "Attachment",
      },
    ];
  }

  const handleDownload = (att) => {
    if (!att.url) return;
    const a = document.createElement("a");
    a.href = att.url;
    a.download = att.originalFilename || "download";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[76%] sm:max-w-[68%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
        {/* Attachments Section */}
        {attachments.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {attachments.map((att, idx) => {
              const isPdf =
                att.contentType === "application/pdf" ||
                att.originalFilename?.toLowerCase().endsWith(".pdf");

              const isImage =
                att.contentType?.startsWith("image/") ||
                /\.(jpg|jpeg|png|webp|gif)$/i.test(att.originalFilename || "");

              const isVideo =
                att.contentType?.startsWith("video/") ||
                /\.(mp4|webm|mov)$/i.test(att.originalFilename || "");

              const isAudio =
                att.contentType?.startsWith("audio/") ||
                /\.(mp3|wav|ogg|m4a|webm)$/i.test(att.originalFilename || "");

              // 1. Image attachment
              if (isImage) {
                return (
                  <div
                    key={att.id || idx}
                    className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm group cursor-pointer max-w-sm"
                    onClick={() => setActiveMediaZoom(att)}
                  >
                    <img
                      src={att.url}
                      alt={att.originalFilename || "Image"}
                      className="w-full max-h-64 object-cover transition-transform duration-300 group-hover:scale-102"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                      <span>View</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(att);
                        }}
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              // 2. Video attachment
              if (isVideo) {
                return (
                  <div key={att.id || idx} className="rounded-2xl overflow-hidden bg-black max-w-sm shadow-sm">
                    <video src={att.url} controls className="w-full max-h-64 rounded-2xl" preload="metadata" />
                  </div>
                );
              }

              // 3. Audio / Voice attachment
              if (isAudio) {
                return (
                  <div
                    key={att.id || idx}
                    className={`p-3 rounded-2xl shadow-sm border space-y-1.5 w-full max-w-xs ${
                      isMe
                        ? "bg-[#016EA6] text-white border-[#0158a0]"
                        : "bg-white text-gray-800 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 truncate">
                        <Music className="w-3.5 h-3.5" /> {att.originalFilename || "Voice Note"}
                      </span>
                      {att.byteSize && <span className="text-[10px] opacity-75">{formatBytes(att.byteSize)}</span>}
                    </div>
                    <audio src={att.url} controls className="w-full h-8" preload="metadata" />
                  </div>
                );
              }

              // 4. PDF or Document attachment
              return (
                <div
                  key={att.id || idx}
                  className={`p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3 max-w-sm ${
                    isMe
                      ? "bg-[#EBF3FA] border-blue-200 text-gray-800"
                      : "bg-white border-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`p-2 rounded-xl shrink-0 ${isPdf ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate" title={att.originalFilename}>
                        {att.originalFilename || "Document"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {isPdf ? "PDF Document" : "File"} {att.byteSize ? `● ${formatBytes(att.byteSize)}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {att.url && (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-1.5 text-gray-500 hover:text-[#016EA6] rounded-lg hover:bg-white transition"
                        title="Open file"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownload(att)}
                      className="p-1.5 text-gray-500 hover:text-[#016EA6] rounded-lg hover:bg-white transition cursor-pointer"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Text Message Bubble (if text exists) */}
        {content && (
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
              isMe
                ? "bg-[#016EA6] text-white rounded-br-sm"
                : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
            }`}
          >
            {content}
          </div>
        )}

        {/* Timestamp and Read Status */}
        <div className={`flex items-center gap-1.5 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-gray-400">{time}</span>
          {isMe && (
            <CheckCheck
              className={`w-3.5 h-3.5 ${
                (msg.isRead ?? msg.read) ? "text-[#016EA6]" : "text-gray-300"
              }`}
            />
          )}
        </div>
      </div>

      {/* Image Lightbox zoom */}
      {activeMediaZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setActiveMediaZoom(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveMediaZoom(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 border-none bg-transparent cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeMediaZoom.url}
              alt={activeMediaZoom.originalFilename || "Preview"}
              className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-3 text-white text-xs font-semibold">
              <span>{activeMediaZoom.originalFilename}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(activeMediaZoom);
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

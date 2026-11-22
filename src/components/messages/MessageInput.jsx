import React, { useRef, useState } from "react";
import {
  Smile,
  Mic,
  Paperclip,
  Send,
  X,
  FileText,
  Film,
  Music,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import mediaService from "../../api/services/mediaService";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ATTACHMENTS = 5;

const MessageInput = ({
  inputText,
  onInputChange,
  onSend,
  onKeyDown,
  inputRef,
  sending = false,
}) => {
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]); // [{ id, file, name, size, type, previewUrl, status, mediaId, error }]
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const uploadFile = async (item) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, status: "uploading", error: null } : a))
    );

    try {
      const { mediaId } = await mediaService.uploadFile(item.file, "chat_attachment");
      setAttachments((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, status: "ready", mediaId } : a))
      );
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Upload failed";
      setAttachments((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, status: "error", error: errorMsg } : a))
      );
    }
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";
    if (!selected.length) return;

    if (attachments.length + selected.length > MAX_ATTACHMENTS) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
      return;
    }

    const newItems = [];
    for (const file of selected) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error(`Unsupported format: ${file.name}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 10MB limit.`);
        continue;
      }

      const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      const item = {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        status: "uploading",
        mediaId: null,
        error: null,
      };
      newItems.push(item);
      uploadFile(item);
    }

    setAttachments((prev) => [...prev, ...newItems]);
  };

  const handleRemove = (item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    setAttachments((prev) => prev.filter((a) => a.id !== item.id));
  };

  const handleRetry = (item) => {
    uploadFile(item);
  };

  const handleSendClick = () => {
    // Check if any attachment is still uploading
    const stillUploading = attachments.some((a) => a.status === "uploading");
    if (stillUploading) {
      toast.error("Please wait for attachments to finish uploading");
      return;
    }

    const readyMediaIds = attachments
      .filter((a) => a.status === "ready" && a.mediaId)
      .map((a) => a.mediaId);

    const hasText = Boolean(inputText && inputText.trim());
    if (!hasText && readyMediaIds.length === 0) return;

    // Call onSend with text and mediaIds
    onSend(inputText, readyMediaIds);

    // Clean up previews and reset attachments
    attachments.forEach((a) => {
      if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
    });
    setAttachments([]);
  };

  const handleKeyDownInternal = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Optional Voice Recording handling
  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        const item = {
          id: crypto.randomUUID(),
          file: audioFile,
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type,
          previewUrl: null,
          status: "uploading",
          mediaId: null,
          error: null,
        };
        setAttachments((prev) => [...prev, item]);
        uploadFile(item);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording voice message... click mic again to stop");
    } catch {
      toast.error("Microphone access denied or unavailable");
    }
  };

  const canSend =
    !sending &&
    (Boolean(inputText && inputText.trim()) || attachments.some((a) => a.status === "ready"));

  return (
    <div className="shrink-0 px-5 py-3 rounded-br-2xl bg-white border-t border-gray-100 space-y-2">
      {/* Pending Attachments Tray */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-gray-100 animate-in fade-in duration-150">
          {attachments.map((item) => {
            const isImage = item.type.startsWith("image/");
            const isPdf = item.type === "application/pdf";
            const isVideo = item.type.startsWith("video/");
            const isAudio = item.type.startsWith("audio/");

            return (
              <div
                key={item.id}
                className="relative flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-2xl p-1.5 pr-2.5 max-w-[220px] shadow-xs group"
              >
                {/* Thumbnail / Icon */}
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                  {isImage && item.previewUrl ? (
                    <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : isPdf ? (
                    <FileText className="w-5 h-5 text-red-500" />
                  ) : isVideo ? (
                    <Film className="w-5 h-5 text-purple-500" />
                  ) : isAudio ? (
                    <Music className="w-5 h-5 text-blue-500" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Name & status */}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-gray-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.status === "uploading" && (
                      <span className="text-[10px] text-[#016EA6] flex items-center gap-1 font-semibold">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Uploading
                      </span>
                    )}
                    {item.status === "ready" && (
                      <span className="text-[10px] text-emerald-600 font-semibold">Ready</span>
                    )}
                    {item.status === "error" && (
                      <button
                        type="button"
                        onClick={() => handleRetry(item)}
                        className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5 font-semibold"
                        title="Retry upload"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="p-1 text-gray-400 hover:text-rose-500 rounded-full hover:bg-white transition cursor-pointer"
                  title="Remove before sending"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Input Row */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#016EA6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#016EA6]/10 transition-all duration-200">
        <button
          type="button"
          title="Emoji"
          className="text-gray-400 hover:text-[#016EA6] transition-colors cursor-pointer shrink-0"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          ref={inputRef}
          type="text"
          maxLength={2000}
          placeholder={attachments.length > 0 ? "Add a message or send attachments..." : "Type Something"}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDownInternal}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none min-w-0"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Voice Record Button */}
          <button
            type="button"
            onClick={handleMicClick}
            title={isRecording ? "Stop recording" : "Record voice message"}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isRecording
                ? "bg-rose-100 text-rose-600 animate-pulse"
                : "text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA]"
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Paperclip Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file (Images, PDFs, Audio, Video)"
            disabled={attachments.length >= MAX_ATTACHMENTS}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all cursor-pointer disabled:opacity-40"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.mp3,.wav,.ogg,.m4a,.webm,.mp4,.mov"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendClick}
            disabled={!canSend}
            title="Send"
            className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
              canSend
                ? "bg-[#016EA6] text-white hover:bg-[#0158a0] shadow-sm hover:shadow-md active:scale-95"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

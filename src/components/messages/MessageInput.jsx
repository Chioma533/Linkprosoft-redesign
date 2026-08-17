import React from "react";
import { Smile, Mic, Paperclip, Send } from "lucide-react";

const MessageInput = ({
  inputText,
  onInputChange,
  onSend,
  onKeyDown,
  inputRef,
  sending = false,
}) => {
  return (
    <div className="shrink-0 px-5 py-4 rounded-br-2xl bg-white border-t border-gray-100">
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
          placeholder="Type Something"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none min-w-0"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            title="Voice message"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Attach file"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all cursor-pointer"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={!inputText.trim() || sending}
            title="Send"
            className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
              inputText.trim() && !sending
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

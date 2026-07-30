import React, { useState, useRef, useEffect } from "react";
import { Search, Phone, ShieldAlert, Smile, Mic, Paperclip, Send, User, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

// Premium double checkmark graphic component
const DoubleCheckSVG = ({ colorClass = "text-gray-400" }) => (
  <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 6L7 16l-3-3" opacity="0.6" />
    <path d="M22 6L12 16l-2-2" />
  </svg>
);

const ChatSubpage = () => {
  const { user } = useAuthStore();
  const [isChatOpenMobile, setIsChatOpenMobile] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Marvelous Samuel",
      text: "Hi Daniel, I found your profile while searching for electricians nearby. Are you available to install some new light fixtures tomorrow?",
      time: "9:12 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "Samuel",
      text: "Hello Daniel! 👋 Thanks for reaching out. Yes, I'm available tomorrow afternoon. How many light fixtures do you need installed?",
      time: "9:12 AM",
      isMe: true,
      status: "read"
    },
    {
      id: 3,
      sender: "Samuel",
      text: "Where are you located?",
      time: "9:12 AM",
      isMe: true,
      status: "delivered"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "Samuel",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      status: "delivered"
    };

    setMessages([...messages, newMsg]);
    setInputText("");
  };

  const conversations = [
    { id: 1, name: "Marvelous Samuel", text: "How are you Chioma, Nice to connect with you.", time: "5min", count: 1, active: true },
    { id: 2, name: "Marvelous Samuel", text: "How are you Chioma, Nice to connect with you.", time: "5min", count: 1 },
    { id: 3, name: "Marvelous Samuel", text: "How are you Chioma, Nice to connect with you.", time: "5min", count: 1 },
    { id: 4, name: "Marvelous Samuel", text: "How are you Chioma, Nice to connect with you.", time: "5min", count: 1 },
    { id: 5, name: "Marvelous Samuel", text: "How are you Chioma, Nice to connect with you.", time: "5min", count: 1 }
  ];

  return (
    <div className="bg-white border border-gray-100/50 shadow-sm rounded-3xl h-[calc(100vh-140px)] overflow-hidden flex animate-fade-in">
      {/* Left panel: Threads list */}
      <div className={`${isChatOpenMobile ? "hidden md:flex" : "flex"} w-full md:w-80 border-r border-gray-100 flex flex-col h-full bg-white shrink-0`}>
        {/* Filters buttons */}
        <div className="p-4 border-b border-gray-50 space-y-3">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-[#016EA6] text-white rounded-full text-xs font-semibold shadow-xs">
              Unread
            </button>
            <button className="px-4 py-1.5 border border-gray-100 text-gray-400 hover:text-gray-900 rounded-full text-xs font-semibold">
              Archives <span className="bg-blue-50 text-[#016EA6] px-1.5 py-0.5 rounded-full text-[9px] font-bold">23</span>
            </button>
            <button className="px-4 py-1.5 border border-gray-100 text-gray-400 hover:text-gray-900 rounded-full text-xs font-semibold">
              Blocked
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search message"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 px-2 py-3 space-y-1">
          {conversations.map((convo, idx) => (
            <div
              key={idx}
              onClick={() => setIsChatOpenMobile(true)}
              className={`flex items-start justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                convo.active ? "bg-sky-50/50 border border-sky-100/10" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-gray-600 text-xs shrink-0 overflow-hidden relative">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 leading-tight">{convo.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate mt-1 leading-snug">{convo.text}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end shrink-0 gap-1.5">
                <span className="text-[9px] font-semibold text-gray-400">{convo.time}</span>
                {convo.count > 0 && (
                  <span className="w-4 h-4 bg-[#016EA6] text-white font-bold rounded-full text-[8px] flex items-center justify-center">
                    {convo.count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: Active Chat */}
      <div className={`${isChatOpenMobile ? "flex" : "hidden md:flex"} flex-1 flex flex-col h-full bg-[#FAFCFE]/50`}>
        {/* Chat Thread Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChatOpenMobile(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 md:hidden cursor-pointer flex items-center justify-center shrink-0"
              title="Back to conversations list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-sky-100/50 flex items-center justify-center relative font-bold text-gray-700 text-sm">
              MS
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-800 leading-tight">Marvelous Samuel</h3>
              <span className="text-[10px] text-green-500 font-semibold">Online</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl transition-all cursor-pointer">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-all cursor-pointer">
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message bubble logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.isMe
                      ? "bg-[#016EA6] text-white rounded-tr-none font-medium"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none font-medium"
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1 ${msg.isMe ? "justify-end" : "justify-start"}`}>
                  <span className="text-[8px] font-semibold text-gray-400">
                    {msg.time}
                  </span>
                  {msg.isMe && (
                    msg.status === "read" ? (
                      <DoubleCheckSVG colorClass="text-sky-400" />
                    ) : (
                      <DoubleCheckSVG colorClass="text-gray-400" />
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Text Area Footer */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <button type="button" className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type Something"
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
          />
          <button type="button" className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer">
            <Mic className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer">
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSubpage;

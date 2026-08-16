import React, { useState } from "react";
import { FiArrowLeft, FiAlertTriangle, FiCheck, FiSmile, FiPaperclip, FiSend, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";

const EmployerJobDetailsSubpage = ({ jobId, onBack, onOpenDispute }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Marvelous Samuel", text: "Going well! I've just finished the main structure. Uploading photos now so you can take a look.", time: "11:24 AM", isMe: false }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "Elvis",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    toast.success("Message sent!");
  };

  const handleMarkAsCompleted = () => {
    toast.success("Project marked as completed! Review request sent to professional.");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Title Header with Back arrow */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full transition-all cursor-pointer"
          title="Back to Manage Jobs"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Wardrobe Installation</h2>
      </div>

      {/* Main Job Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full md:w-auto">
          <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-2xl shrink-0 flex items-center justify-center text-white text-xl font-bold">
            W
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Wardrobe Installation</h3>
              <span className="px-2.5 py-0.5 bg-orange-50 text-orange-500 rounded-md font-bold text-[9px] uppercase tracking-wider">
                In Progress
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold">
              ID: {jobId || "ORD657783"} • <span className="text-gray-500">Carpentry</span>
            </p>
            <p className="text-[11px] text-gray-500 font-semibold">
              📍 Lekki Lagos • <span className="text-gray-900 font-extrabold">₦500,000</span>
            </p>
            <div className="flex items-center gap-1.5 mt-2 bg-slate-50 px-2 py-1 rounded-lg w-max">
              <div className="w-4 h-4 bg-sky-100 rounded-full flex items-center justify-center text-[#016EA6] font-bold text-[8px]">JD</div>
              <span className="text-[10px] text-gray-500 font-bold">Johnathan David</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
          <button
            onClick={handleMarkAsCompleted}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer"
          >
            <FiCheck className="w-4 h-4" />
            <span>Mark as completed</span>
          </button>
          <button
            onClick={onOpenDispute}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer"
          >
            <FiAlertTriangle className="w-4 h-4" />
            <span>Open a dispute</span>
          </button>
        </div>
      </div>

      {/* Escrow Status Card */}
      <div className="bg-gradient-to-r from-[#013554] via-[#01507B] to-[#016EA6] p-6 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
        <div className="space-y-4 relative z-10 flex-1">
          <div>
            <span className="text-[10px] text-sky-200 font-semibold tracking-wide">Escrow Protected Payment</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[10px] text-sky-200">Total Project Budget:</span>
              <h2 className="text-xl font-extrabold">₦540,000</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-3 max-w-lg">
            <div>
              <span className="text-[8px] text-sky-200 block uppercase font-bold">Total Funded</span>
              <span className="text-xs font-extrabold mt-0.5 block">₦500,000</span>
            </div>
            <div>
              <span className="text-[8px] text-sky-200 block uppercase font-bold">Released</span>
              <span className="text-xs font-extrabold mt-0.5 block">₦150,000</span>
            </div>
            <div>
              <span className="text-[8px] text-sky-200 block uppercase font-bold">Remaining Balance</span>
              <span className="text-xs font-extrabold mt-0.5 block">₦350,000</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full lg:w-72 shrink-0 space-y-1.5 relative z-10">
          <div className="flex justify-between text-[10px] font-bold text-sky-200">
            <span>Project Funding Progress</span>
            <span>100% Funded</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#22C55E] h-full w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Progress Gallery</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-slate-100 rounded-2xl border border-gray-100 flex items-center justify-center p-4">
              <span className="text-xs text-gray-400 font-semibold">Framing Structure</span>
            </div>
            <div className="aspect-square bg-slate-100 rounded-2xl border border-gray-100 flex items-center justify-center p-4">
              <span className="text-xs text-gray-400 font-semibold">Cabinet Shelving</span>
            </div>
            <div className="aspect-square bg-slate-100 rounded-2xl border border-gray-100 flex items-center justify-center p-4">
              <span className="text-xs text-gray-400 font-semibold">Sliding Door Fit</span>
            </div>
            <div className="aspect-square bg-slate-100 rounded-2xl border border-gray-100 flex items-center justify-center p-4">
              <span className="text-xs text-gray-400 font-semibold">Polishing & Paint</span>
            </div>
          </div>
        </div>

        {/* Message Box */}
        <div className="bg-white border border-gray-100/50 shadow-sm rounded-3xl h-[400px] overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100/50 flex items-center justify-center relative font-bold text-gray-700 text-xs">
                MS
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-800 leading-tight">Marvelous Samuel</h3>
                <span className="text-[9px] text-green-500 font-semibold">Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${msg.isMe ? "bg-[#016EA6] text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                  {msg.text}
                </div>
                <span className="text-[8px] font-semibold text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type Something"
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
            />
            <button type="submit" className="p-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full shadow-xs transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer">
              <FiSend className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobDetailsSubpage;

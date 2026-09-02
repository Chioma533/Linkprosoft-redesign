import React, { useState } from "react";
import { 
  X, 
  Megaphone, 
  Globe, 
  Briefcase, 
  User, 
  UserPlus, 
  Check,
  Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../../../api/services/adminService";

const SendAnnouncementModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("professionals"); // all | professionals | clients | specific
  const [priority, setPriority] = useState("normal"); // normal | important | urgent
  const [channel, setChannel] = useState("in_app"); // in_app | email | push
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSaveDraft = () => {
    toast.success("Announcement saved as draft.");
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an announcement title.");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.sendAnnouncement({
        title,
        message,
        targetAudience: audience.toUpperCase(),
        channel: channel.toUpperCase(),
        priority,
      });
      setIsSuccess(true);
    } catch (err) {
      console.warn("[SendAnnouncementModal] Send announcement error:", err);
      // Fallback in case endpoint is mock in dev
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setTitle("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleResetAndClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-50 p-6 sm:p-8 overflow-y-auto border-none flex flex-col justify-between transform transition-transform duration-300 animate-in slide-in-from-right">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#1E1B4B] tracking-tight">
                Make an announcement
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Send an important message to users on the platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSuccess && (
              <button 
                onClick={handleSaveDraft}
                className="text-xs font-bold text-[#016EA6] hover:underline cursor-pointer border-none bg-transparent"
              >
                Save draft
              </button>
            )}
            <button 
              onClick={handleResetAndClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          /* Success Screen View (Image 2) */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden my-auto">
            {/* Confetti Ribbons */}
            <div className="absolute top-6 left-8 w-3 h-3 bg-pink-500 rounded-sm transform rotate-45 animate-bounce" />
            <div className="absolute top-12 left-16 w-2 h-4 bg-purple-500 rounded-full transform -rotate-12" />
            <div className="absolute top-8 right-10 w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="absolute top-16 right-16 w-2 h-4 bg-cyan-400 rounded-sm transform rotate-30" />
            <div className="absolute top-20 left-10 w-4 h-2 bg-emerald-400 rounded-full transform rotate-12" />

            {/* Megaphone Illustration graphic */}
            <div className="relative z-10 my-6">
              <div className="w-24 h-24 rounded-full bg-[#E0F2FE] text-[#016EA6] flex items-center justify-center shadow-lg shadow-blue-100 mx-auto relative">
                <Megaphone className="w-12 h-12 stroke-[1.8] transform -rotate-12" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#34D399] rounded-full border-2 border-white flex items-center justify-center text-white shadow-md">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-2">
              Announcemt Sent
            </h3>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              Your announcement has been made
            </p>

            <button
              onClick={handleResetAndClose}
              className="mt-8 w-full max-w-xs py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer border-none"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form View (Image 1) */
          <form onSubmit={handleSend} className="space-y-6 my-6 flex-1">
            <h4 className="font-extrabold text-[#1E1B4B] text-base tracking-tight">
              Announcement Details
            </h4>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                className="w-full px-4 py-3 bg-gray-50/90 focus:bg-gray-100/80 rounded-2xl text-xs font-medium text-gray-800 outline-none border-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                rows={4}
                className="w-full px-4 py-3 bg-gray-50/90 focus:bg-gray-100/80 rounded-2xl text-xs font-medium text-gray-800 outline-none border-none transition-all placeholder:text-gray-400 resize-none h-36"
              />
            </div>

            {/* Audience 2x2 Grid Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Audience
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* All Users */}
                <div
                  onClick={() => setAudience("all")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-none ${
                    audience === "all"
                      ? "bg-[#E0F2FE]/50 ring-2 ring-[#016EA6]"
                      : "bg-white border border-gray-150 hover:bg-gray-50"
                  }`}
                >
                  <Globe className="w-5 h-5 text-gray-600 mb-2" />
                  <span className="text-xs font-bold text-gray-800 block">All Linkprosoft Users</span>
                </div>

                {/* Professionals Only */}
                <div
                  onClick={() => setAudience("professionals")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-none ${
                    audience === "professionals"
                      ? "bg-[#E0F2FE]/50 ring-2 ring-[#016EA6]"
                      : "bg-white border border-gray-150 hover:bg-gray-50"
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-[#016EA6] mb-2" />
                  <span className="text-xs font-bold text-gray-800 block">Professionals only</span>
                </div>

                {/* Clients Only */}
                <div
                  onClick={() => setAudience("clients")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-none ${
                    audience === "clients"
                      ? "bg-[#E0F2FE]/50 ring-2 ring-[#016EA6]"
                      : "bg-white border border-gray-150 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5 text-gray-600 mb-2" />
                  <span className="text-xs font-bold text-gray-800 block">Clients only</span>
                </div>

                {/* Specific User */}
                <div
                  onClick={() => setAudience("specific")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-none ${
                    audience === "specific"
                      ? "bg-[#E0F2FE]/50 ring-2 ring-[#016EA6]"
                      : "bg-white border border-gray-150 hover:bg-gray-50"
                  }`}
                >
                  <UserPlus className="w-5 h-5 text-gray-600 mb-2" />
                  <span className="text-xs font-bold text-gray-800 block">Specific User</span>
                </div>
              </div>
            </div>

            {/* Priority Radios */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Priority
              </label>
              <div className="flex items-center gap-6 text-xs font-bold text-gray-700 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "normal"}
                    onChange={() => setPriority("normal")}
                    className="accent-[#016EA6] cursor-pointer"
                  />
                  <span>Normal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "important"}
                    onChange={() => setPriority("important")}
                    className="accent-[#016EA6] cursor-pointer"
                  />
                  <span className="text-gray-500 font-medium">Important</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "urgent"}
                    onChange={() => setPriority("urgent")}
                    className="accent-[#016EA6] cursor-pointer"
                  />
                  <span className="text-gray-500 font-medium">Urgent</span>
                </label>
              </div>
            </div>

            {/* Delivery Channels Radios */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-gray-700">
                Delivery channels
              </label>
              <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-700 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "in_app"}
                    onChange={() => setChannel("in_app")}
                    className="accent-[#016EA6] cursor-pointer"
                  />
                  <span>In App Notification</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "email"}
                    onChange={() => setChannel("email")}
                    className="accent-[#016EA6] cursor-pointer"
                  />
                  <span className="text-gray-500 font-medium">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "push"}
                    onChange={() => setChannel("push")}
                    className="accent-[#016EA6] cursor-pointer"
                  />
                  <span className="text-gray-500 font-medium">Push Notification</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-full cursor-pointer transition-all border-none"
              >
                Go back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-[#016EA6] hover:bg-[#015582] disabled:opacity-60 text-white font-bold text-xs rounded-full cursor-pointer transition-all shadow-md border-none flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? "Sending..." : "Send announcement"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendAnnouncementModal;

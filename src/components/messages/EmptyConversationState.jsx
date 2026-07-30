import React from "react";
import { Archive } from "lucide-react";

const EmptyConversationState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
      <div className="w-16 h-16 rounded-full bg-[#EBF3FA] flex items-center justify-center">
        <Archive className="w-8 h-8 text-[#016EA6]/40" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-500">No conversation selected</p>
        <p className="text-xs mt-1">Pick a thread from the left to start chatting</p>
      </div>
    </div>
  );
};

export default EmptyConversationState;

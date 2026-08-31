import React from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";

const VerificationCard = ({
  icon: Icon,
  title,
  description,
  duration,
  onStart,
  isCompleted = false,
  isLocked = false,
}) => {
  return (
    <article
      className={`relative flex min-h-[260px] flex-col rounded-2xl border p-5 transition-all duration-200 ${
        isLocked
          ? "border-gray-200 bg-gray-50/70 opacity-60"
          : isCompleted
          ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
          : "border-[#e7e8e8] bg-white hover:border-[#0879aa]/40 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isCompleted
              ? "bg-emerald-100 text-emerald-600"
              : isLocked
              ? "bg-gray-100 text-gray-400"
              : "bg-[#eef8fc] text-[#0879aa]"
          }`}
        >
          <Icon size={24} />
        </div>

        {isCompleted ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 size={12} /> Completed
          </span>
        ) : isLocked ? (
          <span className="flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
            <Lock size={10} /> Locked
          </span>
        ) : null}
      </div>

      <span className="mt-5 w-fit rounded-md bg-[#eaf3f6] px-3 py-1 text-[10px] text-[#555b5e]">
        Duration: {duration}
      </span>

      <h2 className="mt-3 text-base font-semibold text-[#15191b]">{title}</h2>

      <p className="mt-1 text-xs leading-relaxed text-[#85898b]">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs">
        <span className="text-[#85898b] text-[11px]">
          {isCompleted
            ? "Ready for review"
            : isLocked
            ? "Complete previous steps"
            : "Estimated 1 min"}
        </span>

        <button
          type="button"
          disabled={isLocked}
          onClick={onStart}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-medium transition ${
            isCompleted
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : isLocked
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-[#0879aa] text-white hover:bg-[#076b97] active:scale-95"
          }`}
        >
          {isCompleted ? "Edit Step" : isLocked ? "Locked" : "Start Verification"}
        </button>
      </div>
    </article>
  );
};

export default VerificationCard;

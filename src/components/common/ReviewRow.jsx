import React from "react";

const ReviewRow = ({ label, value, onEdit, noBorder = false }) => (
  <div className={`flex items-start justify-between py-5 ${noBorder ? "" : "border-b border-gray-100"}`}>
    <div>
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
    <button
      type="button"
      onClick={onEdit}
      className="text-sm font-semibold text-[#016EA6] hover:text-[#061EA6] transition-colors cursor-pointer shrink-0 ml-6"
    >
      Edit
    </button>
  </div>
);

export default ReviewRow;

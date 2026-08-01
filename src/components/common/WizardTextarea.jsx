import React from "react";

const WizardTextarea = ({ placeholder, value, onChange }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={5}
    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#016EA6] focus:ring-2 focus:ring-[#016EA6]/10 transition-all duration-200 resize-none"
  />
);

export default WizardTextarea;

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiDownload, FiFileText } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const ExportButton = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (type) => {
    setIsOpen(false);

    if (onExport) {
      onExport(type);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-full text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <FiDownload className="w-3.5 h-3.5" />

        <span>Export data</span>

        <FiChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg z-50">
          <button
            onClick={() => handleExport("excel")}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <PiMicrosoftExcelLogoFill className="text-green-600 text-lg" />

            <div className="text-left">
              <p className="font-semibold">Excel Spreadsheet</p>

              <p className="text-xs text-gray-400">Download as .xlsx</p>
            </div>
          </button>

          <button
            onClick={() => handleExport("pdf")}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <FiFileText className="text-red-500 text-lg" />

            <div className="text-left">
              <p className="font-semibold">PDF Document</p>

              <p className="text-xs text-gray-400">Download as .pdf</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;

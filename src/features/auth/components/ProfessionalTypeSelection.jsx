import { motion } from "framer-motion";
import Button from "../../../components/common/Button";

const ProfessionalTypeSelection = ({ professionalType, onChangeType, onNext, onBack }) => {
  const options = [
    {
      id: "digital",
      title: "Digital Professional",
      description: "Web designer, 3d artist, e.t.c.",
      illustration: (
        <svg viewBox="0 0 200 150" className="w-full h-auto max-h-[140px] mx-auto mt-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circles */}
          <circle cx="100" cy="75" r="50" fill="#F0F7FD" />
          <circle cx="150" cy="40" r="10" fill="#E0F2FE" />
          <circle cx="50" cy="110" r="15" fill="#E0F2FE" />
          
          {/* Laptop body */}
          <rect x="50" y="55" width="100" height="60" rx="6" fill="#FFFFFF" stroke="#D1E2F0" strokeWidth="2" />
          <rect x="56" y="61" width="88" height="48" rx="2" fill="#0F172A" />
          
          {/* Laptop keyboard base */}
          <path d="M40 115H160C160 115 158 122 152 122H48C42 122 40 115 40 115Z" fill="#D1E2F0" />
          <rect x="90" y="116" width="20" height="3" rx="1" fill="#94A3B8" />

          {/* Code lines */}
          <rect x="62" y="68" width="24" height="4" rx="1" fill="#38BDF8" />
          <rect x="62" y="76" width="36" height="4" rx="1" fill="#F472B6" />
          <rect x="62" y="84" width="48" height="4" rx="1" fill="#34D399" />
          <rect x="62" y="92" width="20" height="4" rx="1" fill="#FBBF24" />

          {/* Code bubble / tag */}
          <g transform="translate(135, 45)">
            <circle cx="10" cy="10" r="14" fill="#016EA6" />
            <path d="M7 7L4 10L7 13M13 7L16 10L13 13M11 6L9 14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Gear bubble */}
          <g transform="translate(35, 55)">
            <circle cx="10" cy="10" r="12" fill="#FBBF24" />
            <path d="M7 10H13M10 7V13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Curly brace bubble */}
          <g transform="translate(145, 95)">
            <rect width="18" height="18" rx="4" fill="#34D399" />
            <text x="5" y="13" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">{"{"}</text>
          </g>
        </svg>
      ),
    },
    {
      id: "non-digital",
      title: "None-digital professional",
      description: "Carpenter, Painter, e.t.c.",
      illustration: (
        <svg viewBox="0 0 200 150" className="w-full h-auto max-h-[140px] mx-auto mt-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circles */}
          <circle cx="100" cy="75" r="50" fill="#FDF8F0" />
          <circle cx="50" cy="40" r="12" fill="#FEF3C7" />
          <circle cx="150" cy="110" r="14" fill="#FEF3C7" />

          {/* Toolbox */}
          <rect x="55" y="70" width="90" height="45" rx="6" fill="#016EA6" />
          <path d="M75 70V60C75 56.6863 77.6863 54 81 54H119C122.314 54 125 56.6863 125 60V70" stroke="#016EA6" strokeWidth="4" fill="none" />
          <rect x="70" y="80" width="60" height="6" rx="3" fill="#01527C" />
          <circle cx="100" cy="95" r="8" fill="#FBBF24" />

          {/* Hammer */}
          <g transform="translate(58, 42)">
            <rect x="6" y="10" width="6" height="24" rx="2" fill="#D1A176" transform="rotate(-15)" />
            <path d="M0 4C0 2.89543 0.89543 2 2 2H18C19.1046 2 20 2.89543 20 4V10C20 11.1046 19.1046 12 18 12H2C0.89543 12 0 11.1046 0 10V4Z" fill="#94A3B8" />
            <path d="M20 7H24V9H20V7Z" fill="#64748B" />
          </g>

          {/* Paintbrush */}
          <g transform="translate(118, 38) rotate(15)">
            <rect x="4" y="16" width="6" height="20" rx="1" fill="#D1A176" />
            <rect x="2" y="10" width="10" height="6" fill="#CBD5E1" />
            <path d="M2 10C2 4 12 4 12 10H2Z" fill="#EF4444" />
          </g>

          {/* Map Pin */}
          <g transform="translate(145, 50)">
            <circle cx="10" cy="10" r="12" fill="#F97316" />
            <path d="M10 5C7.79 5 6 6.79 6 9C6 12 10 15 10 15C10 15 14 12 14 9C14 6.79 12.21 5 10 5ZM10 10.5C9.17 10.5 8.5 9.83 8.5 9C8.5 8.17 9.17 7.5 10 7.5C10.83 7.5 11.5 8.17 11.5 9C11.5 9.83 10.83 10.5 10 10.5Z" fill="#FFFFFF" />
          </g>

          {/* Calculator/Tool Grid */}
          <g transform="translate(32, 90)">
            <rect width="20" height="25" rx="3" fill="#34D399" />
            <rect x="3" y="4" width="14" height="5" fill="#10B981" />
            <circle cx="5" cy="14" r="1.5" fill="#FFFFFF" />
            <circle cx="10" cy="14" r="1.5" fill="#FFFFFF" />
            <circle cx="15" cy="14" r="1.5" fill="#FFFFFF" />
            <circle cx="5" cy="19" r="1.5" fill="#FFFFFF" />
            <circle cx="10" cy="19" r="1.5" fill="#FFFFFF" />
            <circle cx="15" cy="19" r="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[720px] mx-auto px-4 md:px-0 flex flex-col items-center text-center py-6 md:py-12"
    >
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2 font-sans">
        What kind of a professional are you?
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-light mb-8">
        Tell us who you are, so we can get you there faster.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {options.map((option) => {
          const isSelected = professionalType === option.id;

          return (
            <motion.div
              key={option.id}
              onClick={() => onChangeType(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-[#bce2f5] bg-sky-50/40"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <div className="w-full text-center mb-4">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                  {option.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm font-light mt-1">
                  {option.description}
                </p>
              </div>

              <div className="w-full flex items-center justify-center min-h-[140px]">
                {option.illustration}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <Button
          onClick={onNext}
          disabled={!professionalType}
          className="w-full md:max-w-[380px] !rounded-full !bg-[#016EA6] hover:!bg-[#016EA6]/95 py-3.5 text-base shadow-sm font-medium tracking-wide"
        >
          Continue
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors cursor-pointer outline-none hover:bg-transparent"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
};

export default ProfessionalTypeSelection;

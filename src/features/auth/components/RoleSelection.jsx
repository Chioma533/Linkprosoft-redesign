import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Button from "../../../components/common/Button";

const RoleSelection = ({ role, onChangeRole, onNext }) => {
  const options = [
    {
      id: "employer",
      title: "I'm looking to hire",
      description: "Find a trusted professional near you",
      icon: FiSearch,
    },
    {
      id: "professional",
      title: "I'm offering my skills",
      description: "Let your services and get discovered",
      icon: FiSearch,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[580px] mx-auto px-4 md:px-0 flex flex-col items-center text-center py-6 md:py-12"
    >
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2 font-sans">
        What brings you here today?
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-light mb-8">
        Tell us who you are, so we can get you there faster.
      </p>

      <div className="w-full flex flex-col gap-4 mb-10">
        {options.map((option) => {
          const isSelected = role === option.id;
          const Icon = option.icon;

          return (
            <motion.div
              key={option.id}
              onClick={() => onChangeRole(option.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-[#016EA6] bg-sky-50/40"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? "bg-sky-100 text-[#016EA6]" : "bg-sky-50/50 text-[#016EA6]"
                  }`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    {option.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm font-light mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Selection Dot */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? "border-[#016EA6] bg-[#016EA6]" : "border-gray-200 bg-transparent"
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!role}
        className="w-full md:max-w-[380px] !rounded-full !bg-[#016EA6] hover:!bg-[#016EA6]/95 py-3.5 text-base shadow-sm font-medium tracking-wide"
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default RoleSelection;

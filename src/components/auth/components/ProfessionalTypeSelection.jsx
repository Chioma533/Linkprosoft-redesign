import { motion } from "framer-motion";
import Button from "../../../components/common/Button";
import GovtRecognized from "../../../assets/images/govt-approved-illustration.png";
import digitalProfessional from "../../../assets/images/digital-illustration.png";
import nonDigitalProfessional from "../../../assets/images/non-digital-illustration.png";


const ProfessionalTypeSelection = ({ professionalType, onChangeType, onNext, onBack }) => {
  const options = [
    {
      id: "digital",
      title: "Digital Professional",
      description: "Web designer, 3d artist, e.t.c.",
      illustration: (
        <img
          src={digitalProfessional}
          alt="Digital Professional"
          className="w-full mx-auto mt-4"
        />
      ),
    },
    {
      id: "non_digital",
      title: "None-digital professional",
      description: "Carpenter, Painter, e.t.c.",
      illustration: (
        <img
          src={nonDigitalProfessional}
          alt="Non-Digital Professional"
          className="w-full mx-auto mt-4"
        />
      ),
    },
    {
      id: "govt_recognized",
      title: "Govt Recognized",
      description: "Lawyers, Doctors, e.t.c.",
      illustration: (
        <img
          src={GovtRecognized}
          alt="Govt Recognized"
          className="w-full mx-auto mt-4"
        />
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-225 mx-auto px-4 md:px-0 flex flex-col items-center text-center py-6"
    >
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2 font-sans">
        What kind of a professional are you?
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-light mb-8">
        Tell us who you are, so we can get you there faster.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
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

              <div className="w-full flex items-center justify-center min-h-35">
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
          className="w-full md:max-w-95 rounded-full! bg-[#016EA6]! hover:bg-[#016EA6]/95! py-3.5 text-base shadow-sm font-medium tracking-wide"
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

import { motion } from "framer-motion";
import { FiSearch, FiCalendar } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

const STEPS = [
  {
    number: "01",
    icon: FiSearch,
    title: "Search",
    description: "Browse verified shared housing listings or full apartments filtered by price, location, and availability.",
    highlight: false,
  },
  {
    number: "02",
    icon: FaHandshake,
    title: "Connect",
    description: "Chat directly with professionals and employees. Review profiles, ratings, and references before you commit.",
    highlight: true,
  },
  {
    number: "03",
    icon: FiCalendar,
    title: "Search", // mockup says "Search" for step 3 too, with a calendar icon
    description: "Confirm your booking with clear booking confirmation updates, a trust & safety review when needed and reviews system all live inside LINKPROSOFT.",
    highlight: false,
  },
];

const Steps = () => {
  return (
    <section className="w-full bg-[#F3F7FC] py-16 md:py-24 px-4 md:px-12 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
        <span className="bg-[#016EA6] text-white font-semibold text-xs py-1.5 px-4 rounded-full tracking-wide">
          Simple process
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
          Three Steps to find <span className="text-[#016EA6]">professionals</span>
        </h2>
        <p className="text-gray-500 w-[80%] md:[70%] text-sm md:text-base leading-relaxed">
          Tell us what you need, compare verified professionals near you, and hire the right expert in minutes—fast, simple, and stress-free.
        </p>
      </div>

      {/* Cards Row/Grid */}
      <div className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {STEPS.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`rounded-[2rem] p-8 flex flex-col gap-6 shadow-sm border ${
                step.highlight
                  ? "bg-[#016EA6] text-white border-transparent shadow-xl scale-[1.03]"
                  : "bg-white text-gray-900 border-gray-100"
              }`}
            >
              {/* Step Number & Icon */}
              <div className="flex flex-col justify-between gap-5  w-full">
                <span
                  className={`text-4xl md:text-5xl font-extrabold tracking-tight ${
                    step.highlight ? "text-white/20" : "text-gray-200"
                  }`}
                >
                  {step.number}
                </span>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                    step.highlight ? "bg-white text-[#061EA6]" : "bg-gray-50 text-[#061EA6] border border-gray-100"
                  }`}
                >
                  <IconComponent className="text-xl" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-xl md:text-2xl">{step.title}</h3>
                <p
                  className={`text-sm leading-relaxed ${
                    step.highlight ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Steps;

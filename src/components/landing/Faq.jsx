import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const FAQ_ITEMS = [
  {
    id: 1,
    question: "How does Linkprosoft work?",
    answer: "Linkprosoft connects you with verified local professionals for various services. Simply describe what you need, compare real-time quotes, check provider profiles, and hire the professional that best fits your requirements and budget.",
  },
  {
    id: 2,
    question: "Can professionals set their own prices?",
    answer: "Yes, all service rendering professionals on Linkprosoft are independent service providers and have full control over setting their own rates and pricing models based on their expertise and experience.",
  },
  {
    id: 3,
    question: "Are all service providers verified?",
    answer: "Absolutely. Safety and trust are our top priorities. Every professional goes through an ID check and background verification process before they can offer their services or book clients on the platform.",
  },
  {
    id: 4,
    question: "How do I book a professional?",
    answer: "Simply use our search bar to find the category you need, select a verified professional near you, check their availability, agree on the project budget/scope, and confirm your booking securely within the application.",
  },
  {
    id: 5,
    question: "Does Linkprosoft has digital solutions professionals as well?",
    answer: "Yes. In addition to home and maintenance services, Linkprosoft connects you with trusted digital professionals, including web designers, developers, graphic designers, digital marketers, IT support specialists, and other tech experts to help bring your projects to life.",
  },
];

const Faq = () => {
  // Set the 5th item (index 4) expanded by default to match the mockup
  const [expandedId, setExpandedId] = useState();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-12 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="w-[90%] flex flex-col items-start gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
          Frequently <span className="text-[#016EA6]">asked questions</span>
        </h2>
      </div>

      {/* Accordion Container */}
      <div className="w-[90%] flex flex-col gap-4">
        {FAQ_ITEMS.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-[#0561A6] text-white rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {/* Question Clickable Header */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-center justify-between text-left p-6 md:p-8 font-bold text-base md:text-lg focus:outline-none focus:ring-0 focus:ring-offset-0"
              >
                <span>{item.question}</span>
                {/* Chevron icon inside white circle */}
                <span className="w-8 h-8 rounded-full bg-white text-[#0561A6] flex items-center justify-center shrink-0 shadow transition-transform duration-300">
                  <FiChevronDown
                    className={`text-lg transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </button>

              {/* Collapsible Answer */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col gap-4">
                      {/* Horizontal line divider */}
                      <hr className="border-t border-white/20 w-full" />
                      <p className="text-sm md:text-base leading-relaxed text-white/95 font-normal">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;

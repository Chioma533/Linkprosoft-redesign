import { motion } from "framer-motion";
import { FiUserCheck, FiShield, FiStar, FiCheckCircle } from "react-icons/fi";

const FEATURES = [
  {
    icon: FiUserCheck,
    title: "Verified Users",
    description: "Every member goes through ID and background verification before listing or booking.",
  },
  {
    icon: FiShield,
    title: "Secure Booking",
    description: "Booking confirmation, a trust & safety review, and a clear payout delay process help keep every booking protected.",
  },
  {
    icon: FiStar,
    title: "Real Reviews",
    description: "Authentic ratings from real people and service users. No fake reviews, ever.",
  },
  {
    icon: FiCheckCircle,
    title: "Trusted Providers",
    description: "Our service rendering professionals are vetted, insured, and rated by the community.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-12 flex flex-col items-center gap-10">
      {/* Top Header */}
      <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
        <span className="bg-[#061EA6]/10 text-[#016EA6] font-semibold text-sm py-1.5 px-4 rounded-full tracking-wide">
          Why choose us?
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
          Built on trust, <span className="text-[#016EA6]">Driven by community</span>
        </h2>
        <p className="text-gray-500 w-[80%] md:[70%] text-md md:text-base leading-relaxed">
          Every feature is designed to give you confidence, whether you're finding a professional or rendering your services to employees
        </p>
      </div>

      {/* Cards Row/Grid */}
      <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {FEATURES.map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white hover:bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col items-start gap-4 hover:shadow-lg transition-all"
            >
              {/* Icon Container */}
              <div className="p-3 bg-[#E8F0FE] text-[#061EA6] rounded-xl flex items-center justify-center">
                <IconComponent className="text-2xl" />
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-gray-900 text-lg md:text-xl">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;

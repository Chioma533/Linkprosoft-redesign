import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const TESTIMONIALS = [
  {
    rating: 5,
    hasRatingText: false,
    text: "Booked a carpenter for custom furniture work. The quality exceeded my expectations and pricing was fair.",
    name: "Aisha R.",
    role: "Homeowner",
  },
  {
    rating: 5,
    hasRatingText: false,
    text: "We used Linkprosoft for office cleaning services, and the results were excellent. The team was thorough, fast, and very professional.",
    name: "BrightWave Studios",
    role: "",
  },
  {
    rating: 5,
    hasRatingText: true,
    text: "I've worked with different clients through Linkprosoft, and it's been very organized. I know exactly what is expected before I arrive.",
    name: "Monica T., Home",
    role: "Cleaner",
  },
  {
    rating: 5,
    hasRatingText: false,
    text: "I love how easy it is to find verified professionals. No more guessing or random contacts - everything is structured and reliable.",
    name: "Michael T.",
    role: "Property Manager",
  },
  {
    rating: 5,
    hasRatingText: false,
    text: "Finding a reliable plumber used to be stressful. Linkprosoft made it simple - I compared profiles, picked one, and got same-day service.",
    name: "Sarah K.",
    role: "Apartment Owner",
  },
  {
    rating: 5,
    hasRatingText: true,
    text: "I've worked with different clients through Linkprosoft, and it's been very organized. I know exactly what is expected before I arrive.",
    name: "Monica T., Home",
    role: "Cleaner",
  },
  {
    rating: 5,
    hasRatingText: false,
    text: "I've worked with different clients through Linkprosoft, and it's been very organized. I know exactly what is expected before I arrive.",
    name: "Monica T., Home",
    role: "Cleaner",
  },
  {
    rating: 5,
    hasRatingText: false,
    text: "As a small business owner, I need quick maintenance support. Linkprosoft gives me fast access to trusted technicians anytime I need them.",
    name: "Monica T., Home",
    role: "Cleaner",
  },
  {
    rating: 5,
    hasRatingText: true,
    text: "I've worked with different clients through Linkprosoft, and it's been very organized. I know exactly what is expected before I arrive.",
    name: "Monica T., Home",
    role: "Cleaner",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-12 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
          Hear from our <span className="text-[#016EA6]">satisfied user</span>
        </h2>
        <p className="text-gray-500 w-[80%] md:[70%] text-md md:text-base leading-relaxed">
          Every feature is designed to give you confidence, whether you're finding a professional or rendering your services to employees
        </p>
      </div>

      {/* Masonry layout using CSS columns */}
      <div className="w-[90%] columns-1 sm:columns-2 lg:columns-3 gap-6 mt-4">
        {TESTIMONIALS.map((test, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="break-inside-avoid mb-6 bg-[#FAF9F9]/80 border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col gap-4 hover:shadow-md hover:scale-[1.01] transition-all"
          >
            {/* Stars Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-yellow-400">
                {[...Array(test.rating)].map((_, i) => (
                  <FaStar key={i} className="text-sm shrink-0" />
                ))}
              </div>
              {test.hasRatingText && (
                <span className="text-xs text-gray-400 font-medium">(5.0)</span>
              )}
            </div>

            {/* Testimonial Quote */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal">
              "{test.text}"
            </p>

            {/* Author */}
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-sm md:text-base">
                {test.name}
              </span>
              {test.role && (
                <span className="text-gray-400 text-xs md:text-sm font-medium">
                  {test.role}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

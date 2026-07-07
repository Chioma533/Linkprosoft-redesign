import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";

const CATEGORIES = [
  {
    id: "electrician",
    title: "Electrician",
    description: "Power your space with trusted electrical professionals.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "plumber",
    title: "Plumber",
    description: "Plumbing services for repairs, leaks, and installations.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "design-dev",
    title: "Design & Dev",
    description: "Design and development for websites and applications.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "painter",
    title: "Painter",
    description: "Expert painters delivering smooth and precise results.",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "carpenter",
    title: "Carpenter",
    description: "Reliable carpenters for repairs, fittings, and installations.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "cleaner",
    title: "Cleaner",
    description: "High-quality home and commercial cleaning services.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80",
  },
];

const PopularCategories = ({ searchQuery }) => {
  const filteredCategories = CATEGORIES.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-[90%] mx-auto py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Info & Process */}
      <div className="lg:col-span-5 flex flex-col gap-4 md:gap-4">
        {/* Popular Categories Badge */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-full py-2 px-4 w-fit cursor-pointer">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=80&h=80&q=80" className="w-7 h-7  rounded-full bg-yellow-400 border border-white" />
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80" className="w-7 h-7  rounded-full bg-green-500 border border-white" />
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80&q=80"
              className="w-7 h-7 rounded-full bg-blue-500 border border-white" 
            />
          </div>
          <span className="text-md font-semibold text-gray-700">Popular categories</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Everything you need, all in <span className="text-[#016EA6]">one platform.</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 text-base md:text-lg">
          Browse trusted professionals across a wide range of services, from everyday repairs to specialized projects.
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-5 mt-2">
          {[
            "Describe what you need done",
            "Set your budget",
            "Receive quotes and pick the best person",
          ].map((text, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#061EA6]/10 text-[#016EA6] font-semibold flex items-center justify-center text-sm shrink-0">
                {idx + 1}
              </span>
              <p className="text-gray-800 font-medium text-sm md:text-base">{text}</p>
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <Button variant="primary" size="md" rounded="lg" 
         className="w-fit mt-4  !rounded-full !bg-[#016EA6]">
          Explore Services
        </Button>
      </div>

      {/* Right Column: Categories Grid */}
      <div className="lg:col-span-7 bg-[#E8F0FE]/40 rounded-[2.5rem] p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {filteredCategories.length > 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
            >
              {filteredCategories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md hover:scale-[1.02] transition-all relative overflow-hidden"
                >
                  {/* Category Image */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  {/* Category Text */}
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{cat.title}</h3>
                    <p className="text-gray-500 text-xs mt-1 leading-snug">{cat.description}</p>
                  </div>

                  {/* Status Blue Dot */}
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#016EA6] rounded-full" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <p className="text-gray-500 text-lg font-medium">No services match "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-1">Try searching for other terms like 'plumber' or 'electrician'.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PopularCategories;

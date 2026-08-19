import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { FiUserPlus } from 'react-icons/fi';
import { authSlides } from '../constants/authSlide';


const AuthLayout = ({children, icon: Icon = FiUserPlus}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % authSlides.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[960px] mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center gap-10 md:gap-16 "
    >
      {/* Left Column: Handyman testimonial image (Desktop only) */}
      <div className="hidden md:block w-1/2 relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group shadow-md">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={authSlides[currentSlide].image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Dark overlay with testimonial text */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/5 flex flex-col justify-end p-8 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{authSlides[currentSlide].profession}</h3>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>

              <p>{authSlides[currentSlide].testimonial}</p>
            </motion.div>
          </AnimatePresence>
          {/* <p className="text-sm font-light leading-relaxed text-gray-200">
            &ldquo;I&apos;ve worked with different clients through Linkprosoft,
            and it&apos;s been very organized. I know exactly what is expected
            before I arrive.&rdquo;
          </p> */}
        </div>
      </div>

      {/* Right Column: Signup form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center ">
        {/* Header Icon */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white border-[1px] border-[#E0E7FF] flex items-center justify-center text-[#016EA6] mb-4">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {/* <div className="w-full md:w-1/2 flex flex-col justify-center "> */}
        {children}
        {/* </div> */}
      </div>
    </motion.div>
  );
}

export default AuthLayout
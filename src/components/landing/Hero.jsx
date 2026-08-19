import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

const HERO_IMAGES = [
  // 1. Carpenter/Woodworker (matches the mockup style)
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
  // 2. Electrician/Service Technician
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
  // 3. Construction/Renovation builder
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80"
];

function ContentEditable({ value, onChange, onKeyDown }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const current = el.textContent || "";
    if (value !== current) {
      el.textContent = value || "";
    }
  }, [value]);

  return (
    <div className="flex-1 relative">
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={(e) => onChange?.(e.currentTarget.textContent)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-full bg-transparent border-none outline-none text-gray-900 text-base md:text-lg focus:ring-0 focus:outline-none resize-none font-normal leading-normal break-words text-left"
        style={{ whiteSpace: "pre-wrap" }}
      />

      {!value && !focused && (
        <div className="absolute left-0 top-0 pointer-events-none text-gray-400 text-base md:text-lg leading-normal text-left">
          I am looking for a plumber..
        </div>
      )}
    </div>
  );
}

/**
 * Landing page Hero with AI search input.
 * Submit pathway: docs/integrations/AI-SEARCH-NLP-INTEGRATION.md
 *
 * @param {object}   props
 * @param {string}   props.searchVal       - controlled textarea value
 * @param {function} props.onSearchChange  - setter for the textarea value
 * @param {function} props.onSearchSubmit  - callback receiving the trimmed query string
 * @param {boolean}  [props.isSearching]   - disables submit while a request is in-flight
 */
const Hero = ({ searchVal, onSearchChange, onSearchSubmit, isSearching = false }) => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    // Transition slides automatically every 20 seconds
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = searchVal?.trim();
    if (!trimmed || isSearching) return;
    onSearchSubmit?.(trimmed);
  }, [searchVal, isSearching, onSearchSubmit]);

  /**
   * Ctrl+Enter submits the search (standard multi-line textarea convention).
   * Plain Enter inserts a newline as usual.
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <section className="relative w-full min-h-[450px] md:h-[85vh] flex items-center justify-center overflow-hidden px-4 md:px-12 py-12 rounded-[2rem] md:rounded-[2rem] max-w-[95%] mx-auto mt-4">
      {/* Background Image Slider with Smooth Horizontal Scroll Animation */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={bgIndex}
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.8 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // smooth easeOutExpo curve
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[bgIndex]})` }}
          />
        </AnimatePresence>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-4xl text-center text-white flex flex-col items-center gap-4 md:gap-6">
        {/* Animated Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl"
        >
          Book exceptional professionals <br className="hidden md:inline" />
          without the guesswork.
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-200 font-normal max-w-2xl"
        >
          Find trusted professionals for every project all in one seamless platform.
        </motion.p>

        {/* search input matching */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-lg bg-white rounded-3xl p-4  shadow-2xl flex justify-between h-20 border border-white/20 relative"
        >
            {/* Top text input region (now a contentEditable div that fills the box) */}
            {
              /* Controlled contentEditable: sync textContent -> searchVal via ref */
            }
            <ContentEditable
              value={searchVal}
              onChange={onSearchChange}
              onKeyDown={handleKeyDown}
            />

          {/* Bottom right action button panel */}
          <div className="flex justify-end items-center gap-3 shrink-0 mt-auto">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Voice Search"
            >
              <FaMicrophone className="text-base md:text-lg" />
            </button>
            <button
              id="hero-search-submit-btn"
              type="button"
              disabled={isSearching || !searchVal?.trim()}
              onClick={handleSubmit}
              className="p-2.5 bg-[#0070BA] hover:bg-[#0070BA]/90 text-white rounded-full hover:scale-105 transition-all shadow-md shrink-0 flex items-center justify-center w-10 h-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FaArrowUp className="text-sm" />
            </button>
          </div>
        </motion.div>

        {/* Floating service provider connection badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10 hover:bg-black/40 transition-colors cursor-pointer"
        >
          {/* Overlapping Avatars */}
          <div className="flex -space-x-2">
            <img
              src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Provider"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Provider"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Provider"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          </div>
          <span className="text-xs md:text-sm font-medium text-white tracking-wide">
            Connect with a service provider
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

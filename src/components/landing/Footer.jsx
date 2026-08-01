import { Link } from "react-router-dom";
import LandscapeImage from "../../assets/images/footerBg.jpg"; // The colorful landscape illustration

const Footer = () => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="w-full bg-white px-4 md:px-12 py-10">
      {/* Outer Card Wrapper */}
      <div className="w-full relative z-0 mx-auto flex justify-center overflow-hidden mt-auto">
        <div className="max-w-[95%] mx-auto bg-[#016EA6] text-white rounded-[2.5rem] pt-12 md:pt-16 pb-0 px-6 md:px-16 overflow-hidden relative flex flex-col justify-between">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 relative z-10 w-full mb-12 md:mb-16">
            {/* Left Column: Heading, Subtext, Search input */}
            <div className="lg:col-span-6 flex flex-col gap-6 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                Ready to Find the Right Professional?
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                Whether it's home repairs, cleaning, renovations, or digital
                solutions, Linkprosoft connects you with trusted experts
                quickly, securely, and hassle-free.
              </p>

              {/* Search capsule form */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white backdrop-blur-md border border-white/20 p-2 rounded-full flex items-center w-full max-w-md shadow-inner mt-2"
              >
                <input
                  type="text"
                  placeholder="Search professional near you"
                  className="bg-blue border-none outline-none flex-1 pl-4 text-gray-500 placeholder-gray-500 text-md md:text-base focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0561A6] hover:bg-[#0561A6]/95 text-white font-semibold text-sm rounded-full transition-all shrink-0 shadow"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right Columns: Links */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-6 md:gap-8">
              {/* Column 1: Company */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-base tracking-wide text-white/90">
                  Company
                </h4>
                <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/70">
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-white transition-colors"
                    >
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/career"
                      className="hover:text-white transition-colors"
                    >
                      Career
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-white transition-colors"
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Services */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-base tracking-wide text-white/90">
                  Services
                </h4>
                <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/70">
                  <li>
                    <Link
                      to="/services/plumbing"
                      className="hover:text-white transition-colors"
                    >
                      Plumbing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/electrical"
                      className="hover:text-white transition-colors"
                    >
                      Electrical
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/carpentry"
                      className="hover:text-white transition-colors"
                    >
                      Carpentry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/digital"
                      className="hover:text-white transition-colors"
                    >
                      Digital Solutions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Support */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-base tracking-wide text-white/90">
                  Support
                </h4>
                <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/70">
                  <li>
                    <Link
                      to="/help"
                      className="hover:text-white transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faqs"
                      className="hover:text-white transition-colors"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <img
            src={LandscapeImage}
            className="
            absolute
            bottom-0  
            left-0
            w-full
            object-contain
            object-bottom
            mix-blend-multiply
    "
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

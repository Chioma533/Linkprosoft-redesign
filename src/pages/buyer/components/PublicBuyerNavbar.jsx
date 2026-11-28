import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeSwitcher from "../../../components/common/ThemeSwitcher";
import Logo from "/temp_figma_mockups/linkprosoft-logo.png";

const navLinks = [
  { id: "browse", label: "Browse Professionals", path: "/browse-professionals" },
  { id: "community", label: "Community", path: "/community" },
  { id: "trending", label: "Trending Professionals", path: "/trending" },
];

const PublicBuyerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/browse-professionals" className="hidden md:flex items-center shrink-0 hover:opacity-90 transition-opacity gap-2">
            <img src={Logo} alt="Linkprosoft" className="w-9 h-9 rounded-lg object-cover" />
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                id={`public-nav-${link.id}`}
                className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap pb-1 ${link.id === "browse" ? "text-[#016EA6] border-b-2 border-[#016EA6]" : "text-gray-600 hover:text-[#016EA6]"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <Link to="/login" id="public-nav-login-btn" className="text-sm font-semibold text-gray-700 hover:text-[#016EA6] transition-colors px-4 py-2 rounded-full hover:bg-gray-50">Sign In</Link>
            <Link to="/signup" id="public-nav-signup-btn" className="text-sm font-bold text-white bg-[#016EA6] hover:bg-[#015a8c] transition-colors px-5 py-2 rounded-full shadow-sm">Get Started</Link>
          </div>

          <div className="flex md:hidden items-center justify-between w-full h-full">
            <div className="flex items-center gap-3">
              <button id="public-mobile-menu-btn" onClick={() => setMobileMenuOpen((open) => !open)} className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50" aria-label="Toggle Menu">
                {mobileMenuOpen ? <FiX className="w-6 h-6 text-gray-700" /> : <FiMenu className="w-6 h-6 text-gray-700" />}
              </button>
              <ThemeSwitcher />
              <h1 className="text-base font-bold text-gray-900 tracking-tight">Browse Professionals</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login" id="public-mobile-login-btn" className="text-xs font-semibold text-gray-700 hover:text-[#016EA6] transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#016EA6]/40">Sign In</Link>
              <Link to="/signup" id="public-mobile-signup-btn" className="text-xs font-bold text-white bg-[#016EA6] hover:bg-[#015a8c] transition-colors px-3 py-1.5 rounded-full">Get Started</Link>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 bg-white border-t border-gray-100 shadow-lg flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link key={link.id} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`text-base font-medium hover:text-[#016EA6] transition-colors ${link.id === "browse" ? "text-[#016EA6]" : "text-gray-700"}`}>
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-1" />
          <div className="flex flex-col gap-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-center text-gray-700 border border-gray-200 rounded-full py-2.5 hover:text-[#016EA6] hover:border-[#016EA6]/40 transition-colors">Sign In</Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-center text-white bg-[#016EA6] hover:bg-[#015a8c] rounded-full py-2.5 transition-colors">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicBuyerNavbar;

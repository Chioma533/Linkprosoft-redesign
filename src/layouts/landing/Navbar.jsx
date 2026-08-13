import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../../public/temp_figma_mockups/linkprosoft-logo.png";

import Button from "../../components/common/Button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Categories", path: "/Categories" },
    { name: "How it works", path: "/howItWorks" },
    { name: "Browse works", path: "/works" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
          <img src={Logo} alt="Linkprosoft" className="w-10 rounded-lg" />
          <span className="ml-3 font-bold text-xl tracking-tight text-gray-900">Linkprosoft</span>
        </Link>

        {/* Center: Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-600 font-medium hover:text-[#061EA6] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Desktop Action buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/signup"
            className="text-gray-600 font-medium hover:text-[#061EA6] transition-colors"
          >
            Sign up
          </Link>
            <Link
                to="/login"
              >
          <Button variant="primary" size="sm" rounded="lg" className="!rounded-full px-6 py-2 !bg-[#016EA6] text-white hover:bg-[#061EA6]/90 transition-colors font-medium">

                Sign In
          </Button>

            </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50 flex flex-col p-6 gap-5 md:hidden animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 font-medium text-lg hover:text-[#061EA6] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex flex-col gap-3">
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-gray-700 font-medium text-lg hover:text-[#061EA6] py-2 transition-colors"
            >
              Sign up
            </Link>
            <Button
              variant="primary"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full !rounded-full !bg-[#016EA6]"
            >
              <Link
                to="/login"
              >
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

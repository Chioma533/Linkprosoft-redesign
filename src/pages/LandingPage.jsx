import { useState } from "react";
import Navbar from "../components/layout/landing/Navbar";
import Hero from "../components/landing/Hero";
import PopularCategories from "../components/landing/PopularCategories";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import Steps from "../components/landing/Steps";
import Testimonials from "../components/landing/Testimonials";
import Faq from "../components/landing/Faq";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white text-gray-950 flex flex-col font-sans">
      <Navbar />
      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col gap-12 md:gap-16">
        <Hero searchVal={searchQuery} onSearchChange={setSearchQuery} />
        <PopularCategories searchQuery={searchQuery} />
        <WhyChooseUs />
        <Steps />
        <Testimonials />
        <Faq />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;

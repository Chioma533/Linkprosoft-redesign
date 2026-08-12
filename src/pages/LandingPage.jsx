import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../layouts/landing/Navbar";
import Hero from "../components/landing/Hero";
import PopularCategories from "../components/landing/PopularCategories";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import Steps from "../components/landing/Steps";
import Testimonials from "../components/landing/Testimonials";
import Faq from "../components/landing/Faq";
import Footer from "../components/landing/Footer";
import { searchService } from "../api/services/searchService";

/**
 * Landing page.
 * The Hero search box submits a natural-language query to the backend via
 * searchService.searchProfessionalsByText (POST /api/search/professionals).
 * See: docs/integrations/AI-SEARCH-NLP-INTEGRATION.md
 */
const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  /**
   * Handle the Hero search submission.
   * Sends the NLP query to the backend, then navigates to the buyer home
   * screen with the query as a URL search param so the results page can
   * pick it up. If the API call fails, the user stays on the landing page
   * and sees a toast error.
   */
  const handleSearchSubmit = useCallback(
    async (query) => {
      // Abort any in-flight request (per integration spec guidance)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSearching(true);

      try {
        // Fire the POST to validate the query and warm the backend cache
        await searchService.searchProfessionalsByText(
          { query, page: 1, limit: 20 },
          controller.signal
        );

        // Navigate to the buyer home screen with the search query
        navigate(`/home?q=${encodeURIComponent(query)}`);
      } catch (err) {
        // Silently ignore aborted requests (user submitted a new query)
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

        // Surface error to the user per integration spec (preserve input, show retry action)
        const status = err?.response?.status;
        if (status === 400) {
          toast.error(err?.response?.data?.message || "Invalid search query. Please try again.");
        } else if (status === 429) {
          toast.error("Too many requests — please wait a moment and try again.");
        } else if (status === 503) {
          toast.error("Search is temporarily unavailable. Please try again shortly.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        console.error("[LandingPage] search error:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-white text-gray-950 flex flex-col font-sans">
      <Navbar />
      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col gap-12 md:gap-16">
        <Hero
          searchVal={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          isSearching={isSearching}
        />
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

import { useState, useRef, useCallback, useEffect } from "react";
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
import Preloader from "../components/common/preloader/PreLoader";
import { usePreloader } from "../context/PreLoaderContext";
import { searchService } from "../api/services/searchService";
import { useAuthStore } from "../store/authStore";

/**
 * Landing page.
 * The Hero search box submits a natural-language query to the backend via
 * searchService.searchProfessionalsByText (POST /api/search/professionals).
 * See: docs/integrations/AI-SEARCH-NLP-INTEGRATION.md
 */
const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  const { showPreloader } = usePreloader();

  // Initial page load preloader timer
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimePassed(true);
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(minTimer);
  }, []);

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
        // Fire smart heuristic search (NLP POST or profession GET based on query structure)
        await searchService.smartSearchProfessionals(
          { query, page: 1, limit: 20 },
          controller.signal
        );

        // Navigate to the appropriate screen with the search query via smooth preloader transition
        const { isAuthenticated, user } = useAuthStore.getState();
        const targetRoute =
          isAuthenticated && user?.role === "employer"
            ? `/home?q=${encodeURIComponent(query)}`
            : `/browse-professionals?q=${encodeURIComponent(query)}`;

        showPreloader(() => {
          navigate(targetRoute);
        });
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
    [navigate, showPreloader]
  );

  if (isInitialLoading || !minTimePassed) {
    return (
      <Preloader
        onFinish={() => {
          setIsInitialLoading(false);
          setMinTimePassed(true);
        }}
      />
    );
  }

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

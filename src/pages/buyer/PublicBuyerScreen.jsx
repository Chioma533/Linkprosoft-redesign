import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import ProfessionalSearchBar from "../../components/buyer/ProfessionalSearchBar";
import useBuyerProfessionals from "../../hooks/useBuyerProfessionals";
import PublicBuyerNavbar from "./components/PublicBuyerNavbar";
import PublicBuyerHero from "./components/PublicBuyerHero";
import PublicBuyerBottomNav from "./components/PublicBuyerBottomNav";
import PublicProfessionalResults from "./components/PublicProfessionalResults";

const PublicBuyerScreen = () => {
  const location = useLocation();
  const initialFilters = {
    searchQuery: new URLSearchParams(location.search).get("q") || "",
    location: "",
    rating: "",
    budget: "",
  };

  const {
    filters,
    filteredProfessionals,
    paginatedProfessionals,
    safeCurrentPage,
    totalPages,
    isInitialLoading,
    isSearching,
    minTimePassed,
    error,
    handleApplyFilters,
    handlePageChange,
    fetchProfessionals,
  } = useBuyerProfessionals(initialFilters);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || "";
    if (filters.searchQuery !== query) {
      handleApplyFilters({ ...filters, searchQuery: query });
    }
  }, [location.search, filters, handleApplyFilters]);

  if (isInitialLoading || !minTimePassed) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error loading professionals
        </h2>
        <p className="text-gray-500 text-center">{error}</p>
        <button
          onClick={() => fetchProfessionals()}
          className="mt-6 bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-3 rounded-full text-font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-12">
      <PublicBuyerNavbar />
      <PublicBuyerHero />

      <section
        id="public-search-filter-section"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <ProfessionalSearchBar
          onApply={handleApplyFilters}
          initialQuery={filters.searchQuery}
        />
      </section>

      <PublicProfessionalResults
        filters={filters}
        filteredProfessionals={filteredProfessionals}
        paginatedProfessionals={paginatedProfessionals}
        isSearching={isSearching}
        safeCurrentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <PublicBuyerBottomNav />
    </div>
  );
};

export default PublicBuyerScreen;

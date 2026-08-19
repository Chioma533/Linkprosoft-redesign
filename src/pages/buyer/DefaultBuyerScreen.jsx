import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import BuyerNavbar from "../../layouts/buyer/BuyerNavbar";
import ProfessionalSearchBar from "../../components/buyer/ProfessionalSearchBar";
import ProfessionalResults from "../../components/buyer/ProfessionalResults";
import BuyerHero from "../../components/buyer/BuyerHero";
import BuyerBottomNav from "../../components/buyer/BuyerBottomNav";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";

import useBuyerProfessionals from "../../hooks/useBuyerProfessionals";

const DefaultBuyerScreen = () => {
  const location = useLocation();

  const [verificationDismissed, setVerificationDismissed] = useState(false);

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

  const handleDismissVerification = () => {
    setVerificationDismissed(true);
  };

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
      <BuyerNavbar activePage="browse" />

      <BuyerHero
        verificationDismissed={verificationDismissed}
        onDismissVerification={handleDismissVerification}
      />

      <section
        id="search-filter-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <ProfessionalSearchBar
          onApply={handleApplyFilters}
          initialQuery={filters.searchQuery}
        />
      </section>

      <ProfessionalResults
        filters={filters}
        filteredProfessionals={filteredProfessionals}
        paginatedProfessionals={paginatedProfessionals}
        isSearching={isSearching}
        safeCurrentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <BuyerBottomNav activeTab="browse" />
    </div>
  );
};

export default DefaultBuyerScreen;
import React from "react";
import ProfessionalCard from "./ProfessionalCard";
import BuyerPagination from "./BuyerPagination";

const ProfessionalResults = ({
  filters,
  filteredProfessionals,
  paginatedProfessionals,
  isSearching,
  safeCurrentPage,
  totalPages,
  onPageChange,
}) => {
  const getSectionTitle = () => {
    if (filters.searchQuery) {
      return (
        <>
          Related to{" "}
          <span className="text-gray-700">
            &ldquo;{filters.searchQuery}&rdquo;
          </span>
        </>
      );
    }

    if (filters.location || filters.rating || filters.budget) {
      return "Filtered Professionals";
    }

    return "All Professionals";
  };

  return (
    <section
      id="professionals-results-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {getSectionTitle()}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {filteredProfessionals.length} professionals available
          </p>
        </div>

        <div
          id="professionals-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-h-[240px]"
        >
          {isSearching ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-3 border-[#016EA6]/20 border-t-[#016EA6] rounded-full animate-spin" />

              <p className="text-xs font-semibold text-gray-500 animate-pulse">
                Searching professionals...
              </p>
            </div>
          ) : paginatedProfessionals.length > 0 ? (
            paginatedProfessionals.map((pro, idx) => {
              const fullName =
                pro.name ||
                `${pro.user?.firstName || ""} ${
                  pro.user?.lastName || ""
                }`.trim() ||
                "Unknown";

              const roleName =
                pro.profession ||
                pro.role ||
                (pro.skills && pro.skills.length > 0
                  ? typeof pro.skills[0] === "string"
                    ? pro.skills[0]
                    : pro.skills[0].name || "Professional"
                  : "Professional");

              const locationName = pro.location || pro.user?.location || "";

              return (
                <ProfessionalCard
                  key={pro.id}
                  id={pro.id}
                  name={fullName}
                  role={roleName}
                  location={locationName}
                  avatarUrl={
                    pro.avatarUrl ||
                    pro.user?.avatar ||
                    "/professional_avatar.png"
                  }
                  rating={pro.rating ?? pro.avgRating ?? 0}
                  reviewCount={pro.reviewCount ?? pro.totalReviews ?? 0}
                  bio={pro.bio || "No bio available"}
                  pricePerDay={pro.pricePerDay ?? pro.hourlyRate ?? 0}
                  isBookmarked={false}
                  isSelected={idx === 0 && safeCurrentPage === 1}
                  onContact={() => console.log(`Contacting ${fullName}`)}
                  onBookmark={(val) =>
                    console.log(`Bookmarked ${fullName}: ${val}`)
                  }
                />
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-sm text-gray-500">
                No professionals match your current filters. Try expanding your
                search or adjusting the filters.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <BuyerPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default ProfessionalResults;

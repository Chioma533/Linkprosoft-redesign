import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProfessionalCard from "../../../components/buyer/ProfessionalCard";
import BuyerPagination from "../../../components/buyer/BuyerPagination";
import { getPublicProfilePath } from "../../../utils/publicProfilePath";

const PublicProfessionalResults = ({
  filters,
  filteredProfessionals,
  paginatedProfessionals,
  isSearching,
  safeCurrentPage,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  return (
    <section id="public-professionals-results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {filters.searchQuery
              ? <>Related to <span className="text-gray-700">&ldquo;{filters.searchQuery}&rdquo;</span></>
              : filters.location || filters.rating || filters.budget
                ? "Filtered Professionals"
                : "All Professionals"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{filteredProfessionals.length} professionals available</p>
        </div>

        <div id="public-professionals-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-h-[240px]">
          {isSearching ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-3 border-[#016EA6]/20 border-t-[#016EA6] rounded-full animate-spin" />
              <p className="text-xs font-semibold text-gray-500 animate-pulse">Searching professionals...</p>
            </div>
          ) : paginatedProfessionals.length > 0 ? (
            paginatedProfessionals.map((professional, index) => {
              const name =
                professional.name ||
                professional.fullName ||
                professional.user?.fullName ||
                `${professional.user?.firstName || ""} ${professional.user?.lastName || ""}`.trim() ||
                "Unknown";
              const role =
                professional.profession ||
                professional.role ||
                (professional.skills?.length
                  ? typeof professional.skills[0] === "string"
                    ? professional.skills[0]
                    : professional.skills[0].name || "Professional"
                  : "Professional");

              return (
                <ProfessionalCard
                  key={professional.id}
                  id={professional.id}
                  name={name}
                  role={role}
                  location={professional.location || professional.user?.location || ""}
                  avatarUrl={professional.avatarUrl || professional.user?.avatarUrl || professional.user?.avatar || "/professional_avatar.png"}
                  rating={professional.rating ?? professional.avgRating ?? 0}
                  reviewCount={professional.reviewCount ?? professional.totalReviews ?? 0}
                  bio={professional.bio || "No bio available"}
                  pricePerDay={professional.pricePerDay ?? professional.hourlyRate ?? 0}
                  user={{ ...professional, ...professional.user }}
                  isSelected={index === 0 && safeCurrentPage === 1}
                  onViewProfile={() => {
                    const profilePath = getPublicProfilePath(professional.publicSlug);
                    if (profilePath) navigate(profilePath);
                    else toast("Public profile for this user unavailable");
                  }}
                  onContact={() => navigate("/login")}
                  onBookmark={() => navigate("/login")}
                />
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-sm text-gray-500">No professionals match your current filters. Try expanding your search or adjusting the filters.</p>
            </div>
          )}
        </div>
        <div className="mt-8">
          <BuyerPagination currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>
    </section>
  );
};

export default PublicProfessionalResults;

import EmployerBanner from "../../assets/images/trending-professionals-banner.jpg";
import TrendingProfessionalsFilters from "../../components/employer/TrendingProfessionalsFilters";
import TrendingProfessionalsResults from "../../components/employer/TrendingProfessionalsResults";
import BuyerNavbar from "../../layouts/buyer/BuyerNavbar";
import useTrendingProfessionals from "../../hooks/useTrendingProfessionals";

const EmployerTrendingProfessionalsPage = () => {
  const trending = useTrendingProfessionals();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <BuyerNavbar activePage="trending" />
      <div className="h-32 overflow-hidden sm:h-36">
        <img
          src={EmployerBanner}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <header className="mb-5">
          <h1 className="text-xl font-medium tracking-tight text-gray-900 sm:text-2xl">
            Trending Professionals
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
            Discover the professionals clients are booking and recommending
            the most this week. Verified experts at your doorstep.
          </p>
        </header>
        <TrendingProfessionalsFilters
          search={trending.search}
          onSearchChange={trending.handleSearchChange}
          service={trending.service}
          services={trending.services}
          onServiceChange={trending.handleServiceChange}
          selectedFilters={trending.selectedFilters}
          onToggleFilter={trending.toggleFilter}
        />
        <TrendingProfessionalsResults
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.retry}
          professionals={trending.visibleProfessionals}
          currentPage={trending.currentPage}
          totalPages={trending.totalPages}
          onPageChange={trending.setPage}
          onViewProfile={trending.handleViewProfile}
          onMessage={trending.handleMessage}
        />
      </main>
    </div>
  );
};

export default EmployerTrendingProfessionalsPage;

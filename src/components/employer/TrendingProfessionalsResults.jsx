import TrendingProfessionalCard from "./TrendingProfessionalCard";

const PAGE_SIZE = 6;

const LoadingCards = () => (
  <div className="grid min-h-64 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {Array.from({ length: PAGE_SIZE }, (_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-2xl border border-gray-100 bg-white p-3"
      >
        <div className="aspect-[4/3] rounded-xl bg-gray-100" />
        <div className="mt-3 h-3 w-2/5 rounded bg-gray-100" />
        <div className="mt-2 h-10 rounded bg-gray-100" />
        <div className="mt-3 h-8 rounded-full bg-gray-100" />
      </div>
    ))}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - currentPage) <= 1,
  );

  return (
    <nav
      aria-label="Professional results pages"
      className="mt-5 flex flex-col items-center justify-between gap-3 bg-white px-4 py-3 sm:flex-row"
    >
      <p className="text-xs text-gray-600">
        Showing page {currentPage} of {totalPages} pages
      </p>
      <div className="flex items-center gap-1">
        {pages.map((number, index) => (
          <span key={number} className="contents">
            {index > 0 && pages[index - 1] !== number - 1 && (
              <span className="px-1 text-xs text-gray-400">…</span>
            )}
            <button
              type="button"
              aria-current={currentPage === number ? "page" : undefined}
              onClick={() => onPageChange(number)}
              className={`h-7 min-w-7 rounded px-2 text-xs ${
                currentPage === number
                  ? "bg-[#016EA6] font-semibold text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          </span>
        ))}
      </div>
    </nav>
  );
};

const TrendingProfessionalsResults = ({
  loading,
  error,
  onRetry,
  professionals,
  currentPage,
  totalPages,
  onPageChange,
  onViewProfile,
  onMessage,
}) => (
  <>
    <section aria-label="Trending professionals">
      {loading ? (
        <LoadingCards />
      ) : error ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center">
          <p className="text-sm text-gray-600">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-full bg-[#016EA6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#015a8a]"
          >
            Try again
          </button>
        </div>
      ) : professionals.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {professionals.map((professional, index) => (
            <TrendingProfessionalCard
              key={
                professional.id ||
                professional.userId ||
                `${professional.fullName || professional.name || "professional"}-${index}`
              }
              professional={professional}
              onViewProfile={() => onViewProfile(professional)}
              onMessage={() => onMessage(professional)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No professionals match these filters. Try changing your search.
        </div>
      )}
    </section>

    {!loading && !error && professionals.length > 0 && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    )}
  </>
);

export default TrendingProfessionalsResults;

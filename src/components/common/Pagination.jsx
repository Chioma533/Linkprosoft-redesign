import React from "react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  const { page: currentPage, totalPages, totalItems, limit } = pagination;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
      <span className="text-xs font-medium text-gray-400">
        Showing page {currentPage} of {totalPages}
        {totalItems ? ` • ${totalItems} results` : ""}
      </span>

      <div className="flex items-center gap-1.5">
        {getPages().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-1 text-xs text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                currentPage === page
                  ? "bg-[#016EA6] text-white"
                  : "border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default Pagination;

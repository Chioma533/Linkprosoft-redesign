import React from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const BuyerPagination = ({ currentPage, totalPages, onPageChange }) => {
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
    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
      <span className="text-xs text-gray-500 font-medium">
        <span className="sm:hidden text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <span className="hidden sm:inline">
          Showing page {currentPage} of {totalPages} pages
        </span>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          id="pagination-prev-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <FiChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPages().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-xs text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              id={`pagination-page-${page}-btn`}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#016EA6] text-white shadow-sm"
                  : "border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          id="pagination-next-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BuyerPagination;

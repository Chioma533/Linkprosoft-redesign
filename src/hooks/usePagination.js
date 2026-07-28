import { useEffect, useMemo, useState } from "react";

export const usePagination = (items = [], initialLimit = 9) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    totalPages: 1,
    totalItems: items.length,
  });

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pagination.limit));

    setPagination((prev) => ({
      ...prev,
      page: 1,
      totalPages,
      totalItems: items.length,
    }));
  }, [items, pagination.limit]);

  const currentItems = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;

    return items.slice(start, start + pagination.limit);
  }, [items, pagination]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  return {
    pagination,
    currentItems,
    handlePageChange,
  };
};

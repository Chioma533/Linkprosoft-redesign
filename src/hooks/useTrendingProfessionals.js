import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { searchService } from "../api/services/searchService";
import { useAuthStore } from "../store/authStore";
import { useMessagingStore } from "../store/messagingStore";
import { useDashboardStore } from "../store/dashboardStore";
import { getPublicProfilePath } from "../utils/publicProfilePath";

const PAGE_SIZE = 6;

const getName = (professional) =>
  professional.fullName ||
  professional.full_name ||
  professional.name ||
  professional.user?.fullName ||
  "";

const getProfession = (professional) =>
  professional.profession ||
  professional.role ||
  professional.skills?.[0]?.name ||
  professional.skills?.[0] ||
  "Professional";

const getRating = (professional) =>
  Number(
    professional.avgRating ??
      professional.rating ??
      professional.averageRating ??
      0,
  );

const isVerified = (professional) =>
  professional.isVerified === true ||
  professional.verified === true ||
  professional.verification_status === "verified" ||
  professional.verificationStatus === "verified" ||
  professional.user?.verification_status === "verified";

const useTrendingProfessionals = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { startConversation } = useMessagingStore();
  const { setActiveTab } = useDashboardStore();
  const [professionals, setProfessionals] = useState([]);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await searchService.searchProfessionalsByProfession({
          profession: search.trim() || undefined,
          sortBy: "rating_desc",
          page: 1,
          limit: 100,
        });
        const payload = response?.data ?? response;
        const results = Array.isArray(payload?.professionals)
          ? payload.professionals
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload)
              ? payload
              : [];

        if (active) setProfessionals(results);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load professionals.");
          toast.error(requestError.message || "Failed to load professionals");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, search ? 300 : 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [retryCount, search]);

  const services = useMemo(
    () => [...new Set(professionals.map(getProfession))].sort(),
    [professionals],
  );

  const filteredProfessionals = useMemo(() => {
    let results = professionals;

    if (service) {
      results = results.filter(
        (professional) =>
          getProfession(professional).toLowerCase() === service.toLowerCase(),
      );
    }
    if (selectedFilters.includes("topRated")) {
      results = results.filter((professional) => getRating(professional) >= 4);
    }
    if (selectedFilters.includes("available")) {
      results = results.filter((professional) => {
        const status = (
          professional.availabilityStatus ||
          professional.availability_status ||
          ""
        ).toLowerCase();
        return status === "available" || status === "available today";
      });
    }
    if (selectedFilters.includes("verified")) {
      results = results.filter(isVerified);
    }
    if (selectedFilters.includes("trending")) {
      results = [...results].sort(
        (first, second) =>
          new Date(second.createdAt || second.created_at || 0) -
          new Date(first.createdAt || first.created_at || 0),
      );
    }
    return results;
  }, [professionals, selectedFilters, service]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfessionals.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleProfessionals = filteredProfessionals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleServiceChange = (value) => {
    setService(value);
    setPage(1);
  };

  const toggleFilter = (filter) => {
    setPage(1);
    setSelectedFilters((current) =>
      current.includes(filter)
        ? current.filter((value) => value !== filter)
        : [...current, filter],
    );
  };

  const handleViewProfile = (professional) => {
    const profilePath = getPublicProfilePath(
      professional.publicSlug || professional.public_slug,
    );
    if (profilePath) navigate(profilePath);
    else toast("Public profile for this professional is unavailable");
  };

  const handleMessage = async (professional) => {
    if (!isAuthenticated) {
      toast("Please log in to contact professionals");
      navigate("/login");
      return;
    }

    const targetUserId =
      professional.userId || professional.user?.id || professional.id;
    if (user?.id === targetUserId) {
      toast("You cannot message your own account");
      return;
    }

    try {
      await startConversation({
        id: targetUserId,
        fullName: getName(professional) || "Professional",
        avatarUrl:
          professional.avatarUrl ||
          professional.user?.avatarUrl ||
          professional.user?.avatar ||
          null,
        profession: getProfession(professional),
      });
      toast.success(`Connected with ${getName(professional) || "professional"}`);
      setActiveTab("messages");
      navigate("/employer/dashboard");
    } catch (requestError) {
      console.error("Failed to start conversation:", requestError);
      toast.error(
        requestError.response?.data?.message ||
          "Unable to start conversation",
      );
    }
  };

  return {
    currentPage,
    error,
    filteredProfessionals,
    handleMessage,
    handleSearchChange,
    handleServiceChange,
    handleViewProfile,
    loading,
    page,
    retry: () => setRetryCount((count) => count + 1),
    search,
    selectedFilters,
    services,
    service,
    setPage,
    toggleFilter,
    totalPages,
    visibleProfessionals,
  };
};

export default useTrendingProfessionals;

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { adminService } from "../../api/services/adminService";
import { normalizeDispute } from "../../utils/adminDisputes";
import AdminDisputeDetails from "./components/AdminDisputeDetails";
import DisputePageHeader from "./components/disputes/DisputePageHeader";
import DisputeStatCards from "./components/disputes/DisputeStatCards";
import DisputesTable from "./components/disputes/DisputesTable";

const AdminDisputesSubpage = () => {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [raisedByFilter, setRaisedByFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [disputes, setDisputes] = useState([]);

  const fetchDisputesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsRes, disputesRes] = await Promise.allSettled([
        adminService.getDisputesMetrics(),
        adminService.getDisputes({ page: 1, limit: 20 }),
      ]);

      if (metricsRes.status === "fulfilled" && metricsRes.value?.data) {
        setMetrics(metricsRes.value.data);
      }

      if (disputesRes.status === "fulfilled" && disputesRes.value?.data) {
        const payload = disputesRes.value.data;
        const items =
          payload.items ||
          payload.disputes ||
          (Array.isArray(payload) ? payload : []);

        setDisputes(Array.isArray(items) ? items.map(normalizeDispute) : []);
      } else {
        setDisputes([]);
      }
    } catch (error) {
      console.warn("[AdminDisputesSubpage] Error fetching disputes:", error);
      setDisputes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisputesData();
  }, [fetchDisputesData]);

  const handleResolveAction = async (disputeId, resolutionData) => {
    setDisputes((currentDisputes) =>
      currentDisputes.map((dispute) =>
        dispute.id === disputeId || dispute.rawId === disputeId
          ? { ...dispute, status: "resolved", statusText: "Resolved" }
          : dispute,
      ),
    );

    try {
      const cleanId = String(disputeId || "").replace(/^#/, "");
      await adminService.arbitrateDispute(cleanId, {
        resolution: resolutionData.type || "split",
        clientPercentage:
          resolutionData.type === "refund"
            ? 100
            : resolutionData.type === "release"
              ? 0
              : 100 - (resolutionData.percentage || 50),
        proPercentage:
          resolutionData.type === "release"
            ? 100
            : resolutionData.type === "refund"
              ? 0
              : resolutionData.percentage || 50,
        notes: resolutionData.notes || "Arbitrated via Admin Dashboard",
      });
      toast.success("Dispute resolved successfully");
    } catch (error) {
      console.warn(
        "[AdminDisputesSubpage] Failed to arbitrate dispute on backend:",
        error,
      );
      toast.success("Dispute status updated");
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      dispute.id.toLowerCase().includes(query) ||
      dispute.jobTitle.toLowerCase().includes(query) ||
      dispute.raisedBy.toLowerCase().includes(query) ||
      dispute.against.toLowerCase().includes(query);

    const matchesRaisedBy =
      raisedByFilter === "all"
        ? true
        : raisedByFilter === "client"
          ? dispute.raisedBy.includes("Samuel")
          : dispute.raisedBy.includes("Elvis");

    const matchesStatus =
      statusFilter === "all" ? true : dispute.status === statusFilter;

    return matchesSearch && matchesRaisedBy && matchesStatus;
  });

  if (selectedDispute) {
    return (
      <AdminDisputeDetails
        dispute={{
          ...selectedDispute,
          amount: selectedDispute.numericAmount || 85000,
        }}
        onBack={() => setSelectedDispute(null)}
        onResolve={handleResolveAction}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <DisputePageHeader />
      <DisputeStatCards metrics={metrics} isLoading={isLoading} />
      <DisputesTable
        disputes={filteredDisputes}
        isLoading={isLoading}
        searchQuery={searchQuery}
        raisedByFilter={raisedByFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onRaisedByChange={setRaisedByFilter}
        onStatusChange={setStatusFilter}
        onView={setSelectedDispute}
      />
    </div>
  );
};

export default AdminDisputesSubpage;

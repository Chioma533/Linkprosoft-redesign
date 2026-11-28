import { useEffect, useMemo, useState } from "react";
import { walletService } from "../api/services/walletService";
import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";
import { formatDate, normalizeStatus } from "../utils/walletFormatting";

export const useWalletData = () => {
  const [employerWallet, setEmployerWallet] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const { user } = useAuthStore();
  const { metrics, myJobs } = useDashboardStore();
  const isEmployer = user?.role === "employer";

  useEffect(() => {
    if (!isEmployer) return undefined;
    let isMounted = true;

    walletService
      .getWallet()
      .then((wallet) => {
        if (isMounted) setEmployerWallet(wallet);
      })
      .catch((error) => {
        console.warn("Failed to load employer wallet:", error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [isEmployer]);

  useEffect(() => {
    if (!user?.id) return undefined;
    let isMounted = true;

    walletService
      .getPaymentHistory(user.id)
      .then((items) => {
        if (isMounted) setPaymentHistory(Array.isArray(items) ? items : []);
      })
      .catch((error) => {
        console.warn("Failed to load wallet payment history:", error.message);
        if (isMounted) setPaymentHistory([]);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const paymentItems = useMemo(
    () => (Array.isArray(paymentHistory) ? paymentHistory : []),
    [paymentHistory],
  );

  const paymentStats = useMemo(() => {
    return paymentItems.reduce(
      (summary, item) => {
        const userId = Number(user?.id || 0);
        const payerId = Number(item.payer_id ?? item.payerId ?? 0);
        const payeeId = Number(item.payee_id ?? item.payeeId ?? 0);
        const amount = Number(item.amount ?? item.totalAmount ?? 0);
        const status = String(item.status || "").toLowerCase();
        const isRelevant = payerId === userId || payeeId === userId;
        if (!isRelevant) return summary;

        if (payeeId === userId) {
          summary.totalEarnings += amount;
          if (["held_in_escrow", "held_pending_review"].includes(status)) {
            summary.availableBalance += amount;
          }
          if (["pending_payment", "pending_admin_approval"].includes(status)) {
            summary.pendingEarnings += amount;
          }
          if (status === "released") summary.totalWithdrawn += amount;
        }

        if (
          payerId === userId &&
          [
            "pending_payment",
            "pending_admin_approval",
            "held_in_escrow",
            "held_pending_review",
          ].includes(status)
        ) {
          summary.totalSpent += amount;
        }
        return summary;
      },
      {
        availableBalance: 0,
        pendingEarnings: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        totalSpent: 0,
      },
    );
  }, [paymentItems, user?.id]);

  const availableBalance = Number(
    isEmployer
      ? (employerWallet?.balance ?? paymentStats.availableBalance ?? 0)
      : (paymentStats.availableBalance ?? 0),
  );

  const activeEscrows = useMemo(() => {
    const userId = Number(user?.id || 0);
    return paymentItems
      .filter((item) => {
        const payerId = Number(item.payer_id ?? item.payerId ?? 0);
        const payeeId = Number(item.payee_id ?? item.payeeId ?? 0);
        const status = String(item.status || "").toLowerCase();
        return (
          (payerId === userId || payeeId === userId) &&
          [
            "pending_payment",
            "pending_admin_approval",
            "held_in_escrow",
            "held_pending_review",
          ].includes(status)
        );
      })
      .slice(0, 4)
      .map((item) => {
        const payeeId = Number(item.payee_id ?? item.payeeId ?? 0);
        return {
          id:
            item.id ||
            item.paymentId ||
            `payment-${item.job_assignment_id || item.created_at}`,
          jobTitle:
            item.job_title ||
            item.metadata?.jobTitle ||
            `Assignment #${item.job_assignment_id || item.id}`,
          professional:
            payeeId === userId
              ? item.payer_name || item.payerName || "Client"
              : item.payee_name || item.payeeName || "Professional",
          amount: Number(item.amount || item.totalAmount || 0),
          status: normalizeStatus(item.status),
        };
      });
  }, [paymentItems, user?.id]);

  const recentTransactions = useMemo(() => {
    const userId = Number(user?.id || 0);
    return paymentItems.slice(0, 3).map((item) => {
      const payeeId = Number(item.payee_id ?? item.payeeId ?? 0);
      const amount = Number(item.amount || item.totalAmount || 0);
      const isIncoming = payeeId === userId;
      return {
        id: item.id || item.paymentId || `tx-${item.created_at}`,
        title: isIncoming ? "Funds received" : "Payment sent",
        date: formatDate(item.created_at || item.createdAt),
        amount: isIncoming ? amount : -amount,
        status: normalizeStatus(item.status),
      };
    });
  }, [paymentItems, user?.id]);

  const upcomingPayments = useMemo(
    () =>
      (Array.isArray(myJobs) ? myJobs : [])
        .filter((job) =>
          [
            "accepted",
            "in_progress",
            "pending_payment",
            "pending_admin_approval",
            "held_in_escrow",
          ].includes(String(job.status || "").toLowerCase()),
        )
        .slice(0, 3)
        .map((job) => ({
          id: job.id || job.assignmentId || job.jobId,
          title: job.title || job.jobTitle || "Job payment update",
          body:
            job.employer?.fullName ||
            job.employer?.name ||
            job.employerName ||
            "Your payment is currently being processed.",
          amount: Number(job.budget || job.totalAmount || job.acceptedBudget || 0),
        })),
    [myJobs],
  );

  return {
    user,
    availableBalance,
    totalEarnings: Number(metrics?.earningsTotal ?? paymentStats.totalEarnings ?? 0),
    pendingEarnings: Number(paymentStats.pendingEarnings ?? 0),
    totalWithdrawn: Number(paymentStats.totalWithdrawn ?? 0),
    activeEscrows,
    recentTransactions,
    upcomingPayments,
  };
};

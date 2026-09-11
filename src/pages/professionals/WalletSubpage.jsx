import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  DollarSign,
  Wallet,
  Clock,
  X,
  Check,
} from "lucide-react";
import TopUpIcon from "../../components/icons/TopUpIcon";
import StatsCard from "../../components/ui/StatsCard";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuthStore } from "../../store/authStore";
import { greeting } from "../../utils/greeting";
import { walletService } from "../../api/services/walletService";

const formatCurrency = (amount, showSign = false) => {
  const numericAmount = Number(amount || 0);
  const absoluteValue = Math.abs(numericAmount);
  const formattedValue = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(absoluteValue)
    .replace("NGN", "₦");

  if (showSign && numericAmount > 0) return `+${formattedValue}`;
  if (showSign && numericAmount < 0) return `-${formattedValue}`;

  return formattedValue;
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status) => {
  const value = String(status || "").replace(/_/g, " ");
  const lookup = {
    "pending payment": "Pending Payment",
    "pending admin approval": "Pending Approval",
    "held in escrow": "In Escrow",
    "held pending review": "Pending Review",
    released: "Released",
    refunded: "Refunded",
    completed: "Completed",
    "in progress": "In Progress",
    accepted: "Accepted",
  };

  return lookup[value.toLowerCase()] || value;
};

const WalletSubpage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pinDigits, setPinDigits] = useState([]);
  const [employerWallet, setEmployerWallet] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const { user } = useAuthStore();
  const { metrics, myJobs, setActiveTab } = useDashboardStore();

  const userName = user?.fullName || user?.full_name || user?.name || "Samuel";
  const isEmployer = user?.role === "employer";

  useEffect(() => {
    if (user?.role !== "employer") return;

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
  }, [user?.role]);

  useEffect(() => {
    if (!user?.id) return;

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

          if (status === "released") {
            summary.totalWithdrawn += amount;
          }
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

  const walletBalance = isEmployer
    ? (employerWallet?.balance ?? paymentStats.availableBalance ?? 0)
    : (paymentStats.availableBalance ?? 0);

  const availableBalance = Number(walletBalance || 0);
  const totalEarnings = Number(
    metrics?.earningsTotal ?? paymentStats.totalEarnings ?? 0,
  );
  const pendingEarnings = Number(paymentStats.pendingEarnings ?? 0);
  const totalWithdrawn = Number(paymentStats.totalWithdrawn ?? 0);

  const formattedWalletBalance =
    availableBalance == null ? "Loading..." : formatCurrency(availableBalance);

  const activeEscrows = useMemo(() => {
    return paymentItems
      .filter((item) => {
        const userId = Number(user?.id || 0);
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
        const userId = Number(user?.id || 0);
        const payerId = Number(item.payer_id ?? item.payerId ?? 0);
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
    return paymentItems.slice(0, 3).map((item) => {
      const userId = Number(user?.id || 0);
      const payerId = Number(item.payer_id ?? item.payerId ?? 0);
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

  const upcomingPayments = useMemo(() => {
    return (Array.isArray(myJobs) ? myJobs : [])
      .filter((job) => {
        const status = String(job.status || "").toLowerCase();
        return [
          "accepted",
          "in_progress",
          "pending_payment",
          "pending_admin_approval",
          "held_in_escrow",
        ].includes(status);
      })
      .slice(0, 3)
      .map((job) => ({
        id: job.id || job.assignmentId || job.jobId,
        title: job.title || job.jobTitle || "Job payment update",
        body:
          job.employer?.fullName ||
          job.employer?.name ||
          job.employerName ||
          "Your payment is currently being processed.",
        amount: Number(
          job.budget || job.totalAmount || job.acceptedBudget || 0,
        ),
      }));
  }, [myJobs]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {greeting(new Date())} {userName}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage your earnings, withdrawals, and transaction history.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-3xl bg-[#E6F1F6]">
        <div className="p-6 bg-[#00273A] sm:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <img
            src="/white-flow-bgdesign.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-contain"
          />

          <div className="flex flex-col gap-6 w-full md:flex-row md:items-center md:justify-between relative z-10">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between w-full md:w-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs border border-white/10">
                  <span>NGN</span>
                </div>

                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="md:hidden bg-[#E8F3FF] text-[#104F84] hover:bg-[#D7E9FF] px-3.5 py-2 rounded-full text-[11px] font-semibold flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Top Up Wallet</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border border-[#D7E9FF]">
                    <TopUpIcon className="w-4 h-4 text-[#104F84]" />
                  </span>
                </button>
              </div>

              <div>
                <span className="text-xs text-sky-200 font-medium tracking-wide">
                  Total Balance
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    {showBalance ? formattedWalletBalance : "₦ ••••••••"}
                  </h1>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    {showBalance ? (
                      <EyeOff className="w-5 h-5 text-sky-200" />
                    ) : (
                      <Eye className="w-5 h-5 text-sky-200" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsWithdrawOpen(true)}
              className="hidden whitespace-nowrap md:flex bg-[#E8F3FF] text-[#104F84] hover:bg-[#D7E9FF] px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 items-center justify-center gap-3 relative z-10 cursor-pointer active:scale-95"
            >
              <span>Top Up Wallet</span>
              <span className="flex h-6 w-10 items-center justify-center rounded-2xl bg-white border border-[#D7E9FF]">
                <TopUpIcon className="w-4 h-4 text-[#104F84]" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Available Balance"
          value={formattedWalletBalance}
          icon={Wallet}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Pending Earnings"
          value={formatCurrency(pendingEarnings)}
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Total Withdrawn"
          value={formatCurrency(totalWithdrawn)}
          icon={ArrowUpRight}
          iconColor="text-[#016EA6]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E7EB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">
                Active Escrow Payments
              </h3>
            </div>

            {activeEscrows.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-[0.15em]">
                      <th className="px-4 py-3 font-semibold">Job Title</th>
                      <th className="px-4 py-3 font-semibold">Counterparty</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeEscrows.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                          {item.jobTitle}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {item.professional}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-800">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-600">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-6">
                No active escrow payments yet.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100/50">
          <h3 className="text-base font-bold text-gray-900 mb-6">
            Recent Transaction
          </h3>

          {recentTransactions.length ? (
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-gray-50/80 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#016EA6] flex items-center justify-center shrink-0">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {tx.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#016EA6]">
                      {formatCurrency(tx.amount, true)}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600 mt-1">
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No wallet activity yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 max-w-xl">
        <h3 className="text-base font-bold text-gray-900 mb-6">
          Upcoming payments
        </h3>

        {upcomingPayments.length ? (
          <div className="space-y-4">
            {upcomingPayments.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/30 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="text-[#016EA6] flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-800 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {item.body}
                  </p>
                </div>
                <div className="text-xs font-bold text-gray-700">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No upcoming payouts at the moment.
          </p>
        )}
      </div>

      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in text-gray-800">
          <div className="bg-white rounded-[32px] max-w-4xl w-full p-6 sm:p-8 relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsWithdrawOpen(false);
                setWithdrawStep(1);
                setPinDigits([]);
                setWithdrawAmount("");
              }}
              className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {withdrawStep === 1 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-[#016EA6] flex items-center justify-center shrink-0">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      Withdraw Funds
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      Transfer your available earnings to your verified bank
                      account
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Withdrawal Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                          ₦
                        </span>
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-semibold transition-all text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Transfer to
                      </label>
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0">
                            GT
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 leading-tight">
                              GT Bank
                            </h4>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                              {userName} • *****37749
                            </p>
                          </div>
                        </div>
                        <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center text-[#016EA6]">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#013554] to-[#01507B] p-5 rounded-2xl text-white relative overflow-hidden flex items-center justify-between">
                      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
                      <div className="relative z-10 space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-[9px] font-semibold border border-white/5">
                          <span>🇳🇬 NGN</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-[10px] text-sky-200/80 font-bold block">
                            Total Balance
                          </span>
                          <h3 className="text-lg font-bold tracking-tight">
                            {formattedWalletBalance}
                          </h3>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10 relative z-10">
                        <Eye className="w-5 h-5 text-sky-200" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 flex flex-col justify-between h-full min-h-[300px]">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        WITHDRAW SUMMARY
                      </h4>
                      <div className="divide-y divide-gray-100/60 text-xs">
                        <div className="flex justify-between py-3">
                          <span className="text-gray-400 font-semibold">
                            Amount
                          </span>
                          <span className="font-bold text-gray-800">
                            ₦
                            {withdrawAmount
                              ? Number(withdrawAmount).toLocaleString()
                              : "50,000"}
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-400 font-semibold">
                            Linkprosoft Fee
                          </span>
                          <span className="font-bold text-gray-800">
                            ₦2,000
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-505 font-bold">
                            You will Receive
                          </span>
                          <span className="font-black text-gray-900 text-sm">
                            ₦
                            {withdrawAmount
                              ? (Number(withdrawAmount) - 2000).toLocaleString()
                              : "48,000"}
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-400 font-semibold">
                            Estimated Arrival
                          </span>
                          <span className="font-bold text-green-500 uppercase">
                            INSTANTLY
                          </span>
                        </div>
                      </div>

                      <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100/30 flex items-start gap-2.5 mt-2">
                        <Clock className="w-4 h-4 text-[#016EA6] shrink-0 mt-0.5" />
                        <p className="text-[10px] text-sky-700 font-semibold leading-relaxed">
                          Funds will be credited to your verified bank account
                          instantly via NIP Transfer.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-6">
                      <button
                        onClick={() => setWithdrawStep(2)}
                        className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => {
                          setIsWithdrawOpen(false);
                          setWithdrawAmount("");
                        }}
                        className="w-full border border-gray-100 hover:bg-gray-50 text-gray-400 py-3 rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {withdrawStep === 2 && (
              <div className="max-w-md mx-auto py-4">
                <div className="flex flex-col items-center gap-6">
                  <div className="text-[#016EA6] flex items-center justify-center">
                    <Wallet className="w-10 h-10" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      Verify Identity
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      Transfer your available earnings to your verified bank
                      account
                    </p>
                  </div>

                  <div className="text-center mt-2">
                    <h4 className="text-sm font-bold text-gray-800">
                      Enter your PIN
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      Please enter your 4-digit security PIN to authorize this
                      transaction
                    </p>
                  </div>

                  <div className="flex gap-4 justify-center py-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${pinDigits.length > idx ? "bg-[#016EA6] border-[#016EA6]" : "border-[#016EA6]/30 bg-white"}`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[280px] pt-4 justify-items-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          if (pinDigits.length < 4) {
                            const newPin = [...pinDigits, num];
                            setPinDigits(newPin);
                            if (newPin.length === 4) {
                              setTimeout(() => setWithdrawStep(3), 400);
                            }
                          }
                        }}
                        className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold text-base text-gray-700 cursor-pointer active:scale-95 transition-transform"
                      >
                        {num}
                      </button>
                    ))}
                    <div />
                    <button
                      onClick={() => {
                        if (pinDigits.length < 4) {
                          const newPin = [...pinDigits, 0];
                          setPinDigits(newPin);
                          if (newPin.length === 4) {
                            setTimeout(() => setWithdrawStep(3), 400);
                          }
                        }
                      }}
                      className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold text-base text-gray-700 cursor-pointer active:scale-95 transition-transform"
                    >
                      0
                    </button>
                    <button
                      onClick={() => setPinDigits(pinDigits.slice(0, -1))}
                      className="w-12 h-12 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer active:scale-95 transition-transform"
                    >
                      <X className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {withdrawStep === 3 && (
              <div className="max-w-md mx-auto text-center py-6 space-y-6">
                <div className="text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-12 h-12 stroke-[3px]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-900 leading-tight">
                    ₦
                    {withdrawAmount
                      ? Number(withdrawAmount).toLocaleString()
                      : "50,000"}{" "}
                    Has Been Deposited To Your Account
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Your transaction is successfully processed.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-4 w-full max-w-[240px] mx-auto">
                  <button
                    onClick={() => {
                      setIsWithdrawOpen(false);
                      setWithdrawStep(1);
                      setPinDigits([]);
                      setWithdrawAmount("");
                    }}
                    className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Go to wallet
                  </button>
                  <button
                    onClick={() => {
                      setIsWithdrawOpen(false);
                      setWithdrawStep(1);
                      setPinDigits([]);
                      setWithdrawAmount("");
                      setActiveTab("overview");
                    }}
                    className="w-full border border-gray-100 hover:bg-gray-50 text-gray-400 py-3 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Go back home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSubpage;

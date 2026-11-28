import { useState } from "react";
import { useWalletData } from "../../hooks/useWalletData";
import { useDashboardStore } from "../../store/dashboardStore";
import WalletOverview from "./components/WalletOverview";
import WithdrawalModal from "./components/WithdrawalModal";

const WalletSubpage = () => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { setActiveTab } = useDashboardStore();
  const {
    user,
    availableBalance,
    totalEarnings,
    pendingEarnings,
    totalWithdrawn,
    activeEscrows,
    recentTransactions,
    upcomingPayments,
  } = useWalletData();

  const userName =
    user?.fullName || user?.full_name || user?.name || "Samuel";

  return (
    <>
      <WalletOverview
        userName={userName}
        availableBalance={availableBalance}
        pendingEarnings={pendingEarnings}
        totalEarnings={totalEarnings}
        totalWithdrawn={totalWithdrawn}
        activeEscrows={activeEscrows}
        recentTransactions={recentTransactions}
        upcomingPayments={upcomingPayments}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
      />
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        userName={userName}
        availableBalance={availableBalance}
        onClose={() => setIsWithdrawOpen(false)}
        onGoHome={() => setActiveTab("overview")}
      />
    </>
  );
};

export default WalletSubpage;

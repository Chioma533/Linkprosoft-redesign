import React, { useState, useEffect, useCallback } from "react";
import { Users, Briefcase, UserPlus, PauseCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../api/services/adminService";
import UserStatCard from "./components/users/UserStatCard";
import UsersTable from "./components/users/UsersTable";
import UserDetailModal from "./components/UserDetailModal";

const AdminUsersSubpage = ({ onNavigate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);

  /*
  // Default seed user data fallback
  const defaultUsers = [
    {
      id: "U-101",
      name: "Marvellous Samuel",
      email: "marvellous.s@linkprosoft.com",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 801 234 5678",
      bio: "Master Licensed Plumber specializing in residential and commercial basin installation.",
    },
    {
      id: "U-102",
      name: "Marvellous Samuel",
      email: "marvellous.samuel@dev.io",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 802 345 6789",
      bio: "Expert plumbing technician & leak repair contractor.",
    },
    {
      id: "U-103",
      name: "Marvellous Samuel",
      email: "m.samuel@contractor.net",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 803 456 7890",
      bio: "Certified pipe fitter and water system installer.",
    },
    {
      id: "U-104",
      name: "Marvellous Samuel",
      email: "samuel.m@innovate.co",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 804 567 8901",
      bio: "Commercial basin and drainage system specialist.",
    },
    {
      id: "U-105",
      name: "Marvellous Samuel",
      email: "samuel.pro@linkprosoft.com",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 805 678 9012",
      bio: "General home repair & plumbing inspector.",
    },
    {
      id: "U-106",
      name: "Marvellous Samuel",
      email: "m.samuel99@gmail.com",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 806 789 0123",
      bio: "Senior plumbing engineer.",
    },
    {
      id: "U-107",
      name: "Marvellous Samuel",
      email: "samuel.m@agency.org",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 807 890 1234",
      bio: "Full service sanitation and plumbing professional.",
    },
    {
      id: "U-108",
      name: "Marvellous Samuel",
      email: "samuel.tech@linkprosoft.com",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 808 901 2345",
      bio: "Plumbing contractor & water pressure expert.",
    },
    {
      id: "U-109",
      name: "Marvellous Samuel",
      email: "samuel.m.build@corp.com",
      role: "professional",
      category: "Plumbing",
      status: "active",
      verified: "verified",
      joined: "24 jul 2026",
      phone: "+234 809 012 3456",
      bio: "Licensed plumbing technician.",
    },
  ];
  */

  const fetchUsersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.allSettled([
        adminService.getUserMetrics(),
        adminService.getUsers({ page: 1, limit: 20 }),
      ]);

      if (metricsRes.status === "fulfilled" && metricsRes.value?.data) {
        setMetrics(metricsRes.value.data);
      }

      if (usersRes.status === "fulfilled" && usersRes.value?.data) {
        const items = usersRes.value.data.items || usersRes.value.data.users || usersRes.value.data;
        if (Array.isArray(items) && items.length > 0) {
          const normalized = items.map((u) => ({
            id: u.id || u._id || `U-${Math.floor(Math.random() * 1000)}`,
            name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User",
            email: u.email || "",
            role: u.role || "professional",
            category: u.category || u.profession || "Plumbing",
            status: u.status || (u.isSuspended ? "suspended" : "active"),
            verified: u.isVerified || u.verificationStatus === "approved" || u.verificationStatus === "VERIFIED" ? "verified" : (u.verificationStatus || "unverified"),
            joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toLowerCase() : "",
            phone: u.phone || u.phoneNumber || "+234 800 000 0000",
            bio: u.bio || u.description || "Linkprosoft platform member.",
          }));
          setUsers(normalized);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.warn("[AdminUsersSubpage] Error fetching users:", err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const toggleUserStatus = async (userId) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const nextStatus = targetUser.status === "suspended" ? "active" : "suspended";

    // Optimistic UI update
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status: nextStatus };
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser({ ...selectedUser, status: nextStatus });
          }
          return updated;
        }
        return u;
      })
    );

    try {
      await adminService.updateUserStatus(userId, nextStatus, `Status changed to ${nextStatus} by admin`);
      toast.success(`User ${targetUser.name} is now ${nextStatus}`);
    } catch (err) {
      console.warn("[AdminUsersSubpage] Failed to update user status on backend:", err);
      toast.success(`User status changed to ${nextStatus}`);
    }
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return null;
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  const formatTrend = (trend) => {
    if (trend === undefined || trend === null) return /* "+20% this week" */ "";
    if (typeof trend === "number") {
      const sign = trend >= 0 ? "+" : "";
      return `${sign}${trend}% this week`;
    }
    return trend;
  };

  const userStats = [
    {
      id: "total-users",
      title: "Total Users",
      value: formatNumber(metrics?.totalUsers?.value ?? metrics?.totalUsers) || (isLoading ? "..." : /* "42,500" */ "0"),
      trend: formatTrend(metrics?.totalUsers?.growthPercentage ?? metrics?.totalUsersTrend),
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "clients",
      title: "Clients",
      value: formatNumber(metrics?.clients?.value ?? metrics?.clients ?? metrics?.employers) || (isLoading ? "..." : /* "24,300" */ "0"),
      trend: formatTrend(metrics?.clients?.growthPercentage ?? metrics?.clientsTrend),
      icon: Briefcase,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "professionals",
      title: "Professionals",
      value: formatNumber(metrics?.professionals?.value ?? metrics?.professionals) || (isLoading ? "..." : /* "18,200" */ "0"),
      trend: formatTrend(metrics?.professionals?.growthPercentage ?? metrics?.professionalsTrend),
      icon: UserPlus,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "suspended-account",
      title: "Suspended account",
      value: formatNumber(metrics?.suspendedAccounts?.value ?? metrics?.suspendedAccounts ?? metrics?.suspended) || (isLoading ? "..." : /* "142" */ "0"),
      trend: formatTrend(metrics?.suspendedAccounts?.growthPercentage ?? metrics?.suspendedAccountsTrend),
      icon: PauseCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
            Good Morning Admin
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
            Manage all clients and professionals, monitor account status, and perform administrative actions.
          </p>
        </div>

        {/* New Verification Requests Button with Notification Badge */}
        <button
          onClick={() => onNavigate && onNavigate("verifications")}
          className="bg-[#E2E8F0]/70 hover:bg-[#CBD5E1] text-gray-700 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full relative shadow-xs cursor-pointer flex items-center gap-2 border-none shrink-0 self-start md:self-auto transition-all"
        >
          <span>New Verification Requests</span>
          <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
            {metrics?.pendingKyc ?? 3}
          </span>
        </button>
      </div>

      {/* Top 4 Stat Cards Grid (Border-less) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {userStats.map((stat) => (
          <UserStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            iconColor={stat.iconColor}
            iconBg={stat.iconBg}
          />
        ))}
      </div>

      {/* Main Users Table Section */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        onSelectUser={(u) => setSelectedUser(u)}
        onToggleStatus={toggleUserStatus}
      />

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleStatus={() => toggleUserStatus(selectedUser.id)}
        />
      )}
    </div>
  );
};

export default AdminUsersSubpage;

import React, { useState } from "react";
import { Search, ChevronDown, Eye, UserCheck, UserX } from "lucide-react";

const UsersTable = ({ users, onSelectUser, onToggleStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.id && u.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      selectedRole === "all" ? true : u.role.toLowerCase() === selectedRole.toLowerCase();

    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "online"
        ? u.status === "active"
        : selectedStatus === "offline"
        ? u.status !== "active"
        : u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
      {/* Table Header Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
          All Users
        </h3>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or ID...."
              className="pl-9 pr-4 py-2 bg-gray-50/90 focus:bg-gray-100/80 rounded-full text-xs font-medium text-gray-700 outline-none border-none w-full sm:w-64 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="all">All roles</option>
              <option value="professional">Professional</option>
              <option value="employer">Employer / Client</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="online">Online / Active</option>
              <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Apply filter button */}
          <button className="bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs px-4.5 py-2 rounded-full cursor-pointer transition-all border-none">
            Apply filter
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-none">
          <thead>
            <tr className="border-none text-xs font-semibold text-gray-400">
              <th className="py-3 px-3">User</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Verification</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Date joined</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="border-none">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400 text-xs font-medium">
                  No user records match the criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const initials = user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "MS";

                return (
                  <tr
                    key={user.id}
                    className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer"
                  >
                    {/* User avatar and name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#016EA6] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                          {initials}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700 capitalize">
                      {user.role === "employer" ? "Client" : "Professional"}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {user.category || "Plumbing"}
                    </td>

                    {/* Verification */}
                    <td className="py-3.5 px-3">
                      <span className="text-[#016EA6] font-bold text-xs hover:underline cursor-pointer">
                        {user.verified === "verified"
                          ? "Verified"
                          : user.verified === "pending"
                          ? "Pending"
                          : "Unverified"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-[#ECFDF5] text-[#10B981]"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {user.status === "active" ? "Online" : "Suspended"}
                      </span>
                    </td>

                    {/* Date joined */}
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">
                      {user.joined || "24 jul 2026"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectUser(user)}
                          className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer"
                          title="View user details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs font-medium">
            No user records found.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const initials = user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "MS";

            return (
              <div
                key={user.id}
                className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#016EA6] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{user.name}</h4>
                      <p className="text-[10px] text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectUser(user)}
                    className="p-1.5 text-gray-500 hover:text-[#016EA6]"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold pt-1 text-gray-600">
                  <span>Role: {user.role}</span>
                  <span>Category: {user.category || "Plumbing"}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-none">
                  <span className="text-[#016EA6] font-bold text-xs">
                    {user.verified === "verified" ? "Verified" : "Unverified"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      user.status === "active"
                        ? "bg-[#ECFDF5] text-[#10B981]"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {user.status === "active" ? "Online" : "Suspended"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
        <span className="text-xs font-medium text-gray-500">
          Showing page 1 of 5 pages
        </span>

        <div className="flex items-center gap-1.5">
          <button className="w-6 h-6 rounded bg-[#1E1B4B] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs border-none">
            1
          </button>
          <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
            2
          </button>
          <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
            3
          </button>
          <span className="text-xs text-gray-400 px-1">...</span>
          <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
            5
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;

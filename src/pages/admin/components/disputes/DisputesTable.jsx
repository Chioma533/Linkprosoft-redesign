import { ChevronDown, Eye, Loader2, Search } from "lucide-react";

const statusClass = (status) =>
  status === "open"
    ? "bg-[#FFF4E5] text-[#FF9800]"
    : status === "resolved"
      ? "bg-[#E6F9F0] text-[#00CC66]"
      : "bg-[#E6F4FA] text-[#016EA6]";

const DisputesTable = ({
  disputes,
  isLoading,
  searchQuery,
  raisedByFilter,
  statusFilter,
  onSearchChange,
  onRaisedByChange,
  onStatusChange,
  onView,
}) => (
  <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
        Disputes
      </h3>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, email or ID...."
            className="pl-9 pr-4 py-2 bg-gray-50/90 focus:bg-gray-100/80 rounded-full text-xs font-medium text-gray-700 outline-none border-none w-full sm:w-64 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={raisedByFilter}
            onChange={(event) => onRaisedByChange(event.target.value)}
            className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">Raised by : All</option>
            <option value="client">Raised by : Client</option>
            <option value="professional">Raised by : Professional</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>

    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-none">
        <thead>
          <tr className="border-none text-xs font-semibold text-gray-400">
            {["Dispute", "Job", "Raised by", "Against", "Amount", "Reason", "Status", "Date posted", "View"].map(
              (heading) => (
                <th
                  key={heading}
                  className={`py-3.5 px-3 ${heading === "View" ? "text-right" : ""}`}
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="border-none">
          {isLoading ? (
            <tr>
              <td colSpan="9" className="text-center py-12 text-gray-400 text-xs font-medium">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#016EA6]" />
                  <span>Loading marketplace disputes...</span>
                </div>
              </td>
            </tr>
          ) : disputes.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-12 text-gray-400 text-xs font-medium">
                No disputes match the specified criteria.
              </td>
            </tr>
          ) : (
            disputes.map((dispute) => (
              <tr
                key={dispute.rawId}
                className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer"
              >
                <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-gray-800">{dispute.id}</td>
                <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{dispute.jobTitle}</td>
                <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{dispute.raisedBy}</td>
                <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{dispute.against}</td>
                <td className="py-3.5 px-3 text-xs sm:text-sm font-extrabold text-gray-900">{dispute.amount}</td>
                <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">{dispute.reason}</td>
                <td className="py-3.5 px-3">
                  <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${statusClass(dispute.status)}`}>
                    {dispute.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">{dispute.date}</td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => onView(dispute)}
                    className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none"
                    title="View dispute details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="md:hidden space-y-3">
      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-xs font-medium flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#016EA6]" />
          <span>Loading disputes...</span>
        </div>
      ) : disputes.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-xs font-medium">
          No disputes found.
        </div>
      ) : (
        disputes.map((dispute) => (
          <div key={dispute.rawId} className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800 text-sm">{dispute.id} - {dispute.jobTitle}</h4>
              <button
                onClick={() => onView(dispute)}
                className="p-1 text-gray-500 hover:text-[#016EA6]"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
              <span>Raised: {dispute.raisedBy}</span>
              <span>Against: {dispute.against}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-extrabold text-gray-900 text-sm">{dispute.amount}</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusClass(dispute.status)}`}>
                {dispute.statusText}
              </span>
            </div>
          </div>
        ))
      )}
    </div>

    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
      <span className="text-xs font-medium text-gray-500">
        Showing page 1 of 5 pages
      </span>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-6 h-6 rounded text-xs font-semibold flex items-center justify-center cursor-pointer border-none ${
              page === 1
                ? "bg-[#1E1B4B] text-white shadow-xs"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            {page}
          </button>
        ))}
        <span className="text-xs text-gray-400 px-1">...</span>
        <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
          5
        </button>
      </div>
    </div>
  </div>
);

export default DisputesTable;

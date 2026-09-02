import React, { useState } from "react";
import { ArrowUpRight, Settings, Pencil, Wrench, Wallet, Percent, Banknote } from "lucide-react";
import { toast } from "react-hot-toast";

const FinanceCommissionTab = () => {
  const [commissionRate, setCommissionRate] = useState("10");
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [tieredCommission, setTieredCommission] = useState(true);

  /*
  const categories = [
    { id: 1, name: "Plumbing", rate: "10%" },
    { id: 2, name: "Plumbing", rate: "10%" },
    { id: 3, name: "Plumbing", rate: "10%" },
  ];
  */
  const categories = [];

  const handleSaveRate = () => {
    setIsEditingRate(false);
    toast.success(`Standard platform commission updated to ${commissionRate}%`);
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center justify-between border-none shadow-xs relative overflow-hidden">
          <div>
            <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight block">
              Total Commission Earned
            </span>
            <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block mt-2 mb-1">
              {/* "₦42.8M" */}
              ₦0
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{/* "+20% this week" */ ""}</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-gray-300 shrink-0">
            <Wallet className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center justify-between border-none shadow-xs relative overflow-hidden">
          <div>
            <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight block">
              Total Refund
            </span>
            <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block mt-2 mb-1">
              {/* "₦860,000" */}
              ₦0
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{/* "+20% this week" */ ""}</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-gray-300 shrink-0">
            <Banknote className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center justify-between border-none shadow-xs relative overflow-hidden">
          <div>
            <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight block">
              Average Commission
            </span>
            <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block mt-2 mb-1">
              {/* "₦860,000" */}
              ₦0
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{/* "+20% this week" */ ""}</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-gray-300 shrink-0">
            <Percent className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Settings vs Category based Percentage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Settings Card (Left ~35%) */}
        <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-gray-900">
            <Settings className="w-4 h-4 text-[#016EA6]" />
            <h3 className="font-extrabold text-base tracking-tight">Settings</h3>
          </div>

          {/* Standard Platform Commission */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700">Standard Platform Commission</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50/90 rounded-2xl px-4 py-3 flex items-center justify-between">
                {isEditingRate ? (
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-16 bg-white text-sm font-extrabold text-gray-900 outline-none px-2 py-0.5 rounded border border-[#016EA6]"
                    autoFocus
                  />
                ) : (
                  <span className="text-base font-extrabold text-gray-900">{commissionRate}</span>
                )}
                <span className="text-xs font-bold text-[#016EA6]">%</span>
              </div>
              <button
                onClick={() => {
                  if (isEditingRate) {
                    handleSaveRate();
                  } else {
                    setIsEditingRate(true);
                  }
                }}
                className="p-3 bg-blue-50 text-[#016EA6] hover:bg-blue-100 rounded-2xl transition-colors cursor-pointer border-none"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
              Applied to all categories without specific overrides.
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Automatic Payouts</span>
              <button
                onClick={() => setAutoPayouts(!autoPayouts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer border-none ${
                  autoPayouts ? "bg-[#016EA6]" : "bg-gray-200"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoPayouts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Tiered Commission</span>
              <button
                onClick={() => setTieredCommission(!tieredCommission)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer border-none ${
                  tieredCommission ? "bg-[#016EA6]" : "bg-gray-200"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    tieredCommission ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Category Based Percentage Card (Right ~65%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-none shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base tracking-tight">
              Category based Percentage
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Custom percentage overrides by service type.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-none">
              <thead>
                <tr className="bg-gray-50/70 rounded-xl text-xs font-semibold text-gray-500">
                  <th className="py-3 px-4 rounded-l-xl">Service Category</th>
                  <th className="py-3 px-4">Current Rate</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="border-none">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-400 text-xs font-medium">
                      No custom category percentage overrides configured.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-none hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold text-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-blue-50 text-[#016EA6] rounded-lg">
                            <Wrench className="w-3.5 h-3.5" />
                          </div>
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#E6F9F0] text-[#00CC66]">
                          {cat.rate}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
      </div>
    </div>
  );
};

export default FinanceCommissionTab;

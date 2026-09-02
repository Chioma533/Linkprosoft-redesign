import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { adminService } from "../../../../api/services/adminService";

const RevenueEscrowWaveChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const periods = ["This year", "Last 6 months", "This quarter", "All time"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const periodToParam = {
    "This year": "1y",
    "Last 6 months": "90d",
    "This quarter": "30d",
    "All time": "all",
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const param = periodToParam[selectedPeriod] || "30d";
        const response = await adminService.getRevenueEscrowChart(param);
        if (response?.data) {
          setChartData(response.data);
        }
      } catch (err) {
        console.warn("[RevenueEscrowWaveChart] Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [selectedPeriod]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-tight">
          Platform Revenue &amp; Escrow Activity
        </h3>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50/80 hover:bg-gray-100 text-xs font-semibold text-gray-600 transition-colors cursor-pointer"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-150 rounded-2xl p-1.5 shadow-lg z-30 space-y-0.5">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                      selectedPeriod === p 
                        ? "bg-blue-50 text-[#016EA6]" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Responsive Wave Chart Graphic */}
      <div className="w-full flex-1 min-h-[160px] sm:min-h-[190px] flex flex-col justify-end mt-2 relative">
        <div className="w-full h-36 sm:h-44 relative">
          <svg
            viewBox="0 0 700 180"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Soft wave area fill gradient */}
              <linearGradient id="waveGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#016EA6" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#016EA6" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#016EA6" stopOpacity="0.00" />
              </linearGradient>

              {/* Vertical pillar capsule gradient */}
              <linearGradient id="pillarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CBE8F5" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#E2F2FA" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#F4FAFD" stopOpacity="0.2" />
              </linearGradient>

              {/* 3D Oval Cap gradient */}
              <linearGradient id="ovalCapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B9ECF" />
                <stop offset="100%" stopColor="#58B8E6" />
              </linearGradient>

              <linearGradient id="ovalInnerGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6BC4EE" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3193C3" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Vertical Highlight Pillar behind May peak */}
            <rect
              x="275"
              y="18"
              width="68"
              height="150"
              rx="18"
              fill="url(#pillarGradient)"
            />

            {/* 3D Oval Cap atop the May pillar */}
            <g transform="translate(309, 32)">
              {/* Outer shadow base */}
              <ellipse cx="0" cy="1" rx="18" ry="7" fill="#2478A5" opacity="0.35" />
              {/* Main 3D disc */}
              <ellipse cx="0" cy="0" rx="17" ry="6.5" fill="url(#ovalCapGradient)" />
              {/* Inner highlight oval */}
              <ellipse cx="0" cy="-0.5" rx="12" ry="4" fill="url(#ovalInnerGlow)" />
            </g>

            {/* Area Fill path under the wave curve */}
            <path
              d="M 0 85 
                 C 80 75, 140 105, 200 100 
                 C 250 95, 270 50, 310 40 
                 C 350 32, 380 90, 440 75 
                 C 500 60, 560 30, 620 50 
                 C 660 65, 680 75, 700 80 
                 L 700 180 L 0 180 Z"
              fill="url(#waveGradientFill)"
            />

            {/* Smooth main stroke line */}
            <path
              d="M 0 85 
                 C 80 75, 140 105, 200 100 
                 C 250 95, 270 50, 310 40 
                 C 350 32, 380 90, 440 75 
                 C 500 60, 560 30, 620 50 
                 C 660 65, 680 75, 700 80"
              fill="none"
              stroke="#016EA6"
              strokeWidth="2.75"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* X-Axis Month Badges */}
        <div className="flex items-center justify-between pt-3 px-1 text-[11px] font-semibold text-gray-400">
          {months.map((month) => {
            const isMay = month === "May";
            return isMay ? (
              <span
                key={month}
                className="bg-[#016EA6] text-white px-3 py-1 rounded-full font-bold text-[11px] shadow-xs select-none"
              >
                {month}
              </span>
            ) : (
              <span key={month} className="hover:text-gray-600 transition-colors select-none">
                {month}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueEscrowWaveChart;

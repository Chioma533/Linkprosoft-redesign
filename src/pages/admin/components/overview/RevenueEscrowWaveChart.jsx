import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { adminService } from "../../../../api/services/adminService";

const RevenueEscrowWaveChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const periods = ["This year", "Last 6 months", "This quarter", "All time"];

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
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.warn("[RevenueEscrowWaveChart] Fetch error:", err);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [selectedPeriod]);

  const rawPoints = Array.isArray(chartData)
    ? chartData
    : chartData?.items || chartData?.series || chartData?.points || [];

  const normalizedPoints = rawPoints.map((pt, idx) => {
    const rawLabel = pt.label || pt.month || pt.date || `${idx + 1}`;
    let label = String(rawLabel);
    if (pt.date && !pt.label && !pt.month) {
      const parsed = new Date(pt.date);
      if (!Number.isNaN(parsed.getTime())) {
        label = parsed.toLocaleDateString("en-US", { month: "short", day: rawPoints.length > 12 ? "numeric" : undefined });
      }
    }
    const value = Number(pt.netRevenue ?? pt.revenue ?? pt.grossVolume ?? pt.escrow ?? pt.amount ?? pt.value ?? 0);
    return { label, value: Number.isFinite(value) ? value : 0 };
  });

  const maxVal = Math.max(...normalizedPoints.map((p) => p.value), 1);
  const svgWidth = 700;
  const svgHeight = 180;
  const topPad = 32;
  const bottomPad = 160;
  const coords = normalizedPoints.map((p, idx) => {
    const x = normalizedPoints.length <= 1 ? svgWidth / 2 : (idx / (normalizedPoints.length - 1)) * svgWidth;
    const y = bottomPad - (p.value / maxVal) * (bottomPad - topPad);
    return { x, y, ...p };
  });

  const buildSmoothPath = (pts) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M 0 ${pts[0].y} L ${svgWidth} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(coords);
  const areaPath = linePath ? `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z` : "";
  const peakPoint = coords.reduce((best, pt) => (pt.value > (best?.value ?? -1) ? pt : best), null);

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
        {isLoading ? (
          <div className="w-full h-36 sm:h-44 flex items-center justify-center text-gray-400 text-xs font-medium gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#016EA6]" />
            <span>Loading revenue activity...</span>
          </div>
        ) : coords.length === 0 ? (
          <div className="w-full h-36 sm:h-44 flex items-center justify-center text-gray-400 text-xs font-medium">
            No revenue activity recorded for this period.
          </div>
        ) : (
          <>
            <div className="w-full h-36 sm:h-44 relative">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="waveGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#016EA6" stopOpacity="0.22" />
                    <stop offset="60%" stopColor="#016EA6" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#016EA6" stopOpacity="0.00" />
                  </linearGradient>

                  <linearGradient id="pillarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CBE8F5" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#E2F2FA" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#F4FAFD" stopOpacity="0.2" />
                  </linearGradient>

                  <linearGradient id="ovalCapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B9ECF" />
                    <stop offset="100%" stopColor="#58B8E6" />
                  </linearGradient>

                  <linearGradient id="ovalInnerGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6BC4EE" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3193C3" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {peakPoint && (
                  <>
                    <rect
                      x={Math.max(0, Math.min(svgWidth - 68, peakPoint.x - 34))}
                      y={Math.max(8, peakPoint.y - 22)}
                      width="68"
                      height={Math.max(40, svgHeight - Math.max(8, peakPoint.y - 22) - 12)}
                      rx="18"
                      fill="url(#pillarGradient)"
                    />
                    <g transform={`translate(${peakPoint.x}, ${Math.max(14, peakPoint.y - 8)})`}>
                      <ellipse cx="0" cy="1" rx="18" ry="7" fill="#2478A5" opacity="0.35" />
                      <ellipse cx="0" cy="0" rx="17" ry="6.5" fill="url(#ovalCapGradient)" />
                      <ellipse cx="0" cy="-0.5" rx="12" ry="4" fill="url(#ovalInnerGlow)" />
                    </g>
                  </>
                )}

                {areaPath && <path d={areaPath} fill="url(#waveGradientFill)" />}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#016EA6"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex items-center justify-between pt-3 px-1 text-[11px] font-semibold text-gray-400">
              {coords.map((pt, idx) => {
                const isPeak = peakPoint && pt.label === peakPoint.label && pt.value === peakPoint.value;
                return isPeak ? (
                  <span
                    key={`${pt.label}-${idx}`}
                    className="bg-[#016EA6] text-white px-3 py-1 rounded-full font-bold text-[11px] shadow-xs select-none"
                  >
                    {pt.label}
                  </span>
                ) : (
                  <span key={`${pt.label}-${idx}`} className="hover:text-gray-600 transition-colors select-none">
                    {pt.label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueEscrowWaveChart;

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CalendarWidget = ({ onSelectDate, selectedDate = "2026-07-02" }) => {
  // Hardcoded to July 2026 for screenshot perfect representation, but supports basic day selections
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed: 6)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["m", "t", "w", "t", "f", "s", "s"];

  // Days matrix for July 2026
  // July 2026 starts on a Wednesday. So Mon=29, Tue=30 from previous month (represented as greyed out or placeholder)
  const julyDays = [
    { day: 29, currentMonth: false, dateStr: "2026-06-29" },
    { day: 30, currentMonth: false, dateStr: "2026-06-30" },
    { day: 1, currentMonth: true, dateStr: "2026-07-01" },
    { day: 2, currentMonth: true, dateStr: "2026-07-02" }, // Selected day in screenshot
    { day: 3, currentMonth: true, dateStr: "2026-07-03" },
    { day: 4, currentMonth: true, dateStr: "2026-07-04" },
    { day: 5, currentMonth: true, dateStr: "2026-07-05" },
    { day: 6, currentMonth: true, dateStr: "2026-07-06" },
    { day: 7, currentMonth: true, dateStr: "2026-07-07" },
    { day: 8, currentMonth: true, dateStr: "2026-07-08" },
    { day: 9, currentMonth: true, dateStr: "2026-07-09" },
    { day: 10, currentMonth: true, dateStr: "2026-07-10" },
    { day: 11, currentMonth: true, dateStr: "2026-07-11" },
    { day: 12, currentMonth: true, dateStr: "2026-07-12" },
    { day: 13, currentMonth: true, dateStr: "2026-07-13" },
    { day: 14, currentMonth: true, dateStr: "2026-07-14" },
    { day: 15, currentMonth: true, dateStr: "2026-07-15" },
    { day: 16, currentMonth: true, dateStr: "2026-07-16" },
    { day: 17, currentMonth: true, dateStr: "2026-07-17" },
    { day: 18, currentMonth: true, dateStr: "2026-07-18" },
    { day: 19, currentMonth: true, dateStr: "2026-07-19" },
    { day: 20, currentMonth: true, dateStr: "2026-07-20" },
    { day: 21, currentMonth: true, dateStr: "2026-07-21" },
    { day: 22, currentMonth: true, dateStr: "2026-07-22" },
    { day: 23, currentMonth: true, dateStr: "2026-07-23" },
    { day: 24, currentMonth: true, dateStr: "2026-07-24" },
    { day: 25, currentMonth: true, dateStr: "2026-07-25" },
    { day: 26, currentMonth: true, dateStr: "2026-07-26" },
    { day: 27, currentMonth: true, dateStr: "2026-07-27" },
    { day: 28, currentMonth: true, dateStr: "2026-07-28" },
    { day: 29, currentMonth: true, dateStr: "2026-07-29" },
    { day: 30, currentMonth: true, dateStr: "2026-07-30" },
    { day: 31, currentMonth: true, dateStr: "2026-07-31" },
    { day: 1, currentMonth: false, dateStr: "2026-08-01" },
    { day: 2, currentMonth: false, dateStr: "2026-08-02" }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100/50  w-full max-w-sm">
      {/* Month Year Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-gray-900 text-sm">
          {monthNames[currentMonth]} {currentYear}
        </h4>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-y-3 justify-items-center mb-4 text-center">
        {daysOfWeek.map((day, idx) => (
          <span key={idx} className="text-xs font-semibold text-gray-400 uppercase leading-none">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 justify-items-center text-center">
        {julyDays.map((item, idx) => {
          const isSelected = item.dateStr === selectedDate;
          return (
            <button
              key={idx}
              onClick={() => item.currentMonth && onSelectDate(item.dateStr)}
              disabled={!item.currentMonth}
              className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-full transition-all cursor-pointer ${isSelected
                ? "bg-[#016EA6] text-white "
                : item.currentMonth
                  ? "text-gray-700 "
                  : "text-gray-300"
                }`}
            >
              {String(item.day).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;

import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysOfWeek = ["m", "t", "w", "t", "f", "s", "s"];

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CalendarWidget = ({ onSelectDate, selectedDate, activeDates = [] }) => {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    return new Date();
  });

  useEffect(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-").map(Number);
      setVisibleMonth(new Date(year, month - 1, 1));
    }
  }, [selectedDate]);

  const monthStart = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const monthEnd = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  );
  const startOffset = (monthStart.getDay() + 6) % 7;

  const calendarDays = useMemo(() => {
    const days = [];
    const firstVisibleDate = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1 - startOffset,
    );

    for (let i = 0; i < 42; i += 1) {
      const date = new Date(firstVisibleDate);
      date.setDate(firstVisibleDate.getDate() + i);

      days.push({
        date,
        dateStr: toDateInputValue(date),
        currentMonth: date.getMonth() === visibleMonth.getMonth(),
      });
    }

    return days;
  }, [startOffset, visibleMonth]);

  const activeDateSet = new Set(activeDates);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100/50 w-full max-w-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-gray-900 text-sm">
          {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() - 1,
                  1,
                ),
              )
            }
            className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() + 1,
                  1,
                ),
              )
            }
            className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-3 justify-items-center mb-4 text-center">
        {daysOfWeek.map((day, idx) => (
          <span
            key={idx}
            className="text-xs font-semibold text-gray-400 uppercase leading-none"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 justify-items-center text-center">
        {calendarDays.map(({ date, dateStr, currentMonth }, idx) => {
          const isSelected = dateStr === selectedDate;
          const hasSchedule = activeDateSet.has(dateStr);

          return (
            <button
              key={`${dateStr}-${idx}`}
              type="button"
              onClick={() => {
                if (!currentMonth) {
                  setVisibleMonth(
                    new Date(date.getFullYear(), date.getMonth(), 1),
                  );
                }

                onSelectDate(dateStr);
              }}
              className={`relative w-9 h-9 flex items-center justify-center text-xs font-bold rounded-full transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#016EA6] text-white shadow-sm"
                  : currentMonth
                    ? "text-gray-700 hover:bg-gray-50"
                    : "text-gray-300"
              }`}
            >
              <span>{String(date.getDate()).padStart(2, "0")}</span>
              {hasSchedule && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#016EA6]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;

import React from "react";

const PRIMARY = "#016EA6";

const StepBar = ({ total, current }) => (
  <div className="flex items-center gap-2 mb-5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="h-1.5 rounded-full transition-all duration-500"
        style={{
          flex: 1,
          backgroundColor: i < current ? PRIMARY : "#d1d5db",
        }}
      />
    ))}
  </div>
);

export default StepBar;

import React from "react";

const ToggleOffIcon = ({ color = "currentColor", size = 24, className, style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ color, ...style }}
    {...props}
  >
    <path
      d="M16.625 10.5C16.625 11.9498 15.4497 13.125 14 13.125C12.5503 13.125 11.375 11.9498 11.375 10.5C11.375 9.05021 12.5503 7.875 14 7.875C15.4497 7.875 16.625 9.05021 16.625 10.5Z"
      stroke="currentColor"
      strokeWidth="1.3125"
    />
    <path
      d="M14 5.25H7C4.1005 5.25 1.75 7.6005 1.75 10.5C1.75 13.3995 4.1005 15.75 7 15.75H14C16.8995 15.75 19.25 13.3995 19.25 10.5C19.25 7.6005 16.8995 5.25 14 5.25Z"
      stroke="currentColor"
      strokeWidth="1.3125"
    />
  </svg>
);

export default ToggleOffIcon;

import React from "react";

const BorderFullIcon = ({ color = "currentColor", size = 24, className, style, ...props }) => (
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
      d="M2.625 9.625C2.625 6.34399 2.625 4.70347 3.46055 3.55344C3.7304 3.18202 4.05702 2.8554 4.42844 2.58555C5.57847 1.75 7.21899 1.75 10.5 1.75C13.781 1.75 15.4215 1.75 16.5715 2.58555C16.943 2.8554 17.2696 3.18202 17.5395 3.55344C18.375 4.70347 18.375 6.34399 18.375 9.625V11.375C18.375 14.656 18.375 16.2965 17.5395 17.4465C17.2696 17.818 16.943 18.1446 16.5715 18.4145C15.4215 19.25 13.781 19.25 10.5 19.25C7.21899 19.25 5.57847 19.25 4.42844 18.4145C4.05702 18.1446 3.7304 17.818 3.46055 17.4465C2.625 16.2965 2.625 14.656 2.625 11.375V9.625Z"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.125 8.3125H6.125M8.75 12.6875H6.125"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BorderFullIcon;

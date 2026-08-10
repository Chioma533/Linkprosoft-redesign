import React from "react";

const InformationCircleIcon = ({ color = "currentColor", size = 24, className, style, ...props }) => (
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
      d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 14V10.5"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6094 7.21875H10.5M10.7188 7.21875C10.7188 7.09794 10.6208 7 10.5 7C10.3792 7 10.2812 7.09794 10.2812 7.21875C10.2812 7.33956 10.3792 7.4375 10.5 7.4375C10.6208 7.4375 10.7188 7.33956 10.7188 7.21875Z"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InformationCircleIcon;

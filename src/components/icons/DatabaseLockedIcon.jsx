import React from "react";

const DatabaseLockedIcon = ({ color = "currentColor", size = 24, className, style, ...props }) => (
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
      d="M9.62496 7C13.491 7 16.625 5.82474 16.625 4.375C16.625 2.92525 13.491 1.75 9.62496 1.75C5.759 1.75 2.625 2.92525 2.625 4.375C2.625 5.82474 5.759 7 9.62496 7Z"
      stroke="currentColor"
      strokeWidth="1.3125"
    />
    <path
      d="M5.25 9.49219C5.77638 9.65039 6.36505 9.78076 7 9.8771"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
    />
    <path
      d="M9.62496 13.125C5.759 13.125 2.625 11.9498 2.625 10.5"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
    />
    <path
      d="M5.25 15.6172C5.77638 15.7754 6.36505 15.9058 7 16.0021"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
    />
    <path
      d="M9.62496 19.25C5.759 19.25 2.625 18.0748 2.625 16.625V4.375M16.625 4.375V9.18753"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.7733 14.3299C13.7733 14.2774 13.7806 13.608 13.7817 13.2279C13.7829 12.8806 13.7523 12.5457 13.9182 12.2393C14.5398 11.0029 16.3248 11.1288 16.7658 12.3883C16.8423 12.5957 16.8468 12.9243 16.8446 13.2279C16.8418 13.6158 16.8498 14.3299 16.8498 14.3299M13.7733 14.3299C12.8285 14.3299 12.44 15.0121 12.335 15.432C12.23 15.8518 12.23 17.3736 12.293 18.0033C12.5029 18.7905 13.0278 19.1159 13.5422 19.2208C14.0146 19.2628 16.0093 19.2471 16.5867 19.2471C17.4265 19.2628 18.0564 18.948 18.3189 18.0033C18.3714 17.6885 18.4239 15.9567 18.2926 15.432C18.0144 14.5923 17.3747 14.3299 16.8498 14.3299M13.7733 14.3299H16.8498"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
    />
  </svg>
);

export default DatabaseLockedIcon;

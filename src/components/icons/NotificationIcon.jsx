import React from "react";

const NotificationIcon = ({ color = "currentColor", size = 24, className, style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ color, ...style }}
    {...props}
  >
    <path
      d="M14.2498 16.5547C14.2498 18.3323 12.8087 19.7733 11.0311 19.7733C9.25353 19.7733 7.8125 18.3323 7.8125 16.5547"
      stroke="currentColor"
      strokeWidth="1.37941"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.6841 16.5586H4.38448C3.4861 16.5586 2.75781 15.8303 2.75781 14.9319C2.75781 14.5005 2.92919 14.0868 3.23425 13.7817L3.78899 13.227C4.30637 12.7096 4.59703 12.0078 4.59703 11.2762V8.74194C4.59703 5.18675 7.47909 2.30469 11.0343 2.30469C14.5895 2.30469 17.4715 5.18674 17.4715 8.74194V11.2762C17.4715 12.0078 17.7622 12.7096 18.2796 13.227L18.8343 13.7817C19.1393 14.0868 19.3108 14.5005 19.3108 14.9319C19.3108 15.8303 18.5824 16.5586 17.6841 16.5586Z"
      stroke="currentColor"
      strokeWidth="1.37941"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default NotificationIcon;

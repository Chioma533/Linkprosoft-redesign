import React, { useState } from "react";

const Avatar = ({
  name,
  avatar,
  imageClassName = "w-10 h-10 rounded-full object-cover",
  fallbackClassName = "w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-xs text-gray-700",
  fallback,
}) => {
  const [failedSource, setFailedSource] = useState(null);

  if (avatar && failedSource !== avatar) {
    return (
      <img
        src={avatar}
        alt={name || ""}
        className={imageClassName}
        onError={() => setFailedSource(avatar)}
      />
    );
  }

  if (fallback !== undefined) return fallback;

  return (
    <div className={fallbackClassName}>
      {name?.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default Avatar;
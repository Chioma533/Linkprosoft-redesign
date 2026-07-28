import React from 'react'
import {getStatusStyle} from '../../utils/status';

const StatusBadge = ({
    status,
    type = "job", // default type is "job"
    className = "",
}) => {

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${getStatusStyle(
        type,
        status,
      )} ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge
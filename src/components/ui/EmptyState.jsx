import React from 'react'

const EmptyState = ({title=""}) => {
  return (
    <div className="col-span-full bg-white p-8 text-center border border-gray-100 rounded-3xl">
        <p className="text-sm font-semibold text-gray-400">
              {title}
            </p>
    </div>
  )
}

export default EmptyState
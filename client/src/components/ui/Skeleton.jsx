import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ width = 'w-full', height = 'h-4', rounded = 'rounded', className = '' }) => {
  return (
    <div
      className={clsx(
        'bg-gray-300 animate-pulse',
        width,
        height,
        rounded,
        className
      )}
    />
  );
};

export default Skeleton;
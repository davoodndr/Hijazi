import clsx from 'clsx';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { FaStar } from "react-icons/fa";

function StarRatingComponent({
  value = 0,
  maxStars = 5,
  starSize = 5,
  showPercentage = false,
  showValue = false,
  starClass = '',
  onClick = () => {},
  editable = false
}){
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const fill = hover !== null ? hover : rating;
  const percentage = Math.round((fill / maxStars) * 100);

  useEffect(() => {
    setRating(value)
  },[value])

  useEffect(() => {
    onClick(rating)
  },[rating])

  return (
    <div className='flex items-center space-x-2'>
      <div className="inline-flex space-x-0.25">
        {[...Array(maxStars)].map((_, i) => {

          const full = i + 1 <= fill;
          const partial = i < fill && i + 1 > fill;
          const percent =
            partial ? Math.round((fill - i) * 100) : full ? 100 : 0;
          
          return (
            <div
            key={i}
              onMouseEnter={() => {
                if(editable) setHover(i + 1)
              }}
              onMouseLeave={() => {
                if(editable) setHover(null)
              }}
              onClick={() => {
                if(editable) setRating(i + 1)
              }}
              className={clsx(`relative text-gray-300 focus:outline-none ${starClass}`,
                editable && 'cursor-pointer'
              )}
              style={{
                width: `calc(var(--spacing) * ${starSize})`,
                height: `calc(var(--spacing) * ${starSize})`
              }}
            >
              
              <FaStar className="text-gray-300 w-full h-full" />
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${percent}%` }}
              >
                <FaStar
                  style={{
                    width: `calc(var(--spacing) * ${starSize})`,
                    height: `calc(var(--spacing) * ${starSize})`
                  }}
                  className="w-full h-full text-yellow-400" 
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && <div className="text-xs text-gray-600 leading-4 inline-flex w-9 font-bold">
        {Number(value).toFixed(1)}
      </div>}
      {/* Percentage display */}
      {showPercentage && <div className="text-xs text-gray-600 leading-4 inline-flex w-9">
        {percentage}%
      </div>}
    </div>
  );
}

const StarRating = React.memo(StarRatingComponent)

export default StarRating
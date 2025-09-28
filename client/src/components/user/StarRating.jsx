import React, { useState } from 'react';
import { useEffect } from 'react';
import { FaStar } from "react-icons/fa";

function StarRatingComponent({ 
  maxStars = 5,
  showPercentage = false,
  starClass = '',
  onClick
}){
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const fill = hover !== null ? hover : rating;
  const percentage = Math.round((fill / maxStars) * 100);

  useEffect(() => {
    onClick(rating)
  },[rating])

  return (
    <div className='flex items-center space-x-2'>
      <div className="inline-flex space-x-0.25">
        {[...Array(maxStars)].map((_, i) => {
          
          const isFilled = i < fill;
          
          return (
            <div
            key={i}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(i + 1)}
              className={`text-gray-300
                focus:outline-none cursor-pointer ${starClass}`}
            >
              <FaStar className={`${isFilled ? 'text-yellow-400' : ''}`}/>
            </div>
          );
        })}
      </div>
      {/* Percentage display */}
      {showPercentage && <div className="text-xs text-gray-600 leading-4 inline-flex w-9">
        {percentage}%
      </div>}
    </div>
  );
}

const StarRating = React.memo(StarRatingComponent)

export default StarRating
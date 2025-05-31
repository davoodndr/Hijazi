import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

function StarRatingComponent(
  { maxStars = 5, showPercentage = false, starClass = '' }
){
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const fill = hover !== null ? hover : rating;
  const percentage = Math.round((fill / maxStars) * 100);

  return (
    <div className='flex items-center gap-1'>
      <div className="inline-flex gap-0.1">
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
      {showPercentage && percentage > 0 && <div className="text-xs text-gray-600 leading-0 inline-flex">
        {percentage}%
      </div>}
    </div>
  );
}

const StarRating = React.memo(StarRatingComponent)

export default StarRating
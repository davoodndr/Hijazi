import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

export default function StarRating({ maxStars = 5 }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  return (
    <div className="flex gap-0.1">
      {[...Array(maxStars)].map((_, i) => {
        const fill = hover !== null ? hover : rating;
        const isFilled = i < fill;

        return (
          <div
            key={i}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setRating(i + 1)}
            className="text-gray-300 hover:text-yellow-400 focus:outline-none cursor-pointer"
          >
            <FaStar className={`text-sm ${isFilled ? 'text-yellow-400' : ''}`}/>
          </div>
        );
      })}
    </div>
  );
}

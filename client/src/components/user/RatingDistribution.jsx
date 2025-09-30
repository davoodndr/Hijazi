import React, { useEffect, useState } from 'react'
import { getRatingDistribution } from '../../utils/Utils';

function RatingDistribution({reviewData}) {

  const [ratingDistribution, setRatingDistribution] = useState(null);

  useEffect(() => {
    const ratingDistributionData = getRatingDistribution(reviewData);
    setRatingDistribution(ratingDistributionData)
  },[reviewData])

  return (
    <div className='flex flex-col space-y-3 h-fit'>
      <div className="flex space-x-3 leading-5">
        <span>5 star</span>
        <div
          style={{
            '--progress-width': `calc(var(--spacing) * ${ratingDistribution?.['5'] || 0})`
          }} 
          className={`review-progress before:w-[var(--progress-width)]`} >
            <span className='px-3 z-5'>{ratingDistribution?.['5'] || 0}%</span>
        </div>
      </div>
      <div className="flex space-x-3 leading-5">
        <span>4 star</span>
        <div
          style={{
            '--progress-width': `calc(var(--spacing) * ${ratingDistribution?.['4'] || 0})`
          }} 
          className={`review-progress before:w-[var(--progress-width)]`} >
            <span className='px-3 z-5'>{ratingDistribution?.['4'] || 0}%</span>
        </div>
      </div>
      <div className="flex space-x-3 leading-5">
        <span>3 star</span>
        <div
          style={{
            '--progress-width': `calc(var(--spacing) * ${ratingDistribution?.['3'] || 0})`
          }} 
          className={`review-progress before:w-[var(--progress-width)]`} >
            <span className='px-3 z-5'>{ratingDistribution?.['3'] || 0}%</span>
        </div>
      </div>
      <div className="flex space-x-3 leading-5">
        <span>2 star</span>
        <div
          style={{
            '--progress-width': `calc(var(--spacing) * ${ratingDistribution?.['2'] || 0})`
          }} 
          className={`review-progress before:w-[var(--progress-width)]`} >
            <span className='px-3 z-5'>{ratingDistribution?.['2'] || 0}%</span>
        </div>
      </div>
      <div className="flex space-x-3 leading-5">
        <span>1 star</span>
        <div
          style={{
            '--progress-width': `calc(var(--spacing) * ${ratingDistribution?.['1'] || 0})`
          }} 
          className={`review-progress before:w-[var(--progress-width)]`} >
            <span className='px-3 z-5'>{ratingDistribution?.['1'] || 0}%</span>
        </div>
      </div>
    </div>
  )
}

export default RatingDistribution
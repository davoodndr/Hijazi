import React from 'react'
import { IoArrowUndoOutline } from 'react-icons/io5';
import StarRating from './StarRating';
import user_placeholder from '../../assets/user_placeholder.jpg'
import { format } from 'date-fns'

function ReviewItemComponent({review}) {

  const { user_id: reviewUser} = review;
  const joinDate = new Date(reviewUser?.createdAt)

  return (
    <div className="flex space-x-5 pb-3">
    
      {/* avatar */}
      <div className="w-[12%] inline-flex flex-col items-center overflow-hidden">
        <div className='w-17 rounded-full overflow-hidden mb-1'>
          <img src={reviewUser?.avatar?.url || user_placeholder} alt="" />
        </div>
        <p className='w-full font-semibold text-center truncate leading-4 tracking-wide mb-0.5 capitalize'>
          {reviewUser?.fullname || reviewUser?.username}
        </p>
        <p className="text-xs">Since {joinDate?.getFullYear()}</p>
      </div>
      {/* review */}
      <div className="flex-grow inline-flex flex-col space-y-1">
        <div className="inline-flex items-center space-x-2">
          <p className='capitalize font-bold text-black'>{review?.title}</p>
          <StarRating 
            value={review?.rating}
            starSize={3}
          />
        </div>
        <p className='text-sm'>{review?.review}</p>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-2"> 
            {
              format(new Date(review?.createdAt), 'MMMM d, y \'at\' hh:mm a')
              .replace('AM','am')
              .replace('PM', 'pm')
            }
          </p>
          <div className="inline-flex items-center space-x-2 cursor-pointer
            smooth hover:text-primary-400 hover:translate-x-2 w-fit">
            <IoArrowUndoOutline className='text-xl' />
            <span>Reply</span>
          </div>
        </div>
      </div>

    </div>
  )
}

const ReviewItem = React.memo(ReviewItemComponent);

export default ReviewItem
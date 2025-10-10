import React from 'react'
import { IoArrowUndoOutline } from 'react-icons/io5';
import StarRating from '../ui/StarRating';
import user_placeholder from '../../assets/user_placeholder.jpg'
import { format } from 'date-fns'

function ReviewItemComponent({
  review,
  profileContainerClass = ''
}) {

  const { user_id: reviewUser} = review;
  const joinDate = new Date(reviewUser?.createdAt)

  return (
    <div className="flex space-x-5 pb-3">
    
      {/* avatar */}
      <div className={`shrink-0 inline-flex flex-col items-center overflow-hidden ${profileContainerClass}`}>
        <div className='w-12 rounded-full overflow-hidden mb-1'>
          <img src={reviewUser?.avatar?.url || user_placeholder} alt="" />
        </div>
        <p className='w-full text-xs font-semibold text-center truncate leading-2 tracking-wide mb-0.5 capitalize'>
          {reviewUser?.fullname || reviewUser?.username}
        </p>
        <p className="text-xs">Since {joinDate?.getFullYear()}</p>
      </div>
      {/* review */}
      <div className="flex-grow inline-flex flex-col">
        <div className="inline-flex items-center space-x-2">
          <p className='capitalize font-bold text-black'>{review?.title}</p>
          <StarRating 
            value={review?.rating}
            starSize={3}
          />
        </div>

        <p className="text-xs text-gray-400  mb-2"> On: 
          <span className='ml-1'>
            {
              format(new Date(review?.createdAt), 'MMMM d, y \'at\' hh:mm a')
              .replace('AM','am')
              .replace('PM', 'pm')
            }
          </span>
        </p>
        
        <div className="flex items-center space-x-5">
          
          {/* <div className="inline-flex items-center space-x-1 cursor-pointer
            smooth hover:text-primary-400 hover:translate-x-2 w-fit">
            <IoArrowUndoOutline className='text-lg' />
            <span className='text-xs'>Reply</span>
          </div> */}
        </div>

        <p className='text-sm'>{review?.review}</p>
      </div>

    </div>
  )
}

const ReviewItem = React.memo(ReviewItemComponent);

export default ReviewItem
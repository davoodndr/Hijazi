import Review from "../../models/Review.js";
import { responseMessage } from "../../utils/messages.js";

export const getReviews = async(req, res) => {

  try {

    const reviews = await Review.find({})
      .populate([
        {
          path: 'user_id',
          select: 'fullname username '
        },
        {
          path: 'product_id',
          select: 'name',
          populate:{
            path: 'category',
            'select': 'name'
          }
        }
      ])

    return responseMessage(res, 200, true, "", { reviews })
    
  } catch (error) {
    console.log('getReviews:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}

export const changeReviewStatus = async(req, res) => {

  const { review_id, status } = req.body;

  try {
    
    if(!review_id || !status){
      return responseMessage(res, 400, false, "Invalid credentials!");
    }

    const review = await Review.findByIdAndUpdate(review_id, { status }, { new: true })
      .populate([
        {
          path: 'user_id',
          select: 'fullname username '
        },
        {
          path: 'product_id',
          select: 'name',
          populate:{
            path: 'category',
            'select': 'name'
          }
        }
      ])

    return responseMessage(res, 200, true, "Review status updated successfully", {review});

  } catch (error) {
    console.log('getReviews:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}
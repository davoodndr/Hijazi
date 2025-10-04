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
    console.log('createReview:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}
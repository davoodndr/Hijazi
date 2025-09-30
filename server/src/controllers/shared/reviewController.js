import Review from "../../models/Review.js";
import { responseMessage } from "../../utils/messages.js";


export const getReviews = async(req, res) => {

  const { product_id } = req.query

  try {

    if(!product_id){
      return responseMessage(res, 400, false, "Invalid Product Id requested")
    }
    
    const reviews = await Review.find({product_id}).sort("-1")
    .populate([
      {
        path : 'user_id',
        select: 'fullname username createdAt avatar'
      }
    ]);

    return responseMessage(res, 200, true, "", { reviews });
    
  } catch (error) {
    console.log('createReview:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}
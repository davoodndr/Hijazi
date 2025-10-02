import Order from "../../models/Order.js";
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

export const checkRatingEligiblity = async(req, res) => {

  const { user_id, product_id } = req.query;

  try {
    
    const orders = await Order.find({
      user_id,
      status: 'delivered',
      'cartItems.product_id': product_id
    })

    const canRate = orders?.length > 0;

    return responseMessage(res, 200, true, "", { canRate })

  } catch (error) {
    console.log('checkRatingEligiblity:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}
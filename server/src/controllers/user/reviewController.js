import { responseMessage } from "../../utils/messages.js";
import Review from '../../models/Review.js'
import Product from "../../models/Product.js";


export const createReview = async(req, res) => {

  const { user_id } = req;
  const { product_id } = req.body;

  try {

    if(!user_id){
      return responseMessage(res, 400, false, "Unauthorized access!")
    }

    const invalidMessage = validateReview(req.body);

    if(invalidMessage){
      return responseMessage(res, 400, false, invalidMessage);
    }

    const existingReview = await Review.findOne({ product_id, user_id });
    if (existingReview) {
      return responseMessage(res, 400, false, "You already reviewed this product")
    }

    const review = await Review.create({user_id, ...req.body});
    
    const product = await updateAverageRating(product_id);

    return responseMessage(res, 201, true, "Review added succsessfully!", { review, product})
    
  } catch (error) {
    console.log('createReview:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}


export const updateReview = async(req, res) => {

  //const user_id = '680fcd85ccab7af6a4332392';
  const { user_id } = req;
  const { product_id } = req.body;

  try {

    if(!user_id){
      return responseMessage(res, 400, false, "Unauthorized access!")
    }

    const invalidMessage = validateReview(req.body);

    if(invalidMessage){
      return responseMessage(res, 400, false, invalidMessage);
    }

    const existingReview = await Review.findOne({ product_id, user_id });
    if (!existingReview) {
      return responseMessage(res, 400, false, "Review not found!")
    }

    const updated = await Review.findOneAndUpdate({ product_id, user_id }, req.body, { new: true });

    const product = await updateAverageRating(product_id, 'update');

    return responseMessage(res, 201, true, "Review added succsessfully!", { updated, product })
    
  } catch (error) {
    console.log('updateReview:',error);
    return responseMessage(res, 500,false, error.message || error);
  }

}

const validateReview = (data) => {
  const { product_id, rating } = data;

  if(!product_id) 
    return "Product must be specified";
  else if(!rating || typeof rating !== 'number' || rating < 1 || rating > 5)
    return "Invalid rating"
  else
    return null
}

const updateAverageRating = async(product_id, type) => {

  // update average rating of product
  const productReviews = await Review.find({ product_id });
  const averageRating = productReviews?.reduce((sum, r) => sum + r.rating, 0) / productReviews?.length;

  const product = await Product.findByIdAndUpdate(
    product_id,
    {
      averageRating,
      numReviews: type === 'update' ? productReviews.length : productReviews.length++
    },
    { new: true }
  ).select("_id averageRating numReviews");

  return product;

}